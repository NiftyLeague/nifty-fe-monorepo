interface NavbarScrollStateProps {
  targetId: string
}

export const NAVBAR_SCROLL_STATE_SCRIPT = `(() => {
  const script = document.currentScript
  const targetId = script?.getAttribute('data-target')
  const header = targetId ? document.getElementById(targetId) : null
  if (!header) return

  const supportsCssScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: scroll()') === true
  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Modern browsers run the visual transition on the compositor through the
  // CSS scroll timeline. Keep the compatibility listener for older browsers
  // and reduced-motion users, where the CSS animation is intentionally off.
  if (supportsCssScrollTimeline && !prefersReducedMotion) return

  let frameId = null
  let isScrolled = header.dataset.scrolled === 'true'
  const updateScrollState = () => {
    frameId = null
    const nextIsScrolled = window.scrollY > 80
    if (nextIsScrolled === isScrolled) return

    isScrolled = nextIsScrolled
    header.dataset.scrolled = String(nextIsScrolled)
  }

  const handleScroll = () => {
    if ((window.scrollY > 80) === isScrolled || frameId !== null) return
    frameId = window.requestAnimationFrame(updateScrollState)
  }

  updateScrollState()
  window.addEventListener('scroll', handleScroll, { passive: true })
})()`

export default function NavbarScrollState({ targetId }: NavbarScrollStateProps) {
  return (
    <script
      data-target={targetId}
      dangerouslySetInnerHTML={{ __html: NAVBAR_SCROLL_STATE_SCRIPT }}
    />
  )
}
