import { readdir, readFile } from 'node:fs/promises'

const MIGRATIONS_DIR = new URL('../migrations/', import.meta.url)

// The connection must be created with multipleStatements: true.
export async function applyMigrations(connection, { log = () => {} } = {}) {
  await connection.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name VARCHAR(255) NOT NULL,
      applied_at DATETIME(3) NOT NULL,
      PRIMARY KEY (name)
    ) ENGINE = InnoDB
  `)

  const [rows] = await connection.query('SELECT name FROM schema_migrations')
  const applied = new Set(rows.map((row) => row.name))
  const files = (await readdir(MIGRATIONS_DIR)).filter((file) => file.endsWith('.sql')).sort()

  const pending = files.filter((file) => !applied.has(file))
  for (const file of pending) {
    const sql = await readFile(new URL(file, MIGRATIONS_DIR), 'utf8')
    await connection.query(sql)
    await connection.query(
      'INSERT INTO schema_migrations (name, applied_at) VALUES (?, UTC_TIMESTAMP(3))',
      [file],
    )
    log(file)
  }

  return pending
}
