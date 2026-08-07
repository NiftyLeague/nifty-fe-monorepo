import { Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { Icon } from '@nl/ui/base/icon'
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
  <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
    <TextField
      className={styles.searchTextField}
      label="Search degens by token # or name"
      name="search-degen-by-token-id-name"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={handleChangeSearchTerm}
    />
    <Stack direction="row" sx={{ gap: 1, justifyContent: 'space-between' }}>
      <SortButton handleSort={handleSort}>
        <Button
          id="sort-button"
          aria-controls="sort-menu"
          aria-haspopup="true"
          endIcon={<Icon name="chevron-down" />}
          sx={{
            fontWeight: 400,
            border: 'var(--border-purple)',
            padding: '3px 16px',
            color: 'var(--color-foreground)',
          }}
        />
      </SortButton>
      <ToggleButtonGroup
        className={styles.layoutModeButtonsGroup}
        size="small"
        value={layoutMode}
        exclusive
        aria-label="Layout mode"
        onChange={handleChangeLayoutMode}
      >
        <ToggleButton
          className={styles.layoutModeButton}
          size="small"
          value="gridView"
          aria-label="GridView"
        >
          <Icon name="layout-grid" size="lg" />
        </ToggleButton>
        <ToggleButton
          className={styles.layoutModeButton}
          size="small"
          value="gridOn"
          aria-label="GridOn"
        >
          <Icon name="grid-3x3" size="lg" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  </Stack>
)

export default DegensTopNav
