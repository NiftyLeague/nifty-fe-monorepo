import { ParallaxWrapper } from '@nl/ui/custom/parallax-wrapper'
import NativeImage from '@nl/ui/custom/native-image'

const MintOMatic = () => {
  return (
    <>
      <ParallaxWrapper parallaxDirection="down" parallaxIntensity="normal">
        <div class="relative">
          <NativeImage
            src="https://cdn.niftyleague.com/media/img/mint-o-matic/animated/top.webp"
            alt="NFTL Token Top"
            width={1470}
            height={1778}
            loading="lazy"
            decoding="async"
            class="pixelated w-full h-auto"
          />
        </div>
      </ParallaxWrapper>
      <div class="absolute home-nftl-token-image grow">
        <NativeImage
          src="https://cdn.niftyleague.com/media/img/mint-o-matic/animated/nftl-token-coin.webp"
          alt="NFTL Token Coin"
          width={1470}
          height={1778}
          loading="lazy"
          decoding="async"
          class="pixelated w-full h-auto"
        />
      </div>
      <div class="absolute animate-blink home-nftl-token-image grow">
        <NativeImage
          src="https://cdn.niftyleague.com/media/img/mint-o-matic/animated/nftl-token-tears.webp"
          alt="NFTL Token Tears"
          width={1470}
          height={1778}
          loading="eager"
          fetchpriority="high"
          decoding="async"
          class="pixelated w-full h-auto"
        />
      </div>
      <ParallaxWrapper parallaxDirection="left" parallaxIntensity="normal">
        <div class="parallax-child absolute home-nftl-token-image home-nftl-token-bottom-image grow">
          <NativeImage
            src="https://cdn.niftyleague.com/media/img/mint-o-matic/animated/bottom.webp"
            alt="NFTL Token Bottom"
            width={1470}
            height={1778}
            loading="lazy"
            decoding="async"
            class="pixelated w-full h-auto"
          />
        </div>
      </ParallaxWrapper>
    </>
  )
}

export default MintOMatic
