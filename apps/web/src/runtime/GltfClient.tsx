import OptimizedImage from '@nl/ui/custom/optimized-image'
import { DEGEN_BASE_SPRITE_URL } from '@/constants/degen-assets'
import styles from '@/app/(special-routes)/gltf/[tokenId]/gltf.module.css'
import DegenViews from '@/app/(special-routes)/gltf/[tokenId]/components/DegenViews'

export default function GltfClient() {
  const match = /^\/gltf\/(\d{1,12})\/?$/.exec(window.location.pathname)
  if (!match) return <p role="alert">Invalid token</p>
  const tokenId = match[1]
  return (
    <DegenViews
      tokenId={tokenId}
      initialImage={null}
      spriteImage={
        <div className={styles.sprite__wrapper}>
          <OptimizedImage
            alt="Degen Sprite"
            className={styles.sprite}
            fill
            sizes="100vw"
            unoptimized
            src={`${DEGEN_BASE_SPRITE_URL}/${tokenId}.gif`}
          />
        </div>
      }
      logo={
        <OptimizedImage
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
