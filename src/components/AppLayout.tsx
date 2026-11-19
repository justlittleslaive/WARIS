import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  AlertTriangle,
  BookOpen,
  ClipboardCheck,
  Download,
  Info,
  LayoutDashboard,
  Menu,
  Printer,
  Trash2,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { DemoPersonaId } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'
import { buildDemoProfile, DEMO_PERSONAS } from '../data/demo'
import { calculateReadinessScore } from '../lib/selectors'
import type { TranslationKey } from '../data/i18n'
import { LanguageToggle } from './LanguageToggle'
import { Modal } from './Modal'
import { ConfirmDialog } from './ConfirmDialog'

const NAV_ITEMS: { to: string; label: TranslationKey; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/assets', label: 'nav.assets', icon: Wallet },
  { to: '/family', label: 'nav.family', icon: Users },
  { to: '/readiness', label: 'nav.readiness', icon: ClipboardCheck },
  { to: '/learn', label: 'nav.learn', icon: BookOpen },
  { to: '/summary', label: 'nav.summary', icon: Printer },
]

const PERSONA_OPTIONS = DEMO_PERSONAS.map((persona) => ({
  id: persona.id,
  name: persona.name,
  score: calculateReadinessScore(buildDemoProfile(persona, 'ms')),
}))

function Brand() {
  const { t } = useProfile()
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-base font-bold text-white">
        W
      </span>
      <span>
        <span className="block text-base font-bold tracking-tight text-ink">{t('app.name')}</span>
        <span className="block text-[11px] text-ink-soft">{t('app.tagline')}</span>
      </span>
    </div>
  )
}

export function AppLayout() {
  const { actions, t, loadNotice, dismissLoadNotice, storageError } = useProfile()
  const { show } = useToast()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<DemoPersonaId>('ahmad')

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  function loadPersona() {
    const ok = actions.loadDemoData(selectedPersona)
    setDemoOpen(false)
    if (ok) show(t('demo.loaded'))
    else show(t('shell.storageWarning'), 'error')
  }

  function resetData() {
    const ok = actions.resetProfile()
    setResetOpen(false)
    if (ok) show(t('demo.resetDone'))
    else show(t('shell.storageWarning'), 'error')
  }

  function renderNav(onNavigate?: () => void) {
    return (
      <nav aria-label={t('nav.main')} className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? 'bg-brand/10 font-semibold text-brand'
                  : 'font-medium text-ink-soft hover:bg-canvas hover:text-ink'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t(label)}
          </NavLink>
        ))}
      </nav>
    )
  }

  function renderDemoControls() {
    return (
      <div className="mt-6 border-t border-line pt-4">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          {t('shell.demoControls')}
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setDemoOpen(true)
            }}
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink transition hover:bg-canvas"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t('shell.loadDemo')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setResetOpen(true)
            }}
            className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-danger transition hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            {t('shell.resetData')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="no-print sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        {t('shell.skipToContent')}
      </a>

      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <div className="px-2">
          <Brand />
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          {renderNav()}
          {renderDemoControls()}
        </div>
        <p className="mt-4 px-3 text-[11px] leading-relaxed text-ink-soft">
          {t('shell.demoBanner')}
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-30 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label={t('nav.openMenu')}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                className="rounded-lg border border-line p-2 text-ink transition hover:bg-canvas"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
              <Brand />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-ink">{t('app.tagline')}</p>
            </div>
            <LanguageToggle />
          </div>
        </header>

        <div className="no-print border-b border-line bg-amber-50 px-4 py-2 text-[12px] leading-relaxed text-amber-900 sm:px-6 lg:px-8">
          <p className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t('shell.demoBanner')}</span>
          </p>
        </div>

        {loadNotice ? (
          <div className="no-print flex items-start justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2 text-[12px] text-amber-900 sm:px-6 lg:px-8">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {loadNotice === 'repaired' ? t('shell.dataRepaired') : t('shell.invalidData')}
              </span>
            </p>
            <button
              type="button"
              onClick={dismissLoadNotice}
              className="shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold text-amber-900 underline"
            >
              {t('shell.dismiss')}
            </button>
          </div>
        ) : null}

        {storageError ? (
          <div className="no-print border-b border-red-200 bg-red-50 px-4 py-2 text-[12px] text-danger sm:px-6 lg:px-8">
            <p className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t('shell.storageWarning')}</span>
            </p>
          </div>
        ) : null}

        <main id="main" className="app-main px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      {menuOpen ? (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-nav"
            className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-surface px-4 py-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-3 px-2">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t('nav.closeMenu')}
                className="rounded-lg p-1.5 text-ink-soft transition hover:bg-canvas hover:text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6">
              {renderNav(() => setMenuOpen(false))}
              {renderDemoControls()}
            </div>
          </div>
        </div>
      ) : null}

      {demoOpen ? (
        <Modal
          title={t('demo.loadTitle')}
          onClose={() => setDemoOpen(false)}
          footer={
            <>
              <button
                type="button"
                onClick={() => setDemoOpen(false)}
                className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-canvas"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={loadPersona}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
              >
                {t('demo.load')}
              </button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-ink-soft">{t('demo.loadBody')}</p>
          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-ink">{t('shell.choosePersona')}</legend>
            <div className="mt-2 space-y-2">
              {PERSONA_OPTIONS.map((persona) => (
                <label
                  key={persona.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition ${
                    selectedPersona === persona.id
                      ? 'border-brand bg-brand/5'
                      : 'border-line hover:bg-canvas'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="demo-persona"
                      value={persona.id}
                      checked={selectedPersona === persona.id}
                      onChange={() => setSelectedPersona(persona.id)}
                      className="h-4 w-4 accent-[#0F766E]"
                    />
                    <span className="text-sm font-medium text-ink">{persona.name}</span>
                  </span>
                  <span className="text-sm font-semibold text-brand">{persona.score}%</span>
                </label>
              ))}
            </div>
          </fieldset>
        </Modal>
      ) : null}

      {resetOpen ? (
        <ConfirmDialog
          title={t('demo.resetTitle')}
          body={t('demo.resetBody')}
          confirmLabel={t('demo.reset')}
          cancelLabel={t('common.cancel')}
          onConfirm={resetData}
          onCancel={() => setResetOpen(false)}
          danger
        />
      ) : null}
    </div>
  )
}
