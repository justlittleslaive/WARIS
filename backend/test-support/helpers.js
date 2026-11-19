import mysql from 'mysql2/promise'
import { dbOptions } from '../src/db.js'
import { applyMigrations } from '../src/migrations.js'
import { seedBase } from '../src/seed.js'

export const TEST_DB = process.env.TEST_DB_NAME ?? 'warisready_test'

export async function resetTestDatabase() {
  const connection = await mysql.createConnection(
    dbOptions({ database: TEST_DB, multipleStatements: true }),
  )
  try {
    await connection.query(`
      DROP TABLE IF EXISTS contacts;
      DROP TABLE IF EXISTS assets;
      DROP TABLE IF EXISTS profiles;
      DROP TABLE IF EXISTS schema_migrations;
    `)
    await applyMigrations(connection)
    await seedBase(connection)
  } finally {
    await connection.end()
  }
}

export async function cleanData(pool) {
  await pool.query('DELETE FROM contacts WHERE profile_id = 1')
  await pool.query('DELETE FROM assets WHERE profile_id = 1')
  await pool.query(
    `UPDATE profiles
        SET name = '', legal_track = 'unsure', state = NULL, language = 'ms',
            reviewed_documents = 0, reviewed_planning = 0, reviewed_emergency = 0,
            updated_at = UTC_TIMESTAMP(3)
      WHERE id = 1`,
  )
}
