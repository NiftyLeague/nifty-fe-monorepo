import { memo } from 'react'

// material-ui
import { useTheme } from '@nl/theme'
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'

import { Icon } from '@nl/ui/base/icon'

// styles
import styles from './OnboardingCard.module.css'

interface LinearProgressWithLabelProps {
  value: number
}

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

const LinearProgressWithLabel = ({ value, ...others }: LinearProgressWithLabelProps) => (
  <Grid container sx={{ flexDirection: 'column', mt: 1.5 }} spacing={1}>
    <Grid>
      <Grid container sx={{ justifyContent: 'space-between' }}>
        <Grid>
          <Typography variant="h6" sx={{ color: 'var(--color-foreground)' }}>
            Progress
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="h6" sx={{ color: 'inherit' }}>{`${Math.round(value)}%`}</Typography>
        </Grid>
      </Grid>
    </Grid>
    <Grid>
      <LinearProgress
        className={styles.borderLinearProgress}
        variant="determinate"
        value={value}
        {...others}
      />
    </Grid>
  </Grid>
)

// ==============================|| SIDEBAR - ONBOARDING CARD ||============================== //

const OnboardingCard = () => {
  const theme = useTheme()

  return (
    <Card className={styles.cardStyle}>
      <CardContent sx={{ p: 2 }}>
        <List sx={{ p: 0, m: 0 }}>
          <ListItem alignItems="flex-start" disableGutters sx={{ p: 0 }}>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.largeAvatar,
                  color: 'var(--color-purple)',
                  border: 'var(--border-purple)',
                  background: 'var(--color-background)',
                  marginRight: '12px',
                }}
              >
                <Icon name="book-open-check" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography variant="subtitle1" sx={{ color: 'var(--color-foreground)' }}>
                  Onboarding
                </Typography>
              }
              secondary={<Typography variant="caption"> 28/23 Tasks</Typography>}
            />
          </ListItem>
        </List>
        <LinearProgressWithLabel value={80} />
      </CardContent>
    </Card>
  )
}

export default memo(OnboardingCard)
