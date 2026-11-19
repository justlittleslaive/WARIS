import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearSession, loadSession, saveSession, type DemoSession } from '../lib/session'

interface SessionApi {
  session: DemoSession | null
  signIn(input: { name: string; email: string }): void
  signOut(): void
}

const SessionContext = createContext<SessionApi | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(() => loadSession())

  const signIn = useCallback((input: { name: string; email: string }) => {
    const next: DemoSession = {
      name: input.name.trim().slice(0, 100),
      email: input.email.trim().slice(0, 200),
      signedInAt: new Date().toISOString(),
    }
    saveSession(next)
    setSession(next)
  }, [])

  const signOut = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionApi {
  const api = useContext(SessionContext)
  if (!api) throw new Error('useSession must be used within SessionProvider')
  return api
}
