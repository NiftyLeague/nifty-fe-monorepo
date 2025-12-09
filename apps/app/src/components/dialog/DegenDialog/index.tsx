'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogProps } from '@mui/material';
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery';
import { styled } from '@nl/theme';
import { toast } from 'react-toastify';

import { DEGEN_CONTRACT } from '@/constants/contracts';
import { TRAIT_INDEXES } from '@/constants/cosmeticsFilters';
import useNetworkContext from '@/hooks/useNetworkContext';
import { GET_DEGEN_DETAIL_URL } from '@/constants/url';
import type { CharacterType, Degen, GetDegenResponse } from '@/types/degens';
import { errorMsgHandler } from '@/utils/errorHandlers';
import useAuth from '@/hooks/useAuth';

import ClaimDegenContentDialog from './ClaimDegenContentDialog';
import EquipDegenContentDialog from './EquipDegenContentDialog';
import RentDegenContentDialog from './RentDegenContentDialog';
import ViewTraitsContentDialog from './ViewTraitsContentDialog';

export interface DegenDialogProps extends DialogProps {
  degen?: Degen;
  isRent?: boolean;
  setIsRent?: React.Dispatch<React.SetStateAction<boolean>>;
  isClaim?: boolean;
  setIsClaim?: React.Dispatch<React.SetStateAction<boolean>>;
  isEquip?: boolean;
  setIsEquip?: React.Dispatch<React.SetStateAction<boolean>>;
  onRent?: (degen: Degen) => void;
}

const CustomDialog = styled(Dialog, { shouldForwardProp: prop => prop !== 'isRent' && prop !== 'isEquip' })<{
  isRent?: boolean;
  isEquip?: boolean;
}>(({ theme, isRent, isEquip }) => ({
  '& .MuiPaper-root': {
    overflowX: 'hidden',
    minWidth: 'inherit',
    [theme.breakpoints.down('md')]: {
      minWidth: 'inherit',
      margin: isRent || isEquip ? 16 : 'inherit',
      maxWidth: isRent || isEquip ? 'calc(100% - 32px) !important' : 'inherit',
      width: isRent || isEquip ? 'calc(100% - 32px) !important' : 'inherit',
      height: isRent || isEquip ? 'auto' : 'inherit',
      borderRadius: isRent || isEquip ? '10px' : 'inherit',
    },
  },
  ...(isRent && { '& .MuiPaper-root': { minWidth: 550 } }),
}));

const DegenDialog = ({
  open,
  degen,
  isRent,
  setIsRent,
  isClaim,
  setIsClaim,
  // onRent,
  isEquip,
  // setIsEquip,
  onClose,
  ...rest
}: DegenDialogProps) => {
  const tokenId = degen?.id || 0;
  const fullScreen = useMediaQuery('(max-width:768px)');
  const { readContracts } = useNetworkContext();
  const { authToken } = useAuth();
  const [degenDetail, setDegenDetail] = useState<GetDegenResponse>();
  const [character, setCharacter] = useState<CharacterType>({ name: null, owner: null, traitList: [] });
  const { name, traitList } = character as unknown as { name: string; owner: string; traitList: number[] };
  const resetDialog = () => {
    setCharacter({ name: null, owner: null, traitList: [] });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      if (!open || !tokenId || !readContracts || !readContracts[DEGEN_CONTRACT] || !authToken) {
        return;
      }

      try {
        // Fetch Degen details from API
        const degenDetailPromise = fetch(GET_DEGEN_DETAIL_URL(tokenId), {
          method: 'GET',
          headers: { authorizationToken: authToken },
          signal,
        });

        // Fetch character data from contract
        const contract = readContracts[DEGEN_CONTRACT];
        const characterDataPromise =
          contract &&
          Promise.all([contract.getName(tokenId), contract.ownerOf(tokenId), contract.getCharacterTraits(tokenId)]);

        const [degenRes, characterData] = await Promise.all([degenDetailPromise, characterDataPromise]);

        // Process Degen details
        if (degenRes) {
          if (degenRes.status === 404) {
            throw new Error('Degen not found');
          }
          if (!degenRes.ok) {
            throw new Error('Failed to fetch Degen details');
          }
          const json: GetDegenResponse = await degenRes.json();
          if (!signal.aborted) {
            setDegenDetail(json);
          }
        }

        // Process character data
        if (characterData) {
          const [name, owner, traitList] = characterData;
          if (!signal.aborted) {
            setCharacter({ name, owner, traitList });
          }
        }
      } catch (err) {
        if (!signal.aborted) {
          toast.error(errorMsgHandler(err), { theme: 'dark' });
        }
      }
    };

    // eslint-disable-next-line no-void
    void fetchData();

    return () => {
      controller.abort();
    };
  }, [tokenId, readContracts, open, authToken]);

  const displayName = name || 'No Name DEGEN';
  const traits: { [traitType: string]: number } = traitList.reduce(
    (acc, trait, i) => ({ ...acc, [TRAIT_INDEXES[i] as string]: trait }),
    {},
  );

  const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClose?.(event, 'backdropClick');
    resetDialog();
  };

  return (
    <CustomDialog
      maxWidth={isRent ? 'xs' : 'sm'}
      fullWidth={isClaim ? false : true}
      scroll="body"
      fullScreen={isEquip ? false : fullScreen}
      onClose={handleClose}
      open={open}
      isRent={isRent}
      isEquip={isEquip}
      {...rest}
    >
      {isClaim && <ClaimDegenContentDialog degen={degen} onClose={handleClose} />}
      {isEquip && <EquipDegenContentDialog degen={degen} name={name} />}
      {isRent && <RentDegenContentDialog degen={degen} onClose={handleClose} />}
      {!isRent && !isClaim && !isEquip && setIsRent && (
        <ViewTraitsContentDialog
          degen={degen}
          degenDetail={degenDetail}
          traits={traits}
          displayName={displayName}
          onRent={() => setIsRent(true)}
          onClose={handleClose}
        />
      )}
      {!isRent && !isClaim && !isEquip && setIsClaim && (
        <ViewTraitsContentDialog
          degen={degen}
          degenDetail={degenDetail}
          traits={traits}
          displayName={displayName}
          onClaim={() => setIsClaim(true)}
          onClose={handleClose}
        />
      )}
    </CustomDialog>
  );
};

export default DegenDialog;
