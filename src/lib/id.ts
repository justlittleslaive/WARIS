/**
 * crypto.randomUUID is only available in secure contexts; a LAN HTTP origin is
 * not one, so a timestamp + random base-36 fallback is required.
 */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID()
    } catch {
      // fall through to the non-cryptographic fallback
    }
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
