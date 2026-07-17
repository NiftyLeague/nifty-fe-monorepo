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
    return <Box sx={{ border: '1px solid #363636', borderRadius: '5px', minWidth: 345, height: 375 }} />;
  }

  const { equipped, image, multiplier, title, thumbnail } = data;

  const handleEquip = () => {
    router.push('/dashboard/degens');
  };

  return (
    <Stack
      sx={{
        border: { xs: 'none', lg: '1px solid #363636' },
        borderRadius: '5px',
        minWidth: { xs: '100%', lg: 345 },
        width: 345,
        height: 375,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ position: 'relative', width: 225, height: 226 }}>
        <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: '10px 10px 0px 0px' }}>
          <ImageCard image={image} thumbnail={thumbnail} title={title} ratio={1} />
        </Box>
        {multiplier && multiplier >= 2 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              position: 'absolute',
              borderRadius: '50%',
              background: 'var(--color-purple)',
              top: -12,
              right: -28,
            }}
          >
            <Typography
              sx={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-foreground)' }}
            >{`${multiplier}x`}</Typography>
          </Box>
        )}
      </Box>
      {enableEquip ? (
        <Stack
          spacing={1.5}
          sx={{
            width: 225,
            border: '1px solid #5D5F74',
            borderTop: 'none',
            p: 1,
            pb: 3,
            borderRadius: '0px 0px var(--radius-default) var(--radius-default)',
          }}
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
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#363636' }}>Equipped:</Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-purple)',
                textDecorationLine: equipped ? 'underline' : 'none',
              }}
            >
              {equipped ? 'DEGEN #1152' : '-'}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#363636' }}>Rental:</Typography>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-purple)',
                textDecorationLine: equipped ? 'underline' : 'none',
              }}
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
