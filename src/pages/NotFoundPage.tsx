import { ArrowLeft, FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { useSession } from '../context/SessionContext'

export function NotFoundPage() {
  const { t } = useProfile()
  const { session } = useSession()

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
      <span className="ui-icon !h-14 !w-14 !bg-amber-50 !text-amber-600 !ring-amber-200"><FileQuestion className="h-7 w-7" aria-hidden="true" /></span>
      <p className="mt-6 text-xs font-semibold text-brand">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{t('nf.title')}</h1>
      <p className="mt-3 text-sm text-gray-500">{t('nf.body')}</p>
      <Link to={session ? '/app' : '/'} className="ui-button mt-7"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t(session ? 'nf.home' : 'nf.homeHome')}</Link>
    </div>
  )
}
