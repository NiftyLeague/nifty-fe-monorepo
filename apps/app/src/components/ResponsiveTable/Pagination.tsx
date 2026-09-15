'use client'

import { cn } from '@nl/ui/utils'

import { PaginationControls } from '@/components/pagination/PaginationControls'

interface PaginationProps {
  count: number
  className?: string
  // Legacy MUI TablePagination compat: callers may specify the wrapper element.
  component?: JSX.ElementType
  onChangePage: (event: JSX.MouseEvent | null, page: number) => void
  page: number
  rowsPerPage: number
  style?: JSX.CSSProperties
}

const Pagination = (props: PaginationProps) => {
  const {
  count,
  className,
  onChangePage,
  page,
  rowsPerPage,
  style,
} = props
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))

  const handleChangePage = (event: JSX.MouseEvent | null, newPage: number) => {
    onChangePage(event, newPage)
  }

  return (
    <footer
      class={cn('flex items-center justify-end gap-2 px-4 py-2', className)}
      style={style}
    >
      <PaginationControls
        hasNext={page + 1 < totalPages}
        hasPrev={page > 0}
        onClickNext={() => handleChangePage(null, page + 1)}
        onClickPrev={() => handleChangePage(null, Math.max(0, page - 1))}
        pageLabel={
          <span class="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
        }
        iconSize={20}
      />
    </footer>
  )
}

export default Pagination
