import Image from 'next/image';
import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';

const GameSection = () => {
  function playVid() {
    const vid = document.getElementById('level-video') as HTMLVideoElement;
    vid?.play();
  }
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
                Nifty Smashers is an <strong className="font-semibold">online multiplayer</strong> that blends elements
                of a <strong className="font-semibold">casual party survival</strong> experience with the fast-paced
                action of a <strong className="font-semibold">platform fighter</strong>!
                <br />
                <br />
                Play on iOS, Android, and Steam with <strong className="font-semibold">full cross-play support</strong>!
                Jump in and brawl anytime, anywhere!
              </p>
            </AnimatedWrapper>
          </div>
        </div>
        <div className="md:col-span-12 lg:col-span-6">
          <div onClick={playVid}>
            <AnimatedWrapper>
              <div className="transition-quick-pop transition-quick-pop-start delay-lite rounded-[40px] overflow-hidden">
                <video id="level-video" className="w-full h-auto" muted autoPlay loop playsInline data-keepplaying>
                  <source src="/video/rocket.mp4" type="video/mp4" />
                </video>
              </div>
            </AnimatedWrapper>
          </div>
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
          />
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default GameSection;
