import { ViewportVideo } from '@nl/ui/custom/viewport-video'

const GameSection = () => {
  return (
    <div class="flex flex-col-reverse lg:flex-col">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div class="md:col-span-12 lg:col-span-6">
          <div class="text-center lg:text-left mb-6">
            <h2 class="transition-vertical-fade">
              FREE-TO-PLAY
              <br />
              <span class="font-default font-normal">PARTY PLATFORM FIGHTER</span>
            </h2>
          </div>
          <div class="text-center lg:text-left">
            <p class="leading-relaxed transition-vertical-fade">
              Nifty Smashers is an <strong class="font-semibold">online multiplayer</strong> that
              blends elements of a <strong class="font-semibold">casual party survival</strong>{' '}
              experience with the fast-paced action of a{' '}
              <strong class="font-semibold">platform fighter</strong>!
              <br />
              <br />
              Play on iOS, Android, and Steam with{' '}
              <strong class="font-semibold">full cross-play support</strong>! Jump in and brawl
              anytime, anywhere!
            </p>
          </div>
        </div>
        <div class="md:col-span-12 lg:col-span-6">
          <div class="transition-quick-pop overflow-hidden rounded-[40px]">
            <ViewportVideo
              id="level-video"
              class="h-auto w-full"
              deferLoad
              muted
              loop
              playsinline
              data-keepplaying
              poster="/img/games/smashers/rocket-poster.webp"
              src="/video/rocket.mp4"
            />
          </div>
        </div>
      </div>
      {/*
       * The party-modes montage ships as a muted H.264 loop: the animated WebP was
       * 8.3 MB for 229 frames and the same frames are 1.2 MB as video. The poster
       * is what renders first and what stays for reduced-motion visitors —
       * ViewportVideo loads on idle, waits for the viewport, and never plays when
       * `prefers-reduced-motion: reduce` is set.
       */}
      <div class="my-10 block text-center transition-fade-slow">
        <ViewportVideo
          id="party-modes-video"
          class="w-full h-auto rounded-[40px]"
          width={1350}
          height={566}
          aria-label="Smashers Party Modes"
          deferLoad
          muted
          loop
          playsinline
          data-keepplaying
          poster="/img/games/smashers/party_modes-poster.webp"
          src="/video/party-modes.mp4"
        />
      </div>
    </div>
  )
}

export default GameSection
