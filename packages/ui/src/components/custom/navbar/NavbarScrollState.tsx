interface NavbarScrollStateProps {
  targetId: string
}

export const NAVBAR_SCROLL_STATE_SCRIPT = `(() => {
  const script = document.currentScript
  const targetId = script?.getAttribute('data-target')
  const header = targetId ? document.getElementById(targetId) : null
  if (!header) return

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

  const details = [...header.querySelectorAll('details')]
  const closeDetails = (except) => {
    details.forEach((detail) => {
      if (detail !== except) detail.open = false
    })
  }

  details.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      if (detail.open) closeDetails(detail)
    })
    detail.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        detail.open = false
      })
    })
  })

  document.addEventListener('click', (event) => {
    const target = event.target
    details.forEach((detail) => {
      if (detail.open && !detail.contains(target)) detail.open = false
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDetails()
  })
})()`

export default function NavbarScrollState({ targetId }: NavbarScrollStateProps) {
  return (
    <script
      data-target={targetId}
      dangerouslySetInnerHTML={{ __html: NAVBAR_SCROLL_STATE_SCRIPT }}
    />
  )
}
