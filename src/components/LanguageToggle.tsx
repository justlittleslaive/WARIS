import type { Language } from '../types'
import { useProfile } from '../context/ProfileContext'
import { useToast } from '../context/ToastContext'

export function LanguageToggle() {
  const { profile, actions, t } = useProfile()
  const { show } = useToast()

  function choose(language: Language) {
    if (language === profile.language) return
    if (!actions.setLanguage(language)) {
      show(t('shell.storageWarning'), 'error')
    }
  }

  const base = 'rounded-full px-3 py-1 text-xs font-semibold transition'
  const active = 'bg-brand text-white shadow-sm'
  const idle = 'text-ink-soft hover:text-ink'

  return (
    <div
      role="group"
      aria-label={t('shell.language')}
      className="flex items-center rounded-full border border-line bg-surface p-0.5"
    >
      <button
        type="button"
        aria-pressed={profile.language === 'ms'}
        onClick={() => choose('ms')}
        className={`${base} ${profile.language === 'ms' ? active : idle}`}
      >
        BM
      </button>
      <button
        type="button"
        aria-pressed={profile.language === 'en'}
        onClick={() => choose('en')}
        className={`${base} ${profile.language === 'en' ? active : idle}`}
      >
        EN
      </button>
    </div>
  )
}
