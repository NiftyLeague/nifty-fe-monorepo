import { Button, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridOn, GridView, KeyboardArrowDown } from '@mui/icons-material';
import SortButton from '@/components/extended/SortButton';

const PREFIX = 'DegensTopNav';

const classes = {
  searchTextField: `${PREFIX}-searchTextField`,
  layoutModeButton: `${PREFIX}-layoutModeButton`,
  layoutModeButtonsGroup: `${PREFIX}-layoutModeButtonsGroup`,
};

const StyledStack = styled(Stack)(() => ({
  [`& .${classes.searchTextField}`]: {
    flex: 1,
    height: 32,
    '& .MuiInputLabel-root': {
      color: '#424453',
      top: -4,
    },
    '& .MuiOutlinedInput-root': {
      height: 32,
      '& input': {
        paddingTop: '6px',
        paddingBottom: '6px',
      },
      '& fieldset': {
        borderRadius: '5px',
      },
    },
  },

  [`& .${classes.layoutModeButton}`]: {
    border: 'none',
    borderRadius: '5px',
    padding: '5px 16px',
    '&.Mui-selected': {
      background: 'rgba(88, 32, 214, 0.2)',
      '&:hover': {
        background: 'rgba(88, 32, 214, 0.2)',
      },
    },
    '& svg': {
      width: 20,
      height: 20,
    },
  },

  [`& .${classes.layoutModeButtonsGroup}`]: {
    border: '1px solid #2f2f2f',
    borderRadius: '5px',
  },
}));

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
  return (
    <StyledStack direction={{ xs: 'column', sm: 'row' }} gap={1}>
      <TextField
        label="Search degens by token # or name"
        name="search-degen-by-token-id-name"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleChangeSearchTerm}
        className={classes.searchTextField}
        InputLabelProps={{
          style: { color: '#e0e0e0' },
        }}
      />
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <SortButton handleSort={handleSort}>
          <Button
            id="sort-button"
            aria-controls="sort-menu"
            aria-haspopup="true"
            endIcon={<KeyboardArrowDown />}
            sx={{
              fontWeight: 400,
              border: '1px solid #620EDF',
              padding: '3px 16px',
              color: '#f5f5f5',
            }}
          />
        </SortButton>
        <ToggleButtonGroup
          size="small"
          value={layoutMode}
          exclusive
          aria-label="Layout mode"
          onChange={handleChangeLayoutMode}
          className={classes.layoutModeButtonsGroup}
        >
          <ToggleButton size="small" value="gridView" aria-label="GridView" className={classes.layoutModeButton}>
            <GridView />
          </ToggleButton>
          <ToggleButton size="small" value="gridOn" aria-label="GridOn" className={classes.layoutModeButton}>
            <GridOn />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </StyledStack>
  );
};

export default DegensTopNav;
