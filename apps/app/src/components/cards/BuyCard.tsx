import Image from 'next/image';
import { Box, Typography } from '@mui/material';
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
      <Image src="/icons/shopping-cart.svg" alt="Shopping Cart" width={cardWidth - 50} height={cardHeight - 50} />
      <Typography mt={0.5} color="#5820D6" sx={{ textDecoration: 'underline' }}>
        {isNew ? 'Buy' : 'Buy More'}
      </Typography>
    </Box>
  );
};

export default BuyCard;
