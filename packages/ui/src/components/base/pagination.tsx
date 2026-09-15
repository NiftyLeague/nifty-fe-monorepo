import { splitProps, type ComponentProps } from 'solid-js'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-solid'

import { cn } from '@nl/ui/utils'
import { buttonVariants } from '@nl/ui/base/button'

function Pagination(props: ComponentProps<'nav'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      class={cn('mx-auto flex w-full justify-center', local.class, local.className)}
      {...others}
    />
  )
}

function PaginationContent(props: ComponentProps<'ul'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <ul
      data-slot="pagination-content"
      class={cn('flex flex-row items-center gap-1', local.class, local.className)}
      {...others}
    />
  )
}

function PaginationItem(props: ComponentProps<'li'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return <li data-slot="pagination-item" class={cn(local.class, local.className)} {...others} />
}

type PaginationLinkProps = ComponentProps<'a'> & {
  className?: string
  isActive?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon' | null
}

function PaginationLink(props: PaginationLinkProps) {
  const [local, others] = splitProps(props, ['class', 'className', 'isActive', 'size'])
  return (
    <a
      aria-current={local.isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={local.isActive}
      class={cn(
        buttonVariants({
          variant: local.isActive ? 'outline' : 'ghost',
          size: local.size ?? 'icon',
        }),
        local.class,
        local.className
      )}
      {...others}
    />
  )
}

function PaginationPrevious(props: PaginationLinkProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      class={cn('gap-1 px-2.5 sm:pl-2.5', local.class, local.className)}
      {...others}
    >
      <ChevronLeftIcon />
      <span class="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext(props: PaginationLinkProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      class={cn('gap-1 px-2.5 sm:pr-2.5', local.class, local.className)}
      {...others}
    >
      <span class="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis(props: ComponentProps<'span'> & { className?: string }) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      class={cn('flex size-9 items-center justify-center', local.class, local.className)}
      {...others}
    >
      <MoreHorizontalIcon class="size-4" />
      <span class="sr-only">More pages</span>
    </span>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
