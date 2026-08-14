'use client'

import { cn } from '@nl/ui/utils'

import { PaginationControls } from '@/components/pagination/PaginationControls'

interface PaginationProps {
  count: number
  className?: string
  onChangePage: (event: React.MouseEvent | null, page: number) => void
  page: number
  rowsPerPage: number
  style?: React.CSSProperties
}

const Pagination: React.FC<PaginationProps> = ({
  count,
  className,
  onChangePage,
  page,
  rowsPerPage,
  style,
}) => {
  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage))

  const handleChangePage = (event: React.MouseEvent | null, newPage: number) => {
    onChangePage(event, newPage)
  }

  return (
    <footer
      className={cn('flex items-center justify-end gap-2 px-4 py-2', className)}
      style={style}
    >
      <PaginationControls
        hasNext={page + 1 < totalPages}
        hasPrev={page > 0}
        onClickNext={() => handleChangePage(null, page + 1)}
        onClickPrev={() => handleChangePage(null, Math.max(0, page - 1))}
        pageLabel={
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
        }
        iconSize={20}
      />
    </footer>
  )
}

export default Pagination
