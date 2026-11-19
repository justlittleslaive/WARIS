import mysql from 'mysql2/promise'

export function dbOptions(overrides = {}) {
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3308),
    user: process.env.DB_USER ?? 'warisready',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'warisready',
    timezone: 'Z',
    decimalNumbers: true,
    ...overrides,
  }
}

export function createPool(overrides = {}) {
  return mysql.createPool({
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 5),
    ...dbOptions(overrides),
  })
}

export const pool = createPool()

export function mapAsset(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    institution: row.institution,
    estimatedValue: Number(row.estimated_value),
    documentLocation: row.document_location,
    ...(row.notes ? { notes: row.notes } : {}),
    createdAt: new Date(row.created_at).toISOString(),
  }
}

export function mapContact(row) {
  return {
    id: row.id,
    name: row.name,
    relationship: row.relationship,
    ...(row.phone ? { phone: row.phone } : {}),
    isPrimaryContact: Boolean(row.is_primary),
  }
}

export function mapProfile(profileRow, assetRows, contactRows) {
  return {
    name: profileRow.name,
    legalTrack: profileRow.legal_track,
    ...(profileRow.state ? { state: profileRow.state } : {}),
    language: profileRow.language,
    readiness: {
      documents: Boolean(profileRow.reviewed_documents),
      planning: Boolean(profileRow.reviewed_planning),
      emergency: Boolean(profileRow.reviewed_emergency),
    },
    assets: assetRows.map(mapAsset),
    contacts: contactRows.map(mapContact),
    updatedAt: new Date(profileRow.updated_at).toISOString(),
  }
}

export async function ensureProfileRow(connection) {
  await connection.query(
    `INSERT INTO profiles (id, updated_at) VALUES (1, UTC_TIMESTAMP(3))
     ON DUPLICATE KEY UPDATE id = id`,
  )
}

export async function loadProfile(connection) {
  const [[profileRow]] = await connection.query('SELECT * FROM profiles WHERE id = 1')
  if (!profileRow) {
    throw new Error('profiles row is missing; run npm run db:setup')
  }
  const [assetRows] = await connection.query(
    'SELECT * FROM assets WHERE profile_id = 1 ORDER BY created_at DESC',
  )
  const [contactRows] = await connection.query(
    'SELECT * FROM contacts WHERE profile_id = 1 AND is_primary = 1',
  )
  const [otherRows] = await connection.query(
    'SELECT * FROM contacts WHERE profile_id = 1 AND is_primary = 0',
  )
  return mapProfile(profileRow, assetRows, [...contactRows, ...otherRows])
}
