import Image from 'next/image';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import type { Comic } from '@/types/marketplace';
import useMediaQuery from '@nl/ui/hooks/useMediaQuery';

export interface ViewComicDialogProps {
  comic?: Comic | null;
  open: boolean;
  onClose: () => void;
}

const ViewComicDialog = ({ comic, open, onClose }: ViewComicDialogProps): React.ReactNode => {
  const fullScreen = useMediaQuery('(max-width:640px)');

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogContent className="flex justify-center">
        {comic?.image ? (
          <Image
            src={comic.image}
            alt={`Comic: ${comic?.title}`}
            width={500}
            height={500}
            style={{ width: fullScreen ? '100%' : 500, height: 'auto' }}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewComicDialog;
