import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'

export function NotFoundPage() {
  const { t } = useProfile()

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink">{t('nf.title')}</h1>
      <p className="mt-1 text-sm text-ink-soft">{t('nf.body')}</p>
      <Link
        to="/"
        className="mt-5 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        {t('nf.home')}
      </Link>
    </div>
  )
}
