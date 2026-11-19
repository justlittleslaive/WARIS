const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 }
const minLevel = LEVELS[process.env.LOG_LEVEL] ?? LEVELS.info

function write(level, message, fields = {}) {
  if (LEVELS[level] < minLevel) return
  const line = JSON.stringify({
    time: new Date().toISOString(),
    level,
    message,
    ...fields,
  })
  if (level === 'error' || level === 'warn') console.error(line)
  else console.log(line)
}

export const logger = {
  debug: (message, fields) => write('debug', message, fields),
  info: (message, fields) => write('info', message, fields),
  warn: (message, fields) => write('warn', message, fields),
  error: (message, fields) => write('error', message, fields),
}
