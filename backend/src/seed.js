import { ensureProfileRow } from './db.js'

// Idempotent: creates the singleton profile row only when it does not exist.
export async function seedBase(connection) {
  await ensureProfileRow(connection)
}
