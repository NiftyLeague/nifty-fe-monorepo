'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';

import { type AddressLike } from 'ethers6';
import IMXContext from '@/contexts/IMXContext';
import useNetworkContext from '@/hooks/useNetworkContext';
import { COMICS_BURNER_CONTRACT, COMICS_CONTRACT } from '@/constants/contracts';
import { DEBUG } from '@/constants/index';
import type { Comic } from '@/types/comic';

import Machine from './_components/machine';
import MachineButton from './_components/machine-button';
import HelpDialog from './_components/help-dialog';
import ComicsGrid from './_components/comics-grid';
import SatoshiAnimations from './_components/satoshi-animations';
import ItemsGrid from './_components/items-grid';

const ComicsBurner = () => {
  const router = useRouter();
  const imx = useContext(IMXContext);
  const { address, tx, writeContracts } = useNetworkContext();
  const [isApprovedForAll, setIsApprovedForAll] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [selectedComics, setSelectedComics] = useState<Comic[]>([]);
  const [itemCounts, setItemsCounts] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [burnCount, setBurnCount] = useState([0, 0, 0, 0, 0, 0]);
  const [burning, setBurning] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const burnDisabled = !imx.registeredUser || burning || selectedComics.length < 1 || burnCount.every(c => !c);

  useEffect(() => {
    if (imx.itemsBalance) {
      setItemsCounts(imx.itemsBalance.map(it => it.balance || 0));
    }
  }, [imx.itemsBalance]);

  useEffect(() => {
    const getAllowance = async () => {
      const burnContract = writeContracts[COMICS_BURNER_CONTRACT];
      const burnContractAddress = await burnContract.getAddress();
      const comicsContract = writeContracts[COMICS_CONTRACT];
      const approved = (await comicsContract.isApprovedForAll(address as AddressLike, burnContractAddress)) as boolean;
      setIsApprovedForAll(approved);
    };
    if (writeContracts && writeContracts[COMICS_BURNER_CONTRACT] && writeContracts[COMICS_CONTRACT]) {
      // eslint-disable-next-line no-void
      void getAllowance();
    }
  }, [address, writeContracts]);

  const handleSetApproval = useCallback(async () => {
    const burnContract = writeContracts[COMICS_BURNER_CONTRACT];
    if (!isApprovedForAll) {
      const burnContractAddress = await burnContract.getAddress();
      const comicsContract = writeContracts[COMICS_CONTRACT];
      await tx(comicsContract.setApprovalForAll(burnContractAddress, true));
    }
  }, [isApprovedForAll, tx, writeContracts]);

  const handleBurn = useCallback(async () => {
    if (!isApprovedForAll) await handleSetApproval();
    setBurning(true);
    // eslint-disable-next-line no-console
    if (DEBUG) console.log('burn comics', burnCount);
    const burnContract = writeContracts[COMICS_BURNER_CONTRACT];
    const res = await tx(burnContract.burnComics(burnCount));
    setBurning(false);
    if (res) {
      setSelectedComics([]);
      const keyCount = burnCount.some(v => v === 0) ? 0 : Math.min(...burnCount);
      setItemsCounts([
        (itemCounts[0] ?? 0) + (burnCount[0] ?? 0) - keyCount,
        (itemCounts[1] ?? 0) + (burnCount[1] ?? 0) - keyCount,
        (itemCounts[2] ?? 0) + (burnCount[2] ?? 0) - keyCount,
        (itemCounts[3] ?? 0) + (burnCount[3] ?? 0) - keyCount,
        (itemCounts[4] ?? 0) + (burnCount[4] ?? 0) - keyCount,
        (itemCounts[5] ?? 0) + (burnCount[5] ?? 0) - keyCount,
        (itemCounts[6] ?? 0) + keyCount,
      ]);
      setBurnCount([0, 0, 0, 0, 0, 0]);
      setTimeout(() => setRefreshKey(Math.random() + 1), 5000);
    }
  }, [burnCount, handleSetApproval, isApprovedForAll, itemCounts, tx, writeContracts]);

  const handleReturnPage = () => router.push('/dashboard/items');

  return (
    <>
      <Button variant="contained" sx={{ height: 28 }} onClick={handleReturnPage}>
        ← Back to Comics &amp; Items
      </Button>
      <Machine burnDisabled={burnDisabled} selectedComics={selectedComics} />
      <MachineButton
        disabled={imx.registeredUser}
        height={25}
        name="Connect Wallet"
        onClick={imx.linkSetup}
        width={135}
        top={45}
        left={-200}
      />
      <HelpDialog open={helpDialogOpen} setOpen={setHelpDialogOpen} />
      <MachineButton
        height={20}
        name="Help Button"
        onClick={() => setHelpDialogOpen(true)}
        width={120}
        top={100}
        left={220}
      />
      <ComicsGrid
        selectedComics={selectedComics}
        setBurnCount={setBurnCount}
        burnCount={burnCount}
        setSelectedComics={setSelectedComics}
        refreshKey={refreshKey}
      />
      <SatoshiAnimations burning={burning} />
      <MachineButton
        disabled={burnDisabled}
        height={48}
        name="Burn Button"
        onClick={handleBurn}
        width={360}
        top={850}
        left={0}
      />
      <ItemsGrid itemCounts={itemCounts} />
    </>
  );
};

export default ComicsBurner;
