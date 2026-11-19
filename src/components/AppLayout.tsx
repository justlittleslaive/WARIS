import { useEffect, useRef, useState, type ComponentType } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileText,
  Info,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Trash2,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';
import { DEMO_PERSONAS, getDemoPersonaMeta } from '../data/demo';
import { TRACK_LABEL_KEYS, type DictKey } from '../data/i18n';
import type { DemoPersonaId } from '../types';
import { LanguageToggle } from './LanguageToggle';
import { Modal } from './Modal';
import { ConfirmDialog } from './ConfirmDialog';

interface NavItem {
  to: string;
  labelKey: DictKey;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard, end: true },
  { to: '/assets', labelKey: 'nav.assets', icon: Wallet },
  { to: '/family', labelKey: 'nav.family', icon: Users },
  { to: '/readiness', labelKey: 'nav.readiness', icon: ClipboardCheck },
  { to: '/learn', labelKey: 'nav.learn', icon: BookOpen },
  { to: '/summary', labelKey: 'nav.summary', icon: FileText },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useProfile();
  return (
    <nav aria-label={t('app.ariaMainNav')} className="flex-1 space-y-1 px-3">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden />
            {t(item.labelKey)}
          </NavLink>
        );
      })}
    </nav>
  );
}

function Brand() {
  const { t } = useProfile();
  return (
    <div className="flex items-center gap-2">
      <ShieldCheck className="h-7 w-7 shrink-0 text-teal-700" aria-hidden />
      <div className="leading-tight">
        <p className="text-base font-bold tracking-tight text-slate-900">{t('app.name')}</p>
        <p className="text-[11px] text-slate-500">{t('app.tagline')}</p>
      </div>
    </div>
  );
}

export function AppLayout() {
  const { profile, t, initialWarnings, actions } = useProfile();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [pendingPersona, setPendingPersona] = useState<DemoPersonaId | null>(null);
  const warningsShown = useRef(false);

  useEffect(() => {
    if (warningsShown.current) return;
    warningsShown.current = true;
    for (const warning of initialWarnings) {
      showToast(t(warning as DictKey), 'error');
    }
  }, [initialWarnings, showToast, t]);

  const hasContent =
    profile.assets.length > 0 ||
    profile.contacts.length > 0 ||
    profile.name.trim() !== '' ||
    profile.readiness.documents ||
    profile.readiness.planning ||
    profile.readiness.emergency;

  function loadPersona(id: DemoPersonaId) {
    const meta = getDemoPersonaMeta(id);
    if (actions.loadDemoData(id)) {
      showToast(t('demo.loaded', { name: meta.name }), 'success');
    } else {
      showToast(t('common.storageError'), 'error');
    }
    setDemoOpen(false);
    setMenuOpen(false);
    setPendingPersona(null);
  }

  function choosePersona(id: DemoPersonaId) {
    setMenuOpen(false);
    if (hasContent) {
      setDemoOpen(false);
      setPendingPersona(id);
    } else {
      loadPersona(id);
    }
  }

  function handleReset() {
    if (actions.resetProfile()) {
      showToast(t('demo.resetDone'), 'success');
    } else {
      showToast(t('common.storageError'), 'error');
    }
    setResetOpen(false);
    setMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="no-print fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="px-5 py-5">
          <Brand />
        </div>
        <NavList />
        <div className="border-t border-slate-200 px-4 py-3">
          <p className="text-[11px] leading-relaxed text-slate-500">{t('app.demoBanner')}</p>
        </div>
      </aside>

      {menuOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40"
            aria-hidden
            onClick={() => setMenuOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('nav.menu')}
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t('aria.closeMenu')}
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <NavList onNavigate={() => setMenuOpen(false)} />
            <div className="space-y-2 border-t border-slate-200 p-4">
              <button
                type="button"
                className="btn-secondary w-full"
                onClick={() => {
                  setMenuOpen(false);
                  setDemoOpen(true);
                }}
              >
                <Database className="h-4 w-4" aria-hidden />
                {t('demo.load')}
              </button>
              <button
                type="button"
                className="btn-ghost w-full text-red-600 hover:bg-red-50"
                onClick={() => {
                  setMenuOpen(false);
                  setResetOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                {t('demo.reset')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="app-main lg:pl-64">
        <header className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-2 px-4 py-3 lg:px-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t('app.ariaMenu')}
              aria-expanded={menuOpen}
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
            <span className="truncate text-sm font-bold text-slate-900 sm:hidden">
              {t('app.name')}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <LanguageToggle />
              <button
                type="button"
                className="btn-secondary hidden sm:inline-flex"
                onClick={() => setDemoOpen(true)}
              >
                <Database className="h-4 w-4" aria-hidden />
                {t('demo.load')}
              </button>
              <button
                type="button"
                className="btn-ghost hidden text-red-600 hover:bg-red-50 sm:inline-flex"
                onClick={() => setResetOpen(true)}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                {t('demo.reset')}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 border-t border-amber-200 bg-amber-50 px-3 py-1.5 text-center text-[11px] text-amber-900">
            <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{t('app.demoBanner')}</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="no-print mx-auto w-full max-w-6xl px-4 pb-8 lg:px-8">
          <p className="text-[11px] leading-relaxed text-slate-500">{t('app.storageNotice')}</p>
        </footer>
      </div>

      {demoOpen && (
        <Modal title={t('demo.dialogTitle')} onClose={() => setDemoOpen(false)}>
          <p className="text-sm text-slate-600">{t('demo.dialogDesc')}</p>
          <div className="mt-4 space-y-2">
            {DEMO_PERSONAS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => choosePersona(persona.id)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left transition-colors hover:border-teal-600 hover:bg-teal-50"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {persona.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {t('demo.personaMeta', {
                      track: t(TRACK_LABEL_KEYS[persona.track]),
                      assets: persona.assetCount,
                      contacts: persona.contactCount,
                      score: persona.score,
                    })}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
              </button>
            ))}
          </div>
        </Modal>
      )}

      {pendingPersona && (
        <ConfirmDialog
          title={t('demo.replaceTitle')}
          description={t('demo.replaceConfirm')}
          confirmLabel={t('demo.load')}
          onCancel={() => setPendingPersona(null)}
          onConfirm={() => loadPersona(pendingPersona)}
        />
      )}

      {resetOpen && (
        <ConfirmDialog
          title={t('demo.resetTitle')}
          description={t('demo.resetDesc')}
          confirmLabel={t('demo.reset')}
          danger
          onCancel={() => setResetOpen(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
}
