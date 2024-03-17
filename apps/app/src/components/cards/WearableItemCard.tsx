import Image from 'next/image';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import { Theme } from '@nl/theme';
import type { Item } from '@/types/comic';
import ImageCard from '@/components/cards/ImageCard';

export interface WearableItemCardProps {
  data: Item;
  sx?: SxProps<Theme>;
  isSelected?: boolean;
  onViewItem?: () => void;
}

interface WearableItemCardPaneProps {
  data: Item;
  sx?: SxProps<Theme>;
  width: number;
  height: number;
}

const WearableItemCardPane: React.FC<WearableItemCardPaneProps> = ({ width, height, data, sx }) => {
  const { image, title, thumbnail } = data;
  return (
    <Box width={width} height={height} borderRadius="10px" overflow="hidden" sx={sx}>
      <Box position="relative">
        <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
      </Box>
    </Box>
  );
};

const CARD_WIDTH = 106;
const CARD_HEIGHT = 106;

const WearableItemCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<WearableItemCardProps>>> = ({
  data,
  onViewItem,
  sx,
  isSelected = false,
}) => {
  const { balance, empty, isNew, title } = data;

  const handleViewItem = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!onViewItem) return;
    onViewItem();
  };

  if (!balance)
    return (
      <Box display="flex" alignItems="center" justifyContent="center" width={CARD_WIDTH + 24} height={CARD_HEIGHT + 24}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid #363636"
          borderRadius="10px"
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
        >
          <Image src={empty as string} alt={title} width={CARD_WIDTH} height={CARD_HEIGHT} />
        </Box>
      </Box>
    );

  return (
    <Stack position="relative">
      {isNew && (
        <Typography color="#E3B210" textAlign="center" position="absolute" width="100%" sx={{ top: -16 }}>
          New!
        </Typography>
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        width={CARD_WIDTH + 24}
        height={CARD_HEIGHT + 24}
        onClick={handleViewItem}
        sx={{ borderRadius: '10px', cursor: 'pointer' }}
      >
        {balance === 1 ? (
          <WearableItemCardPane
            data={data}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            sx={{
              outline: isSelected ? '3px solid #620EDF' : 'none',
            }}
          />
        ) : (
          <>
            {[0, 1, 2].map(item => (
              <WearableItemCardPane
                data={data}
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                key={`WearableItemCard-${item}`}
                sx={{
                  position: 'absolute',
                  zIndex: 2 - item,
                  top: item * 8,
                  left: (item + 1) * 8,
                  border: '1px solid #000000',
                }}
              />
            ))}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="absolute"
              width={38}
              height={35}
              sx={{
                background: '#8F4BF4',
                borderRadius: '10px',
                bottom: 0,
                left: 0,
                zIndex: 3,
              }}
            >
              <Typography sx={{ fontSize: 20, color: '#FFFFFF', fontWeight: 700 }}>{balance}</Typography>
            </Box>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default WearableItemCard;
