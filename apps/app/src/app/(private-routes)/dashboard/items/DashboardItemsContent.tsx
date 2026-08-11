'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
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

const DashboardComicsPageContent = (): React.ReactNode => {
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [selectedSubIndex, setSelectedSubIndex] = useState<number>(-1)
  const { comicsBalances, loadingComics, itemsBalances, loadingItems } = useNFTsBalances()
  const isSmallScreen = useMediaQuery('(max-width:1280px)')

  const handleViewComic = (comic: Comic) => {
    setSelectedComic(comic)
  }

  const handleViewItem = (item: Item) => {
    removeSubItemSelection()
    setSelectedItem(item)
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

  const renderComics = useMemo(() => {
    if (comicsBalances.length === 0 && loadingComics) {
      return Array.from({ length: 6 }, (_, index) => (
        <div key={`comic-placeholder-${index}`}>
          <ComicPlaceholder />
        </div>
      ))
    } else if (comicsBalances.length > 0) {
      return comicsBalances.map((comic) => (
        <div key={comic.id}>
          <ComicCard
            data={comic}
            onViewComic={() => handleViewComic(comic)}
            isSelected={comic.id === selectedComic?.id}
          />
        </div>
      ))
    }
    return null
  }, [comicsBalances, loadingComics, selectedComic])

  const renderItems = useMemo(() => {
    if (itemsBalances.length === 0 && loadingItems) {
      return Array.from({ length: 6 }, (_, index) => (
        <div key={`item-placeholder-${index}`}>
          <ComicPlaceholder />
        </div>
      ))
    } else if (itemsBalances.length > 0) {
      return itemsBalances
        .filter(
          (item) =>
            !selectedItem?.balance || selectedItem?.balance <= 1 || item.id !== selectedItem?.id
        )
        .map((item) => (
          <div key={item.id}>
            <WearableItemCard
              data={item}
              onViewItem={() => handleViewItem(item)}
              isSelected={item.id === selectedItem?.id}
            />
          </div>
        ))
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsBalances, loadingItems, selectedItem])

  const renderSubItems = useMemo(() => {
    if (!selectedItem?.balance || selectedItem?.balance <= 1) return null
    return Array.from(Array(selectedItem?.balance).keys()).map((itemIndex) => (
      <div key={`WearableSubItem-${itemIndex}`}>
        <WearableSubItemCard
          data={selectedItem}
          itemIndex={itemIndex}
          onViewItem={() => handleViewSubItem(itemIndex)}
          isSelected={itemIndex === selectedSubIndex}
          sx={{ height: '100%', justifyContent: 'center' }}
        />
      </div>
    ))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem, selectedSubIndex])

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-10">
          <SectionSlider firstSection title="My Comics" isSlider={false}>
            <div>
              <div
                onClick={removeComicSelection}
                className="flex flex-wrap gap-4 min-h-[375px] w-full border border-border rounded-md bg-muted px-4 py-6 justify-between sm:justify-normal"
              >
                {renderComics}
                {comicsBalances.length > 0 && (
                  <div>
                    <Link href={COMICS_PURCHASE_URL} target="_blank" rel="noreferrer">
                      <BuyCard
                        onBuy={() => {}}
                        isNew={!comicsBalances.some((comic) => comic.balance && comic.balance > 0)}
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SectionSlider>
          {!isSmallScreen && (
            <div className="mt-15">
              <ComicDetail data={selectedComic} />
            </div>
          )}
        </div>
        <div className="flex flex-row gap-10">
          <SectionSlider firstSection title="My Items" isSlider={false}>
            <div>
              <div
                onClick={removeItemSelection}
                className="flex flex-col gap-6 min-h-[375px] w-full border border-border rounded-md bg-muted px-4 pt-8 pb-4"
              >
                {selectedItem?.balance && selectedItem?.balance > 1 && (
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4 md:flex-row md:gap-20">
                      <WearableItemCard data={selectedItem} />
                      <div className="flex flex-wrap gap-5">{renderSubItems}</div>
                    </div>
                    <Separator className="bg-[#363636] opacity-60" />
                  </div>
                )}
                <div className="flex flex-wrap gap-4 justify-between sm:justify-normal">
                  {renderItems}
                  {itemsBalances.length > 0 && (
                    <div>
                      <Link href={ITEM_PURCHASE_URL} target="_blank" rel="noreferrer">
                        <BuyCard
                          onBuy={() => {}}
                          isNew={!itemsBalances.some((it) => it.balance && it.balance > 0)}
                        />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SectionSlider>
          {!isSmallScreen && (
            <div className="mt-15">
              <ItemDetail data={selectedItem} subIndex={selectedSubIndex} />
            </div>
          )}
        </div>
      </div>
      {isSmallScreen && (
        <ViewComicDialog
          comic={selectedComic}
          open={Boolean(selectedComic)}
          onClose={handleCloseComicDialog}
        />
      )}
      {isSmallScreen && (
        <ViewItemDialog
          item={selectedItem}
          subIndex={selectedSubIndex}
          open={
            Boolean(selectedItem) &&
            !!selectedItem?.balance &&
            (selectedItem?.balance === 1 || selectedSubIndex >= 0)
          }
          onClose={handleCloseItemDialog}
        />
      )}
    </>
  )
}

export default DashboardComicsPageContent
