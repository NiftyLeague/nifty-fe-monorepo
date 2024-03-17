import { Box, SxProps, Typography } from '@mui/material';
import { Theme } from '@nl/theme';
import type { Comic } from '@/types/comic';
import ImageCard from '@/components/cards/ImageCard';
import useComicDimension from '@/hooks/useComicDimension';

export interface ComicCardProps {
  data: Comic;
  sx?: SxProps<Theme>;
  isSelected?: boolean;
  onViewComic?: () => void;
}

interface ComicCardPaneProps {
  data: Comic;
  sx?: SxProps<Theme>;
  width: number;
  height: number;
}

const ComicCardPane: React.FC<ComicCardPaneProps> = ({ width, height, data, sx }) => {
  const { image, title, thumbnail } = data;
  return (
    <Box sx={sx}>
      <Box width={width} height={height} borderRadius="5px" position="relative" overflow="hidden">
        <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
      </Box>
    </Box>
  );
};

const ComicCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<ComicCardProps>>> = ({
  data,
  onViewComic,
  sx,
  isSelected = false,
}) => {
  const { balance } = data;
  const { width: comicCardWidth, height: comicCardHeight } = useComicDimension();

  const handleViewComic = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!onViewComic) return;
    onViewComic();
  };

  if (!balance)
    return <Box border="1px solid #363636" borderRadius="5px" width={comicCardWidth} height={comicCardHeight} />;

  return (
    <Box
      onClick={handleViewComic}
      position="relative"
      sx={{
        borderRadius: '5px',
        outline: isSelected ? '3px solid #620EDF' : 'none',
        cursor: 'pointer',
      }}
    >
      {balance === 1 ? (
        <ComicCardPane data={data} width={comicCardWidth} height={comicCardHeight} />
      ) : (
        <Box width={comicCardWidth + 24} height={comicCardHeight + 16}>
          {[0, 1, 2].map(item => (
            <ComicCardPane
              data={data}
              width={comicCardWidth}
              height={comicCardHeight}
              key={`ComicCardPane-${item}`}
              sx={{
                position: 'absolute',
                zIndex: 2 - item,
                top: item * 8,
                left: (item + 1) * 8,
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
              borderRadius: '5px',
              bottom: 0,
              left: 0,
              zIndex: 3,
            }}
          >
            <Typography sx={{ fontSize: 20, color: '#FFFFFF', fontWeight: 700 }}>
              <span>{balance}</span>
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ComicCard;
