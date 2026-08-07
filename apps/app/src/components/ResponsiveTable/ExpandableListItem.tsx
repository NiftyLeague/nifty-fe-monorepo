'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Icon, type IconProps } from '@nl/ui/base/icon'
import { Checkbox } from '@nl/ui/base/checkbox'
import { cn } from '@nl/ui/utils'

import type {
  AccordionDetailsProps,
  AccordionProps,
  AccordionSummaryProps,
  Row,
  TypographyProps,
} from './types'

interface ExpandableListItemProps {
  AccordionDetailsProps?: AccordionDetailsProps
  AccordionDetailsTypographyProps?: TypographyProps<'div'>
  AccordionMoreIconProps?: IconProps
  AccordionProps?: AccordionProps
  AccordionSummaryProps?: AccordionSummaryProps
  AccordionSummaryTypographyProps?: TypographyProps
  checkboxSelection?: boolean
  details: React.ReactNode
  onSelect: (row: Row) => void
  panelClass?: string
  row: Row
  scrollOptions?: ScrollIntoViewOptions
  scrollToSelected: boolean
  selected: boolean
  SelectedAccordionProps?: AccordionProps
  summary: React.ReactNode | React.ReactNode[]
}

/**
 * Expandable component with header text (summary) and expandable description text (details)
 */
const ExpandableListItem: React.FC<ExpandableListItemProps> = ({
  AccordionDetailsProps,
  AccordionDetailsTypographyProps,
  AccordionMoreIconProps,
  AccordionProps,
  AccordionSummaryProps,
  AccordionSummaryTypographyProps,
  checkboxSelection,
  details,
  onSelect,
  panelClass,
  row,
  scrollOptions,
  scrollToSelected,
  selected,
  SelectedAccordionProps,
  summary,
}) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (selected && scrollToSelected && panelRef.current) {
      panelRef.current.scrollIntoView(scrollOptions || { behavior: 'smooth', block: 'center' })
    }
  }, [selected, scrollToSelected, scrollOptions])

  const handleSelect: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    onSelect(row)
  }

  const rootProps = selected ? { ...AccordionProps, ...SelectedAccordionProps } : AccordionProps
  const {
    className: rootClassName,
    style: rootStyle,
    children: _rootChildren,
    ...rootRest
  } = rootProps ?? {}

  const {
    expandIcon: _expandIcon,
    className: summaryClassName,
    style: summaryStyle,
    children: _summaryChildren,
    ...summaryRest
  } = AccordionSummaryProps ?? {}

  // TypographyProps has no index signature (only MUI-typo keys); keep className/style and drop the rest so no unknown attrs leak to the DOM.
  const { className: summaryTypoClassName, style: summaryTypoStyle } =
    AccordionSummaryTypographyProps ?? {}

  const {
    className: detailsClassName,
    style: detailsStyle,
    children: _detailsChildren,
    ...detailsRest
  } = AccordionDetailsProps ?? {}

  const { className: detailsTypoClassName, style: detailsTypoStyle } =
    AccordionDetailsTypographyProps ?? {}

  return (
    <div ref={panelRef} className={cn(panelClass, rootClassName)} style={rootStyle} {...rootRest}>
      <div
        className={cn(
          'flex cursor-pointer items-center justify-between',
          summaryClassName as string | undefined
        )}
        style={summaryStyle}
        {...summaryRest}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          {checkboxSelection && (
            <Checkbox
              style={{ padding: `0 10px 5px 0` }}
              checked={selected}
              onClick={handleSelect}
            />
          )}
          <span
            className={cn('text-sm font-medium text-foreground', summaryTypoClassName)}
            style={{ width: '100%', display: 'flex', ...summaryTypoStyle }}
          >
            {summary}
          </span>
        </div>
        <Icon
          name="chevron-down"
          size="lg"
          className={cn('transition-transform', expanded && 'rotate-180')}
          {...AccordionMoreIconProps}
        />
      </div>
      <div className={cn('overflow-hidden transition-all', !expanded && 'hidden')} {...detailsRest}>
        <span
          className={cn('text-sm text-muted-foreground', detailsTypoClassName)}
          style={{ opacity: 0.5, width: '100%', ...detailsTypoStyle }}
        >
          {details}
        </span>
      </div>
    </div>
  )
}

export default ExpandableListItem
