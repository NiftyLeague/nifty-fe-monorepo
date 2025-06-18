import { Button, Card, Typography } from '@mui/material';

interface EmptyStateProps {
  message?: string;
  buttonText?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  noBorder?: boolean;
}
const EmptyState = ({ message, buttonText, onClick, noBorder = false }: EmptyStateProps) => (
  <>
    <Card
      sx={{
        mx: 'auto',
        mt: 5,
        width: { xs: 'calc(100% - 24px)', sm: 400 },
        bgcolor: 'transparent',
        border: noBorder ? 'none' : 'var(--border-purple)',
        boxShadow: 'none',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography sx={{ mt: 2, color: 'var(--color-foreground)' }}>{message}</Typography>
      {buttonText && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </Card>
  </>
);

export default EmptyState;
