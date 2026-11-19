import { BookOpen, Compass, Landmark, ScrollText, Trees } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'

export function LearnPage() {
  const { t } = useProfile()
  const tracks = [{ id: 'muslim', icon: Landmark }, { id: 'civil', icon: ScrollText }, { id: 'native', icon: Trees }, { id: 'unsure', icon: Compass }] as const

  return (
    <div className="ui-page enter-page">
      <header><h1 className="ui-title">{t('learn.title')}</h1><p className="mt-2 text-sm text-gray-500">{t('ui.legalScope')}</p></header>
      <section className="ui-panel flex items-start gap-4 p-6">
        <span className="ui-icon !bg-amber-50 !text-amber-600"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
        <div><span className="ui-badge">{t('ui.planned')}</span><h2 className="mt-3 text-sm font-semibold">{t('learn.placeholder')}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">{t('learn.placeholderBody')}</p></div>
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        {tracks.map(({ id, icon: Icon }) => <article key={id} className="ui-panel p-6"><Icon className="h-6 w-6 text-gray-400" aria-hidden="true" /><h2 className="mt-4 text-sm font-semibold">{t(`landing.legal.${id}`)}</h2><p className="mt-2 text-xs leading-relaxed text-gray-500">{t(`landing.legal.${id}Desc`)}</p><p className="mt-5 border-t border-line pt-3 text-[11px] font-medium text-gray-400">{t('ui.planned')}</p></article>)}
      </div>
      <p className="text-xs leading-relaxed text-gray-500">{t('landing.footer.legal')}</p>
    </div>
  )
}
