'use client';

import { Menu, MenuItem, Stack } from '@mui/material';
import { Children, cloneElement, ReactElement, useRef, useState } from 'react';
import type { MenuItemBaseProps } from '@/types';
import callAll, { type FunctionType } from '@/utils/callAll';
import DegenSortOptions from '@/constants/sort';

const sortOptions: MenuItemBaseProps[] = DegenSortOptions;
interface Props {
  children: ReactElement;
  defaultSelectedItemValue?: string | null;
  label?: string;
  handleSort: (sortOptions: string) => void;
}

const SortButton = ({
  children,
  defaultSelectedItemValue = null,
  // label = 'Sort by: ',
  handleSort,
}: Props): React.ReactNode => {
  if (!Children.only(children)) console.error('SortButton only accepts one child');

  const [selectedSort, setSelectedSort] = useState(defaultSelectedItemValue || sortOptions[0]?.value);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef(null);
  const isSortOpen = Boolean(anchorEl);
  const sortLabel = sortOptions.filter(items => items.value === selectedSort);

  const handleOpenSortMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSortMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, value: string) => {
    setSelectedSort(value);
    handleSort(value);
    handleCloseSortMenu();
  };

  const Button = cloneElement(
    children as React.ReactElement<any>,
    {
      ...(children?.props || {}),
      ref: buttonRef,
      onClick: callAll(handleOpenSortMenu as FunctionType, (children.props as any)?.onClick),
    },
    sortLabel.length > 0 && sortLabel[0]?.label,
  );

  return (
    <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
      {Button}
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={isSortOpen}
        onClose={handleCloseSortMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPaper-root': {
            background: '#1E2023',
            borderRadius: '0px 0px 5px 5px',
          },
          '& .MuiMenuItem-root': {
            width: (buttonRef?.current as unknown as { clientWidth: number })?.clientWidth,
            color: '#f5f5f5',
          },
        }}
      >
        {sortOptions.map(option => (
          <MenuItem
            sx={{ p: 1.5 }}
            key={option.value}
            selected={option.value === selectedSort}
            onClick={event => handleMenuItemClick(event, option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default SortButton;
