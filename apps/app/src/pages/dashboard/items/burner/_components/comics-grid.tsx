import { createMemo, For, Show } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import { Flame } from 'lucide-solid'
import { Input } from '@nl/ui/base/input'
import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

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

export default function ComicsGrid(props: {
  burnCount: number[]
  selectedComics: Comic[]
  setBurnCount: (v: number[]) => void
  setSelectedComics: (v: Comic[]) => void
  refreshKey: number
}) {
  const nfts = useNFTsBalances()
  const keyCount = createMemo(() =>
    props.burnCount.some((v) => v === 0) ? 0 : Math.min(...props.burnCount)
  )
  const itemCount = createMemo(
    () => props.burnCount.reduce((total, count) => total + count, 0) - keyCount() * 6
  )

  const handleManualSetBurnCount = (comic: Comic, value: string) => {
    const newBurnCount = [...props.burnCount]
    newBurnCount[comic.id - 1] = !value ? 0 : parseInt(value)
    props.setBurnCount(newBurnCount)
  }

  const handleUpdateBurnCount = (comic: Comic, newSelectedComics: Comic[]) => {
    const removed = !newSelectedComics.includes(comic)
    const newBurnCount = [...props.burnCount]
    if (removed) {
      newBurnCount[comic.id - 1] = 0
    } else {
      const comicCount = nfts.comicsBalances.find((c) => c.id === comic.id)?.balance || 0
      newBurnCount[comic.id - 1] = comicCount
    }
    props.setBurnCount(newBurnCount)
  }

  const handleSelectComic = (comic: Comic) => {
    const newSelectedComics = toggleValue(props.selectedComics, comic)
    props.setSelectedComics(newSelectedComics)
    handleUpdateBurnCount(comic, newSelectedComics)
  }

  return (
    <Show
      when={!nfts.loadingComics}
      fallback={
        <DeferredSkeleton class="absolute left-0 right-0 top-[130px] mx-auto h-[265px] w-[315px] rounded-none" />
      }
    >
      <div>
        <div class="absolute left-0 right-0 top-[130px] mx-auto w-[315px]">
          <div class="grid grid-cols-3 gap-x-2.5">
            <For each={nfts.comicsBalances}>
              {(comic) => (
                <div>
                  <NativeImage
                    src={COMPRESSED_COMIC_IMAGES[comic.id - 1] as string}
                    // srcset={`${comic.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={comic.title}
                    onClick={() => handleSelectComic(comic)}
                    width={98}
                    height={98}
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      height: 'auto',
                      ...(props.selectedComics.includes(comic) && {
                        'box-shadow': '0 0 8px rgba(81, 203, 238, 1)',
                        border: '3px solid rgba(81, 203, 238, 1)',
                      }),
                    }}
                  />
                  <div class={styles.titleWrap}>
                    <div class={styles.title}>
                      <Show
                        when={props.selectedComics.includes(comic)}
                        fallback={
                          <>
                            <span>#{comic.id}</span>
                            <span>x{comic.balance}</span>
                          </>
                        }
                      >
                        <div class="relative">
                          <Input
                            aria-label={`Burn count for ${comic.title}`}
                            value={props.burnCount[comic.id - 1]}
                            onInput={(event) => {
                              handleManualSetBurnCount(comic, event.currentTarget.value)
                            }}
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            min={0}
                            max={
                              nfts.comicsBalances.find((c) => c.id === comic.id)?.balance || 0
                            }
                            style={{
                              'text-align': 'center',
                              'padding-bottom': '2.5px',
                              'padding-left': '1.75rem',
                              'padding-right': '2.5px',
                              'padding-top': '2.5px',
                            }}
                            class="h-8 w-[98px]"
                          />
                          <Flame
                            aria-hidden="true"
                            class="pointer-events-none absolute inset-y-0 left-2 my-auto text-muted-foreground"
                            size={14}
                            stroke-width={1.5}
                          />
                        </div>
                      </Show>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
          <div class={styles.sums}>
            <span class={styles.keySum}>{keyCount()} Keys</span>
            <span class={styles.itemSum}>{itemCount()} Items</span>
          </div>
        </div>
      </div>
    </Show>
  )
}
