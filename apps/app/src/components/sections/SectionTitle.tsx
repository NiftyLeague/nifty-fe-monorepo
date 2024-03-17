import { Stack, Typography } from '@mui/material';

export interface SectionTitleProps {
  actions?: React.ReactNode;
  firstSection?: boolean;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const SectionTitle: React.FC<React.PropsWithChildren<React.PropsWithChildren<SectionTitleProps>>> = ({
  children,
  firstSection,
  actions,
  variant = 'h2',
}) => (
  <Stack
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    mb={2}
    mt={firstSection ? 0 : 4}
    gap={2}
    flexWrap="wrap"
  >
    {typeof children === 'string' ? <Typography variant={variant}>{children}</Typography> : children}
    {actions}
  </Stack>
);

export default SectionTitle;
