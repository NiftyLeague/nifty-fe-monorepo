'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

import { errorMsgHandler } from '@/utils/errorHandlers';
import { GET_DEGEN_DETAIL_URL } from '@/constants/url';
import { TRAIT_INDEXES, TRIBES } from '@/constants/cosmeticsFilters';
import DegenDialog from '@/components/dialog/DegenDialog';
import useAuth from '@/hooks/useAuth';
import ViewTraitsContentDialog from '@/components/dialog/DegenDialog/ViewTraitsContentDialog';
import type { Degen, GetDegenResponse } from '@/types/degens';
import { useCharacterSearch } from '@/hooks/useGraphQL';

type TraitsDetailsDialogProps = { tokenId: string; query: string | string[] | undefined };

const DegenTraitsDetailsDialog = ({ tokenId }: TraitsDetailsDialogProps): React.ReactNode => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [degenDetail, setDegenDetail] = useState<GetDegenResponse>();
  const { authToken } = useAuth();
  const { isFetching: loading, data: degens } = useCharacterSearch(tokenId);

  const degen = useMemo((): Degen | null => {
    if (loading || !degens) return null;
    const character = degens[0];
    if (character === undefined) return null;
    return {
      id: tokenId,
      stats: degenDetail?.stats || {},
      rental_count: degenDetail?.rental_count || 0,
      is_active: degenDetail?.is_active || true,
      last_rented_at: degenDetail?.last_rented_at || 0,
      total_rented: degenDetail?.total_rented || 0,
      price: degenDetail?.price || 0,
      price_daily: degenDetail?.price_daily || 0,
      tribe: TRIBES[character.traits.tribe as keyof typeof TRIBES],
      background: degenDetail?.degen?.background || '',
      traits_string:
        degenDetail?.degen?.traits_string ||
        Object.values(character.traits)
          .filter(v => v.toString() !== 'TraitMap')
          .toString(),
      multiplier: degenDetail?.multiplier || 0,
      multipliers: degenDetail?.multipliers || { background: 0 },
      name: character.name as string,
      owner: character.owner.address as string,
      earning_cap: 0,
      earning_cap_daily: 0,
    };
  }, [degens, degenDetail, loading, tokenId]);

  const traits = useMemo((): { [traitType: string]: number } => {
    const traitList = degen?.traits_string?.split(',').map(Number) || [];
    return traitList.reduce((acc, trait, i) => ({ ...acc, [TRAIT_INDEXES[i] as string]: trait }), {});
  }, [degen?.traits_string]);

  const getDegenDetail = useCallback(async () => {
    if (!tokenId || !authToken) return;

    try {
      const res = await fetch(GET_DEGEN_DETAIL_URL(tokenId), {
        method: 'GET',
        headers: { authorizationToken: authToken },
      });

      if (res.status === 404) {
        throw Error('Not Found');
      }
      const json = await res.json();
      setDegenDetail(json);
    } catch (err) {
      toast.error(errorMsgHandler(err), { theme: 'dark' });
    }
  }, [authToken, tokenId]);

  useEffect(() => {
    getDegenDetail();
  }, [getDegenDetail]);

  return degen !== null ? (
    <Box sx={{ margin: 'auto', marginTop: 8 }}>
      <ViewTraitsContentDialog
        degen={degen}
        degenDetail={degenDetail}
        traits={traits}
        displayName={degen?.name || 'No Name DEGEN'}
        onRent={() => setOpenDialog(true)}
        degenImageSx={{ objectFit: 'contain', height: 400 }}
      />
      <DegenDialog open={openDialog} degen={degen} isRent={true} onClose={() => setOpenDialog(false)} />
    </Box>
  ) : (
    <></>
  );
};

export default DegenTraitsDetailsDialog;
