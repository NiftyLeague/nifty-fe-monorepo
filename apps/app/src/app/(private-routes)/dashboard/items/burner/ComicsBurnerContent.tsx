'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
import { type AddressLike } from 'ethers'
import { useRouter } from 'next/navigation'
import { Button } from '@nl/ui/base/button'

import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import useNetworkContext from '@/hooks/useNetworkContext'
import { COMICS_BURNER_CONTRACT, MARKETPLACE_CONTRACT } from '@/constants/contracts'
import { DEBUG } from '@/constants/index'
import type { Comic } from '@/types/marketplace'

import Machine from './_components/machine'
import MachineButton from './_components/machine-button'
import HelpDialog from './_components/help-dialog'
import ComicsGrid from './_components/comics-grid'
import SatoshiAnimations from './_components/satoshi-animations'
import ItemsGrid from './_components/items-grid'

// TODO: Config Signer for MARKETPLACE_CONTRACT or add to writeContracts

const ComicsBurnerContent = () => {
  const router = useRouter()
  const { itemsBalances, refreshItemsBalances } = useNFTsBalances()
  const { address, tx, writeContracts } = useNetworkContext()
  const [isApprovedForAll, setIsApprovedForAll] = useState(false)
  const [helpDialogOpen, setHelpDialogOpen] = useState(false)
  const [selectedComics, setSelectedComics] = useState<Comic[]>([])
  const [burnCount, setBurnCount] = useState([0, 0, 0, 0, 0, 0])
  const [burning, setBurning] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const burnDisabled = burning || selectedComics.length < 1 || burnCount.every((c) => !c)

  const itemCounts = useMemo(() => {
    if (itemsBalances.length) {
      return itemsBalances.map((it) => it.balance || 0)
    }
    return [0, 0, 0, 0, 0, 0, 0]
  }, [itemsBalances])

  useEffect(() => {
    const getAllowance = async () => {
      const burnContract = writeContracts[COMICS_BURNER_CONTRACT]
      const burnContractAddress = await burnContract.getAddress()
      const comicsContract = writeContracts[MARKETPLACE_CONTRACT]
      const approved = (await comicsContract.isApprovedForAll(
        address as AddressLike,
        burnContractAddress
      )) as boolean
      setIsApprovedForAll(approved)
    }
    if (
      writeContracts &&
      writeContracts[COMICS_BURNER_CONTRACT] &&
      writeContracts[MARKETPLACE_CONTRACT]
    ) {
      // eslint-disable-next-line no-void
      void getAllowance()
    }
  }, [address, writeContracts])

  const handleSetApproval = useCallback(async () => {
    const burnContract = writeContracts[COMICS_BURNER_CONTRACT]
    if (!isApprovedForAll) {
      const burnContractAddress = await burnContract.getAddress()
      const comicsContract = writeContracts[MARKETPLACE_CONTRACT]
      await tx(comicsContract.setApprovalForAll(burnContractAddress, true))
    }
  }, [isApprovedForAll, tx, writeContracts])

  const handleBurn = useCallback(async () => {
    if (!isApprovedForAll) await handleSetApproval()
    setBurning(true)
    // eslint-disable-next-line no-console
    if (DEBUG) console.log('burn comics', burnCount)
    const burnContract = writeContracts[COMICS_BURNER_CONTRACT]
    const res = await tx(burnContract.burnComics(burnCount))
    setBurning(false)
    if (res) {
      setSelectedComics([])
      refreshItemsBalances()
      setBurnCount([0, 0, 0, 0, 0, 0])
      setTimeout(() => setRefreshKey((key) => key + 1), 5000)
    }
  }, [burnCount, handleSetApproval, isApprovedForAll, refreshItemsBalances, tx, writeContracts])

  const handleReturnPage = () => router.push('/dashboard/items')

  return (
    <>
      <Button variant="default" className="h-7" onClick={handleReturnPage}>
        ← Back to Comics &amp; Items
      </Button>
      <Machine burnDisabled={burnDisabled} selectedComics={selectedComics} />
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
  )
}

export default ComicsBurnerContent
