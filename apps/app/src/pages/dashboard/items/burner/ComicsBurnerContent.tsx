import { createEffect, createSignal, createMemo, onCleanup } from 'solid-js'
import { type AddressLike } from 'ethers'
import { useRouter } from '@/runtime/navigation'
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
  const nfts = useNFTsBalances()
  const network = useNetworkContext()
  const [isApprovedForAll, setIsApprovedForAll] = createSignal(false)
  const [helpDialogOpen, setHelpDialogOpen] = createSignal(false)
  const [selectedComics, setSelectedComics] = createSignal<Comic[]>([])
  const [burnCount, setBurnCount] = createSignal<number[]>([0, 0, 0, 0, 0, 0])
  const [burning, setBurning] = createSignal(false)
  const [refreshKey, setRefreshKey] = createSignal(0)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  onCleanup(() => clearTimeout(refreshTimer))
  const burnDisabled = () =>
    burning() || selectedComics().length < 1 || burnCount().every((c) => !c)

  const itemCounts = createMemo(() => {
    if (nfts.itemsBalances.length) {
      return nfts.itemsBalances.map((it) => it.balance || 0)
    }
    return [0, 0, 0, 0, 0, 0, 0]
  })

  createEffect(() => {
    const writeContracts = network.writeContracts
    const address = network.address
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
      writeContracts[MARKETPLACE_CONTRACT] &&
      address
    ) {
      void getAllowance()
    }
  })

  const handleSetApproval = async () => {
    const writeContracts = network.writeContracts
    const burnContract = writeContracts[COMICS_BURNER_CONTRACT]
    if (!isApprovedForAll()) {
      const burnContractAddress = await burnContract.getAddress()
      const comicsContract = writeContracts[MARKETPLACE_CONTRACT]
      await network.tx(comicsContract.setApprovalForAll(burnContractAddress, true))
    }
  }

  const handleBurn = async () => {
    if (!isApprovedForAll()) await handleSetApproval()
    setBurning(true)
    if (DEBUG) console.log('burn comics', burnCount())
    const burnContract = network.writeContracts[COMICS_BURNER_CONTRACT]
    const res = await network.tx(burnContract.burnComics(burnCount()))
    setBurning(false)
    if (res) {
      setSelectedComics([])
      nfts.refreshItemsBalances()
      setBurnCount([0, 0, 0, 0, 0, 0])
      refreshTimer = setTimeout(() => setRefreshKey((key) => key + 1), 5000)
    }
  }

  const handleReturnPage = () => router.push('/dashboard/items')

  return (
    <>
      <Button variant="default" class="h-7" onClick={handleReturnPage}>
        ← Back to Comics &amp; Items
      </Button>
      <Machine burnDisabled={burnDisabled()} selectedComics={selectedComics()} />
      <HelpDialog open={helpDialogOpen()} setOpen={setHelpDialogOpen} />
      <MachineButton
        height={20}
        name="Help Button"
        onClick={() => setHelpDialogOpen(true)}
        width={120}
        top={100}
        left={220}
      />
      <ComicsGrid
        selectedComics={selectedComics()}
        setBurnCount={setBurnCount}
        burnCount={burnCount()}
        setSelectedComics={setSelectedComics}
        refreshKey={refreshKey()}
      />
      <SatoshiAnimations burning={burning()} />
      <MachineButton
        disabled={burnDisabled()}
        height={48}
        name="Burn Button"
        onClick={() => void handleBurn()}
        width={360}
        top={850}
        left={0}
      />
      <ItemsGrid itemCounts={itemCounts()} />
    </>
  )
}

export default ComicsBurnerContent
