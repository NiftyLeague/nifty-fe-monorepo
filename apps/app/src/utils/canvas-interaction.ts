export function setCanvasInteraction(className: string, enabled: boolean): boolean {
  const canvas = document.getElementsByClassName(className)[0] as HTMLElement | undefined
  if (!canvas) return false

  canvas.style.pointerEvents = enabled ? 'auto' : 'none'
  if (enabled) canvas.style.cursor = 'pointer'
  return true
}
