import { memo } from 'react';

// material-ui
import { useTheme, styled } from '@nl/theme';
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
  linearProgressClasses,
} from '@mui/material';

import Icon from '@nl/ui/base/Icon';

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: 'var(--color-foreground)',
    ...theme.applyStyles('dark', { backgroundColor: 'var(--color-foreground-2)' }),
  },
  [`&.${linearProgressClasses.bar}`]: {
    borderRadius: 'var(--border-radius-default)',
    backgroundColor: 'var(--color-purple)',
    ...theme.applyStyles('dark', { backgroundColor: 'var(--color-purple)' }),
  },
}));

const CardStyle = styled(Card)(({ theme }) => ({
  background: 'var(--color-background-3)',
  border: 'var(--border-default)',
  marginBottom: '22px',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '157px',
    height: '157px',
    background: 'var(--color-purple-200)',
    borderRadius: '50%',
    top: '-105px',
    right: '-96px',
    ...theme.applyStyles('dark', { background: 'var(--color-background)' }),
  },
}));

interface LinearProgressWithLabelProps {
  value: number;
}

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

const LinearProgressWithLabel = ({ value, ...others }: LinearProgressWithLabelProps) => (
  <Grid container direction="column" spacing={1} sx={{ mt: 1.5 }}>
    <Grid>
      <Grid container justifyContent="space-between">
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
      <BorderLinearProgress variant="determinate" value={value} {...others} />
    </Grid>
  </Grid>
);

// ==============================|| SIDEBAR - ONBOARDING CARD ||============================== //

const OnboardingCard = () => {
  const theme = useTheme();

  return (
    <CardStyle>
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
    </CardStyle>
  );
};

export default memo(OnboardingCard);
