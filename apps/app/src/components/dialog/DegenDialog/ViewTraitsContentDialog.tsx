import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';
import { Box, Button, Grid, Skeleton, Stack, Typography, SxProps } from '@mui/material';

import DegenImage from '@/components/cards/DegenCard/DegenImage';
import { TRAIT_KEY_VALUE_MAP, TRAIT_NAME_MAP } from '@/constants/cosmeticsFilters';
import type { Degen, GetDegenResponse } from '@/types/degens';
import { DEGEN_PURCHASE_URL } from '@/constants/url';

export interface ViewTraitsContentDialogProps {
  degen?: Degen;
  degenDetail?: GetDegenResponse;
  traits: { [traitType: string]: number };
  displayName?: string;
  onRent?: () => void;
  onClaim?: () => void;
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  degenImageSx?: SxProps<{}>;
}

const ViewTraitsContentDialog = ({
  degen,
  degenDetail,
  traits,
  displayName,
  onRent,
  onClaim,
  onClose,
  degenImageSx,
}: ViewTraitsContentDialogProps) => (
  <Grid container>
    <Grid size={{ xs: 12, md: 6 }} sx={{ py: 1, px: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'center' }}>
        {degen?.id && <DegenImage sx={{ maxWidth: '500px', ...degenImageSx }} tokenId={degen.id} />}
      </Stack>
      <Stack direction="column" sx={{ alignItems: 'center', my: 2 }}>
        <Typography gutterBottom variant="h4">
          {displayName}
        </Typography>
        <a
          href={DEGEN_PURCHASE_URL(degen?.id as string)}
          target="_blank"
          rel="noreferrer"
          className="flex flex-row flex-nowrap items-center"
        >
          <Typography sx={{ color: 'var(--color-foreground-2)', textDecoration: 'none' }}>
            DEGEN ID #{degen?.id}{' '}
          </Typography>
          <Image
            src="/img/logos/other/OpenSea.webp"
            alt="OpenSea Logo"
            width={18}
            height={18}
            className="ml-1 w-[18px] h-[18px]"
          />
        </a>
      </Stack>
      {/* <Stack direction="column"  sx={{ alignItems: 'center' }} sx={{ my: 2 }}>
          <Typography sx={{ color: 'rgb(75, 7, 175)' }}>
            {degenDetail?.multiplier}x Multiplier
          </Typography>
          <Typography sx={{ color: 'rgb(75, 7, 175)' }}>
            {degenDetail?.rental_count} Active Rentals
          </Typography>
          <Typography sx={{ color: 'rgb(75, 7, 175)' }}>
            {degenDetail?.price} NFTL/ 1 Week
          </Typography>
        </Stack> */}
      {degen?.owner && (
        <Stack direction="column" sx={{ alignItems: 'center' }} gap={1}>
          <Typography sx={{ color: 'var(--color-foreground-2)' }}>
            Owned by{' '}
            {`${degen?.owner?.slice(0, 5)}...${degen?.owner?.slice(
              degen?.owner?.length - 5,
              degen?.owner?.length - 1,
            )}`}
          </Typography>
        </Stack>
      )}
    </Grid>
    <Grid size={{ xs: 12, md: 6 }} sx={{ py: 1, px: 2, position: 'relative' }}>
      <Stack gap={3} sx={{ justifyContent: 'space-between', height: '100%' }}>
        <Stack>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
            <Typography variant="h3">Degen Traits</Typography>
          </Box>
          <Grid container sx={{ marginTop: 3, justifyContent: 'center' }} rowGap={3} columnGap={2}>
            {isEmpty(traits)
              ? [...Array(9)].map(() => (
                  <Grid size={{ xs: 3 }} key={uuidv4()}>
                    <Stack direction="column" sx={{ alignItems: 'center' }}>
                      <Skeleton animation="wave" width={60} />
                      <Skeleton animation="wave" width={40} />
                    </Stack>
                  </Grid>
                ))
              : Object.entries(traits)
                  .filter(([, value]) => parseInt(value as unknown as string, 10) > 0)
                  .map(([key, value]) => (
                    <Grid size={{ xs: 3 }} key={key}>
                      <Stack direction="column" sx={{ alignItems: 'center' }}>
                        <Typography fontWeight={700} textAlign="center">
                          {TRAIT_NAME_MAP[key as keyof typeof TRAIT_NAME_MAP]}
                        </Typography>
                        <Typography textAlign="center">
                          {TRAIT_KEY_VALUE_MAP[value as keyof typeof TRAIT_KEY_VALUE_MAP] ?? value}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
          </Grid>
        </Stack>
        <Stack direction="column" gap={1} width="100%">
          {/* {false && (
              <Button variant="contained" fullWidth onClick={onRent || onClaim}>
                {onRent ? 'Rent Degen' : 'Claim Degen'}
              </Button>
            )} */}
          {onClose && (
            <Button variant="contained" fullWidth onClick={onClose}>
              Close
            </Button>
          )}
        </Stack>
      </Stack>
    </Grid>
  </Grid>
);

export default ViewTraitsContentDialog;
