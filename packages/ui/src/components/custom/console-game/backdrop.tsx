import OptimizedImage from '@nl/ui/custom/optimized-image'

export const CONSOLE_ARTWORK_DIMENSIONS = {
  width: 4842,
  height: 3371,
  quality: 65,
  sizes: '100vw',
} as const

interface ConsoleGameBackdropProps {
  fetchPriority?: 'high' | 'low' | 'auto'
  loading?: 'eager' | 'lazy'
}

export function ConsoleGameBackdrop({
  fetchPriority = 'low',
  loading = 'lazy',
}: ConsoleGameBackdropProps) {
  return (
    <OptimizedImage
      alt="Game Console Backdrop"
      className="pixelated"
      {...CONSOLE_ARTWORK_DIMENSIONS}
      fetchPriority={fetchPriority}
      src="/img/console-game/classic-gaming-reinvented-notv.webp"
      loading={loading}
      decoding="async"
      style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
    />
  )
}
