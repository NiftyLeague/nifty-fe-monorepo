import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { DeferredAnimatedImage } from '@nl/ui/custom/deferred-animated-image'

import { ITEMS } from '@/constants/marketplace'
import useNFTsBalances from '@/hooks/balances/useNFTsBalances'

import styles from './items-grid.module.css'

export default function ItemsGrid({ itemCounts }: { itemCounts: number[] }) {
  const { loadingItems } = useNFTsBalances()
  const citadelKey = ITEMS[6]

  if (!citadelKey) return null

  return loadingItems ? (
    <DeferredSkeleton class="absolute left-0 right-0 top-237.5 mx-auto h-100.75 w-78.75 rounded-none" />
  ) : (
    <div class="absolute left-0 right-0 top-237.5 mx-auto w-78.75">
      <div>ITEMS I OWN</div>
      <div class="grid grid-cols-3 gap-x-2.5">
        {ITEMS.slice(0, 6).map((item) => {
          if (item.id === null) return null

          const name =
            item.title === 'Purple Bat'
              ? 'NL PURPLE'
              : item.title.toUpperCase().replace(/ BAT$| CHARACTER$/, '')

          return (
            <div>
              <DeferredAnimatedImage
                src={item.thumbnail ?? item.image}
                animatedSrc={item.imageWebp}
                animatedType="image/webp"
                fallbackAnimatedSrc={item.image}
                fallbackAnimatedType="image/gif"
                alt={name}
                deferAnimation
                activationDelay={1000}
                loading="lazy"
                width={98}
                height={98}
                class="w-full h-auto"
                unoptimized
              />
              <div class={styles.titleWrap}>
                <div class={styles.title}>
                  <span>{name}</span>
                  <span>x{itemCounts[item.id - 1]}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div class="text-center">
        <DeferredAnimatedImage
          src={citadelKey.thumbnail ?? citadelKey.image}
          animatedSrc={citadelKey.imageWebp}
          animatedType="image/webp"
          fallbackAnimatedSrc={citadelKey.image}
          fallbackAnimatedType="image/gif"
          unoptimized
          alt="CITADEL KEY"
          deferAnimation
          activationDelay={1000}
          loading="lazy"
          width={98}
          height={98}
          class="w-31/100 h-auto"
        />
        <div class={`${styles.title} w-35/100 mx-auto`}>
          <span>CITADEL KEY</span>
          <span>x{itemCounts[6]}</span>
        </div>
      </div>
    </div>
  )
}
