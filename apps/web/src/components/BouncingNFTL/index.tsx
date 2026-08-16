import { DesktopOnlyImage } from '@nl/ui/custom/responsive-only-image'

type TokenName = 'token1' | 'token2' | 'token3'

interface ComponentProps {
  visibleTokens?: readonly TokenName[]
}

const TOKEN_CONFIG = {
  token1: {
    wrapperClassName:
      'absolute left-[-100px] top-[calc(50%-160px)] w-[165px] h-[160px] 2xl:left-[-226px] 2xl:w-[226px] 2xl:h-[223px]',
    animationClassName: 'animate-bounce-coin1',
    src: '/img/compete-and-earn/animated/token-1.webp',
    alt: 'Bouncing NFTL Left',
    width: 226,
    height: 223,
    sizes: '226px',
  },
  token2: {
    wrapperClassName:
      'absolute right-[-80px] top-0 w-[180px] h-[185px] 2xl:w-[226px] 2xl:h-[221px]',
    animationClassName: 'animate-bounce-coin2',
    src: '/img/compete-and-earn/animated/token-2.webp',
    alt: 'Bouncing NFTL Right',
    width: 226,
    height: 221,
    sizes: '226px',
  },
  token3: {
    wrapperClassName: 'absolute bottom-[-500px] left-[calc(50%-100px)] w-[246px]',
    animationClassName: 'animate-bounce-coin3',
    src: '/img/compete-and-earn/animated/token-3.webp',
    alt: 'Bouncing NFTL Bottom',
    width: 246,
    height: 96,
    sizes: '246px',
  },
} satisfies Record<
  TokenName,
  {
    wrapperClassName: string
    animationClassName: string
    src: string
    alt: string
    width: number
    height: number
    sizes: string
  }
>

const DEFAULT_VISIBLE_TOKENS: readonly TokenName[] = ['token1', 'token2', 'token3']

function BouncingToken({ token }: { token: TokenName }) {
  const config = TOKEN_CONFIG[token]

  return (
    <div className={config.wrapperClassName}>
      <div>
        <div className={`${config.animationClassName} transition-fade`}>
          <DesktopOnlyImage
            src={config.src}
            alt={config.alt}
            width={config.width}
            height={config.height}
            className="w-full h-auto"
            sizes={config.sizes}
          />
        </div>
      </div>
    </div>
  )
}

const BouncingNFTL = ({
  visibleTokens = DEFAULT_VISIBLE_TOKENS,
}: ComponentProps): React.ReactNode => (
  <>
    {visibleTokens.map((token) => (
      <BouncingToken key={token} token={token} />
    ))}
  </>
)

export default BouncingNFTL
