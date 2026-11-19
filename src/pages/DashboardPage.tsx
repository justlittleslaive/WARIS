import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, ClipboardCheck, FileText, Plus, Printer, Users, Wallet } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { calculateAssetTotal, calculateReadinessScore, getReadinessStatus, getReadinessTasks } from '../lib/selectors'
import { formatMoney } from '../lib/format'

const TASK_LINK = { assets: '/app/assets', family: '/app/family', documents: '/app/readiness', planning: '/app/readiness', emergency: '/app/summary' }

export function DashboardPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const [name, setName] = useState(profile.name)
  useEffect(() => { setName(profile.name) }, [profile.name])
  const score = calculateReadinessScore(profile)
  const status = getReadinessStatus(score)
  const tasks = getReadinessTasks(profile)
  const completed = tasks.filter((task) => task.completed).length
  const total = calculateAssetTotal(profile.assets)
  const recentAssets = [...profile.assets].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4)
  const primaryContact = profile.contacts.find((contact) => contact.isPrimaryContact)

  function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const ok = actions.setProfileName(name)
    show(t(ok ? 'dash.nameSaved' : 'shell.storageWarning'), ok ? 'success' : 'error')
  }

  const stats = [
    { label: t('dash.totalValue'), value: formatMoney(total, profile.language), note: t('assets.indicativeNote'), icon: Wallet },
    { label: t('dash.assetCount'), value: profile.assets.length, note: t('nav.assets'), icon: FileText, link: '/app/assets' },
    { label: t('dash.contactCount'), value: profile.contacts.length, note: t('nav.family'), icon: Users, link: '/app/family' },
    { label: t('dash.score'), value: `${score}%`, note: t(`status.${status}`), icon: ClipboardCheck, link: '/app/readiness' },
  ]

  return (
    <div className="ui-page enter-page">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="ui-title">{t('nav.dashboard')}</h1><p className="mt-2 text-sm text-gray-500">{profile.name.trim() ? t('dash.welcome', { name: profile.name }) : t('dash.welcomeNew')}</p></div>
        <Link to="/app/assets" className="ui-button"><Plus className="h-4 w-4" aria-hidden="true" />{t('dash.addAsset')}</Link>
      </header>
      <section aria-label={t('ui.overview')} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, link }) => (
          <article key={label} className="ui-panel p-5">
            <div className="flex items-center justify-between gap-3"><p className="text-xs font-medium text-gray-500">{label}</p><Icon className="h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" /></div>
            <p className="mt-4 break-words text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
            {link ? <Link to={link} className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-dark">{note}<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" /></Link> : <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-gray-400">{note}</p>}
          </article>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
        <div className="ui-panel flex flex-col">
          <div className="border-b border-line px-5 py-4"><h2 className="text-sm font-semibold">{t('dash.progress')}</h2><p className="mt-1 text-xs text-gray-500">{t('ready.doneOf', { done: completed, total: tasks.length })}</p></div>
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-7">
            <div role="progressbar" aria-label={t('dash.progress')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} className="relative h-40 w-40">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="#f3f4f6" strokeWidth="9" /><circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-brand-accent)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${score / 100 * 2 * Math.PI * 52} ${2 * Math.PI * 52}`} /></svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-semibold tabular-nums">{score}%</span><span className="mt-1 text-[10px] text-gray-400">{t('dash.score')}</span></div>
            </div>
            <span className="ui-badge mt-5">{t(`status.${status}`)}</span><p className="mt-3 max-w-xs text-center text-xs leading-relaxed text-gray-500">{t('dash.question')}</p>
          </div>
          <Link to="/app/readiness" className="flex items-center justify-center gap-2 border-t border-line px-4 py-3.5 text-xs font-semibold text-brand hover:bg-teal-50/50">{t('dash.completeCta')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
        </div>
        <div className="ui-panel">
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4"><h2 className="text-sm font-semibold">{t('dash.nextSteps')}</h2><span className="rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-500">{completed}/{tasks.length}</span></div>
          <ol className="divide-y divide-line">
            {tasks.map((task) => <li key={task.id}><Link to={TASK_LINK[task.id]} className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-gray-50"><span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${task.completed ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-white ring-1 ring-gray-300'}`}>{task.completed && <Check className="h-3 w-3" aria-hidden="true" />}</span><div className="min-w-0 flex-1"><p className="text-xs font-medium leading-relaxed">{t(`task.${task.id}.label`)}</p><p className="mt-0.5 text-[11px] text-gray-400">{t(task.completed ? 'ui.completed' : 'ui.remaining')}</p></div><span className="mt-1 text-[11px] font-medium text-gray-400">{t('ready.points', { points: task.points })}</span></Link></li>)}
          </ol>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="ui-panel overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4"><h2 className="text-sm font-semibold">{t('ui.recentAssets')}</h2><Link to="/app/assets" className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-dark">{t('ui.allAssets')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div>
          {recentAssets.length ? <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-gray-50 text-gray-500"><tr><th scope="col" className="px-5 py-3 font-medium">{t('assets.colName')}</th><th scope="col" className="px-5 py-3 text-right font-medium">{t('assets.colValue')}</th></tr></thead><tbody className="divide-y divide-line">{recentAssets.map((asset) => <tr key={asset.id}><td className="px-5 py-4"><p className="font-medium">{asset.name}</p><p className="mt-1 text-[11px] text-gray-400">{asset.category}</p></td><td className="px-5 py-4 text-right font-semibold tabular-nums">{formatMoney(asset.estimatedValue, profile.language)}</td></tr>)}</tbody></table></div> : <div className="flex min-h-56 flex-col items-center justify-center p-6 text-center"><span className="ui-icon"><Wallet className="h-5 w-5" aria-hidden="true" /></span><p className="mt-4 text-sm font-medium">{t('assets.emptyTitle')}</p><Link to="/app/assets" className="mt-3 text-xs font-semibold text-brand">{t('assets.emptyCta')}</Link></div>}
        </div>
        <div className="space-y-5">
          <form onSubmit={saveName} className="ui-panel p-5"><h2 className="mb-4 text-sm font-semibold">{t('ui.profile')}</h2><label htmlFor="profile-name" className="mb-1.5 block text-xs font-medium text-gray-500">{t('dash.nameLabel')}</label><div className="flex gap-2"><input id="profile-name" className="ui-input min-w-0" value={name} maxLength={100} placeholder={t('dash.namePlaceholder')} onChange={(event) => setName(event.target.value)} /><button type="submit" className="ui-button-secondary">{t('common.save')}</button></div></form>
          <div className="ui-panel p-5"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-gray-400" aria-hidden="true" /><h2 className="text-sm font-semibold">{t('family.primary')}</h2></div><p className="mt-3 text-sm text-gray-600">{primaryContact?.name ?? t('summary.notRecorded')}</p><p className="mt-1 text-xs text-gray-400">{primaryContact?.phone ?? t('family.phoneEmpty')}</p><Link to="/app/family" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand">{t('nav.family')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div>
        </div>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-start gap-3"><Printer className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" /><div><h2 className="text-sm font-semibold">{t('nav.summary')}</h2><p className="mt-1 text-xs text-gray-500">{t('summary.subtitle')}</p></div></div><Link to="/app/summary" className="ui-button-secondary !text-xs">{t('dash.summaryCta')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link></div>
    </div>
  )
}
