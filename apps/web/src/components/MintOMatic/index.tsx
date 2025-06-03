import Image from 'next/image';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const MintOMatic = () => {
  return (
    <>
      <AnimatedWrapper parallax parallaxDirection="top" transitionAmount="medium">
        <div className="position-relative">
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
      </AnimatedWrapper>
      <AnimatedWrapper>
        <div className="position-absolute home-nftl-token-image flex-grow-1">
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
      </AnimatedWrapper>
      <AnimatedWrapper>
        <div className="position-absolute animation-visible home-nftl-token-image flex-grow-1">
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
      </AnimatedWrapper>
      <AnimatedWrapper parallax parallaxDirection="right" transitionAmount="medium">
        <div className="parallax-child position-absolute home-nftl-token-image home-nftl-token-bottom-image flex-grow-1">
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
      </AnimatedWrapper>
    </>
  );
};

export default MintOMatic;
