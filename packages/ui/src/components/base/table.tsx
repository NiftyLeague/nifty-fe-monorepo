import { splitProps, type ComponentProps, type JSX } from 'solid-js'

import { cn } from '@nl/ui/utils'

type TableProps = ComponentProps<'table'> & { className?: string }
type TableSectionProps<T extends keyof JSX.IntrinsicElements> = ComponentProps<T> & {
  className?: string
}

function Table(props: TableProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div data-slot="table-container" class="relative w-full overflow-auto">
      <table
        data-slot="table"
        class={cn('w-full caption-bottom text-sm', local.class, local.className)}
        {...others}
      />
    </div>
  )
}

function TableHeader(props: TableSectionProps<'thead'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <thead
      data-slot="table-header"
      class={cn('[&_tr]:border-b', local.class, local.className)}
      {...others}
    />
  )
}

function TableBody(props: TableSectionProps<'tbody'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <tbody
      data-slot="table-body"
      class={cn('[&_tr:last-child]:border-0', local.class, local.className)}
      {...others}
    />
  )
}

function TableFooter(props: TableSectionProps<'tfoot'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function TableRow(props: TableSectionProps<'tr'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <tr
      data-slot="table-row"
      class={cn(
        'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function TableHead(props: TableSectionProps<'th'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <th
      data-slot="table-head"
      class={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function TableCell(props: TableSectionProps<'td'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <td
      data-slot="table-cell"
      class={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5',
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function TableCaption(props: TableSectionProps<'caption'>) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <caption
      data-slot="table-caption"
      class={cn('text-muted-foreground mt-4 text-sm', local.class, local.className)}
      {...others}
    />
  )
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
