import mysql from 'mysql2/promise'
import { dbOptions } from '../db.js'
import { applyMigrations } from '../migrations.js'

const database = process.env.DB_NAME ?? 'warisready'
let connection

try {
  connection = await mysql.createConnection(dbOptions({ multipleStatements: true }))
  const pending = await applyMigrations(connection, {
    log: (file) => console.log(`Applied ${file}`),
  })
  console.log(
    pending.length === 0
      ? `Database "${database}" is up to date.`
      : `Applied ${pending.length} migration(s) to "${database}".`,
  )
} catch (error) {
  if (error.code === 'ER_BAD_DB_ERROR') {
    console.error(`Database "${database}" does not exist. Create it first (see README).`)
  } else if (error.code === 'ECONNREFUSED') {
    const host = process.env.DB_HOST ?? '127.0.0.1'
    const port = process.env.DB_PORT ?? 3308
    console.error(`Cannot reach MySQL at ${host}:${port}. Is the instance running?`)
  } else {
    console.error(error.message)
  }
  process.exitCode = 1
} finally {
  if (connection) await connection.end()
}
