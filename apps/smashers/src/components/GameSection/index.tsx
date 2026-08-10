import Image from 'next/image'
import { AnimatedWrapper } from '@nl/ui/custom/animated-wrapper'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'

const GameSection = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-col">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-12 lg:col-span-6">
          <div className="text-center lg:text-left mb-6">
            <AnimatedWrapper>
              <h2 className="transition-vertical-fade transition-vertical-fade-start delay-lite">
                FREE-TO-PLAY
                <br />
                <span className="font-default font-normal">PARTY PLATFORM FIGHTER</span>
              </h2>
            </AnimatedWrapper>
          </div>
          <div className="text-center lg:text-left">
            <AnimatedWrapper>
              <p className="leading-relaxed transition-vertical-fade transition-vertical-fade-start delay-normal">
                Nifty Smashers is an <strong className="font-semibold">online multiplayer</strong>{' '}
                that blends elements of a{' '}
                <strong className="font-semibold">casual party survival</strong> experience with the
                fast-paced action of a <strong className="font-semibold">platform fighter</strong>!
                <br />
                <br />
                Play on iOS, Android, and Steam with{' '}
                <strong className="font-semibold">full cross-play support</strong>! Jump in and
                brawl anytime, anywhere!
              </p>
            </AnimatedWrapper>
          </div>
        </div>
        <div className="md:col-span-12 lg:col-span-6">
          <AnimatedWrapper>
            <div className="transition-quick-pop transition-quick-pop-start delay-lite overflow-hidden rounded-[40px]">
              <ViewportVideo
                id="level-video"
                className="h-auto w-full"
                muted
                loop
                playsInline
                data-keepplaying
                src="/video/rocket.mp4"
              />
            </div>
          </AnimatedWrapper>
        </div>
      </div>
      <AnimatedWrapper>
        <div className="my-10 text-center transition-fade-slow transition-fade-start delay-lite">
          <Image
            src="/img/games/smashers/party_modes.gif"
            alt="Smashers Party Modes"
            width={1350}
            height={556}
            className="w-full h-auto rounded-[40px]"
            unoptimized
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 1350px"
          />
        </div>
      </AnimatedWrapper>
    </div>
  )
}

export default GameSection
