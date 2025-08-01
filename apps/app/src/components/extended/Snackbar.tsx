import { SyntheticEvent } from 'react';

// material-ui
import { Alert, Button, Fade, Grow, IconButton, Slide, SlideProps } from '@mui/material';
import MuiSnackbar from '@mui/material/Snackbar';

import { Icon } from '@nl/ui/base/icon';
import { useDispatch, useSelector } from '@/store/hooks';
import { closeSnackbar } from '@/store/slices/snackbar';

// animation function
function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

// animation options
const animation = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade,
};

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const dispatch = useDispatch();
  const snackbar = useSelector(state => state.snackbar);
  const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } = snackbar;

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {/* default snackbar */}
      {variant === 'default' && (
        <MuiSnackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          TransitionComponent={animation[transition as keyof typeof animation]}
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} sx={{ mt: 0.25 }}>
                <Icon name="x" size="sm" />
              </IconButton>
            </>
          }
        />
      )}

      {/* alert snackbar */}
      {variant === 'alert' && (
        <MuiSnackbar
          TransitionComponent={animation[transition as keyof typeof animation]}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            variant={alert.variant}
            color={alert.color}
            action={
              <>
                {actionButton !== false && (
                  <Button size="small" onClick={handleClose} sx={{ color: 'background.paper' }}>
                    UNDO
                  </Button>
                )}
                {close !== false && (
                  <IconButton sx={{ color: 'background.paper' }} size="small" aria-label="close" onClick={handleClose}>
                    <Icon name="x" size="sm" />
                  </IconButton>
                )}
              </>
            }
            sx={{ ...(alert.variant === 'outlined' && { bgcolor: 'background.paper' }) }}
          >
            {message}
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
};

export default Snackbar;
