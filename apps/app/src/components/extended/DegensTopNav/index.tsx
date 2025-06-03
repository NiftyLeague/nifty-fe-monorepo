import { Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled, useTheme } from '@nl/theme';
import { GridOn, GridView, KeyboardArrowDown } from '@mui/icons-material';
import SortButton from '@/components/extended/SortButton';

const SearchTextField = styled(TextField)({
  flex: 1,
  height: 32,
  '& .MuiInputLabel-root': { color: '#424453', top: -4 },
  '& .MuiOutlinedInput-root': {
    height: 32,
    '& input': { paddingTop: '6px', paddingBottom: '6px' },
    '& fieldset': { borderRadius: '5px' },
  },
});

const LayoutModeButtonsGroup = styled(ToggleButtonGroup)({ border: '1px solid #2f2f2f', borderRadius: '5px' });

const LayoutModeButton = styled(ToggleButton)({
  border: 'none',
  borderRadius: '5px',
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
}: DegensTopNavProps) => {
  const theme = useTheme();
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
      <SearchTextField
        label="Search degens by token # or name"
        name="search-degen-by-token-id-name"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleChangeSearchTerm}
        InputLabelProps={{ style: { color: theme.palette.text.secondary } }}
      />
      <Stack direction="row" gap={1} sx={{ justifyContent: 'space-between' }}>
        <SortButton handleSort={handleSort}>
          <Button
            id="sort-button"
            aria-controls="sort-menu"
            aria-haspopup="true"
            endIcon={<KeyboardArrowDown />}
            sx={{
              fontWeight: 400,
              border: `1px solid ${theme.palette.primary.main}`,
              padding: '3px 16px',
              color: theme.palette.text.primary,
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
            <GridView />
          </LayoutModeButton>
          <LayoutModeButton size="small" value="gridOn" aria-label="GridOn">
            <GridOn />
          </LayoutModeButton>
        </LayoutModeButtonsGroup>
      </Stack>
    </Stack>
  );
};

export default DegensTopNav;
