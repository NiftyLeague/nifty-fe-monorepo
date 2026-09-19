import { createMemo, For, Show, type JSX } from 'solid-js'
import { useRouter } from '@/runtime/navigation'
import { Button } from '@nl/ui/base/button'

import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import WearableItemCard from '@/components/cards/WearableItemCard'
import SectionSlider from '@/components/sections/SectionSlider'
import EmptyState from '@/components/EmptyState'
import ComicPlaceholder from '@/components/cards/Skeleton/ComicPlaceholder'
import { ITEM_PURCHASE_URL } from '@/constants/url'

const MyItems = (): JSX.Element => {
  const router = useRouter()
  const nfts = useNFTsBalances()
  const filteredItems = createMemo(() =>
    nfts.itemsBalances.filter((item) => item.balance && item.balance > 0)
  )

  const settings = {
    slidesToShow: 5,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 4 } },
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 6 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 640, settings: { slidesToShow: 3 } },
    ],
  }

  return (
    <>
      <SectionSlider
        isSlider={filteredItems().length > 0}
        firstSection
        title="My Items"
        variant="h3"
        sliderSettingsOverride={settings}
        actions={
          <Button variant="outline" onClick={() => router.push('/dashboard/items')}>
            View All Items
          </Button>
        }
      >
        <Show
          when={!nfts.loadingItems}
          fallback={
            <div class="px-1">
              <ComicPlaceholder />
            </div>
          }
        >
          <Show
            when={filteredItems().length > 0}
            fallback={
              <div class="flex items-center justify-center">
                <a href={ITEM_PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                  <EmptyState
                    message="No Items found. Please check your address or go purchase some if you have not done so already!"
                    buttonText="Buy Items"
                  />
                </a>
              </div>
            }
          >
            <For each={filteredItems()}>
              {(item) => (
                <div class="px-1">
                  <WearableItemCard data={item} />
                </div>
              )}
            </For>
          </Show>
        </Show>
      </SectionSlider>
    </>
  )
}

export default MyItems
