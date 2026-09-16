import type { ComponentProps, ValidComponent } from 'solid-js'
import { splitProps } from 'solid-js'
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-solid'
import * as PaginationPrimitive from '@kobalte/core/pagination'

import { cn } from '@nl/ui/utils'
import { buttonVariants } from '@nl/ui/base/button-variants'

type PaginationProps<T extends ValidComponent = 'nav'> = ComponentProps<
  typeof PaginationPrimitive.Root<T>
> & {
  className?: string
}

function Pagination<T extends ValidComponent = 'nav'>(props: PaginationProps<T>) {
  const [local, others] = splitProps(props as PaginationProps, ['class', 'className'])
  return (
    <PaginationPrimitive.Root
      data-slot="pagination"
      class={cn('mx-auto flex w-full items-center justify-center', local.class, local.className)}
      {...(others as ComponentProps<typeof PaginationPrimitive.Root>)}
    />
  )
}

type PaginationContentProps = ComponentProps<'ul'> & {
  className?: string
}

function PaginationContent(props: PaginationContentProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <ul
      data-slot="pagination-content"
      class={cn('flex flex-row items-center gap-1', local.class, local.className)}
      {...others}
    />
  )
}

/*
 * The current page mirrors the `outline` Button variant through `data-current`
 * selectors so the item stays a single static class string (Kobalte owns the
 * attribute, we own the styling).
 */
const pageItemClass = cn(
  buttonVariants({ variant: 'ghost', size: 'icon' }),
  'cursor-pointer data-current:border data-current:bg-background data-current:shadow-xs dark:data-current:border-input dark:data-current:bg-input/30 hover:bg-accent hover:text-accent-foreground dark:hover:bg-input/50'
)

type PaginationItemProps = ComponentProps<typeof PaginationPrimitive.Item> & {
  className?: string
}

function PaginationItem(props: PaginationItemProps) {
  const [local, others] = splitProps(props as PaginationItemProps, ['class', 'className'])
  return (
    <PaginationPrimitive.Item
      data-slot="pagination-item"
      class={cn(pageItemClass, local.class, local.className)}
      {...(others as ComponentProps<typeof PaginationPrimitive.Item>)}
    />
  )
}

function PaginationPrevious(props: ComponentProps<typeof PaginationPrimitive.Previous>) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  return (
    <PaginationPrimitive.Previous
      data-slot="pagination-previous"
      class={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'gap-1 px-2.5 sm:pl-2.5 cursor-pointer',
        local.class,
        local.className
      )}
      {...(others as ComponentProps<typeof PaginationPrimitive.Previous>)}
    >
      <ChevronLeftIcon />
      {local.children ?? <span class="hidden sm:block">Previous</span>}
    </PaginationPrimitive.Previous>
  )
}

function PaginationNext(props: ComponentProps<typeof PaginationPrimitive.Next>) {
  const [local, others] = splitProps(props, ['class', 'className', 'children'])
  return (
    <PaginationPrimitive.Next
      data-slot="pagination-next"
      class={cn(
        buttonVariants({ variant: 'ghost', size: 'default' }),
        'gap-1 px-2.5 sm:pr-2.5 cursor-pointer',
        local.class,
        local.className
      )}
      {...(others as ComponentProps<typeof PaginationPrimitive.Next>)}
    >
      {local.children ?? <span class="hidden sm:block">Next</span>}
      <ChevronRightIcon />
    </PaginationPrimitive.Next>
  )
}

type PaginationEllipsisProps = ComponentProps<typeof PaginationPrimitive.Ellipsis> & {
  className?: string
}

function PaginationEllipsis(props: PaginationEllipsisProps) {
  const [local, others] = splitProps(props as PaginationEllipsisProps, [
    'class',
    'className',
    'children',
  ])
  return (
    <PaginationPrimitive.Ellipsis
      data-slot="pagination-ellipsis"
      class={cn('flex size-9 items-center justify-center', local.class, local.className)}
      {...(others as ComponentProps<typeof PaginationPrimitive.Ellipsis>)}
    >
      {local.children ?? (
        <>
          <MoreHorizontalIcon class="size-4" />
          <span class="sr-only">More pages</span>
        </>
      )}
    </PaginationPrimitive.Ellipsis>
  )
}

type PaginationItemsProps = {
  className?: string
}

function PaginationItems(props: PaginationItemsProps) {
  const [local] = splitProps(props, ['className'])
  return (
    <PaginationContent class={local.className}>
      <PaginationPrimitive.Items />
    </PaginationContent>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationItems,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
