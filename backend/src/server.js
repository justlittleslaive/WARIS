import { createApp } from './app.js'
import { pool } from './db.js'
import { logger } from './logger.js'
import { seedBase } from './seed.js'

const port = Number(process.env.PORT ?? 4000)
const host = process.env.HOST ?? '127.0.0.1'
const app = createApp({ pool })

async function start() {
  await seedBase(pool)

  const server = app.listen(port, host, () => {
    logger.info('api listening', { host, port })
  })

  let shuttingDown = false
  function shutdown(signal) {
    if (shuttingDown) return
    shuttingDown = true
    logger.info('shutting down', { signal })

    const forceExit = setTimeout(() => {
      logger.error('forced shutdown after timeout')
      process.exit(1)
    }, 10_000)
    forceExit.unref()

    server.close(async (error) => {
      if (error) logger.error('http server close failed', { error: error.message })
      try {
        await pool.end()
      } catch (poolError) {
        logger.error('database pool close failed', { error: poolError.message })
      }
      process.exit(error ? 1 : 0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch(async (error) => {
  logger.error('failed to start api', { error: error.message })
  try {
    await pool.end()
  } catch {
    // pool may never have connected
  }
  process.exit(1)
})
