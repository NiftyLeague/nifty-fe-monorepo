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

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 30,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[50],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[400],
    }),
  },
  [`&.${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.primary.dark,
    }),
  },
}));

const CardStyle = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  marginBottom: '22px',
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: '157px',
    height: '157px',
    background: theme.palette.primary.light,
    borderRadius: '50%',
    top: '-105px',
    right: '-96px',
    ...theme.applyStyles('dark', {
      background: theme.palette.dark.dark,
    }),
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
          <Typography
            variant="h6"
            sx={{
              color: theme =>
                theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.darker,
            }}
          >
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

// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
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
                  color: theme.palette.primary.main,
                  border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
                  borderColor: theme.palette.primary.main,
                  background: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.grey[50],
                  marginRight: '12px',
                }}
              >
                <TableChartOutlinedIcon fontSize="inherit" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme =>
                      theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.primary.darker,
                  }}
                >
                  Get Extra Space
                </Typography>
              }
              secondary={<Typography variant="caption"> 28/23 GB</Typography>}
            />
          </ListItem>
        </List>
        <LinearProgressWithLabel value={80} />
      </CardContent>
    </CardStyle>
  );
};

export default memo(MenuCard);
