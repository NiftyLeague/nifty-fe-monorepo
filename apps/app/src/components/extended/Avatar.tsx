import { ReactNode } from 'react';

// material-ui
import { useTheme } from '@nl/theme';
import MuiAvatar, { AvatarProps } from '@mui/material/Avatar';
import { OverridableComponent, OverridableTypeMap } from '@mui/material/OverridableComponent';
import type { LinkTarget } from '@/types';

// ==============================|| AVATAR ||============================== //

interface avatarProps extends AvatarProps {
  alt?: string;
  src?: string;
  className?: string;
  color?: string;
  component?: OverridableComponent<OverridableTypeMap>;
  target?: LinkTarget;
  href?: string;
  sx?: AvatarProps['sx'];
  children?: ReactNode;
  outline?: boolean;
  size?: 'badge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = ({ className, color, outline, size, sx, ...others }: avatarProps) => {
  const theme = useTheme();

  const colorSX = color && !outline && { color: `var(--color-${color}-foreground)`, bgcolor: `var(--color-${color})` };
  const outlineSX = outline && {
    color: color ? `${color}.main` : 'var(--color-purple)',
    bgcolor: 'var(--color-muted)',
    border: '2px solid',
    borderColor: color ? `${color}.main` : 'var(--color-purple)',
  };
  let sizeSX = {};
  switch (size) {
    case 'badge':
      sizeSX = { width: theme.spacing(3.5), height: theme.spacing(3.5) };
      break;
    case 'xs':
      sizeSX = { width: theme.spacing(4.25), height: theme.spacing(4.25) };
      break;
    case 'sm':
      sizeSX = { width: theme.spacing(5), height: theme.spacing(5) };
      break;
    case 'lg':
      sizeSX = { width: theme.spacing(9), height: theme.spacing(9) };
      break;
    case 'xl':
      sizeSX = { width: theme.spacing(10.25), height: theme.spacing(10.25) };
      break;
    case 'md':
      sizeSX = { width: theme.spacing(7.5), height: theme.spacing(7.5) };
      break;
    default:
      sizeSX = {};
  }

  return <MuiAvatar sx={{ ...colorSX, ...outlineSX, ...sizeSX, ...sx }} {...others} />;
};

export default Avatar;
