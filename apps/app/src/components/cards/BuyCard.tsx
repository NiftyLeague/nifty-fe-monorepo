import { Box, Typography } from '@mui/material';
import Icon from '@nl/ui/base/Icon';
import useComicDimension from '@/hooks/useComicDimension';

export interface BuyCardProps {
  isNew: boolean;
  onBuy: () => void;
}

const BuyCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<BuyCardProps>>> = ({ isNew, onBuy }) => {
  const { width: cardWidth, height: cardHeight } = useComicDimension();

  const handleBuyComic = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onBuy();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      border="1px solid #363636"
      borderRadius="5px"
      width={cardWidth}
      height={cardHeight}
      onClick={handleBuyComic}
      sx={{ cursor: 'pointer' }}
    >
      <Icon name="shopping-cart" color="purple" size={cardWidth - 50} strokeWidth={3} />
      <Typography mt={0.5} sx={{ textDecoration: 'underline', color: 'var(--color-purple)' }}>
        {isNew ? 'Buy' : 'Buy More'}
      </Typography>
    </Box>
  );
};

export default BuyCard;
