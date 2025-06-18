import { Button, Dialog, DialogActions, DialogContent, useMediaQuery } from '@mui/material';
import type { Item } from '@/types/marketplace';
import { useTheme } from '@nl/theme';
import ItemDetail from '@/components/cards/ItemDetail';

export interface ViewItemDialogProps {
  item?: Item | null;
  subIndex: number;
  open: boolean;
  onClose: () => void;
}

const ViewItemDialog = ({ item, subIndex, open, onClose }: ViewItemDialogProps): React.ReactNode => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
