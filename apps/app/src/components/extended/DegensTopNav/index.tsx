import { Grid3X3, LayoutGrid } from 'lucide-react'

import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import DegenSortOptions from '@/constants/sort'

import styles from './index.module.css'

interface DegensTopNavProps {
  searchTerm: string
  handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  handleSort: (sortOptions: string) => void
  sortValue: string
  layoutMode: string
  handleChangeLayoutMode: (_: React.MouseEvent<HTMLElement>, newMode: string) => void
}

const DegensTopNav = ({
  searchTerm,
  handleChangeSearchTerm,
  handleSort,
  sortValue,
  layoutMode,
  handleChangeLayoutMode,
}: DegensTopNavProps) => (
  <div className="flex flex-col gap-2 sm:flex-row">
    <div className="grid flex-1 gap-2">
      <Label htmlFor="search-degen-by-token-id-name">Search degens by token # or name</Label>
      <Input
        id="search-degen-by-token-id-name"
        className={`${styles.searchTextField} h-8 border-0 bg-muted`}
        name="search-degen-by-token-id-name"
        value={searchTerm}
        onChange={handleChangeSearchTerm}
      />
    </div>
    <div className="flex flex-row items-center justify-between gap-2">
      <Select value={sortValue} onValueChange={handleSort}>
        <SelectTrigger
          aria-label="Sort degens"
          className="h-8 min-w-[150px] border-purple px-3 py-1 text-foreground"
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
  </div>
)

export default DegensTopNav
