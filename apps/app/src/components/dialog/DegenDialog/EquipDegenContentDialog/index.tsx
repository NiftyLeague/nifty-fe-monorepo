'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import isEqual from 'lodash/isEqual';

import { gtm, GTM_EVENTS } from '@nl/ui/gtm';
import useNFTsBalances from '@/hooks/balances/useNFTsBalances';
import { useDispatch } from '@/store/hooks';
import { openSnackbar } from '@/store/slices/snackbar';
import { COMICS_PURCHASE_URL } from '@/constants/url';
import type { Degen } from '@/types/degens';
import DegenImage from '@/components/cards/DegenCard/DegenImage';
import EmptyState from '@/components/EmptyState';
import { Icon } from '@nl/ui/base/icon';

import { getInventoryAnalyticsEventName, getSlotAnalyticsEventName, INVENTORIES, SLOTS } from './equips';

import styles from './index.module.css';

export interface EquipDegenContentDialogProps {
  degen?: Degen;
  name?: string;
}

// Hardcoded multipliers by INVENTORIES order
// Should be given from BE later
// each multiplier will be larger than 2
const multipliers: number[] = [2, 3, 2, 3, 4, 2];

// Hardcoded DEGEN equipped status by INVENTORIES order
// Should be given from BE later
const initEquipped: boolean[] = new Array(6).fill(false);

const EquipDegenContentDialog = ({ degen, name }: EquipDegenContentDialogProps) => {
  const dispatch = useDispatch();
  const { comicsBalances, loadingComics } = useNFTsBalances();
  const filteredComics = useMemo(
    () => comicsBalances.filter(comic => comic.balance && comic.balance > 0),
    [comicsBalances],
  );
  const [animationType, setAnimationType] = useState<string>('pose');
  const [equipped, setEquipped] = useState<boolean[]>(initEquipped);
  const [pendingEquipped, setPendingEquipped] = useState<boolean[]>(initEquipped);
  const { animTypeActiveButton, animTypeButton, label, tag, title } = styles;

  useEffect(() => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_CLICKED);
  }, []);

  const handleEquip = useCallback(
    (index: number) => {
      const item = INVENTORIES[index];
      if (item) {
        const newEquipped = [...pendingEquipped];
        // If bat, unequip existing bat.
        if (index >= 3) {
          for (let i = 3; i < 6; i++) {
            newEquipped[i] = false;
          }
        }
        newEquipped[index] = true;
        setPendingEquipped(newEquipped);
        const eventName = getInventoryAnalyticsEventName(item.name);
        if (eventName) {
          gtm.sendEvent(eventName);
        }
      }
    },
    [pendingEquipped],
  );

  const handleUnequip = useCallback(
    (index: number) => {
      const slot = SLOTS[index];
      if (slot) {
        const newEquipped = [...pendingEquipped];
        if (index >= 3) {
          for (let i = 3; i < 6; i++) {
            newEquipped[i] = false;
          }
        } else {
          newEquipped[index] = false;
        }
        setPendingEquipped(newEquipped);
        const eventName = getSlotAnalyticsEventName(slot.name);
        if (eventName) {
          gtm.sendEvent(eventName);
        }
      }
    },
    [pendingEquipped],
  );

  const stateChanged = useMemo(() => !isEqual(equipped, pendingEquipped), [equipped, pendingEquipped]);

  const handleSave = useCallback(() => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_STARTED);
    // Should call proper api here
    setEquipped(pendingEquipped);
    dispatch(
      openSnackbar({
        open: true,
        message: 'Settings saved successfuly...',
        variant: 'alert',
        alert: { color: 'success' },
        close: false,
      }),
    );
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_SUCCESS);
  }, [dispatch, pendingEquipped]);

  const getSlotImage = useCallback(
    (index: number) => {
      const slot = SLOTS[index];
      if (slot) {
        if (index < 3) {
          return pendingEquipped[index] ? slot.filled : slot.empty;
        }
        const slicedArr = pendingEquipped.slice(3);
        const equippedBatIndex = slicedArr.findIndex(item => !!item);
        const filledArr = slot.filledArr;
        if (equippedBatIndex >= 0 && filledArr) {
          return filledArr[equippedBatIndex];
        } else {
          return slot.empty;
        }
      }
    },
    [pendingEquipped],
  );

  const isEquippedSlot = useCallback(
    (index: number) => {
      if (index < 3) {
        return pendingEquipped[index];
      }
      const slicedArr = pendingEquipped.slice(3);
      const equippedBatIndex = slicedArr.findIndex(item => !!item);
      return equippedBatIndex >= 0;
    },
    [pendingEquipped],
  );

  const totalMultiplierApplied = useMemo(() => {
    let totalMultipliers = 0;
    pendingEquipped.forEach((status, index) => {
      if (status) totalMultipliers += multipliers[index] ?? 0;
    });
    if (totalMultipliers > 0) {
      return `${totalMultipliers}X Earnings Multiplier`;
    }
    return 'No Multiplier Applied';
  }, [pendingEquipped]);

  const handleSetPose = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_ANIMATION_POSE_CLICKED);
    setAnimationType('pose');
  };

  const handleSetRotate = () => {
    gtm.sendEvent(GTM_EVENTS.DEGEN_EQUIP_ANIMATION_ROTATE_CLICKED);
    setAnimationType('rotate');
  };

  if (filteredComics.length === 0) {
    if (loadingComics) {
      return (
        <Stack direction="row" justifyContent="center" alignItems="center" height={200} mx="auto">
          <CircularProgress />
        </Stack>
      );
    }
    return (
      <Grid container justifyContent="center" alignItems="center" display="flex" height={200}>
        <Link href={COMICS_PURCHASE_URL} target="_blank" rel="noreferrer">
          <EmptyState message="You don't own any Comics yet." buttonText="Buy a Comic" noBorder />
        </Link>
      </Grid>
    );
  }

  return (
    <Stack py={1} maxWidth={330} mx="auto">
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        p={1.25}
        mx={1.25}
        sx={{ backgroundColor: '#262930' }}
      >
        <Typography variant="h5" className={title}>
          {name || `DEGEN #${degen?.id}`}
        </Typography>
      </Box>
      <Stack direction="row" mt={2.25}>
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="body1" mb={2} className={label}>
            SLOTS
          </Typography>
          <Stack rowGap={3}>
            {SLOTS.map((slot, index) => (
              <Box key={slot.name} width={40} height={40} position="relative">
                {getSlotImage(index)}
                {isEquippedSlot(index) && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className={tag}
                    onClick={() => handleUnequip(index)}
                  >
                    <Icon name="x" size={12} className="cursor-pointer" />
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
        <Stack mt={2.75} ml={3.75} mr={1.5}>
          {degen?.id && (
            <DegenImage sx={{ objectFit: 'cover', width: 183, height: 244, borderRadius: '10px' }} tokenId={degen.id} />
          )}
          <Stack mt={1.25} gap={1.5} direction="row">
            <Button
              variant="contained"
              fullWidth
              className={animationType === 'pose' ? animTypeActiveButton : animTypeButton}
              onClick={handleSetPose}
            >
              POSE
            </Button>
            <Button
              variant="contained"
              fullWidth
              className={animationType === 'rotate' ? animTypeActiveButton : animTypeButton}
              onClick={handleSetRotate}
            >
              ROTATE
            </Button>
          </Stack>
          <Typography variant="body1" my={2.25} mx="auto" fontWeight={700} className={label}>
            {totalMultiplierApplied}
          </Typography>
          <Button variant="contained" disabled={!stateChanged} sx={{ width: 116, mx: 'auto' }} onClick={handleSave}>
            SAVE
          </Button>
        </Stack>
        <Stack sx={{ alignItems: 'center' }}>
          <Typography variant="body1" mb={2} textAlign="center" className={label}>
            INVENTORY
          </Typography>
          <Stack rowGap={1.25}>
            {INVENTORIES.map((inventory, index) => (
              <Box
                key={inventory.name}
                width={30}
                height={30}
                position="relative"
                sx={{ cursor: pendingEquipped[index] ? 'inherit' : 'pointer' }}
                onClick={() => handleEquip(index)}
              >
                {pendingEquipped[index] ? inventory.empty : inventory.filled}
                {!pendingEquipped[index] && (multipliers[index] ?? 0) >= 2 && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    className={tag}
                  >{`${multipliers[index]}x`}</Box>
                )}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default EquipDegenContentDialog;
