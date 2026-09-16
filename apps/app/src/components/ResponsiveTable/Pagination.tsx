import type { JSX } from 'solid-js'
import { cn } from '@nl/ui/utils'

import { PaginationControls } from '@/components/pagination/PaginationControls'

interface PaginationProps {
  count: number
  className?: string
  onChangePage: (event: MouseEvent | null, page: number) => void
  page: number
  rowsPerPage: number
  style?: JSX.CSSProperties
}

const Pagination = (props: PaginationProps) => {
  const totalPages = () => Math.max(1, Math.ceil(props.count / props.rowsPerPage))

  const handleChangePage = (event: MouseEvent | null, newPage: number) => {
    props.onChangePage(event, newPage)
  }

  return (
    <footer
      class={cn('flex items-center justify-end gap-2 px-4 py-2', props.className)}
      style={props.style}
    >
      <PaginationControls
        hasNext={props.page + 1 < totalPages()}
        hasPrev={props.page > 0}
        onClickNext={() => handleChangePage(null, props.page + 1)}
        onClickPrev={() => handleChangePage(null, Math.max(0, props.page - 1))}
        pageLabel={
          <span class="text-sm text-muted-foreground">
            Page {props.page + 1} of {totalPages()}
          </span>
        }
        iconSize={20}
      />
    </footer>
  )
}

export default Pagination
