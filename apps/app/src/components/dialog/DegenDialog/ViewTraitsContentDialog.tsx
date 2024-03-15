import { useEffect } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import isEmpty from 'lodash/isEmpty';
import { Box, Button, Grid, Skeleton, Stack, Typography, SxProps } from '@mui/material';

import DegenImage from '@/components/cards/DegenCard/DegenImage';
import { GOOGLE_ANALYTICS } from '@/constants/google-analytics';
import { TRAIT_KEY_VALUE_MAP, TRAIT_NAME_MAP } from '@/constants/cosmeticsFilters';
import type { Degen, GetDegenResponse } from '@/types/degens';
import { sendEvent } from '@/utils/google-analytics';

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
}: ViewTraitsContentDialogProps) => {
  useEffect(() => {
    sendEvent(GOOGLE_ANALYTICS.EVENTS.VIEW_ITEM, GOOGLE_ANALYTICS.CATEGORIES.ENGAGEMENT);
  }, []);

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6} sx={{ py: 1, px: 2 }}>
        <Stack direction="row" justifyContent="center">
          {degen?.id && <DegenImage sx={{ ...degenImageSx }} tokenId={degen.id} />}
        </Stack>
        <Stack direction="column" alignItems="center" sx={{ my: 2 }}>
          <Typography gutterBottom variant="h3">
            {displayName}
          </Typography>
          <a
            href={`https://opensea.io/assets/0x986aea67c7d6a15036e18678065eb663fc5be883/${degen?.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <Typography color="gray" sx={{ textDecoration: 'none' }}>
              DEGEN ID #{degen?.id} <Image src="/images/icons/OpenSea.png" alt="Nifty Logo" width={16} height={16} />
            </Typography>
          </a>
        </Stack>
        {/* <Stack direction="column" alignItems="center" sx={{ my: 2 }}>
          <Typography color="rgb(75, 7, 175)">
            {degenDetail?.multiplier}x Multiplier
          </Typography>
          <Typography color="rgb(75, 7, 175)">
            {degenDetail?.rental_count} Active Rentals
          </Typography>
          <Typography color="rgb(75, 7, 175)">
            {degenDetail?.price} NFTL/ 1 Week
          </Typography>
        </Stack> */}
        <Stack direction="column" alignItems="center" gap={1}>
          <Typography color="gray">
            Owned by{' '}
            {degen?.name ||
              `${degen?.owner?.slice(0, 5)}...${degen?.owner?.slice(
                degen?.owner?.length - 5,
                degen?.owner?.length - 1,
              )}`}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} sm={12} md={6} sx={{ py: 1, px: 2, position: 'relative' }}>
        <Stack gap={3} sx={{ justifyContent: 'space-between', height: '100%' }}>
          <Stack>
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
              <Typography variant="h2">Degen Traits</Typography>
            </Box>
            <Grid container sx={{ marginTop: 3, justifyContent: 'center' }} rowGap={3} columnGap={2}>
              {isEmpty(traits)
                ? [...Array(9)].map(() => (
                    <Grid item xs={3} key={uuidv4()}>
                      <Stack direction="column" alignItems="center">
                        <Skeleton animation="wave" width={60} />
                        <Skeleton animation="wave" width={40} />
                      </Stack>
                    </Grid>
                  ))
                : Object.entries(traits)
                    .filter(([, value]) => parseInt(value as unknown as string, 10) > 0)
                    .map(([key, value]) => (
                      <Grid item xs={3} key={key}>
                        <Stack direction="column" alignItems="center">
                          <Typography fontWeight={700} textAlign="center">
                            {TRAIT_NAME_MAP[key]}
                          </Typography>
                          <Typography textAlign="center">{TRAIT_KEY_VALUE_MAP[value] ?? value}</Typography>
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
              <Button fullWidth onClick={onClose}>
                Close
              </Button>
            )}
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ViewTraitsContentDialog;
