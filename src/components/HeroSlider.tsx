import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { useSession } from '../context/SessionContext'

const SLIDES = [
  { id: 'plan', image: '/images/mywaris-plan.webp', primary: '/app', secondary: '#how', top: '67.4%', primaryWidth: '18.7%', secondaryLeft: '25.5%', secondaryWidth: '19.3%' },
  { id: 'records', image: '/images/mywaris-records.webp', primary: '/app/assets', secondary: '#features', top: '65.8%', primaryWidth: '20%', secondaryLeft: '26.6%', secondaryWidth: '18%' },
  { id: 'readiness', image: '/images/mywaris-readiness.webp', primary: '/app/readiness', secondary: '/app/summary', top: '67.4%', primaryWidth: '20%', secondaryLeft: '26.6%', secondaryWidth: '18%' },
] as const

export function HeroSlider() {
  const { t } = useProfile()
  const { session } = useSession()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [hovered, setHovered] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const playing = !paused && !hovered && pageVisible
  const slide = SLIDES[current]

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPreferenceChange = () => { if (preference.matches) setPaused(true) }
    const onVisibilityChange = () => setPageVisible(!document.hidden)
    preference.addEventListener('change', onPreferenceChange)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      preference.removeEventListener('change', onPreferenceChange)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % SLIDES.length), 8000)
    return () => window.clearInterval(timer)
  }, [playing])

  function goTo(index: number) {
    setCurrent((index + SLIDES.length) % SLIDES.length)
    setPaused(true)
  }

  return (
    <section
      aria-label={t('slider.label')}
      aria-roledescription={t('slider.carousel')}
      className="border-b border-line bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(true) }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1) }
        if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1) }
      }}
    >
      <h1 className="sr-only">{t('app.name')} — {t('app.tagline')}</h1>
      <div className="mx-auto max-w-[1440px]" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        {SLIDES.map((item, index) => (
          <div key={item.id} hidden={index !== current} role="group" aria-roledescription={t('slider.slide')} aria-label={t('slider.position', { current: index + 1, total: SLIDES.length })}>
            <div
              className="relative overflow-hidden"
              onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }}
              onTouchEnd={(event) => {
                if (!touchStart.current) return
                const dx = event.changedTouches[0].clientX - touchStart.current.x
                const dy = event.changedTouches[0].clientY - touchStart.current.y
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1))
                touchStart.current = null
              }}
              onTouchCancel={() => { touchStart.current = null }}
            >
              <img src={item.image} alt={t(`slider.${item.id}.alt`)} width={1672} height={880} fetchPriority={index === 0 ? 'high' : 'low'} decoding="async" className="block h-auto w-full" draggable={false} />
              <Link to={session ? item.primary : '/login'} state={session ? undefined : { from: item.primary }} aria-label={t(`slider.${item.id}.primary`)} className="absolute left-[5.7%] hidden h-[7.6%] rounded-full transition-shadow hover:ring-4 hover:ring-brand/30 focus-visible:ring-4 focus-visible:ring-brand sm:block" style={{ top: item.top, width: item.primaryWidth }} />
              {item.secondary.startsWith('#') ? (
                <a href={item.secondary} aria-label={t(`slider.${item.id}.secondary`)} className="absolute hidden h-[7.6%] rounded-full hover:ring-4 hover:ring-brand/30 focus-visible:ring-4 focus-visible:ring-brand sm:block" style={{ top: item.top, left: item.secondaryLeft, width: item.secondaryWidth }} />
              ) : (
                <Link to={session ? item.secondary : '/login'} state={session ? undefined : { from: item.secondary }} aria-label={t(`slider.${item.id}.secondary`)} className="absolute hidden h-[7.6%] rounded-full hover:ring-4 hover:ring-brand/30 focus-visible:ring-4 focus-visible:ring-brand sm:block" style={{ top: item.top, left: item.secondaryLeft, width: item.secondaryWidth }} />
              )}
            </div>
            <div className="px-5 pb-4 pt-5 sm:sr-only">
              <h2 className="text-2xl font-bold leading-tight tracking-tight text-ink">{t(`slider.${item.id}.title`)}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{t(`slider.${item.id}.body`)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3">
        <div className="flex flex-wrap gap-2 sm:hidden">
          <Link to={session ? slide.primary : '/login'} state={session ? undefined : { from: slide.primary }} className="ui-button min-h-11">{t(`slider.${slide.id}.primary`)}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          {slide.secondary.startsWith('#') ? <a href={slide.secondary} className="ui-button-secondary min-h-11">{t(`slider.${slide.id}.secondary`)}</a> : <Link to={session ? slide.secondary : '/login'} state={session ? undefined : { from: slide.secondary }} className="ui-button-secondary min-h-11">{t(`slider.${slide.id}.secondary`)}</Link>}
        </div>
        <p className="hidden text-xs font-medium text-ink-soft sm:block">{t(`slider.${slide.id}.title`)}</p>
        <div className="flex items-center justify-center gap-1.5">
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={t(paused ? 'slider.play' : 'slider.pause')} className="slider-control mr-2">{paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}</button>
          <button type="button" onClick={() => goTo(current - 1)} aria-label={t('slider.previous')} className="slider-control"><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
          {SLIDES.map((item, index) => <button key={item.id} type="button" onClick={() => goTo(index)} aria-label={t('slider.goTo', { number: index + 1 })} aria-current={current === index ? 'true' : undefined} className="group flex h-11 w-8 items-center justify-center rounded-lg hover:bg-gray-50"><span className={`h-2 rounded-full transition-all ${current === index ? 'w-6 bg-brand' : 'w-2 bg-gray-300 group-hover:bg-gray-400'}`} /></button>)}
          <button type="button" onClick={() => goTo(current + 1)} aria-label={t('slider.next')} className="slider-control"><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  )
}
