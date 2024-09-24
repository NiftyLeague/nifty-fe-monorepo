// material-ui
import { Box, Grid2, Skeleton, Typography } from '@mui/material';
import type { GenericCardProps } from '@/types';

interface TokenInfoCardProps extends GenericCardProps {
  customStyle?: React.CSSProperties;
  actions?: React.ReactNode;
  isLoading?: boolean;
}

const TokenInfoCard = ({ title, secondary, customStyle, actions, isLoading }: TokenInfoCardProps) => (
  <Box sx={customStyle}>
    <Grid2 container alignItems="center" justifyContent="center">
      <Grid2 size={{ xs: 12, xl: 6 }}>
        <Box alignItems="center" justifyContent="space-around" p={1.5}>
          <Grid2 container alignItems="center" justifyContent="center" spacing={1}>
            <Grid2 size={{ xs: 12, xl: 6 }}>
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={100} sx={{ mx: 'auto' }} />
              ) : (
                <Typography variant="h4" sx={{ color: 'inherit' }} textAlign="center">
                  {title}
                </Typography>
              )}
            </Grid2>
            <Grid2 size={{ xs: 12, xl: 6 }}>
              {isLoading ? (
                <Skeleton variant="text" animation="wave" width={80} sx={{ mx: 'auto' }} />
              ) : (
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ color: theme => theme.palette.text.secondary }}
                  textAlign="center"
                >
                  {secondary}
                </Typography>
              )}
            </Grid2>
          </Grid2>
        </Box>
      </Grid2>
      <Grid2 size={{ xs: 12, xl: 6 }}>{actions}</Grid2>
    </Grid2>
  </Box>
);

export default TokenInfoCard;
