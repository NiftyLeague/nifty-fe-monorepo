import { DeferredAnimatedImage } from '@nl/ui/custom/deferred-animated-image'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'

const GameSection = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-col">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-12 lg:col-span-6">
          <div className="text-center lg:text-left mb-6">
            <h2 className="transition-vertical-fade">
              FREE-TO-PLAY
              <br />
              <span className="font-default font-normal">PARTY PLATFORM FIGHTER</span>
            </h2>
          </div>
          <div className="text-center lg:text-left">
            <p className="leading-relaxed transition-vertical-fade">
              Nifty Smashers is an <strong className="font-semibold">online multiplayer</strong>{' '}
              that blends elements of a{' '}
              <strong className="font-semibold">casual party survival</strong> experience with the
              fast-paced action of a <strong className="font-semibold">platform fighter</strong>!
              <br />
              <br />
              Play on iOS, Android, and Steam with{' '}
              <strong className="font-semibold">full cross-play support</strong>! Jump in and brawl
              anytime, anywhere!
            </p>
          </div>
        </div>
        <div className="md:col-span-12 lg:col-span-6">
          <div className="transition-quick-pop overflow-hidden rounded-[40px]">
            <ViewportVideo
              id="level-video"
              className="h-auto w-full"
              deferLoad
              muted
              loop
              playsInline
              data-keepplaying
              poster="/img/games/smashers/rocket-poster.webp"
              src="/video/rocket.mp4"
            />
          </div>
        </div>
      </div>
      <DeferredAnimatedImage
        containerClassName="my-10 block text-center transition-fade-slow"
        animatedSrc="/img/games/smashers/party_modes.webp"
        animatedType="image/webp"
        animatedMedia="(prefers-reduced-motion: no-preference)"
        src="/img/games/smashers/party_modes-poster.webp"
        alt="Smashers Party Modes"
        width={1350}
        height={566}
        className="w-full h-auto rounded-[40px]"
        deferAnimation
        activationDelay={1000}
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 1350px"
      />
    </div>
  )
}

export default GameSection
