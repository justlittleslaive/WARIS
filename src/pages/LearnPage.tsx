import { ExternalLink, Info, ShieldAlert } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import {
  ADVICE_URL,
  MUSLIM_CARDS,
  NON_MUSLIM_CARDS,
  TRACK_CARDS,
  type LearnCard,
} from '../data/legalTracks';
import {
  TRACK_DISCLAIMER_KEYS,
  TRACK_LABEL_KEYS,
} from '../data/i18n';
import { LegalTrackSelector } from '../components/LegalTrackSelector';

function LearnCardView({ card }: { card: LearnCard }) {
  const { t } = useProfile();
  return (
    <article className="card flex flex-col p-5">
      <h3 className="text-base font-semibold text-slate-900">{t(card.titleKey)}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(card.introKey)}</p>
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {t('learn.whyLabel')}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(card.whyKey)}</p>
      </div>
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {t('learn.tipLabel')}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(card.tipKey)}</p>
      </div>
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-teal-700 hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        {card.linkLabel}
        <span className="sr-only">({t('learn.officialLink')})</span>
      </a>
    </article>
  );
}

function AdviceCard() {
  const { t } = useProfile();
  return (
    <article className="rounded-xl border border-teal-200 bg-teal-50 p-5">
      <h3 className="text-base font-semibold text-teal-900">{t('learn.adviceTitle')}</h3>
      <p className="mt-2 text-sm leading-relaxed text-teal-900/80">{t('learn.adviceBody')}</p>
      <a
        href={ADVICE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-teal-800 hover:underline"
      >
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        malaysianbar.org.my
        <span className="sr-only">({t('learn.officialLink')})</span>
      </a>
    </article>
  );
}

export function LearnPage() {
  const { profile, t } = useProfile();
  const track = profile.legalTrack;
  const inBorneoState = profile.state === 'Sabah' || profile.state === 'Sarawak';
  const nativeNeedsState = track === 'native-customary' && !inBorneoState;
  const localLawWarning = track === 'non-muslim' && inBorneoState;
  const nativeNote = track === 'unsure' && inBorneoState;

  return (
    <div>
      <h1 className="page-title">{t('learn.title')}</h1>
      <p className="page-subtitle">{t('learn.subtitle')}</p>

      <section className="card mt-4 p-5">
        <LegalTrackSelector />
      </section>

      <div className="mt-4 space-y-3">
        {nativeNeedsState && (
          <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <AlertIcon />
            <span>{t('learn.nativeStatePrompt')}</span>
          </p>
        )}
        {localLawWarning && (
          <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <AlertIcon />
            <span>{t('learn.localLawWarning')}</span>
          </p>
        )}
        {nativeNote && (
          <p className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs text-blue-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{t('learn.nativeNote', { state: profile.state ?? '' })}</span>
          </p>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          <span>{t(TRACK_DISCLAIMER_KEYS[track])}</span>
        </p>
        <p className="mt-2 pl-6 text-[11px] leading-relaxed text-slate-500">
          {t('learn.generalDisclaimer')}
        </p>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        {t('learn.trackHeading', { track: t(TRACK_LABEL_KEYS[track]) })}
      </p>

      {track === 'unsure' ? (
        <div className="mt-2 space-y-6">
          <section>
            <h2 className="section-title">{t('learn.groupMuslim')}</h2>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {MUSLIM_CARDS.map((card) => (
                <LearnCardView key={card.id} card={card} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="section-title">{t('learn.groupNonMuslim')}</h2>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {NON_MUSLIM_CARDS.map((card) => (
                <LearnCardView key={card.id} card={card} />
              ))}
            </div>
          </section>
          <AdviceCard />
        </div>
      ) : (
        <div className="mt-2 grid gap-3 lg:grid-cols-2">
          {TRACK_CARDS[track].map((card) => (
            <LearnCardView key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

function AlertIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
