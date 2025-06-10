import { useRouter } from 'next/navigation';
import { Box, Button, Stack, Typography } from '@mui/material';
import useFlags from '@/hooks/useFlags';
import type { Item } from '@/types/marketplace';
import ImageCard from '@/components/cards/ImageCard';

export interface ItemDetailProps {
  data: Item | null;
  subIndex: number;
}

const ItemDetail: React.FC<React.PropsWithChildren<React.PropsWithChildren<ItemDetailProps>>> = ({
  data,
  subIndex,
}) => {
  const router = useRouter();
  const { enableEquip } = useFlags();

  if (!data || (data?.balance && data?.balance > 1 && subIndex < 0)) {
    return <Box border="1px solid #363636" borderRadius="5px" minWidth={345} height={375} />;
  }

  const { equipped, image, multiplier, title, thumbnail } = data;

  const handleEquip = () => {
    router.push('/dashboard/degens');
  };

  return (
    <Stack
      sx={{ justifyContent: 'center', alignItems: 'center' }}
      border={{ xs: 'none', lg: '1px solid #363636' }}
      borderRadius="5px"
      minWidth={{ xs: '100%', lg: 345 }}
      width={345}
      height={375}
    >
      <Box position="relative" width={225} height={226}>
        <Box position="relative" overflow="hidden" sx={{ borderRadius: '10px 10px 0px 0px' }}>
          <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
        </Box>
        {multiplier && multiplier >= 2 && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width={50}
            height={50}
            position="absolute"
            borderRadius="50%"
            sx={{ background: 'var(--color-brand-purple)', top: -12, right: -28 }}
          >
            <Typography
              sx={{ color: 'var(--color-light)' }}
              fontSize="20px"
              fontWeight="bold"
            >{`${multiplier}x`}</Typography>
          </Box>
        )}
      </Box>
      {enableEquip ? (
        <Stack
          width={225}
          border="1px solid #5D5F74"
          borderTop="none"
          sx={{ borderRadius: '0px 0px var(--border-radius-default) var(--border-radius-default)' }}
          spacing={1.5}
          p={1}
          pb={3}
        >
          <Button
            variant="contained"
            fullWidth
            sx={{ height: 28, textTransform: 'none', fontWeight: 700 }}
            onClick={handleEquip}
          >
            {equipped ? 'Unequip' : 'Equip on a DEGEN'}
          </Button>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#363636' }} fontSize="12px" fontWeight={600}>
              Equipped:
            </Typography>
            <Typography
              fontSize="12px"
              fontWeight={500}
              sx={{ color: 'var(--color-brand-purple)', textDecorationLine: equipped ? 'underline' : 'none' }}
            >
              {equipped ? 'DEGEN #1152' : '-'}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ color: '#363636' }} fontSize="12px" fontWeight={600}>
              Rental:
            </Typography>
            <Typography
              fontSize="12px"
              fontWeight={500}
              sx={{ color: 'var(--color-brand-purple)', textDecorationLine: equipped ? 'underline' : 'none' }}
            >
              {equipped ? '28 days left' : '-'}
            </Typography>
          </Stack>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default ItemDetail;
