import Image from 'next/image'

import { DEGEN_BASE_SPRITE_URL, LEGGIES } from '@/constants/degen-assets'

import DegenViewsRouteBoundary from './components/DegenViewsRouteBoundary'
import styles from './gltf.module.css'

interface DegenViewsPageProps {
  params: Promise<{ tokenId: string }>
}

export default async function DegenViewsPage({ params }: DegenViewsPageProps) {
  const { tokenId } = await params
  const imageSrc = `/img/degens/nfts/${tokenId}.${LEGGIES.includes(Number(tokenId)) ? 'gif' : 'webp'}`
  const spriteSrc = `${DEGEN_BASE_SPRITE_URL}/${tokenId}.gif`

  return (
    <DegenViewsRouteBoundary
      tokenId={tokenId}
      initialImage={
        <Image
          alt="NiftyDegen 2D NFT"
          className={styles.image}
          width={584}
          height={640}
          priority
          src={imageSrc}
          unoptimized={imageSrc.includes('.gif')}
        />
      }
      spriteImage={
        <Image alt="Degen Sprite" className={styles.sprite} fill unoptimized src={spriteSrc} />
      }
      logo={
        <Image
          alt="Nifty League Logo"
          width={200}
          height={70}
          style={{ maxWidth: '24vw', height: 'auto' }}
          src="/img/logos/NL/wordmark.webp"
        />
      }
    />
  )
}
