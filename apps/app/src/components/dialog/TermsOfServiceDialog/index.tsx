import { Button, Dialog, DialogProps, Stack } from '@mui/material'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import TermsOfServiceContent from './TermsOfServiceContent'

export interface TermsOfServiceDialogProps extends DialogProps {
  onClose: (
    event: object,
    reason: 'backdropClick' | 'escapeKeyDown' | 'accepted' | 'cancel'
  ) => void
}

const TermsOfServiceDialog = ({ open, onClose, ...rest }: TermsOfServiceDialogProps) => {
  const fullScreen = useMediaQuery('(max-width:768px)')

  return (
    <Dialog
      maxWidth="sm"
      scroll="paper"
      fullScreen={fullScreen}
      onClose={onClose}
      open={open}
      {...rest}
    >
      <Stack direction="column" sx={{ gap: 0, width: '100%', overflow: 'none' }}>
        <h2 className="text-center mb-5">Terms and Conditions</h2>
        <Stack
          direction="column"
          sx={{
            gap: 0,
            width: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            height: fullScreen ? 'calc(100vh - 184px)' : '65vh',
          }}
        >
          <TermsOfServiceContent />
        </Stack>
        <div className="flex mt-3 px-4">
          <Button fullWidth variant="contained" onClick={() => onClose({}, 'accepted')}>
            Accept
          </Button>
          <Button fullWidth onClick={() => onClose({}, 'cancel')}>
            Close
          </Button>
        </div>
      </Stack>
    </Dialog>
  )
}

export default TermsOfServiceDialog
