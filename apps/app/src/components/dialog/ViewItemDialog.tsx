import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import type { Item } from '@/types/marketplace';
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery';
import ItemDetail from '@/components/cards/ItemDetail';

export interface ViewItemDialogProps {
  item?: Item | null;
  subIndex: number;
  open: boolean;
  onClose: () => void;
}

const ViewItemDialog = ({ item, subIndex, open, onClose }: ViewItemDialogProps): React.ReactNode => {
  const fullScreen = useMediaQuery('(max-width:640px)');

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose} fullScreen={fullScreen}>
      <DialogContent className="flex justify-center">
        {item && <ItemDetail data={item} subIndex={subIndex} />}
      </DialogContent>
      <DialogActions>
        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewItemDialog;
