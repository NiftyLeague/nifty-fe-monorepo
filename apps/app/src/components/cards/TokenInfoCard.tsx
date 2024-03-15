// material-ui
import { Box, Grid, Skeleton, Typography } from '@mui/material';
import type { GenericCardProps } from '@/types';

interface TokenInfoCardProps extends GenericCardProps {
  customStyle?: React.CSSProperties;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

const TokenInfoCard = ({ title, secondary, customStyle, actions, isLoading }: TokenInfoCardProps) => (
  <Box sx={customStyle}>
    <Grid container alignItems="center" justifyContent="center">
      <Grid item xl={6} xs={12}>
        <Box alignItems="center" justifyContent="space-around" p={1.5}>
          <Grid container alignItems="center" justifyContent="center" spacing={1}>
            <Grid item xl={6} xs={12}>
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={100} sx={{ mx: 'auto' }} />
              ) : (
                <Typography variant="h5" color="inherit" textAlign="center">
                  {title}
                </Typography>
              )}
            </Grid>
            <Grid item xl={6} xs={12}>
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={80} sx={{ mx: 'auto' }} />
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  {secondary}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xl={6} xs={12}>
        {actions}
      </Grid>
    </Grid>
  </Box>
);

export default TokenInfoCard;
