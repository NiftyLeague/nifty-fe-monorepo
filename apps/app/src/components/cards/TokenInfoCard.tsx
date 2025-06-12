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
      <Grid size={{ xs: 12, xl: 6 }}>
        <Box alignItems="center" justifyContent="space-around" p={1.5}>
          <Grid container alignItems="center" justifyContent="center" spacing={1}>
            <Grid size={{ xs: 12, xl: 6 }}>
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={100} sx={{ mx: 'auto' }} />
              ) : (
                <Typography variant="h4" sx={{ color: 'inherit' }} textAlign="center">
                  {title}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, xl: 6 }}>
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={80} sx={{ mx: 'auto' }} />
              ) : (
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: 'var(--color-foreground-2)' }}
                  textAlign="center"
                >
                  {secondary}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, xl: 6 }}>{actions}</Grid>
    </Grid>
  </Box>
);

export default TokenInfoCard;
