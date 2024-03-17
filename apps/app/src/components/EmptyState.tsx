import { Button, Card, Typography } from '@mui/material';
import { useTheme } from '@nl/theme';

interface EmptyStateProps {
  message?: string;
  buttonText?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  noBorder?: boolean;
}
const EmptyState: React.FC<React.PropsWithChildren<React.PropsWithChildren<EmptyStateProps>>> = ({
  message,
  buttonText,
  onClick,
  noBorder = false,
}) => {
  const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          mx: 'auto',
          mt: 5,
          width: { xs: 'calc(100% - 24px)', sm: 400 },
          bgcolor: 'transparent',
          border: noBorder ? 'none' : `1px solid ${theme.palette.primary.main}`,
          boxShadow: 'none',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography sx={{ mt: 2, color: 'white' }}>{message}</Typography>
        {buttonText && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={onClick}>
            {buttonText}
          </Button>
        )}
      </Card>
    </>
  );
};

export default EmptyState;
