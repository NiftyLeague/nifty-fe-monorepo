'use client'

import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { cn } from '@nl/ui/utils'

import type { TablePaginationProps } from './types'

interface PaginationProps {
  component?: React.ElementType
  count: number
  onChangePage: (event: React.MouseEvent | null, page: number) => void
  page: number
  rowsPerPage: number
  TablePaginationProps?: TablePaginationProps
}

const Pagination: React.FC<PaginationProps> = ({
  component,
  count,
  onChangePage,
  page,
  rowsPerPage,
  TablePaginationProps,
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))

  const handleChangePage = (event: React.MouseEvent | null, newPage: number) => {
    onChangePage(event, newPage)
  }

  // The legacy `component` prop controlled the wrapping element used by MUI's
  // TablePagination; we render a semantic footer in its place and honor any
  // caller-supplied className/style via the merged TablePaginationProps.
  const Wrapper: React.ElementType = component || 'div'

  return (
    <Wrapper
      className={cn(
        'flex items-center justify-end gap-2 px-4 py-2',
        typeof TablePaginationProps?.className === 'string' ? TablePaginationProps.className : ''
      )}
      style={TablePaginationProps?.style}
    >
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        disabled={page === 0}
        onClick={() => handleChangePage(null, Math.max(0, page - 1))}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer"
        disabled={page + 1 >= totalPages}
        onClick={() => handleChangePage(null, page + 1)}
        aria-label="Next page"
      >
        <Icon name="chevron-right" />
      </Button>
    </Wrapper>
  )
}

export default Pagination
