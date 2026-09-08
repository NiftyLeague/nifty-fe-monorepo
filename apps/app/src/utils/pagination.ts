export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

/** Builds a compact page window without rendering one button per page. */
export const getPageItems = (currentPage: number, maxPage: number, siblings = 1): PageItem[] => {
  if (maxPage <= 7) return Array.from({ length: maxPage }, (_, index) => index + 1)

  const start = Math.max(2, currentPage - siblings)
  const end = Math.min(maxPage - 1, currentPage + siblings)
  const items: PageItem[] = [1]

  if (start > 2) items.push('ellipsis-start')
  for (let page = start; page <= end; page += 1) items.push(page)
  if (end < maxPage - 1) items.push('ellipsis-end')

  items.push(maxPage)
  return items
}
