export interface DemoSession {
  name: string
  email: string
  signedInAt: string
}

const SESSION_KEY = 'warisready:session:v1'

export function loadSession(): DemoSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null
    const { name, email, signedInAt } = parsed as Record<string, unknown>
    if (typeof name !== 'string' || !name.trim()) return null
    if (typeof email !== 'string' || !email.trim()) return null
    if (typeof signedInAt !== 'string' || Number.isNaN(Date.parse(signedInAt))) return null
    return { name: name.trim().slice(0, 100), email: email.trim().slice(0, 200), signedInAt }
  } catch {
    return null
  }
}

export function saveSession(session: DemoSession): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // The in-memory session still works for this tab.
  }
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY)
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
