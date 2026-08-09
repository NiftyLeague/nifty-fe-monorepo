'use client'

import { Children, cloneElement, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement } from 'react'
import type { MenuItemBaseProps } from '@/types'
import callAll, { type FunctionType } from '@/utils/callAll'
import DegenSortOptions from '@/constants/sort'

const sortOptions: MenuItemBaseProps[] = DegenSortOptions
interface Props {
  children: ReactElement
  defaultSelectedItemValue?: string | null
  label?: string
  handleSort: (sortOptions: string) => void
}

const SortButton = ({
  children,
  defaultSelectedItemValue = null,
  label = 'Sort options',
  handleSort,
}: Props): React.ReactNode => {
  if (!Children.only(children)) console.error('SortButton only accepts one child')

  const [selectedSort, setSelectedSort] = useState(
    defaultSelectedItemValue || sortOptions[0]?.value
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [buttonNode, setButtonNode] = useState<HTMLElement | null>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const buttonRef = useCallback((node: HTMLElement | null) => {
    setButtonNode(node)
  }, [])
  const isSortOpen = Boolean(anchorEl)
  const sortLabel = sortOptions.filter((items) => items.value === selectedSort)
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (buttonNode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setButtonWidth(buttonNode.clientWidth)
    }
  }, [buttonNode, isSortOpen])

  const handleOpenSortMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseSortMenu = useCallback(() => {
    setAnchorEl(null)
  }, [])

  useEffect(() => {
    if (!isSortOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuContainerRef.current?.contains(event.target as Node)) handleCloseSortMenu()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleCloseSortMenu()
        buttonNode?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [buttonNode, handleCloseSortMenu, isSortOpen])

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, value: string) => {
    setSelectedSort(value)
    handleSort(value)
    handleCloseSortMenu()
  }

  if (!children || typeof children !== 'object' || !('props' in children)) {
    throw new Error('SortButton expects a valid ReactElement as children')
  }
  const child = children as ReactElement<any, any>
  const childOnClick = typeof child.props.onClick === 'function' ? child.props.onClick : undefined
  // TypeScript limitation: ref typing for generic child
  const Button = cloneElement<unknown>(
    child,
    {
      ...(child.props || {}),
      ref: buttonRef,
      'aria-controls': isSortOpen ? menuId : undefined,
      'aria-expanded': isSortOpen,
      'aria-haspopup': 'menu',
      onClick: callAll(handleOpenSortMenu as FunctionType, childOnClick as FunctionType),
    },
    <>
      {sortLabel.length > 0 && sortLabel[0]?.label}
      {child.props.children}
    </>
  )

  return (
    <div ref={menuContainerRef} className="relative flex items-center justify-center">
      {Button}
      {isSortOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute top-full right-0 z-50 rounded-b-md border border-border bg-background shadow-md"
          style={{ width: buttonWidth }}
        >
          {sortOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              role="menuitemradio"
              aria-checked={option.value === selectedSort}
              onClick={(event) => handleMenuItemClick(event, option.value)}
              className={`w-full px-3 py-1.5 text-left text-sm text-foreground hover:bg-accent ${
                option.value === selectedSort ? 'font-medium text-blue' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortButton
