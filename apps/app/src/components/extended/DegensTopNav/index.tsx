import { Button } from '@nl/ui/base/button'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import { Icon } from '@nl/ui/base/icon'
import { Input } from '@nl/ui/custom/input'
import SortButton from '@/components/extended/SortButton'

import styles from './index.module.css'

interface DegensTopNavProps {
  searchTerm: string
  handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  handleSort: (sortOptions: string) => void
  layoutMode: string
  handleChangeLayoutMode: (_: React.MouseEvent<HTMLElement>, newMode: string) => void
}

const DegensTopNav = ({
  searchTerm,
  handleChangeSearchTerm,
  handleSort,
  layoutMode,
  handleChangeLayoutMode,
}: DegensTopNavProps) => (
  <div className="flex flex-col gap-2 sm:flex-row">
    <Input
      className={`${styles.searchTextField} h-8 flex-1 border-0 bg-muted`}
      label="Search degens by token # or name"
      name="search-degen-by-token-id-name"
      value={searchTerm}
      onChange={handleChangeSearchTerm}
    />
    <div className="flex flex-row items-center justify-between gap-2">
      <SortButton handleSort={handleSort}>
        <Button
          id="sort-button"
          aria-controls="sort-menu"
          aria-haspopup="true"
          style={{
            fontWeight: 400,
            border: 'var(--border-purple)',
            padding: '3px 16px',
            color: 'var(--color-foreground)',
          }}
        >
          <Icon name="chevron-down" />
        </Button>
      </SortButton>
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
          <Icon name="layout-grid" size="lg" />
        </ToggleGroupItem>
        <ToggleGroupItem
          className={`${styles.layoutModeButton} data-[state=on]:bg-[rgba(88,32,214,0.2)]`}
          value="gridOn"
          aria-label="GridOn"
        >
          <Icon name="grid-3x3" size="lg" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  </div>
)

export default DegensTopNav
