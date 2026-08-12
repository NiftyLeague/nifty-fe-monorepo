import Image from 'next/image'
import { ParallaxWrapper } from '@nl/ui/custom/parallax-wrapper'

const MintOMatic = () => {
  return (
    <>
      <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
        <div className="relative">
          <Image
            src="/img/mint-o-matic/animated/top.webp"
            alt="NFTL Token Top"
            width={1470}
            height={1778}
            className="pixelated"
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </ParallaxWrapper>
      <div className="absolute home-nftl-token-image flex-grow">
        <Image
          src="/img/mint-o-matic/animated/nftl-token-coin.webp"
          alt="NFTL Token Coin"
          width={1470}
          height={1778}
          className="pixelated"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="absolute animate-blink home-nftl-token-image flex-grow">
        <Image
          src="/img/mint-o-matic/animated/nftl-token-tears.webp"
          alt="NFTL Token Tears"
          width={1470}
          height={1778}
          className="pixelated"
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <ParallaxWrapper parallaxDirection="left" parallaxIntensity="normal">
        <div className="parallax-child absolute home-nftl-token-image home-nftl-token-bottom-image flex-grow">
          <Image
            src="/img/mint-o-matic/animated/bottom.webp"
            alt="NFTL Token Bottom"
            width={1470}
            height={1778}
            className="pixelated"
            sizes="100vw"
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </ParallaxWrapper>
    </>
  )
}

export default MintOMatic
