import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { MALAYSIAN_STATES, type LegalTrack, type MalaysianState } from '../types';
import { TRACK_LABEL_KEYS, type DictKey } from '../data/i18n';
import { useProfile } from '../context/ProfileContext';
import { useToast } from '../context/ToastContext';

const TRACK_OPTIONS: { value: LegalTrack; labelKey: DictKey }[] = [
  { value: 'muslim', labelKey: 'track.labelMuslim' },
  { value: 'non-muslim', labelKey: 'track.labelNonMuslim' },
  { value: 'native-customary', labelKey: 'track.labelNative' },
  { value: 'unsure', labelKey: 'track.labelUnsure' },
];

interface LegalTrackSelectorProps {
  onSaved?: () => void;
  showTitle?: boolean;
}

export function LegalTrackSelector({ onSaved, showTitle = true }: LegalTrackSelectorProps) {
  const { profile, t, actions } = useProfile();
  const { showToast } = useToast();
  const [track, setTrack] = useState<LegalTrack>(profile.legalTrack);
  const [stateValue, setStateValue] = useState<MalaysianState | ''>(profile.state ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setTrack(profile.legalTrack);
    setStateValue(profile.state ?? '');
    setError(null);
  }, [profile.legalTrack, profile.state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);
    if (track === 'native-customary' && stateValue !== 'Sabah' && stateValue !== 'Sarawak') {
      setError(t('track.stateRequired'));
      return;
    }
    setError(null);
    const ok = actions.setLegalTrack(track, stateValue === '' ? undefined : stateValue);
    if (!ok) {
      showToast(t('common.storageError'), 'error');
      return;
    }
    setSaved(true);
    showToast(t('track.updated'), 'success');
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {showTitle && (
        <div>
          <h2 className="text-base font-semibold text-slate-900">{t('track.selectTitle')}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{t('track.selectDesc')}</p>
        </div>
      )}

      <fieldset>
        <legend className="label">{t('track.religionLabel')}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {TRACK_OPTIONS.map((option) => {
            const checked = track === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  checked
                    ? 'border-teal-600 bg-teal-50 text-teal-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="legal-track"
                  value={option.value}
                  checked={checked}
                  onChange={() => {
                    setTrack(option.value);
                    setError(null);
                    setSaved(false);
                  }}
                  className="h-4 w-4 border-slate-300 text-teal-700 focus:ring-teal-600"
                />
                <span>{t(option.labelKey)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label className="label" htmlFor="track-state">
          {t('track.stateLabel')}{' '}
          <span className="text-slate-400">
            {track === 'native-customary'
              ? `(${t('common.required')})`
              : `(${t('common.optional')})`}
          </span>
        </label>
        <select
          id="track-state"
          value={stateValue}
          onChange={(event) => {
            setStateValue(event.target.value as MalaysianState | '');
            setError(null);
            setSaved(false);
          }}
          className={`input ${error ? 'input-error' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'track-state-error' : undefined}
        >
          <option value="">{t('track.statePlaceholder')}</option>
          {MALAYSIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {track === 'native-customary' && !error && (
          <p className="mt-1 text-xs text-slate-500">{t('track.nativeStateHint')}</p>
        )}
        {error && (
          <p id="track-state-error" className="field-error">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {t('track.save')}
        </button>
        <span className="chip">{`${t('track.current')}: ${t(TRACK_LABEL_KEYS[profile.legalTrack])}`}</span>
        {saved && (
          <span role="status" className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            {t('track.updated')}
          </span>
        )}
      </div>
    </form>
  );
}
