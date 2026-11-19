import { BookOpen } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'

export function LearnPage() {
  const { t } = useProfile()

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-ink">{t('learn.title')}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t('learn.subtitle')}</p>
      </header>

      <section className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-ink">{t('learn.placeholder')}</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t('learn.placeholderBody')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
