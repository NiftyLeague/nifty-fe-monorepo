import { Button, Container, Dialog, DialogProps, Stack } from '@mui/material';
import useMediaQuery from '@nl/ui/hooks/useMediaQuery';

import TermsOfServiceContent from './TermsOfServiceContent';

export interface TermsOfServiceDialogProps extends DialogProps {
  onClose: (event: object, reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel') => void;
}

const TermsOfServiceDialog = ({ open, onClose, ...rest }: TermsOfServiceDialogProps) => {
  const fullScreen = useMediaQuery('(max-width:768px)');

  return (
    <Dialog maxWidth="sm" scroll="paper" fullScreen={fullScreen} onClose={onClose} open={open} {...rest}>
      <Stack sx={{ overflow: 'none' }} direction="column" gap={0} width="100%">
        <Container sx={{ background: 'var(--color-background-3)' }}>
          <h2>Terms and Conditions</h2>
        </Container>
        <Stack
          sx={{ overflowY: 'scroll', overflowX: 'hidden', height: fullScreen ? 'calc(100vh - 184px)' : '65vh' }}
          direction="column"
          gap={0}
          width="100%"
        >
          <TermsOfServiceContent />
        </Stack>
        <Container sx={{ background: 'var(--color-background-3)', pt: '1.2em' }}>
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
