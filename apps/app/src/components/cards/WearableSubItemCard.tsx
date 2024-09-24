import { Box, Theme, Stack, SxProps, Typography } from '@mui/material';
import type { Item } from '@/types/marketplace';
import ImageCard from '@/components/cards/ImageCard';
import { useTheme } from '@nl/theme';

export interface WearableSubItemCardProps {
  data: Item;
  itemIndex: number;
  sx?: SxProps<Theme>;
  isSelected?: boolean;
  onViewItem?: () => void;
}

const CARD_WIDTH = 82;
const CARD_HEIGHT = 82;

const WearableSubItemCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<WearableSubItemCardProps>>> = ({
  data,
  itemIndex,
  onViewItem,
  sx,
  isSelected = false,
}) => {
  const theme = useTheme();
  const { image, thumbnail, title } = data;

  const handleViewItem = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onViewItem) onViewItem();
  };

  return (
    <Stack spacing={2.5} alignItems="center" sx={{ cursor: 'pointer', ...sx }} onClick={handleViewItem}>
      <Box
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        position="relative"
        overflow="hidden"
        sx={{
          borderRadius: '10px',
          outline: isSelected ? `3px solid ${theme.palette.primary.main}` : 'none',
        }}
      >
        <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
      </Box>
      <Typography
        maxWidth={CARD_WIDTH}
        textAlign="center"
        sx={{ color: theme => (isSelected ? theme.palette.primary.main : theme.palette.text.primary) }}
      >{`${title} #${itemIndex + 1}`}</Typography>
    </Stack>
  );
};

export default WearableSubItemCard;
