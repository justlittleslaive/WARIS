import { after, before, beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { createPool } from '../src/db.js'
import { cleanData, resetTestDatabase, TEST_DB } from '../test-support/helpers.js'

const pool = createPool({ database: TEST_DB, connectionLimit: 2 })
const app = createApp({ pool, enableRequestLog: false, enableRateLimit: false })

before(async () => {
  await resetTestDatabase()
})

beforeEach(async () => {
  await cleanData(pool)
})

after(async () => {
  await pool.end()
})

function assetPayload(overrides = {}) {
  return {
    name: 'Maybank Savings',
    category: 'Bank Savings',
    institution: 'Maybank',
    estimatedValue: 25000,
    documentLocation: 'Blue folder',
    ...overrides,
  }
}

function contactPayload(overrides = {}) {
  return {
    name: 'Siti',
    relationship: 'Spouse',
    phone: '0123456789',
    ...overrides,
  }
}

test('health reports the database as up', async () => {
  const res = await request(app).get('/api/health').expect(200)
  assert.equal(res.body.status, 'ok')
  assert.equal(res.body.database, 'up')
})

test('GET /api/profile returns the empty default profile', async () => {
  const res = await request(app).get('/api/profile').expect(200)
  assert.equal(res.body.name, '')
  assert.equal(res.body.legalTrack, 'unsure')
  assert.equal(res.body.language, 'ms')
  assert.deepEqual(res.body.readiness, {
    documents: false,
    planning: false,
    emergency: false,
  })
  assert.deepEqual(res.body.assets, [])
  assert.deepEqual(res.body.contacts, [])
  assert.ok(!('state' in res.body))
})

test('PUT /api/profile merges readiness and rejects invalid enums', async () => {
  await request(app)
    .put('/api/profile')
    .send({ name: '  Aisyah  ', language: 'en', readiness: { documents: true } })
    .expect(200)

  const res = await request(app).get('/api/profile').expect(200)
  assert.equal(res.body.name, 'Aisyah')
  assert.equal(res.body.language, 'en')
  assert.deepEqual(res.body.readiness, {
    documents: true,
    planning: false,
    emergency: false,
  })

  await request(app).put('/api/profile').send({ language: 'fr' }).expect(400)
  await request(app).put('/api/profile').send({}).expect(400)
})

test('native-customary track requires a Sabah or Sarawak state', async () => {
  const rejected = await request(app)
    .put('/api/profile')
    .send({ legalTrack: 'native-customary' })
    .expect(400)
  assert.match(rejected.body.error, /Sabah or Sarawak/)

  const accepted = await request(app)
    .put('/api/profile')
    .send({ legalTrack: 'native-customary', state: 'Sarawak' })
    .expect(200)
  assert.equal(accepted.body.state, 'Sarawak')
})

test('assets support create, partial update, and delete', async () => {
  const created = await request(app).post('/api/assets').send(assetPayload()).expect(201)
  assert.match(created.body.id, /^[0-9a-f-]{36}$/)
  assert.equal(created.body.estimatedValue, 25000)
  assert.ok(!Number.isNaN(Date.parse(created.body.createdAt)))

  const updated = await request(app)
    .put(`/api/assets/${created.body.id}`)
    .send({ estimatedValue: 30000 })
    .expect(200)
  assert.equal(updated.body.estimatedValue, 30000)
  assert.equal(updated.body.name, 'Maybank Savings')

  await request(app).delete(`/api/assets/${created.body.id}`).expect(204)
  await request(app).delete(`/api/assets/${created.body.id}`).expect(404)

  const profile = await request(app).get('/api/profile').expect(200)
  assert.equal(profile.body.assets.length, 0)
})

test('asset validation rejects bad values', async () => {
  await request(app)
    .post('/api/assets')
    .send(assetPayload({ estimatedValue: -5 }))
    .expect(400)
  await request(app)
    .post('/api/assets')
    .send(assetPayload({ estimatedValue: 12.5 }))
    .expect(400)
  await request(app)
    .post('/api/assets')
    .send(assetPayload({ category: 'Crypto' }))
    .expect(400)
  await request(app)
    .post('/api/assets')
    .send(assetPayload({ name: '   ' }))
    .expect(400)
  await request(app).post('/api/assets').send({ name: 'X' }).expect(400)
})

test('only one contact stays primary', async () => {
  const first = await request(app)
    .post('/api/contacts')
    .send(contactPayload({ name: 'Ali', isPrimaryContact: true }))
    .expect(201)
  assert.equal(first.body.isPrimaryContact, true)

  const second = await request(app)
    .post('/api/contacts')
    .send(contactPayload({ name: 'Siti', isPrimaryContact: true }))
    .expect(201)

  let profile = await request(app).get('/api/profile').expect(200)
  assert.equal(profile.body.contacts.filter((c) => c.isPrimaryContact).length, 1)
  assert.equal(profile.body.contacts[0].id, second.body.id)

  const third = await request(app)
    .post('/api/contacts')
    .send(contactPayload({ name: 'Ahmad', relationship: 'Child' }))
    .expect(201)
  assert.equal(third.body.isPrimaryContact, false)

  await request(app)
    .put(`/api/contacts/${third.body.id}`)
    .send({ isPrimaryContact: true })
    .expect(200)

  profile = await request(app).get('/api/profile').expect(200)
  const primaries = profile.body.contacts.filter((c) => c.isPrimaryContact)
  assert.equal(primaries.length, 1)
  assert.equal(primaries[0].id, third.body.id)

  await request(app)
    .put(`/api/contacts/${first.body.id}`)
    .send({ relationship: 'Cousin' })
    .expect(400)
})

test('contacts support delete and 404 for unknown ids', async () => {
  const created = await request(app).post('/api/contacts').send(contactPayload()).expect(201)
  await request(app).delete(`/api/contacts/${created.body.id}`).expect(204)
  await request(app).delete(`/api/contacts/${created.body.id}`).expect(404)
})

test('import accepts the localStorage envelope and replaces all data', async () => {
  await request(app).post('/api/assets').send(assetPayload({ name: 'Old asset' })).expect(201)

  const payload = {
    schemaVersion: 1,
    profile: {
      name: 'Lim',
      legalTrack: 'non-muslim',
      language: 'en',
      readiness: { documents: true, planning: true, emergency: false },
      assets: [
        {
          id: randomUUID(),
          name: 'Condo',
          category: 'Property',
          institution: 'CIMB',
          estimatedValue: 500000,
          documentLocation: 'Safe',
          notes: 'Jointly owned',
          createdAt: '2026-01-02T03:04:05.000Z',
        },
        {
          name: 'Savings',
          category: 'Bank Savings',
          estimatedValue: 10000,
          documentLocation: 'Drawer',
        },
      ],
      contacts: [
        { name: 'Mei', relationship: 'Spouse', phone: '0111111111', isPrimaryContact: true },
        { name: 'Wei', relationship: 'Child', isPrimaryContact: true },
      ],
    },
  }

  const res = await request(app).post('/api/import').send(payload).expect(200)
  assert.deepEqual(res.body.imported, { assets: 2, contacts: 2 })
  assert.equal(res.body.profile.name, 'Lim')
  assert.equal(res.body.profile.assets.length, 2)
  assert.equal(res.body.profile.contacts.length, 2)
  assert.equal(res.body.profile.contacts[0].name, 'Mei')
  assert.equal(res.body.profile.contacts.filter((c) => c.isPrimaryContact).length, 1)

  const imported = res.body.profile.assets.find((asset) => asset.name === 'Condo')
  assert.equal(imported.createdAt, '2026-01-02T03:04:05.000Z')
  assert.equal(imported.notes, 'Jointly owned')
})

test('import accepts a bare profile and rolls back on invalid data', async () => {
  await request(app).post('/api/assets').send(assetPayload({ name: 'Keep me' })).expect(201)

  await request(app)
    .post('/api/import')
    .send({
      name: 'X',
      assets: [assetPayload(), { name: 'Bad', category: 'Crypto', estimatedValue: 1 }],
    })
    .expect(400)

  const profile = await request(app).get('/api/profile').expect(200)
  assert.equal(profile.body.assets.length, 1)
  assert.equal(profile.body.assets[0].name, 'Keep me')

  await request(app)
    .post('/api/import')
    .send({ schemaVersion: 2, profile: { name: 'Y' } })
    .expect(400)

  const bare = await request(app)
    .post('/api/import')
    .send({ name: 'Raj', language: 'en' })
    .expect(200)
  assert.equal(bare.body.profile.name, 'Raj')
  assert.equal(bare.body.profile.assets.length, 0)
})

test('import enforces the singular primary contact and state rules', async () => {
  await request(app)
    .post('/api/import')
    .send({ profile: { name: 'Dayang', legalTrack: 'native-customary' } })
    .expect(400)

  const res = await request(app)
    .post('/api/import')
    .send({
      profile: {
        name: 'Dayang',
        legalTrack: 'native-customary',
        state: 'Sabah',
        contacts: [
          { name: 'A', relationship: 'Parent', isPrimaryContact: true },
          { name: 'B', relationship: 'Sibling', isPrimaryContact: true },
        ],
      },
    })
    .expect(200)

  assert.equal(res.body.profile.state, 'Sabah')
  assert.equal(res.body.profile.contacts.filter((c) => c.isPrimaryContact).length, 1)
  assert.equal(res.body.profile.contacts[0].name, 'A')
})

test('reset clears profile data', async () => {
  await request(app)
    .put('/api/profile')
    .send({ name: 'Ahmad', language: 'en', readiness: { planning: true } })
    .expect(200)
  await request(app).post('/api/assets').send(assetPayload()).expect(201)
  await request(app).post('/api/contacts').send(contactPayload()).expect(201)

  const res = await request(app).post('/api/reset').expect(200)
  assert.equal(res.body.name, '')
  assert.equal(res.body.language, 'ms')
  assert.equal(res.body.legalTrack, 'unsure')
  assert.deepEqual(res.body.assets, [])
  assert.deepEqual(res.body.contacts, [])
})

test('malformed JSON and unknown API routes return JSON errors', async () => {
  const malformed = await request(app)
    .post('/api/assets')
    .set('Content-Type', 'application/json')
    .send('{"name":')
    .expect(400)
  assert.equal(malformed.body.error, 'Invalid JSON body')

  const missing = await request(app).get('/api/nope').expect(404)
  assert.equal(missing.body.error, 'Not found')
})
