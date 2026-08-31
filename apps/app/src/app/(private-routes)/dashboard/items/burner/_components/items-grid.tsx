import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'
import { AnimatedImage } from '@nl/ui/custom/animated-image'

import useNFTsBalances from '@/hooks/balances/useNFTsBalances'

import styles from './items-grid.module.css'

const ITEMS = [
  { id: 1, name: 'CAPE', image: '/img/items/full/1.gif', imageWebp: '/img/items/full/1.webp' },
  { id: 2, name: 'HALO', image: '/img/items/full/2.gif', imageWebp: '/img/items/full/2.webp' },
  {
    id: 3,
    name: 'DIAMOND',
    image: '/img/items/full/3.gif',
    imageWebp: '/img/items/full/3.webp',
  },
  { id: 4, name: 'BREAD', image: '/img/items/full/4.gif', imageWebp: '/img/items/full/4.webp' },
  {
    id: 5,
    name: 'NL PURPLE',
    image: '/img/items/full/5.gif',
    imageWebp: '/img/items/full/5.webp',
  },
  {
    id: 6,
    name: 'COMPANION',
    image: '/img/items/full/6.gif',
    imageWebp: '/img/items/full/6.webp',
  },
]

export default function ItemsGrid({ itemCounts }: { itemCounts: number[] }) {
  const { loadingItems } = useNFTsBalances()

  return loadingItems ? (
    <DeferredSkeleton className="absolute left-0 right-0 top-[950px] mx-auto h-[403px] w-[315px] rounded-none" />
  ) : (
    <div className="absolute left-0 right-0 top-[950px] mx-auto w-[315px]">
      <div>ITEMS I OWN</div>
      <div className="grid grid-cols-3 gap-x-2.5">
        {ITEMS.map((item) => (
          <div key={item.id}>
            <AnimatedImage
              src={item.image}
              animatedSrc={item.imageWebp}
              animatedType="image/webp"
              alt={item.name}
              loading="lazy"
              width={98}
              height={98}
              style={{ width: '100%', height: 'auto' }}
              unoptimized
            />
            <div className={styles.titleWrap}>
              <div className={styles.title}>
                <span>{item.name}</span>
                <span>x{itemCounts[item.id - 1]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>
        <AnimatedImage
          src="/img/items/full/7.gif"
          animatedSrc="/img/items/full/7.webp"
          animatedType="image/webp"
          unoptimized
          alt="CITADEL KEY"
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
