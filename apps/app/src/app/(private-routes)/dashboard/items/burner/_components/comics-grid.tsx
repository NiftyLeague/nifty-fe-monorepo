import { useMemo } from 'react'
import Image from 'next/image'
import { Flame } from 'lucide-react'
import { Skeleton } from '@nl/ui/base/skeleton'
import { Input } from '@nl/ui/custom/input'

import useNFTsBalances from '@/hooks/balances/useNFTsBalances'
import type { Comic } from '@/types/marketplace'
import { toggleValue } from '@/utils/collections'

import styles from './comics-grid.module.css'

const COMPRESSED_COMIC_IMAGES = [
  '/img/comics/thumbnail/1.webp',
  '/img/comics/thumbnail/2.webp',
  '/img/comics/thumbnail/3.webp',
  '/img/comics/thumbnail/4.webp',
  '/img/comics/thumbnail/5.webp',
  '/img/comics/thumbnail/6.webp',
]

export default function ComicsGrid({
  burnCount,
  selectedComics,
  setBurnCount,
  setSelectedComics,
  refreshKey,
}: {
  burnCount: number[]
  selectedComics: Comic[]
  setBurnCount: React.Dispatch<React.SetStateAction<number[]>>
  setSelectedComics: React.Dispatch<React.SetStateAction<Comic[]>>
  refreshKey: number
}) {
  const { comicsBalances, loadingComics } = useNFTsBalances()
  const keyCount = useMemo(
    () => (burnCount.some((v) => v === 0) ? 0 : Math.min(...burnCount)),
    [burnCount]
  )
  const itemCount = useMemo(
    () => burnCount.reduce((total, count) => total + count, 0) - keyCount * 6,
    [burnCount, keyCount]
  )

  const handleManualSetBurnCount = (comic: Comic, value: string) => {
    const newBurnCount = [...burnCount]
    newBurnCount[comic.id - 1] = !value ? 0 : parseInt(value)
    setBurnCount(newBurnCount)
  }

  const handleUpdateBurnCount = (comic: Comic, newSelectedComics: Comic[]) => {
    const removed = !newSelectedComics.includes(comic)
    const newBurnCount = [...burnCount]
    if (removed) {
      newBurnCount[comic.id - 1] = 0
    } else {
      const comicCount = comicsBalances.find((c) => c.id === comic.id)?.balance || 0
      newBurnCount[comic.id - 1] = comicCount
    }
    setBurnCount(newBurnCount)
  }

  const handleSelectComic = (comic: Comic) => {
    const newSelectedComics = toggleValue(selectedComics, comic)
    setSelectedComics(newSelectedComics)
    handleUpdateBurnCount(comic, newSelectedComics)
  }

  return loadingComics ? (
    <Skeleton className="absolute left-0 right-0 top-[130px] mx-auto h-[265px] w-[315px] rounded-none" />
  ) : (
    <div>
      <div className="absolute left-0 right-0 top-[130px] mx-auto w-[315px]">
        <div className="grid grid-cols-3 gap-x-2.5">
          {comicsBalances.map((comic) => (
            <div key={comic.image}>
              <Image
                src={COMPRESSED_COMIC_IMAGES[comic.id - 1] as string}
                // srcSet={`${comic.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                alt={comic.title}
                onClick={() => handleSelectComic(comic)}
                width={98}
                height={98}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  height: 'auto',
                  ...(selectedComics.includes(comic) && {
                    boxShadow: '0 0 8px rgba(81, 203, 238, 1)',
                    border: '3px solid rgba(81, 203, 238, 1)',
                  }),
                }}
              />
              <div className={styles.titleWrap}>
                <div className={styles.title}>
                  {selectedComics.includes(comic) ? (
                    <Input
                      value={burnCount[comic.id - 1]}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        handleManualSetBurnCount(comic, event.target.value)
                      }}
                      type="number"
                      startIcon={
                        <Flame aria-hidden="true" absoluteStrokeWidth size={14} strokeWidth={1.5} />
                      }
                      inputMode="numeric"
                      pattern="[0-9]*"
                      min={0}
                      max={comicsBalances.find((c) => c.id === comic.id)?.balance || 0}
                      style={{ textAlign: 'center', padding: 2.5 }}
                      className="h-8 w-[98px]"
                    />
                  ) : (
                    <>
                      <span>#{comic.id}</span>
                      <span>x{comic.balance}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sums}>
          <span className={styles.keySum}>{keyCount} Keys</span>
          <span className={styles.itemSum}>{itemCount} Items</span>
        </div>
      </div>
    </div>
  )
}
