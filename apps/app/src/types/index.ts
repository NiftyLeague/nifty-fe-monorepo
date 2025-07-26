import type { IconName } from '@nl/ui/base/icon';

// material-ui
import { Theme } from '@nl/theme';
import { ChipProps, TableCellProps } from '@mui/material';

// project imports
import { InitialLoginContextProps } from './auth';
import { SnackbarProps } from './snackbar';
import { MenuProps } from './menu';

export type ArrangementOrder = 'asc' | 'desc' | undefined;

export type DateRange = { start: number | Date; end: number | Date };

export type GetComparator = (o: ArrangementOrder, o1: string) => (a: KeyedObject, b: KeyedObject) => number;

export type Direction = 'up' | 'down' | 'right' | 'left';

export interface TabsProps {
  children?: React.ReactElement | React.ReactNode | string;
  value: string | number;
  index: number;
}

export interface GenericCardProps {
  title?: string;
  primary?: string | number | undefined;
  secondary?: string;
  content?: string;
  image?: string;
  dateTime?: string;
  color?: string;
  size?: string;
}

export interface EnhancedTableHeadProps extends TableCellProps {
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  order: ArrangementOrder;
  orderBy?: string;
  numSelected: number;
  rowCount: number;
  onRequestSort: (e: React.SyntheticEvent, p: string) => void;
}

export interface EnhancedTableToolbarProps {
  numSelected: number;
}

export type HeadCell = {
  id: string;
  numeric: boolean;
  label: string;
  disablePadding?: string | boolean | undefined;
  align?: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type NavItemTypeObject = { items: NavItemType[] };

export type NavItemType = {
  id?: string;
  icon?: IconName;
  target?: boolean;
  external?: string;
  url?: string | undefined;
  type?: string;
  title?: React.ReactNode | string;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  caption?: React.ReactNode | string;
  breadcrumbs?: boolean;
  disabled?: boolean;
  chip?: ChipProps;
  children?: NavItemType[];
};

export type AuthSliderProps = { title: string; description: string };

export interface DefaultRootStateProps {
  acount: InitialLoginContextProps;
  menu: MenuProps;
  snackbar: SnackbarProps;
}
export type GuardProps = { children: React.ReactNode };

export interface StringColorProps {
  id?: string;
  label?: string;
  color?: string;
  primary?: string;
  secondary?: string;
}

export interface FormInputProps {
  bug: KeyedObject;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | undefined;
  label: string;
  name: string;
  required?: boolean;
  InputProps?: { label: string; startAdornment?: React.ReactNode };
}

/** ---- Common Functions types ---- */

export type StringBoolFunc = (s: string) => boolean;
export type StringNumFunc = (s: string) => number;
export type NumbColorFunc = (n: number, theme: Theme) => StringColorProps | undefined;
export type ChangeEventFunc = (e: React.ChangeEvent<HTMLInputElement>) => void;

// amit

export type KeyedObject = { [key: string]: string | number | KeyedObject };

export interface MenuItemBaseProps {
  value: string;
  label: string;
}
