import type { NextPage } from 'next';
import Image from 'next/image';

import { cn } from '@nl/ui/utils';
import { AnimatedWrapper } from '@nl/ui/custom/AnimatedWrapper';
import ThemeBtnGroup from '@/components/ThemeBtnGroup';

import styles from './index.module.css';

const Lore: NextPage = () => {
  return (
    <div className="pt-20 overflow-hidden">
      <AnimatedWrapper>
        <h1 className="text-center transition-fade-slow transition-fade-start delay-lite mb-3">LORE</h1>
      </AnimatedWrapper>

      <div className={styles.content}>
        <div className={styles.background}>
          <div className={styles.inner}>
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Satoshi Nakamoto was a quiet genius. Having lived in Japan as an inventor, one day his prodigious
                tinkering led to the creation of a little project known as Bitcoin. After changing the world as we know
                it and paving the way for endless successors, imitators, and meme coins, he retired to a life of equal
                parts solitude and secrecy.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                One day Satoshi met a panicked Frog from a parallel dimension (as you do). The Frog explained that he
                hailed from the NiftyGalaxy, an alternate universe that was in deep trouble. With not much time left to
                save his world, the Frog sought out the greatest minds across the multiverse to aid him in saving his
                world, and that journey had brought him to Satoshi.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Satoshi got into his Space Bubble and warp-jumped to the NiftyGalaxy. Once there he learned that 6
                tribes that inhabited the NiftyGalaxy (Frogs, Cats, Doges, Humans, Aliens and Apes) had all declared war
                amongst each other due to simple misunderstandings.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                The Cat tribe couldn’t stand how the Doge tribe rolled around so carefree, such blissful ignorance, wow.
                The calculated Aliens were sickened by the Apes and their constant fomo-ing into everything that moved.
                And the Frogs despised the Human tribe and their penchant for walking around without clothes.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Satoshi however was impressed with the various tribes’ competitiveness, and decided to form The Nifty
                League - a project whereby tribes from all over The NiftyGalaxy would be able to channel their
                grievances into fun, friendly and safe competitive games. He formalized anyone’s entrance into the Nifty
                League by minting them with unique attributes in his novel Mint-O-Matic machine, and named those
                enrollees ‘DEGENs’. Satoshi started up tournaments as a way to formalize the competitions, and provided
                rewards to those who contributed towards the Nifty League’s success.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                This culminated in Satoshi building The Citadel; an oasis of peace, prosperity, and the occasional bonk
                on the head with a baseball bat. Any Degen with a special Citadel Key would be granted access to this
                idyllic area, and would be the Degens Satoshi considered assets to the Nifty League community, and the
                NiftyGalaxy as a whole.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                The tribes made a pact that Satoshi’s Nifty League was considered neutral and peaceful territory, and
                with the help of the Degens, Satoshi brought about peace in his newly dubbed ‘NiftyVerse’.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Inspired by the world growing before him, Satoshi reached out to tribes from other universes such as The
                Kongz and Forgotten Runes Wizards to share in the fun of what he and his faithful Degens were creating
                in The NiftyVerse.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Satoshi also discovered an ancient 7th tribe - the Hydras. A primordial group long forgotten to Planet
                Degen, they existed long before Satoshi or any of the other tribes had ever lived. He figured out a way
                to bring them back from extinction, as they joined the ranks of Nifty League after some bargaining to
                get the coolest outfits.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                But Satoshi’s astronomic rise as the savior of the Niftyverse perhaps went a step too far, as Satoshi’s
                tinkering with this parallel world has seen an ancient evil once feared in the Niftyverse awaken.
              </p>
            </AnimatedWrapper>
            <br />
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Known as RugMan, he was once the ruthless ruler of the planet and responsible for decimating the Hydras,
                and finds himself resurrected once more after a failed experiment by Satoshi. Along with his grunts in
                the fiery Mt. Gawx, and his second in command Pengweevil who rules the Northern Ice Cap, RugMan seeks to
                reclaim the planet he once ruled over with an iron fist and diamond hands.
              </p>
            </AnimatedWrapper>
            <AnimatedWrapper immediate>
              <p className="transition-fade-slow transition-fade-start delay-lite">
                Feeling responsible for bringing his now peaceful world into danger once more, Satoshi has vowed to put
                an end to RugMan once and for all, and with his faithful army of Degens under his control, the battle
                for the NiftyVerse has just begun.{' '}
              </p>
            </AnimatedWrapper>
          </div>
        </div>
        <div className={styles.satoshiContainer}>
          <AnimatedWrapper>
            <div
              className={cn(styles.satoshi, 'relative flex-1 transition-fade-slow transition-fade-start delay-long')}
            >
              <Image
                alt="Satoshi"
                src="/img/hero/satoshi.webp"
                width={556}
                height={589}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </div>
          </AnimatedWrapper>
        </div>
        <div className={styles.degensContainer}>
          <AnimatedWrapper>
            <div className={cn(styles.degens, 'relative flex-1 transition-fade-slow transition-fade-start delay-long')}>
              <Image
                alt="DEGENs"
                src="/img/degens/community-characters.webp"
                width={1910}
                height={620}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </div>
          </AnimatedWrapper>
        </div>
        <div className="purple-bg-orb orb-top-right" />
        <div className="purple-bg-orb orb-top-left" />
      </div>

      <ThemeBtnGroup
        className="absolute -mt-50 md:-mt-40 xl:-mt-30"
        primary={{ href: '/docs/overview/intro', title: 'VIEW DOCS', external: true }}
      />
    </div>
  );
};

export default Lore;
