// material-ui
import { Grid2, Skeleton, Stack, Typography } from '@mui/material';
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
    <Grid2 container direction="column" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Grid2 size={{ xs: 12 }}>
        {isLoading ? (
          <Skeleton variant="text" animation="wave" width={80} />
        ) : (
          <Typography variant="h4" sx={{ color: 'inherit' }} textAlign="center">
            {title}
          </Typography>
        )}
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Stack direction="row" spacing={0.5} sx={{ mt: 1.75, mb: 0.5, justifyContent: 'center' }}>
          {isLoading ? (
            <Skeleton variant="text" animation="wave" width={80} />
          ) : (
            <Typography variant="body1" fontWeight="bold">
              {primary}
            </Typography>
          )}
        </Stack>
      </Grid2>
      {secondary && (
        <Grid2 size={{ xs: 12 }} sx={{ mb: 1.75 }}>
          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
            {isLoading ? (
              <Skeleton variant="text" animation="wave" width={120} />
            ) : (
              <Typography variant="body2" sx={{ color: theme => theme.palette.text.secondary }}>
                {secondary}
              </Typography>
            )}
          </Stack>
        </Grid2>
      )}
      {actions}
    </Grid2>
  </MainCard>
);

export default HoverDataCard;
