import { randomUUID } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { ensureProfileRow, loadProfile, mapAsset, mapContact } from './db.js'
import { logger } from './logger.js'
import {
  ValidationError,
  validateAssetInput,
  validateContactInput,
  validateImport,
  validateProfilePatch,
} from './validate.js'

const wrap = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next)
}

function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint()
  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6
    logger.info('request', {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 10) / 10,
    })
  })
  next()
}

export function createApp({ pool, enableRequestLog = true, enableRateLimit = true } = {}) {
  if (!pool) throw new Error('createApp requires a database pool')

  const app = express()
  app.disable('x-powered-by')
  if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1)

  const origins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.use(helmet())
  app.use(cors({ origin: origins.length > 0 ? origins : true }))
  app.use(express.json({ limit: '500kb' }))
  if (enableRequestLog) app.use(requestLogger)
  if (enableRateLimit) {
    app.use(
      '/api',
      rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 1000,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        skip: (req) => req.path === '/health',
        message: { error: 'Too many requests, please try again later' },
      }),
    )
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
      res.json(await loadProfile(pool))
    }),
  )

  app.put(
    '/api/profile',
    wrap(async (req, res) => {
      const patch = validateProfilePatch(req.body)
      const connection = await pool.getConnection()
      try {
        await connection.beginTransaction()
        await ensureProfileRow(connection)
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
        res.json(await loadProfile(connection))
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
    }),
  )

  app.post(
    '/api/import',
    wrap(async (req, res) => {
      const data = validateImport(req.body)
      const connection = await pool.getConnection()
      try {
        await connection.beginTransaction()
        await ensureProfileRow(connection)
        await connection.query('SELECT id FROM profiles WHERE id = 1 FOR UPDATE')
        await connection.query('DELETE FROM contacts WHERE profile_id = 1')
        await connection.query('DELETE FROM assets WHERE profile_id = 1')

        const { profile } = data
        await connection.query(
          `UPDATE profiles
              SET name = ?, legal_track = ?, state = ?, language = ?,
                  reviewed_documents = ?, reviewed_planning = ?, reviewed_emergency = ?,
                  updated_at = UTC_TIMESTAMP(3)
            WHERE id = 1`,
          [
            profile.name,
            profile.legalTrack,
            profile.state,
            profile.language,
            profile.readiness.documents ? 1 : 0,
            profile.readiness.planning ? 1 : 0,
            profile.readiness.emergency ? 1 : 0,
          ],
        )

        if (data.assets.length > 0) {
          await connection.query(
            `INSERT INTO assets
               (id, profile_id, name, category, institution, estimated_value, document_location, notes, created_at)
             VALUES ?`,
            [
              data.assets.map((asset) => [
                asset.id,
                1,
                asset.name,
                asset.category,
                asset.institution,
                asset.estimatedValue,
                asset.documentLocation,
                asset.notes,
                new Date(asset.createdAt),
              ]),
            ],
          )
        }

        if (data.contacts.length > 0) {
          await connection.query(
            `INSERT INTO contacts (id, profile_id, name, relationship, phone, is_primary)
             VALUES ?`,
            [
              data.contacts.map((contact) => [
                contact.id,
                1,
                contact.name,
                contact.relationship,
                contact.phone,
                contact.isPrimaryContact ? 1 : 0,
              ]),
            ],
          )
        }

        await connection.commit()
        res.json({
          imported: { assets: data.assets.length, contacts: data.contacts.length },
          profile: await loadProfile(connection),
        })
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
          await connection.query(
            'UPDATE contacts SET is_primary = 0 WHERE profile_id = 1 AND id <> ?',
            [req.params.id],
          )
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
        await ensureProfileRow(connection)
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
        res.json(await loadProfile(connection))
      } catch (error) {
        await connection.rollback()
        throw error
      } finally {
        connection.release()
      }
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
    if (error?.type === 'entity.too.large') {
      res.status(413).json({ error: 'Request body is too large' })
      return
    }
    logger.error('unhandled error', { error: error?.message ?? String(error) })
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
