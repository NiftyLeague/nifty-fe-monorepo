import Image from 'next/image'

import { cn } from '@nl/ui/utils'

interface ComponentProps {
  classes?: { token1?: string; token2?: string; token3?: string }
}

const BouncingNFTL = ({ classes }: ComponentProps): React.ReactNode => (
  <>
    <div
      className={cn(
        'absolute left-[-100px] top-[calc(50%-160px)] w-[165px] h-[160px] 2xl:left-[-226px] 2xl:w-[226px] 2xl:h-[223px]',
        classes?.token1
      )}
    >
      <div>
        <div className="animate-bounce-coin1 transition-fade">
          <Image
            src="/img/compete-and-earn/animated/token-1.webp"
            alt="Bouncing NFTL Left"
            width={226}
            height={223}
            className="w-full h-auto"
            sizes="226px"
          />
        </div>
      </div>
    </div>
    <div
      className={cn(
        'absolute right-[-80px] top-0 w-[180px] h-[185px] 2xl:w-[226px] 2xl:h-[221px]',
        classes?.token2
      )}
    >
      <div>
        <div className="animate-bounce-coin2 transition-fade">
          <Image
            src="/img/compete-and-earn/animated/token-2.webp"
            alt="Bouncing NFTL Right"
            width={226}
            height={221}
            className="w-full h-auto"
            sizes="226px"
          />
        </div>
      </div>
    </div>
    <div
      className={cn('absolute bottom-[-500px] left-[calc(50%-100px)] w-[246px]', classes?.token3)}
    >
      <div>
        <div className="animate-bounce-coin3 transition-fade">
          <Image
            src="/img/compete-and-earn/animated/token-3.webp"
            alt="Bouncing NFTL Bottom"
            width={246}
            height={96}
            className="w-full h-auto"
            sizes="246px"
          />
        </div>
      </div>
    </div>
  </>
)

export default BouncingNFTL
