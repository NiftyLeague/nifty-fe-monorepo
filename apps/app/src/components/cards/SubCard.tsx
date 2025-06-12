import { ReactNode, forwardRef, Ref } from 'react';

// material-ui
import { useTheme } from '@nl/theme';
import { Card, CardContent, CardHeader, Divider, Typography } from '@mui/material';

interface SubCardProps {
  children: ReactNode | string | null;
  content?: boolean;
  className?: string;
  contentClass?: string;
  darkTitle?: boolean;
  secondary?: ReactNode | string;
  sx?: {};
  contentSX?: {};
  title?: ReactNode | string;
}

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = forwardRef(
  (
    {
      children,
      className,
      content = true,
      contentClass,
      darkTitle,
      secondary,
      sx = {},
      contentSX = {},
      title,
      ...others
    }: SubCardProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const theme = useTheme();

    return (
      <Card
        ref={ref}
        sx={{
          border: 'var(--border-default)',
          ':hover': {
            boxShadow:
              theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)',
          },
          ...sx,
        }}
        {...others}
      >
        {/* card header and action */}
        {!darkTitle && title && (
          <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h5">{title}</Typography>} action={secondary} />
        )}
        {darkTitle && title && (
          <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h4">{title}</Typography>} action={secondary} />
        )}

        {/* content & header divider */}
        {title && <Divider sx={{ opacity: 1, borderColor: 'var(--color-divider-default)' }} />}

        {/* card content */}
        {content && (
          <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass || ''}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    );
  },
);

SubCard.displayName = 'SubCard';

export default SubCard;
