import { Button, Container, Dialog, DialogProps, Stack, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import TermsOfServiceContent from './TermsOfServiceContent';

export interface TermsOfServiceDialogProps extends DialogProps {
  onClose: (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel') => void;
}

const TermsOfServiceDialog = ({ open, onClose, ...rest }: TermsOfServiceDialogProps) => {
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog maxWidth="sm" scroll="paper" fullScreen={fullScreen} onClose={onClose} open={open} {...rest}>
      <Stack sx={{ overflow: 'none' }} direction="column" gap={0} width="100%">
        <Container
          sx={{
            background: theme.palette.background.paper,
          }}
        >
          <h2>Terms and Conditions</h2>
        </Container>
        <Stack
          sx={{
            overflowY: 'scroll',
            overflowX: 'hidden',
            height: fullScreen ? 'calc(100vh - 184px)' : '65vh',
          }}
          direction="column"
          gap={0}
          width="100%"
        >
          <TermsOfServiceContent />
        </Stack>
        <Container
          sx={{
            background: theme.palette.background.paper,
            pt: '1.2em',
          }}
        >
          <Button fullWidth variant="contained" onClick={() => onClose({}, 'accepted')}>
            Accept
          </Button>
          <Button fullWidth onClick={() => onClose({}, 'cancel')}>
            Close
          </Button>
        </Container>
      </Stack>
    </Dialog>
  );
};

export default TermsOfServiceDialog;
