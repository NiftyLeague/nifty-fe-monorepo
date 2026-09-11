/**
 * Renders `mermaid` fenced code blocks client side, replacing the highlighted
 * source with the rendered diagram.
 *
 * The previous site used the Docusaurus Mermaid theme, which rendered only in the
 * browser with the same dark/forest theme selection. Mermaid is imported lazily
 * so pages without diagrams never download it.
 */
const blocks = document.querySelectorAll<HTMLElement>('pre[data-language="mermaid"]')

if (blocks.length > 0) {
  void renderMermaid(blocks)
}

async function renderMermaid(elements: NodeListOf<HTMLElement>): Promise<void> {
  const [{ default: mermaid }, { default: themeVariables }] = await Promise.all([
    import('mermaid'),
    import('../lib/mermaid-theme'),
  ])

  const isDark = document.documentElement.dataset.theme === 'dark'
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: isDark ? 'dark' : 'forest',
    themeVariables,
  })

  for (const [index, pre] of Array.from(elements).entries()) {
    const source = extractSource(pre)
    if (!source.trim()) continue

    // Expressive Code wraps the block in a <figure>; replace the whole wrapper so
    // no stray code frame is left behind.
    const target = pre.closest('figure') ?? pre
    try {
      const { svg } = await mermaid.render(`mermaid-diagram-${index}`, source)
      const container = document.createElement('div')
      container.className = 'mermaid-container'
      container.innerHTML = svg
      target.replaceWith(container)
    } catch (error) {
      console.error(error)
      const warning = document.createElement('div')
      warning.className = 'starlight-aside starlight-aside--caution'
      warning.textContent = 'Failed to render Mermaid diagram.'
      target.replaceWith(warning)
    }
  }
}

/** Rebuild the diagram source from the expressive-code line markup. */
function extractSource(pre: HTMLElement): string {
  const lines = pre.querySelectorAll<HTMLElement>('.ec-line')
  if (lines.length === 0) return pre.textContent ?? ''
  return Array.from(lines)
    .map((line) => line.textContent ?? '')
    .join('\n')
}
