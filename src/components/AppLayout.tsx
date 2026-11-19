import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AlertTriangle, BookOpen, ChevronRight, ClipboardCheck, Download, ExternalLink, LayoutDashboard, LogOut, Menu, Printer, Trash2, Users, Wallet, X } from 'lucide-react'
import type { DemoPersonaId } from '../types'
import type { TranslationKey } from '../data/i18n'
import { useProfile } from '../context/ProfileContext'
import { useSession } from '../context/SessionContext'
import { useToast } from '../context/ToastContext'
import { buildDemoProfile, DEMO_PERSONAS } from '../data/demo'
import { calculateReadinessScore } from '../lib/selectors'
import { BrandBadge } from './BrandBadge'
import { LanguageToggle } from './LanguageToggle'
import { Modal } from './Modal'
import { ConfirmDialog } from './ConfirmDialog'

const NAV_ITEMS = [
  { to: '/app', label: 'nav.dashboard', icon: LayoutDashboard, group: 'ui.overview' },
  { to: '/app/assets', label: 'nav.assets', icon: Wallet, group: 'ui.records' },
  { to: '/app/family', label: 'nav.family', icon: Users, group: 'ui.records' },
  { to: '/app/readiness', label: 'nav.readiness', icon: ClipboardCheck, group: 'ui.resources' },
  { to: '/app/learn', label: 'nav.learn', icon: BookOpen, group: 'ui.resources' },
  { to: '/app/summary', label: 'nav.summary', icon: Printer, group: 'ui.resources' },
] as const

const PERSONA_OPTIONS = DEMO_PERSONAS.map((persona) => ({
  id: persona.id, name: persona.name, score: calculateReadinessScore(buildDemoProfile(persona, 'ms')),
}))

export function AppLayout() {
  const { profile, actions, t, loadNotice, dismissLoadNotice, storageError } = useProfile()
  const { session, signOut } = useSession()
  const { show } = useToast()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<DemoPersonaId>('ahmad')
  const drawerRef = useRef<HTMLDialogElement>(null)
  const currentPage = NAV_ITEMS.find((item) => item.to === location.pathname)?.label ?? 'nf.title'

  useEffect(() => { setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer) return
    if (menuOpen) drawer.showModal()
    else drawer.close()
    const previous = document.body.style.overflow
    if (menuOpen) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [menuOpen])

  function loadPersona() {
    const ok = actions.loadDemoData(selectedPersona)
    setDemoOpen(false)
    show(t(ok ? 'demo.loaded' : 'shell.storageWarning'), ok ? 'success' : 'error')
  }

  function resetData() {
    const ok = actions.resetProfile()
    setResetOpen(false)
    show(t(ok ? 'demo.resetDone' : 'shell.storageWarning'), ok ? 'success' : 'error')
  }

  function signOutToHome() {
    signOut()
    window.location.replace('/')
  }

  function renderSidebar(mobile = false) {
    return <>
      <div className="flex h-18 shrink-0 items-center justify-between border-b border-line px-5">
        <Link to="/"><BrandBadge wordmark className="h-14 w-auto" /></Link>
        {mobile && <button type="button" onClick={() => setMenuOpen(false)} aria-label={t('nav.closeMenu')} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><X className="h-5 w-5" aria-hidden="true" /></button>}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <div className="mb-7 flex items-center gap-3 rounded-lg border border-line bg-gray-50 px-3 py-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 ring-1 ring-gray-200"><Users className="h-4 w-4" aria-hidden="true" /></div><div className="min-w-0"><p className="truncate text-xs font-semibold">{t('ui.workspace')}</p><p className="mt-0.5 text-[11px] text-gray-500">{t('ui.localDemo')}</p></div><span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" /></div>
        <nav aria-label={t('nav.main')}>
          {(['ui.overview', 'ui.records', 'ui.resources'] as const).map((group) => (
            <div key={group} className="mb-6">
              <p className="mb-2 px-3 text-[11px] font-semibold text-gray-400">{t(group)}</p>
              <div className="space-y-1">
                {NAV_ITEMS.filter((item) => item.group === group).map(({ to, label, icon: Icon }) => (
                  <NavLink key={to} to={to} end={to === '/app'} onClick={() => setMenuOpen(false)} className={({ isActive }) => `flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-teal-50 text-brand' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.7} aria-hidden="true" /><span className="flex-1">{t(label)}</span>
                    {(to === '/app/assets' || to === '/app/family') && <span className="rounded-md bg-gray-100 px-1.5 text-[11px] text-gray-500">{to === '/app/assets' ? profile.assets.length : profile.contacts.length}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-line pt-5"><p className="mb-2 px-3 text-[11px] font-semibold text-gray-400">{t('shell.demoControls')}</p>
          <button type="button" onClick={() => { setMenuOpen(false); setDemoOpen(true) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-100"><Download className="h-4 w-4" aria-hidden="true" />{t('shell.loadDemo')}</button>
          <button type="button" onClick={() => { setMenuOpen(false); setResetOpen(true) }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-danger"><Trash2 className="h-4 w-4" aria-hidden="true" />{t('shell.resetData')}</button>
        </div>
      </div>
      {session && <div className="shrink-0 border-t border-line p-4"><div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800">{session.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{session.name}</p><p className="mt-0.5 truncate text-[11px] text-gray-500">{session.email}</p></div><button type="button" onClick={signOutToHome} aria-label={t('shell.logout')} title={t('shell.logout')} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"><LogOut className="h-4 w-4" aria-hidden="true" /></button></div></div>}
    </>
  }

  return (
    <div className="min-h-screen">
      <a href="#main" className="no-print sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-white focus:p-3 focus:text-sm">{t('shell.skipToContent')}</a>
      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-white lg:flex">{renderSidebar()}</aside>
      <div className="app-shell lg:pl-64">
        <header className="no-print sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-line bg-white px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMenuOpen(true)} aria-label={t('nav.openMenu')} aria-expanded={menuOpen} aria-controls="mobile-nav" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"><Menu className="h-5 w-5" aria-hidden="true" /></button>
            <div className="flex min-w-0 items-center gap-2 text-sm"><span className="hidden text-gray-400 sm:inline">{t('ui.workspace')}</span><ChevronRight className="hidden h-3.5 w-3.5 text-gray-300 sm:block" aria-hidden="true" /><span className="truncate font-medium text-gray-700">{t(currentPage as TranslationKey)}</span></div>
          </div>
          <div className="flex shrink-0 items-center gap-4"><Link to="/" className="hidden items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-ink md:flex">{t('ui.home')}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></Link><LanguageToggle /></div>
        </header>
        <main id="main" className="app-main px-4 py-6 sm:p-8">
          {loadNotice && <div className="no-print mx-auto mb-4 flex max-w-6xl items-start justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"><p>{t(loadNotice === 'repaired' ? 'shell.dataRepaired' : 'shell.invalidData')}</p><button type="button" onClick={dismissLoadNotice} className="font-semibold underline">{t('shell.dismiss')}</button></div>}
          {storageError && <div role="alert" className="no-print mx-auto mb-4 flex max-w-6xl items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-danger"><AlertTriangle className="h-4 w-4" aria-hidden="true" />{t('shell.storageWarning')}</div>}
          <Outlet />
          <footer className="no-print mx-auto mt-10 flex max-w-6xl flex-wrap justify-between gap-3 border-t border-line pt-5 text-[11px] text-gray-400"><span>© {new Date().getFullYear()} MyWaris</span><span>{t('ui.localDemo')} · {t('app.tagline')}</span></footer>
        </main>
      </div>
      <dialog ref={drawerRef} id="mobile-nav" className="drawer no-print" aria-label={t('nav.main')} onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setMenuOpen(false) }}>
        <div className="flex h-full flex-col">{renderSidebar(true)}</div>
      </dialog>
      {demoOpen && <Modal title={t('demo.loadTitle')} onClose={() => setDemoOpen(false)} footer={<><button type="button" onClick={() => setDemoOpen(false)} className="ui-button-secondary">{t('common.cancel')}</button><button type="button" onClick={loadPersona} className="ui-button">{t('demo.load')}</button></>}>
        <p className="text-sm leading-relaxed text-ink-soft">{t('demo.loadBody')}</p>
        <fieldset className="mt-5"><legend className="text-sm font-medium">{t('shell.choosePersona')}</legend><div className="mt-3 space-y-2">{PERSONA_OPTIONS.map((persona) => <label key={persona.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 ${selectedPersona === persona.id ? 'border-brand bg-teal-50' : 'border-line hover:bg-gray-50'}`}><input type="radio" name="demo-persona" value={persona.id} checked={selectedPersona === persona.id} onChange={() => setSelectedPersona(persona.id)} className="h-4 w-4 accent-amber-500" /><span className="flex-1 text-sm font-medium">{persona.name}</span><span className="text-xs font-semibold text-brand">{persona.score}%</span></label>)}</div></fieldset>
      </Modal>}
      {resetOpen && <ConfirmDialog title={t('demo.resetTitle')} body={t('demo.resetBody')} confirmLabel={t('demo.reset')} cancelLabel={t('common.cancel')} onConfirm={resetData} onCancel={() => setResetOpen(false)} danger />}
    </div>
  )
}
