// material-ui
import { Grid, Skeleton, Stack, Typography } from '@mui/material'
import type { GenericCardProps } from '@/types'
// project imports
import MainCard from './MainCard'

// ============================|| HOVER DATA CARD ||============================ //

interface HoverDataCardProps extends Omit<GenericCardProps, 'title'> {
  customStyle?: React.CSSProperties
  actions?: React.ReactNode
  isLoading?: boolean
  title?: string | React.ReactNode
}

const HoverDataCard = ({
  title,
  primary,
  secondary,
  customStyle,
  actions,
  isLoading,
}: HoverDataCardProps) => (
  <MainCard sx={customStyle ?? {}}>
    <Grid
      container
      sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Grid size={{ xs: 12 }}>
        {isLoading ? (
          <Skeleton variant="text" animation="wave" width={80} />
        ) : (
          <Typography variant="h4" sx={{ textAlign: 'center', color: 'inherit' }}>
            {title}
          </Typography>
        )}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Stack direction="row" spacing={0.5} sx={{ mt: 1.75, mb: 0.5, justifyContent: 'center' }}>
          {isLoading ? (
            <Skeleton variant="text" animation="wave" width={80} />
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {primary}
            </Typography>
          )}
        </Stack>
      </Grid>
      {secondary && (
        <Grid size={{ xs: 12 }} sx={{ mb: 1.75 }}>
          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
            {isLoading ? (
              <Skeleton variant="text" animation="wave" width={120} />
            ) : (
              <Typography variant="body2" sx={{ color: 'var(--color-muted-foreground)' }}>
                {secondary}
              </Typography>
            )}
          </Stack>
        </Grid>
      )}
      {actions}
    </Grid>
  </MainCard>
)

export default HoverDataCard
