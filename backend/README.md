# WarisReady API

Local backend for the WarisReady SPA: a single profile, its assets, and family contacts stored in MySQL/MariaDB and served as JSON.

> The SRS scopes WarisReady as frontend-only. This API is an optional local extension; the React app still persists to localStorage and does not call it yet.

## Stack

- Node.js >= 20.6 (`--env-file` support)
- Express 5, `mysql2`, `helmet`, `express-rate-limit`
- MariaDB 10.4+ (tested with the binaries bundled in XAMPP)

## Layout

```
backend/
  migrations/001_init.sql   schema, applied once and tracked
  src/app.js                Express app factory (pool injected)
  src/server.js             bootstrap, graceful shutdown
  src/db.js                 pool/config, row mappers, profile loader
  src/migrations.js         migration runner (shared with tests)
  src/seed.js               idempotent singleton profile seed
  src/validate.js           request validation and import normalisation
  src/scripts/              migrate and seed CLIs
  test/                     node:test + supertest integration suite
```

## Quick start

1. Start the dedicated database instance on port 3308. Do not reuse XAMPP's
   port 3307 instance; this project keeps its own data directory.

   ```bat
   C:\xampp\mysql\bin\mysqld.exe --defaults-file=C:\path\to\warisready\backend\.mysql-data\my.ini --standalone
   ```

   The data directory and `my.ini` live in `.mysql-data/` (gitignored).

2. Create the databases and app user once, as the MySQL administrator:

   ```sql
   CREATE DATABASE IF NOT EXISTS warisready CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   CREATE DATABASE IF NOT EXISTS warisready_test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

   CREATE USER IF NOT EXISTS 'warisready'@'localhost' IDENTIFIED BY 'change-me';
   CREATE USER IF NOT EXISTS 'warisready'@'127.0.0.1' IDENTIFIED BY 'change-me';

   GRANT ALL PRIVILEGES ON warisready.* TO 'warisready'@'localhost';
   GRANT ALL PRIVILEGES ON warisready.* TO 'warisready'@'127.0.0.1';
   GRANT ALL PRIVILEGES ON warisready_test.* TO 'warisready'@'localhost';
   GRANT ALL PRIVILEGES ON warisready_test.* TO 'warisready'@'127.0.0.1';
   FLUSH PRIVILEGES;
   ```

3. Configure and run:

   ```bash
   cp .env.example .env   # then set DB_PASSWORD and DB_USER if needed
   npm install
   npm run db:setup       # migrations + seed
   npm start              # http://127.0.0.1:4000
   ```

   ```bash
   curl http://127.0.0.1:4000/api/health
   # {"status":"ok","database":"up"}
   ```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Start the API (`src/server.js`) |
| `npm run dev` | Start with `--watch` |
| `npm run db:migrate` | Apply pending SQL files in `migrations/` |
| `npm run db:seed` | Ensure the singleton profile row exists |
| `npm run db:setup` | `db:migrate` then `db:seed` |
| `npm test` | Integration tests against the test database |

Migrations run once each and are recorded in `schema_migrations`. Add new files
as `migrations/002_description.sql`, run `npm run db:migrate`, and commit them.
The migration connection enables `multipleStatements`, so one file may contain
several statements.

The test suite resets its own database: it drops and recreates the tables in
`TEST_DB_NAME` (default `warisready_test`) before running. It never touches
`DB_NAME`.

## Environment

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4000` | HTTP port |
| `HOST` | `127.0.0.1` | Bind address |
| `DB_HOST` | `127.0.0.1` | |
| `DB_PORT` | `3308` | Dedicated instance |
| `DB_USER` | `warisready` | |
| `DB_PASSWORD` | empty | Set in `.env`, never commit |
| `DB_NAME` | `warisready` | |
| `DB_CONNECTION_LIMIT` | `5` | Pool size |
| `CORS_ORIGINS` | empty (allow all) | Comma-separated allowlist |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |
| `LOG_REQUESTS` | `1` | Set `0` to disable request logs |
| `TRUST_PROXY` | `0` | Set `1` behind a reverse proxy |
| `TEST_DB_NAME` | `warisready_test` | Used by `npm test` |

## API

All routes are under `/api`. Responses are JSON; errors use `{ "error": "..." }`.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness plus database check |
| `GET` | `/api/profile` | Profile with ordered assets and contacts (primary first) |
| `PUT` | `/api/profile` | Partial update; readiness keys merge |
| `POST` | `/api/import` | Replace profile, assets, and contacts in one transaction |
| `POST` | `/api/assets` | Create asset |
| `PUT` | `/api/assets/:id` | Partial update |
| `DELETE` | `/api/assets/:id` | Delete |
| `POST` | `/api/contacts` | Create contact; a new primary demotes the old one |
| `PUT` | `/api/contacts/:id` | Partial update; promoting demotes the others |
| `DELETE` | `/api/contacts/:id` | Delete |
| `POST` | `/api/reset` | Clear all data and restore empty defaults |

The `native-customary` legal track requires `state` to be `Sabah` or `Sarawak`.
Asset values must be whole ringgit amounts up to RM 1,000,000,000,000.

### Import

`POST /api/import` accepts either the localStorage envelope or a bare profile:

```json
{
  "schemaVersion": 1,
  "profile": {
    "name": "Aisyah",
    "legalTrack": "muslim",
    "language": "ms",
    "readiness": { "documents": true, "planning": false, "emergency": false },
    "assets": [],
    "contacts": []
  }
}
```

The import replaces everything for the singleton profile. Validation is strict:
any invalid asset or contact rejects the whole request with `400` and nothing is
written. Arrays are capped at 500 assets and 200 contacts. Missing or duplicate
UUIDs are regenerated, extra primary contacts are demoted, and unknown
`schemaVersion` values are rejected.

## Backups

`mysqldump` is the supported backup path; the `.mysql-data` directory is not a
backup.

```bash
mysqldump -h 127.0.0.1 -P 3308 -u warisready -p warisready > warisready-backup.sql
mysql -h 127.0.0.1 -P 3308 -u warisready -p warisready < warisready-backup.sql
```

## Production notes

- Express serves plain HTTP. Terminate TLS at a reverse proxy and set
  `TRUST_PROXY=1` so rate limiting sees real client IPs.
- Set `CORS_ORIGINS` to the deployed frontend origin(s) instead of allowing all.
- Rate limit is 1000 requests per 15 minutes per IP for `/api` (health exempt).
- Logs are structured JSON on stdout; ship them with your process manager.
- On `SIGTERM`/`SIGINT` the server stops accepting connections, closes the
  pool, and force-exits after 10 seconds.
- The singleton profile has no authentication or per-user isolation. Phone
  numbers are stored in plaintext; treat them as PII. Accounts, pagination,
  audit trails, and multi-tab conflict handling are intentionally out of scope
  for this local demo.
