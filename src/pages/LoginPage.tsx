import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import { BrandBadge } from '../components/BrandBadge'
import { LanguageToggle } from '../components/LanguageToggle'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { DEMO_PERSONAS } from '../data/demo'

export function LoginPage() {
  const [params] = useSearchParams()
  const persona = DEMO_PERSONAS.find((item) => item.id === params.get('demo'))
  return <LoginForm key={persona?.id ?? 'custom'} persona={persona} />
}

function LoginForm({ persona }: { persona: (typeof DEMO_PERSONAS)[number] | undefined }) {
  const { profile, actions, t } = useProfile()
  const { session, signIn } = useSession()
  const { show } = useToast()
  const location = useLocation()
  const [name, setName] = useState(persona?.name ?? '')
  const [email, setEmail] = useState(persona ? `${persona.id}@example.test` : '')
  const [errors, setErrors] = useState<{ name?: boolean; email?: boolean }>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const from: unknown = (location.state as { from?: unknown } | null)?.from
  const redirectTo = typeof from === 'string' && (from === '/app' || from.startsWith('/app/')) ? from : '/app'

  if (session) return <Navigate to={redirectTo} replace />

  function enterWorkspace() {
    if (persona && !actions.loadDemoData(persona.id)) {
      setConfirmOpen(false)
      show(t('shell.storageWarning'), 'error')
      return
    }
    signIn({ name, email })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const invalid = { name: !name.trim(), email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) }
    setErrors(invalid)
    if (invalid.name || invalid.email) {
      document.getElementById(invalid.name ? 'login-name' : 'login-email')?.focus()
      return
    }
    const hasRecords = profile.name || profile.assets.length || profile.contacts.length || Object.values(profile.readiness).some(Boolean)
    if (persona && hasRecords) setConfirmOpen(true)
    else enterWorkspace()
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex items-center justify-between gap-3 px-4 py-5 sm:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-ink"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('auth.back')}</Link>
        <LanguageToggle />
      </header>
      <main className="enter-page mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center px-4 pb-12 pt-6">
        <Link to="/" className="mx-auto mb-7"><BrandBadge wordmark className="h-20 w-auto" /></Link>
        <div className="ui-panel p-6 sm:p-8">
          <div className="text-center"><h1 className="text-2xl font-bold tracking-tight">{t('ui.demoLogin')}</h1><p className="mt-2 text-sm leading-relaxed text-gray-500">{t('ui.demoLoginNote')}</p></div>
          <div className="mt-7">
            <p className="mb-3 text-xs font-semibold text-gray-600">{t('ui.chooseDemo')}</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_PERSONAS.map((option) => (
                <Link key={option.id} to={`/login?demo=${option.id}`} state={location.state} aria-current={option.id === persona?.id ? 'true' : undefined} className={`flex min-h-12 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${option.id === persona?.id ? 'border-brand bg-teal-50 text-teal-900 ring-1 ring-brand' : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <span>{option.name}</span>{option.id === persona?.id ? <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />}
                </Link>
              ))}
            </div>
          </div>
          <div className="my-6 flex items-center gap-3 text-center text-[11px] text-gray-400"><span className="h-px flex-1 bg-gray-200" /><Link to="/login" state={location.state} className="text-gray-500 hover:text-brand">{t('ui.orDetails')}</Link><span className="h-px flex-1 bg-gray-200" /></div>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="login-name" className="mb-1.5 block text-sm font-medium">{t('auth.name')} <span aria-hidden="true" className="text-danger">*</span></label>
              <input id="login-name" className="ui-input" value={name} onChange={(event) => setName(event.target.value)} type="text" autoComplete="off" maxLength={100} required placeholder={t('auth.namePlaceholder')} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'login-name-error' : undefined} />
              {errors.name && <p id="login-name-error" role="alert" className="mt-1 text-xs text-danger">{t('auth.error.name')}</p>}
            </div>
            <div>
              <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium">{t('auth.email')} <span aria-hidden="true" className="text-danger">*</span></label>
              <input id="login-email" className="ui-input" value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="off" maxLength={200} required placeholder="name@example.test" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'login-email-error' : undefined} />
              {errors.email && <p id="login-email-error" role="alert" className="mt-1 text-xs text-danger">{t('auth.error.email')}</p>}
            </div>
            {persona && <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500">{t('ui.demoReplace')}</p>}
            <button type="submit" className="ui-button !mt-6 w-full">{t('auth.submit')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
          </form>
        </div>
      </main>
      {confirmOpen && <ConfirmDialog title={t('demo.loadTitle')} body={t('demo.loadBody')} confirmLabel={t('common.confirm')} cancelLabel={t('common.cancel')} onConfirm={enterWorkspace} onCancel={() => setConfirmOpen(false)} />}
    </div>
  )
}
