// material-ui
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import type { GenericCardProps } from '@/types';
// project imports
import MainCard from './MainCard';

// ============================|| HOVER DATA CARD ||============================ //

interface HoverDataCardProps extends Omit<GenericCardProps, 'title'> {
  customStyle?: React.CSSProperties;
  actions?: React.ReactNode;
  isLoading?: boolean;
  title?: string | React.ReactNode;
}

const HoverDataCard = ({ title, primary, secondary, customStyle, actions, isLoading }: HoverDataCardProps) => (
  <MainCard sx={customStyle ?? {}}>
    <Grid container justifyContent="space-between" direction="column" alignItems="center">
      <Grid item sm={12}>
        {isLoading ? (
          <Skeleton variant="text" animation="wave" width={80} />
        ) : (
          <Typography variant="h5" color="inherit" textAlign="center">
            {title}
          </Typography>
        )}
      </Grid>
      <Grid item sm={12}>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1.75, mb: 0.5, mx: 'auto' }}>
          {isLoading ? (
            <Skeleton variant="text" animation="wave" width={80} />
          ) : (
            <Typography variant="h3">{primary}</Typography>
          )}
        </Stack>
      </Grid>
      {secondary && (
        <Grid item sm={12} sx={{ mb: 1.75 }}>
          {isLoading ? (
            <Skeleton variant="text" animation="wave" width={120} />
          ) : (
            <Typography variant="body2" color="textSecondary">
              {secondary}
            </Typography>
          )}
        </Grid>
      )}
      {actions}
    </Grid>
  </MainCard>
);

export default HoverDataCard;
