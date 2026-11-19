export function BrandBadge({ className = 'h-10 w-auto', wordmark = false }: { className?: string; wordmark?: boolean }) {
  return (
    <img
      src={wordmark ? '/images/mywaris-logo.webp' : '/images/mywaris-mark.webp'}
      alt={wordmark ? 'MyWaris' : ''}
      width={wordmark ? 1362 : 426}
      height={512}
      className={`shrink-0 object-contain mix-blend-multiply ${className}`}
    />
  )
}
