'use client'

import { Grid3X3, LayoutGrid } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import DegenSortOptions from '@/constants/sort'

import styles from './index.module.css'

interface DegensTopNavControlsProps {
  handleSort: (sortOptions: string) => void
  sortValue: string
  layoutMode: string
  handleChangeLayoutMode: (_event: React.MouseEvent<HTMLElement>, newMode: string) => void
}

export default function DegensTopNavControls({
  handleChangeLayoutMode,
  handleSort,
  layoutMode,
  sortValue,
}: DegensTopNavControlsProps) {
  return (
    <div className="flex h-8 shrink-0 flex-row items-center justify-between gap-2">
      <Select value={sortValue} onValueChange={handleSort}>
        <SelectTrigger
          aria-label="Sort degens"
          size="sm"
          className="min-w-[150px] border-purple px-3 py-1 text-foreground"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {DegenSortOptions.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ToggleGroup
        type="single"
        size="sm"
        className={styles.layoutModeButtonsGroup}
        value={layoutMode}
        aria-label="Layout mode"
        onValueChange={(value) =>
          value &&
          handleChangeLayoutMode(undefined as unknown as React.MouseEvent<HTMLElement>, value)
        }
      >
        <ToggleGroupItem
          className={`${styles.layoutModeButton} data-[state=on]:bg-[rgba(88,32,214,0.2)]`}
          value="gridView"
          aria-label="GridView"
        >
          <LayoutGrid absoluteStrokeWidth aria-hidden="true" size={24} strokeWidth={1.5} />
        </ToggleGroupItem>
        <ToggleGroupItem
          className={`${styles.layoutModeButton} data-[state=on]:bg-[rgba(88,32,214,0.2)]`}
          value="gridOn"
          aria-label="GridOn"
        >
          <Grid3X3 absoluteStrokeWidth aria-hidden="true" size={24} strokeWidth={1.5} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
