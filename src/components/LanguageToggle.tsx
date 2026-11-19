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

  const base = 'min-h-8 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors'
  const active = 'bg-white text-gray-950 shadow-sm ring-1 ring-gray-200'
  const idle = 'text-gray-500 hover:text-gray-900'

  return (
    <div
      role="group"
      aria-label={t('shell.language')}
      className="flex shrink-0 items-center rounded-lg bg-gray-100 p-1"
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
