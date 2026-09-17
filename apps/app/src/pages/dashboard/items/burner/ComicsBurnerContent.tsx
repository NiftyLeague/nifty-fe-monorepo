import { createSignal, createMemo, onCleanup } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import { Button } from '@nl/ui/base/button'

import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import useNetworkContext from '@/hooks/useNetworkContext'
import { COMICS_BURNER_CONTRACT, MARKETPLACE_CONTRACT } from '@/constants/contracts'
import { getContractABI, getContractAddress } from '@/constants/contracts'
import { TARGET_NETWORK } from '@/constants/networks'
import { useReadContract } from '@/runtime/wagmi'
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

  // Public view read through the shared query cache: no ethers contract
  // instance or provider round-trip, deduped across remounts.
  const burnerAddress = getContractAddress(
    TARGET_NETWORK.chainId,
    COMICS_BURNER_CONTRACT
  ) as `0x${string}`
  const marketplaceAddress = getContractAddress(
    TARGET_NETWORK.chainId,
    MARKETPLACE_CONTRACT
  ) as `0x${string}`
  const approvalQuery = useReadContract(() => ({
    address: marketplaceAddress,
    abi: getContractABI(TARGET_NETWORK.chainId, MARKETPLACE_CONTRACT),
    functionName: 'isApprovedForAll',
    args: network.address ? [network.address, burnerAddress] : [],
    chainId: TARGET_NETWORK.chainId,
    query: { enabled: Boolean(network.address), staleTime: 30_000 },
  }))
  const isApprovedForAll = () => approvalQuery.data === true

  const handleSetApproval = async () => {
    if (!isApprovedForAll()) {
      await network.write({
        address: marketplaceAddress,
        abi: getContractABI(TARGET_NETWORK.chainId, MARKETPLACE_CONTRACT),
        functionName: 'setApprovalForAll',
        args: [network.address, burnerAddress],
      })
      // The fresh approval flips this read; refetch instead of waiting for
      // the staleTime to lapse.
      void approvalQuery.refetch()
    }
  }

  const handleBurn = async () => {
    if (!isApprovedForAll()) await handleSetApproval()
    setBurning(true)
    if (DEBUG) console.log('burn comics', burnCount())
    const txHash = await network.write({
      address: burnerAddress,
      abi: getContractABI(TARGET_NETWORK.chainId, COMICS_BURNER_CONTRACT),
      functionName: 'burnComics',
      args: [burnCount()],
    })
    setBurning(false)
    if (txHash) {
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
