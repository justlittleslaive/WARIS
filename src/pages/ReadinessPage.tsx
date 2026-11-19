import { Link } from 'react-router-dom'
import { ArrowRight, Check, ClipboardCheck, Info } from 'lucide-react'
import type { ManualReadinessId } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { calculateReadinessScore, getReadinessStatus, getReadinessTasks } from '../lib/selectors'

export function ReadinessPage() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()
  const score = calculateReadinessScore(profile)
  const tasks = getReadinessTasks(profile)
  const done = tasks.filter((task) => task.completed).length

  function toggleManual(id: ManualReadinessId, checked: boolean) {
    if (!actions.setManualReadiness(id, checked)) show(t('shell.storageWarning'), 'error')
  }

  return (
    <div className="ui-page enter-page">
      <header><h1 className="ui-title">{t('ready.title')}</h1><p className="mt-2 text-sm text-gray-500">{t('ready.subtitle')}</p></header>
      <section className="ui-panel p-5 sm:p-6" aria-label={t('ready.scoreLabel')}>
        <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-4"><span className="ui-icon !bg-amber-50 !text-amber-600 !ring-amber-100"><ClipboardCheck className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-xs font-medium text-gray-500">{t('ready.scoreLabel')}</p><p className="mt-1 text-3xl font-semibold tabular-nums">{score}%</p></div></div><div className="text-right"><span className="ui-badge">{t(`status.${getReadinessStatus(score)}`)}</span><p className="mt-2 text-xs text-gray-500">{t('ready.doneOf', { done, total: tasks.length })}</p></div></div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={score} aria-label={t('ready.scoreLabel')} className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${score}%` }} /></div>
      </section>
      <section className="ui-panel overflow-hidden">
        <div className="border-b border-line px-5 py-4"><h2 className="text-sm font-semibold">{t('summary.checklist')}</h2></div>
        <ol className="divide-y divide-line">
          {tasks.map((task, index) => (
            <li key={task.id} className="p-5 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium ${task.completed ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-500'}`}>{task.completed ? <Check className="h-4 w-4" /> : `0${index + 1}`}</span>
                <div className="min-w-0 flex-1"><label htmlFor={`task-${task.id}`} className="block text-sm font-semibold leading-relaxed">{t(`task.${task.id}.label`)}</label><p className="mt-1 text-xs leading-relaxed text-gray-500">{t(`task.${task.id}.desc`)}</p><div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]"><span className="rounded-md bg-gray-100 px-2 py-1 font-medium text-gray-500">{t('ready.points', { points: task.points })}</span><span className="text-gray-400">{t(task.mode === 'manual' ? 'ready.manualHint' : 'ready.derived')}</span></div>
                  {task.mode === 'derived' ? <Link to={task.id === 'assets' ? '/app/assets' : '/app/family'} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">{t(task.id === 'assets' ? 'ready.goAssets' : 'ready.goContacts')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link> : task.id === 'emergency' ? <Link to="/app/summary" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-brand">{t('ready.reviewSummary')}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></Link> : null}
                </div>
                <input id={`task-${task.id}`} type="checkbox" checked={task.completed} disabled={task.mode !== 'manual'} onChange={(event) => { if (task.mode === 'manual') toggleManual(task.id as ManualReadinessId, event.target.checked) }} className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-brand disabled:cursor-default disabled:opacity-60" />
              </div>
            </li>
          ))}
        </ol>
      </section>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500"><Info className="h-4 w-4 shrink-0" aria-hidden="true" />{t('ready.disclaimer')}</p>
    </div>
  )
}
