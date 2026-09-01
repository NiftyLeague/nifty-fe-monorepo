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
    <DeferredSkeleton className="absolute left-0 right-0 top-[950px] mx-auto h-[403px] w-[315px] rounded-none" />
  ) : (
    <div className="absolute left-0 right-0 top-[950px] mx-auto w-[315px]">
      <div>ITEMS I OWN</div>
      <div className="grid grid-cols-3 gap-x-2.5">
        {ITEMS.slice(0, 6).map((item) => {
          if (item.id === null) return null

          const name =
            item.title === 'Purple Bat'
              ? 'NL PURPLE'
              : item.title.toUpperCase().replace(/ BAT$| CHARACTER$/, '')

          return (
            <div key={item.id}>
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
                style={{ width: '100%', height: 'auto' }}
                unoptimized
              />
              <div className={styles.titleWrap}>
                <div className={styles.title}>
                  <span>{name}</span>
                  <span>x{itemCounts[item.id - 1]}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ textAlign: 'center' }}>
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
          style={{ width: '31%', height: 'auto' }}
        />
        <div className={styles.title} style={{ width: '35%', margin: 'auto' }}>
          <span>CITADEL KEY</span>
          <span>x{itemCounts[6]}</span>
        </div>
      </div>
    </div>
  )
}
