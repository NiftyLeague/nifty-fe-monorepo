'use client'

import { useCallback, useMemo, useState } from 'react'

export type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

/**
 * Builds a compact pagination window so a large page count doesn't render one
 * button per page (which overflows the layout and bloats the DOM).
 *
 * Returns e.g. [1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 50] for a 50-page
 * dataset on page 5.
 */
export const getPageItems = (currentPage: number, maxPage: number, siblings = 1): PageItem[] => {
  if (maxPage <= 7) return Array.from({ length: maxPage }, (_, i) => i + 1)

  const start = Math.max(2, currentPage - siblings)
  const end = Math.min(maxPage - 1, currentPage + siblings)
  const items: PageItem[] = [1]

  if (start > 2) items.push('ellipsis-start')
  for (let i = start; i <= end; i += 1) items.push(i)
  if (end < maxPage - 1) items.push('ellipsis-end')

  items.push(maxPage)
  return items
}

const usePagination = <T>(data: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1)

  const maxPage = Math.ceil(data.length / itemsPerPage)

  const dataForCurrentPage = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage
    const end = begin + itemsPerPage
    return data.slice(begin, end)
  }, [currentPage, itemsPerPage, data])

  const jump = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, page)
      setCurrentPage(() => (maxPage > 0 ? Math.min(pageNumber, maxPage) : 1))
    },
    [maxPage]
  )

  const pageItems = useMemo(() => getPageItems(currentPage, maxPage), [currentPage, maxPage])

  return { jump, dataForCurrentPage, currentPage, maxPage, pageItems }
}

export default usePagination
