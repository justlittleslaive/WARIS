import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';

export function LanguageToggle() {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();

  function change(language: 'ms' | 'en') {
    if (language === profile.language) return;
    if (!actions.setLanguage(language)) {
      showToast(t('common.storageError'), 'error');
    }
  }

  return (
    <div
      role="group"
      aria-label={t('language.switch')}
      className="inline-flex overflow-hidden rounded-lg border border-slate-300 bg-white"
    >
      <button
        type="button"
        onClick={() => change('ms')}
        aria-pressed={profile.language === 'ms'}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
          profile.language === 'ms'
            ? 'bg-teal-700 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        BM
      </button>
      <button
        type="button"
        onClick={() => change('en')}
        aria-pressed={profile.language === 'en'}
        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
          profile.language === 'en'
            ? 'bg-teal-700 text-white'
            : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}
