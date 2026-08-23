import { ParallaxWrapper } from '@nl/ui/custom/parallax-wrapper'
import NativeImage from '@nl/ui/custom/native-image'

const MintOMatic = () => {
  return (
    <>
      <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
        <div className="relative">
          <NativeImage
            src="/img/mint-o-matic/animated/top.webp"
            alt="NFTL Token Top"
            width={1470}
            height={1778}
            loading="lazy"
            decoding="async"
            className="pixelated"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </ParallaxWrapper>
      <div className="absolute home-nftl-token-image flex-grow">
        <NativeImage
          src="/img/mint-o-matic/animated/nftl-token-coin.webp"
          alt="NFTL Token Coin"
          width={1470}
          height={1778}
          loading="lazy"
          decoding="async"
          className="pixelated"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="absolute animate-blink home-nftl-token-image flex-grow">
        <NativeImage
          src="/img/mint-o-matic/animated/nftl-token-tears.webp"
          alt="NFTL Token Tears"
          width={1470}
          height={1778}
          loading="lazy"
          decoding="async"
          className="pixelated"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <ParallaxWrapper parallaxDirection="left" parallaxIntensity="normal">
        <div className="parallax-child absolute home-nftl-token-image home-nftl-token-bottom-image flex-grow">
          <NativeImage
            src="/img/mint-o-matic/animated/bottom.webp"
            alt="NFTL Token Bottom"
            width={1470}
            height={1778}
            loading="lazy"
            decoding="async"
            className="pixelated"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </ParallaxWrapper>
    </>
  )
}

export default MintOMatic
