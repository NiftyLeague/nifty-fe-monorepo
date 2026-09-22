import OptimizedImage from '@nl/ui/custom/optimized-image'

export const CONSOLE_ARTWORK_DIMENSIONS = {
  width: 4842,
  height: 3371,
  quality: 65,
  sizes: '100vw',
} as const

interface ConsoleGameBackdropProps {
  fetchpriority?: 'high' | 'low' | 'auto'
  loading?: 'eager' | 'lazy'
}

export function ConsoleGameBackdrop(props: ConsoleGameBackdropProps) {
  return (
    <OptimizedImage
      alt="Game Console Backdrop"
      class="pixelated"
      {...CONSOLE_ARTWORK_DIMENSIONS}
      fetchpriority={props.fetchpriority ?? 'low'}
      src="https://cdn.niftyleague.com/media/img/console-game/classic-gaming-reinvented-notv.webp"
      loading={props.loading ?? 'lazy'}
      decoding="async"
      style={{ width: '100%', height: 'auto', 'object-fit': 'contain' }}
    />
  )
}
