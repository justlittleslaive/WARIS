import { randomUUID } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import { loadProfile, mapAsset, mapContact, pool } from './db.js'
import {
  ValidationError,
  validateAssetInput,
  validateContactInput,
  validateProfilePatch,
} from './validate.js'

const app = express()
const origins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: origins.length > 0 ? origins : true }))
app.use(express.json({ limit: '100kb' }))

const wrap = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next)
}

app.get(
  '/api/health',
  wrap(async (_req, res) => {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'up' })
  }),
)

app.get(
  '/api/profile',
  wrap(async (_req, res) => {
    res.json(await loadProfile())
  }),
)

app.put(
  '/api/profile',
  wrap(async (req, res) => {
    const patch = validateProfilePatch(req.body)
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const [[current]] = await connection.query('SELECT * FROM profiles WHERE id = 1 FOR UPDATE')

      const track = patch.legalTrack ?? current.legal_track
      const state = patch.state !== undefined ? patch.state : current.state
      if (track === 'native-customary' && state !== 'Sabah' && state !== 'Sarawak') {
        throw new ValidationError('state must be Sabah or Sarawak for the native-customary track')
      }

      const name = patch.name !== undefined ? patch.name : current.name
      const language = patch.language ?? current.language
      const readiness = {
        documents: Boolean(current.reviewed_documents),
        planning: Boolean(current.reviewed_planning),
        emergency: Boolean(current.reviewed_emergency),
        ...patch.readiness,
      }

      await connection.query(
        `UPDATE profiles
            SET name = ?, legal_track = ?, state = ?, language = ?,
                reviewed_documents = ?, reviewed_planning = ?, reviewed_emergency = ?,
                updated_at = UTC_TIMESTAMP(3)
          WHERE id = 1`,
        [
          name,
          track,
          state ?? null,
          language,
          readiness.documents ? 1 : 0,
          readiness.planning ? 1 : 0,
          readiness.emergency ? 1 : 0,
        ],
      )
      await connection.commit()
      res.json(await loadProfile())
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  }),
)

app.post(
  '/api/assets',
  wrap(async (req, res) => {
    const input = validateAssetInput(req.body)
    const id = randomUUID()
    await pool.query(
      `INSERT INTO assets
         (id, profile_id, name, category, institution, estimated_value, document_location, notes, created_at)
       VALUES (?, 1, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(3))`,
      [
        id,
        input.name,
        input.category,
        input.institution ?? '',
        input.estimatedValue,
        input.documentLocation ?? '',
        input.notes ?? null,
      ],
    )
    const [[row]] = await pool.query('SELECT * FROM assets WHERE id = ?', [id])
    res.status(201).json(mapAsset(row))
  }),
)

app.put(
  '/api/assets/:id',
  wrap(async (req, res) => {
    const input = validateAssetInput(req.body, { partial: true })
    const columns = {
      name: 'name',
      category: 'category',
      institution: 'institution',
      estimatedValue: 'estimated_value',
      documentLocation: 'document_location',
      notes: 'notes',
    }
    const assignments = Object.keys(input).map((key) => `${columns[key]} = ?`)
    const values = Object.keys(input).map((key) => input[key])
    const [result] = await pool.query(
      `UPDATE assets SET ${assignments.join(', ')} WHERE id = ? AND profile_id = 1`,
      [...values, req.params.id],
    )
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Asset not found' })
      return
    }
    const [[row]] = await pool.query('SELECT * FROM assets WHERE id = ?', [req.params.id])
    res.json(mapAsset(row))
  }),
)

app.delete(
  '/api/assets/:id',
  wrap(async (req, res) => {
    const [result] = await pool.query('DELETE FROM assets WHERE id = ? AND profile_id = 1', [
      req.params.id,
    ])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Asset not found' })
      return
    }
    res.status(204).end()
  }),
)

app.post(
  '/api/contacts',
  wrap(async (req, res) => {
    const input = validateContactInput(req.body)
    const id = randomUUID()
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      if (input.isPrimaryContact) {
        await connection.query('UPDATE contacts SET is_primary = 0 WHERE profile_id = 1')
      }
      await connection.query(
        `INSERT INTO contacts (id, profile_id, name, relationship, phone, is_primary)
         VALUES (?, 1, ?, ?, ?, ?)`,
        [id, input.name, input.relationship, input.phone ?? null, input.isPrimaryContact ? 1 : 0],
      )
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
    const [[row]] = await pool.query('SELECT * FROM contacts WHERE id = ?', [id])
    res.status(201).json(mapContact(row))
  }),
)

app.put(
  '/api/contacts/:id',
  wrap(async (req, res) => {
    const input = validateContactInput(req.body, { partial: true })
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const [[current]] = await connection.query(
        'SELECT * FROM contacts WHERE id = ? AND profile_id = 1 FOR UPDATE',
        [req.params.id],
      )
      if (!current) {
        await connection.rollback()
        res.status(404).json({ error: 'Contact not found' })
        return
      }
      const isPrimary = input.isPrimaryContact ?? Boolean(current.is_primary)
      if (isPrimary && !current.is_primary) {
        await connection.query('UPDATE contacts SET is_primary = 0 WHERE profile_id = 1 AND id <> ?', [
          req.params.id,
        ])
      }
      await connection.query(
        `UPDATE contacts
            SET name = ?, relationship = ?, phone = ?, is_primary = ?
          WHERE id = ? AND profile_id = 1`,
        [
          input.name ?? current.name,
          input.relationship ?? current.relationship,
          input.phone !== undefined ? input.phone : current.phone,
          isPrimary ? 1 : 0,
          req.params.id,
        ],
      )
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
    const [[row]] = await pool.query('SELECT * FROM contacts WHERE id = ?', [req.params.id])
    res.json(mapContact(row))
  }),
)

app.delete(
  '/api/contacts/:id',
  wrap(async (req, res) => {
    const [result] = await pool.query('DELETE FROM contacts WHERE id = ? AND profile_id = 1', [
      req.params.id,
    ])
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Contact not found' })
      return
    }
    res.status(204).end()
  }),
)

app.post(
  '/api/reset',
  wrap(async (_req, res) => {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      await connection.query('DELETE FROM contacts WHERE profile_id = 1')
      await connection.query('DELETE FROM assets WHERE profile_id = 1')
      await connection.query(
        `UPDATE profiles
            SET name = '', legal_track = 'unsure', state = NULL, language = 'ms',
                reviewed_documents = 0, reviewed_planning = 0, reviewed_emergency = 0,
                updated_at = UTC_TIMESTAMP(3)
          WHERE id = 1`,
      )
      await connection.commit()
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
    res.json(await loadProfile())
  }),
)

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((error, _req, res, _next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error.message })
    return
  }
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})

const port = Number(process.env.PORT ?? 4000)
app.listen(port, '127.0.0.1', () => {
  console.log(`WarisReady API listening on http://127.0.0.1:${port}`)
})
