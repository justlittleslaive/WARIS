import mysql from 'mysql2/promise'
import { dbOptions } from '../db.js'
import { seedBase } from '../seed.js'

const database = process.env.DB_NAME ?? 'warisready'
let connection

try {
  connection = await mysql.createConnection(dbOptions())
  await seedBase(connection)
  console.log(`Seed complete: singleton profile row present in "${database}".`)
} catch (error) {
  if (error.code === 'ER_NO_SUCH_TABLE') {
    console.error('Tables are missing. Run "npm run db:migrate" first.')
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.error(`Database "${database}" does not exist. Create it first (see README).`)
  } else {
    console.error(error.message)
  }
  process.exitCode = 1
} finally {
  if (connection) await connection.end()
}
