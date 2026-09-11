/** Sidebar entries as Starlight's route data defines them. */
export type StarlightRouteData = App.Locals['starlightRoute']
export type SidebarEntry = StarlightRouteData['sidebar'][number]
export type SidebarLink = Extract<SidebarEntry, { type: 'link' }>

/**
 * The persistent navbar links, also shown as the drawer's "main menu": one
 * entry per core documentation section, pointing at its primary page.
 */
export const NAV_LINKS = [
  { label: 'Overview', href: '/docs/overview/intro' },
  { label: 'Guides', href: '/docs/guides/set-up' },
  { label: 'FAQ', href: '/docs/faq/general' },
] as const

/**
 * The previous Docusaurus site rendered one sidebar per documentation section.
 * Starlight has a single sidebar, so the configured tree holds every section and
 * is filtered here to the section that owns the current page.
 */
export const SECTIONS = ['overview', 'guides', 'faq', 'tutorial', 'archive'] as const
export type Section = (typeof SECTIONS)[number]

/** Derive the owning section from a doc id (`overview/intro` -> `overview`). */
export function sectionForId(id: string): Section | undefined {
  const [head] = id.replace(/^\/+/, '').split('/')
  return SECTIONS.find((section) => section === head)
}

const isLink = (entry: SidebarEntry): entry is SidebarLink => entry.type === 'link'

/** Drop the configured base so section matching works on both docs hosts. */
function withoutBase(href: string): string {
  const path = href.replace(/^[a-z]+:\/\/[^/]+/i, '')
  return path.startsWith('/docs/') ? path.slice('/docs'.length) : path
}

export function isInSection(href: string | undefined, section: Section | undefined): boolean {
  if (!href || !section) return false
  return withoutBase(href).startsWith(`/${section}/`)
}

/** Keep only the entries belonging to `section`, preserving order. */
export function sectionEntries(
  sidebar: SidebarEntry[],
  section: Section | undefined
): SidebarEntry[] {
  const keep = (entry: SidebarEntry): boolean =>
    isLink(entry) ? isInSection(entry.href, section) : entry.entries.some(keep)
  return sidebar.filter(keep)
}

/**
 * Pagination neighbours that fall outside the current section are dropped,
 * which reproduces the previous site's per-section previous/next links.
 */
export function clampPagination<T extends { href: string }>(
  pagination: { prev?: T; next?: T },
  section: Section | undefined
): { prev?: T; next?: T } {
  return {
    prev: isInSection(pagination.prev?.href, section) ? pagination.prev : undefined,
    next: isInSection(pagination.next?.href, section) ? pagination.next : undefined,
  }
}

/**
 * Groups whose entries include the directory's own index page (the old
 * Docusaurus "category index") render that label as a link instead of as a
 * duplicated child entry.
 */
export function splitCategoryIndex(entries: SidebarEntry[]): {
  index?: SidebarLink
  rest: SidebarEntry[]
} {
  const index = entries.find(
    (entry): entry is SidebarLink => isLink(entry) && entry.href.endsWith('/')
  )
  if (!index) return { rest: entries }
  return { index, rest: entries.filter((entry) => entry !== index) }
}
