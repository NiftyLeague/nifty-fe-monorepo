import { createSignal, For, Show, type JSX } from 'solid-js'
import { Separator } from '@nl/ui/base/separator'
import { useMediaQuery } from '@nl/ui/hooks/useMediaQuery'

import ComicCard from '@/components/cards/ComicCard'
import ViewComicDialog from '@/components/dialog/ViewComicDialog'
import SectionSlider from '@/components/sections/SectionSlider'

import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import type { Comic, Item } from '@/types/marketplace'
import { COMICS_PURCHASE_URL, ITEM_PURCHASE_URL } from '@/constants/url'
import ComicDetail from '@/components/cards/ComicDetail'
import ComicPlaceholder from '@/components/cards/Skeleton/ComicPlaceholder'
import BuyCard from '@/components/cards/BuyCard'
import WearableItemCard from '@/components/cards/WearableItemCard'
import WearableSubItemCard from '@/components/cards/WearableSubItemCard'
import ItemDetail from '@/components/cards/ItemDetail'
import ViewItemDialog from '@/components/dialog/ViewItemDialog'

const DashboardComicsPageContent = (): JSX.Element => {
  const [selectedComic, setSelectedComic] = createSignal<Comic | null>(null)
  const [selectedItem, setSelectedItem] = createSignal<Item | null>(null)
  const [selectedSubIndex, setSelectedSubIndex] = createSignal<number>(-1)
  const nfts = useNFTsBalances()
  const isSmallScreen = useMediaQuery('(max-width:1280px)')

  const handleViewComic = (comic: Comic) => {
    setSelectedComic(() => comic)
  }

  const handleViewItem = (item: Item) => {
    removeSubItemSelection()
    setSelectedItem(() => item)
  }

  const handleViewSubItem = (index: number) => {
    setSelectedSubIndex(index)
  }

  const removeComicSelection = () => {
    setSelectedComic(null)
  }

  const removeItemSelection = () => {
    setSelectedItem(null)
    removeSubItemSelection()
  }

  const removeSubItemSelection = () => {
    setSelectedSubIndex(-1)
  }

  const handleCloseComicDialog = () => {
    removeComicSelection()
  }

  const handleCloseItemDialog = () => {
    removeItemSelection()
  }

  const renderComics = () => {
    if (nfts.comicsBalances.length === 0 && nfts.loadingComics) {
      return (
        <For each={Array.from({ length: 6 })}>
          {() => (
            <div>
              <ComicPlaceholder />
            </div>
          )}
        </For>
      )
    } else if (nfts.comicsBalances.length > 0) {
      return (
        <For each={nfts.comicsBalances}>
          {(comic) => (
            <div>
              <ComicCard
                data={comic}
                onViewComic={() => handleViewComic(comic)}
                isSelected={comic.id === selectedComic()?.id}
              />
            </div>
          )}
        </For>
      )
    }
    return null
  }

  const renderItems = () => {
    if (nfts.itemsBalances.length === 0 && nfts.loadingItems) {
      return (
        <For each={Array.from({ length: 6 })}>
          {() => (
            <div>
              <ComicPlaceholder />
            </div>
          )}
        </For>
      )
    } else if (nfts.itemsBalances.length > 0) {
      return (
        <For
          each={nfts.itemsBalances.filter(
            (item) =>
              !selectedItem()?.balance ||
              (selectedItem()?.balance ?? 0) <= 1 ||
              item.id !== selectedItem()?.id
          )}
        >
          {(item) => (
            <div>
              <WearableItemCard
                data={item}
                onViewItem={() => handleViewItem(item)}
                isSelected={item.id === selectedItem()?.id}
              />
            </div>
          )}
        </For>
      )
    }
    return null
  }

  const renderSubItems = () => {
    const item = selectedItem()
    if (!item?.balance || item.balance <= 1) return null
    return (
      <For each={Array.from(Array(item.balance).keys())}>
        {(itemIndex) => (
          <div>
            <WearableSubItemCard
              data={item}
              itemIndex={itemIndex}
              onViewItem={() => handleViewSubItem(itemIndex)}
              isSelected={itemIndex === selectedSubIndex()}
              class="h-full justify-center"
            />
          </div>
        )}
      </For>
    )
  }

  return (
    <>
      <div class="flex flex-col gap-8">
        <div class="flex flex-row gap-10">
          <SectionSlider firstSection title="My Comics" isSlider={false}>
            <div>
              <div
                onClick={removeComicSelection}
                class="flex flex-wrap gap-4 min-h-93.75 w-full border border-border rounded-md bg-muted px-4 py-6 justify-between sm:justify-normal"
              >
                {renderComics()}
                <Show when={nfts.comicsBalances.length > 0}>
                  <div>
                    <a href={COMICS_PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                      <BuyCard
                        isNew={
                          !nfts.comicsBalances.some((comic) => comic.balance && comic.balance > 0)
                        }
                      />
                    </a>
                  </div>
                </Show>
              </div>
            </div>
          </SectionSlider>
          <Show when={!isSmallScreen()}>
            <div class="mt-15">
              <ComicDetail data={selectedComic()} />
            </div>
          </Show>
        </div>
        <div class="flex flex-row gap-10">
          <SectionSlider firstSection title="My Items" isSlider={false}>
            <div>
              <div
                onClick={removeItemSelection}
                class="flex flex-col gap-6 min-h-93.75 w-full border border-border rounded-md bg-muted px-4 pt-8 pb-4"
              >
                <Show when={selectedItem()?.balance && (selectedItem()?.balance ?? 0) > 1}>
                  <div class="flex flex-col gap-8">
                    <div class="flex flex-col gap-4 md:flex-row md:gap-20">
                      <WearableItemCard data={selectedItem() as Item} />
                      <div class="flex flex-wrap gap-5">{renderSubItems()}</div>
                    </div>
                    <Separator class="bg-(--scrim) opacity-60" />
                  </div>
                </Show>
                <div class="flex flex-wrap gap-4 justify-between sm:justify-normal">
                  {renderItems()}
                  <Show when={nfts.itemsBalances.length > 0}>
                    <div>
                      <a href={ITEM_PURCHASE_URL} target="_blank" rel="noopener noreferrer">
                        <BuyCard
                          isNew={!nfts.itemsBalances.some((it) => it.balance && it.balance > 0)}
                        />
                      </a>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </SectionSlider>
          <Show when={!isSmallScreen()}>
            <div class="mt-15">
              <ItemDetail data={selectedItem()} subIndex={selectedSubIndex()} />
            </div>
          </Show>
        </div>
      </div>
      <Show when={isSmallScreen()}>
        <ViewComicDialog
          comic={selectedComic()}
          open={Boolean(selectedComic())}
          onClose={handleCloseComicDialog}
        />
      </Show>
      <Show when={isSmallScreen()}>
        <ViewItemDialog
          item={selectedItem()}
          subIndex={selectedSubIndex()}
          open={
            Boolean(selectedItem()) &&
            !!selectedItem()?.balance &&
            (selectedItem()?.balance === 1 || selectedSubIndex() >= 0)
          }
          onClose={handleCloseItemDialog}
        />
      </Show>
    </>
  )
}

export default DashboardComicsPageContent
