'use client'

import { Grid3X3, LayoutGrid } from 'lucide-solid'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import DegenSortOptions from '@/constants/sort'
import type { MenuItemBaseProps } from '@/types'

import styles from './index.module.css'

interface DegensTopNavControlsProps {
  handleSort: (sortOptions: string) => void
  sortValue: string
  layoutMode: string
  handleChangeLayoutMode: (_event: MouseEvent & { currentTarget: HTMLElement }, newMode: string) => void
}

export default function DegensTopNavControls(props: DegensTopNavControlsProps) {
  return (
    <div class={styles.controls} data-slot="degen-search-controls">
      <Select<MenuItemBaseProps>
        options={DegenSortOptions}
        optionValue="value"
        optionTextValue="label"
        value={DegenSortOptions.find((option) => option.value === props.sortValue)}
        onValueChange={(option) => option && props.handleSort((option as MenuItemBaseProps).value)}
        itemComponent={(itemProps) => (
          <SelectItem item={itemProps.item}>{itemProps.item.rawValue.label}</SelectItem>
        )}
      >
        <SelectTrigger
          aria-label="Sort degens"
          size="sm"
          class="min-w-[150px] border-purple px-3 py-1 text-foreground"
        >
          <SelectValue<MenuItemBaseProps> />
        </SelectTrigger>
        <SelectContent />
      </Select>
      <ToggleGroup
        class={styles.layoutModeButtonsGroup}
        value={props.layoutMode}
        aria-label="Layout mode"
        onValueChange={(value) =>
          value &&
          props.handleChangeLayoutMode(
            undefined as unknown as MouseEvent & { currentTarget: HTMLElement },
            value as string
          )
        }
      >
        <ToggleGroupItem
          class={`${styles.layoutModeButton} data-[pressed]:bg-[rgba(88,32,214,0.2)]`}
          value="gridView"
          aria-label="GridView"
        >
          <LayoutGrid aria-hidden="true" size={24} stroke-width={1.5} />
        </ToggleGroupItem>
        <ToggleGroupItem
          class={`${styles.layoutModeButton} data-[pressed]:bg-[rgba(88,32,214,0.2)]`}
          value="gridOn"
          aria-label="GridOn"
        >
          <Grid3X3 aria-hidden="true" size={24} stroke-width={1.5} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
