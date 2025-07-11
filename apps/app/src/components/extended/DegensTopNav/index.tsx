import { Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@nl/theme';
import Icon from '@nl/ui/base/Icon';
import SortButton from '@/components/extended/SortButton';

const SearchTextField = styled(TextField)({
  flex: 1,
  height: 32,
  '& .MuiInputLabel-root': { color: 'var(--color-foreground-2)', top: -12 },
  '& .MuiOutlinedInput-root': {
    height: 32,
    '& input': { backgroundColor: 'var(--color-background-3)', paddingTop: '6px', paddingBottom: '6px' },
    '& fieldset': { border: 'none' },
  },
});

const LayoutModeButtonsGroup = styled(ToggleButtonGroup)({
  border: 'var(--border-default)',
  borderRadius: 'var(--border-radius-default)',
});

const LayoutModeButton = styled(ToggleButton)({
  border: 'none',
  borderRadius: 'var(--border-radius-default)',
  padding: '5px 16px',
  '&.Mui-selected': { background: 'rgba(88, 32, 214, 0.2)', '&:hover': { background: 'rgba(88, 32, 214, 0.2)' } },
  '& svg': { width: 20, height: 20 },
});

interface DegensTopNavProps {
  searchTerm: string;
  handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  handleSort: (sortOptions: string) => void;
  layoutMode: string;
  handleChangeLayoutMode: (_: React.MouseEvent<HTMLElement>, newMode: string) => void;
}

const DegensTopNav = ({
  searchTerm,
  handleChangeSearchTerm,
  handleSort,
  layoutMode,
  handleChangeLayoutMode,
}: DegensTopNavProps) => (
  <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
    <SearchTextField
      label="Search degens by token # or name"
      name="search-degen-by-token-id-name"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={handleChangeSearchTerm}
    />
    <Stack direction="row" gap={1} sx={{ justifyContent: 'space-between' }}>
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
      <LayoutModeButtonsGroup
        size="small"
        value={layoutMode}
        exclusive
        aria-label="Layout mode"
        onChange={handleChangeLayoutMode}
      >
        <LayoutModeButton size="small" value="gridView" aria-label="GridView">
          <Icon name="layout-grid" size="lg" />
        </LayoutModeButton>
        <LayoutModeButton size="small" value="gridOn" aria-label="GridOn">
          <Icon name="grid-3x3" size="lg" />
        </LayoutModeButton>
      </LayoutModeButtonsGroup>
    </Stack>
  </Stack>
);

export default DegensTopNav;
