import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, ChevronRight, ClipboardCheck, FileText, Printer, Users, Wallet } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { useSession } from '../context/SessionContext'
import { BrandBadge } from '../components/BrandBadge'
import { HeroSlider } from '../components/HeroSlider'
import { LanguageToggle } from '../components/LanguageToggle'
import { buildDemoProfile, DEMO_PERSONAS } from '../data/demo'
import { calculateReadinessScore } from '../lib/selectors'

export function LandingPage() {
  const { profile, t } = useProfile()
  const { session } = useSession()
  const destination = session ? '/app' : '/login'
  const features = [
    { id: 'assets', icon: Wallet }, { id: 'family', icon: Users },
    { id: 'readiness', icon: ClipboardCheck }, { id: 'summary', icon: Printer },
  ] as const

  return (
    <div className="min-h-screen bg-white">
      <a href="#public-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3">{t('shell.skipToContent')}</a>
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="shrink-0" aria-label={t('app.name')}><BrandBadge wordmark className="h-11 w-auto sm:h-14" /></Link>
          <nav aria-label={t('nav.main')} className="hidden items-center gap-7 text-sm font-medium text-gray-600 lg:flex">
            <a href="#features" className="hover:text-brand">{t('landing.nav.features')}</a>
            <a href="#how" className="hover:text-brand">{t('landing.nav.how')}</a>
            {!session && <a href="#profiles" className="hover:text-brand">{t('ui.tryDemo')}</a>}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageToggle />
            <Link to={destination} className="ui-button-secondary !px-3 max-[360px]:!px-2 max-[360px]:!text-xs">{session ? t('landing.nav.app') : t('landing.nav.signIn')}<ArrowRight className="hidden h-4 w-4 sm:block" aria-hidden="true" /></Link>
          </div>
        </div>
      </header>

      <main id="public-main">
        <HeroSlider />
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-end gap-5 md:grid-cols-[1.2fr_1fr]">
            <div><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">{t('landing.nav.features')}</p><h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t('ui.whyTitle')}</h2></div>
            <p className="max-w-md text-base leading-relaxed text-ink-soft">{t('ui.whyBody')}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ id, icon: Icon }, index) => (
              <article key={id} className="ui-panel p-6 !shadow-none">
                <div className="flex items-center justify-between"><span className="ui-icon !bg-teal-50 !text-brand !ring-teal-100"><Icon className="h-5 w-5" aria-hidden="true" /></span><span className="text-xs font-medium text-gray-400">0{index + 1}</span></div>
                <h3 className="mt-6 font-semibold">{t(`landing.features.${id}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{t(`landing.features.${id}.desc`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="border-y border-line bg-canvas">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div><span className="ui-icon"><FileText className="h-5 w-5" aria-hidden="true" /></span><h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight">{t('landing.how.title')}</h2><p className="mt-4 text-sm leading-relaxed text-gray-500">{t('landing.cta.body')}</p><Link to={destination} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark">{t('landing.cta.button')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
            <ol className="ui-panel divide-y divide-line">
              {(['step1', 'step2', 'step3'] as const).map((step, index) => (
                <li key={step} className="flex items-start gap-4 p-5 sm:p-6"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500">0{index + 1}</span><div><h3 className="text-sm font-semibold">{t(`landing.how.${step}.title`)}</h3><p className="mt-1.5 text-sm leading-relaxed text-gray-500">{t(`landing.how.${step}.desc`)}</p></div></li>
              ))}
            </ol>
          </div>
        </section>

        {!session && <section id="profiles" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl"><h2 className="text-3xl font-bold tracking-tight">{t('landing.demo.title')}</h2><p className="mt-3 text-sm leading-relaxed text-gray-500">{t('landing.demo.body')}</p></div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEMO_PERSONAS.map((persona, index) => {
              const score = calculateReadinessScore(buildDemoProfile(persona, profile.language))
              const track = persona.legalTrack === 'muslim' ? 'muslim' : persona.legalTrack === 'native-customary' ? 'native' : 'civil'
              return <Link key={persona.id} to={`/login?demo=${persona.id}`} className="ui-panel group p-5 transition-colors hover:border-brand">
                <div className="flex items-center justify-between"><span className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${['bg-teal-100 text-teal-800', 'bg-sky-100 text-sky-800', 'bg-amber-100 text-amber-800', 'bg-emerald-100 text-emerald-800'][index]}`}>{persona.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-brand" aria-hidden="true" /></div>
                <h3 className="mt-4 text-sm font-semibold">{persona.name}</h3><p className="mt-1 min-h-10 text-xs leading-relaxed text-gray-500">{t(`landing.legal.${track}`)}</p>
                <div className="mt-5 border-t border-line pt-4"><div className="flex items-center justify-between text-xs"><span className="text-gray-500">{t('dash.score')}</span><span className="font-semibold">{score}%</span></div><div className="mt-2 h-1.5 rounded-full bg-gray-100"><div className="h-full rounded-full bg-brand" style={{ width: `${score}%` }} /></div></div>
              </Link>
            })}
          </div>
        </section>}

        <section className="border-y border-line bg-gray-50">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-start"><BookOpen className="h-6 w-6 shrink-0 text-gray-400" aria-hidden="true" /><div><h2 className="text-sm font-semibold">{t('ui.planned')} · {t('nav.learn')}</h2><p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-500">{t('ui.legalScope')}</p></div></div>
        </section>
        <section className="px-4 py-16 text-center sm:px-6 sm:py-20"><h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight">{t('ui.getOrganized')}</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-500">{t('landing.quote.text')}</p><Link to={destination} className="ui-button mt-7 !px-6">{t('landing.cta.button')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></section>
      </main>
      <footer className="border-t border-line bg-gray-50"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="flex flex-wrap items-center justify-between gap-4"><Link to="/"><BrandBadge wordmark className="h-12 w-auto" /></Link><p className="text-xs text-gray-500">© {new Date().getFullYear()} MyWaris</p></div><p className="mt-5 border-t border-line pt-5 text-xs leading-relaxed text-gray-500">{t('landing.footer.legal')}</p></div></footer>
    </div>
  )
}
