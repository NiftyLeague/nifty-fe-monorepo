import type { NextPage } from 'next'

import OptimizedImage from '@nl/ui/custom/optimized-image'

import { cx } from '@nl/ui/class-names'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'

import styles from './index.module.css'

const Lore: NextPage = () => {
  return (
    <div className="pt-20 overflow-hidden">
      <h1 className="text-center mb-3">LORE</h1>

      <div className={styles.content}>
        <div className={styles.background}>
          <div className={styles.inner}>
            <p>
              Satoshi Nakamoto was a quiet genius. Having lived in Japan as an inventor, one day his
              prodigious tinkering led to the creation of a little project known as Bitcoin. After
              changing the world as we know it and paving the way for endless successors, imitators,
              and meme coins, he retired to a life of equal parts solitude and secrecy.
            </p>
            <br />
            <p>
              One day Satoshi met a panicked Frog from a parallel dimension (as you do). The Frog
              explained that he hailed from NiftyWorld, a planet in an alternate universe that was
              in deep trouble. With not much time left to save his world, the Frog sought out the
              greatest minds across the multiverse to aid him in saving his world, and that journey
              had brought him to Satoshi.
            </p>
            <br />
            <p>
              Satoshi got into his Space Bubble and warp-jumped to NiftyWorld. Once there he learned
              that 6 tribes that inhabited NiftyWorld (Frogs, Cats, Doges, Humans, Aliens and Apes)
              had all declared war amongst each other due to simple misunderstandings.
            </p>
            <br />
            <p>
              The Cat tribe couldn&apos;t stand how the Doge tribe rolled around so carefree, such
              blissful ignorance, wow! The calculated Aliens were sickened by the Apes and their
              constant fomo-ing into everything that moved. And the Frogs despised the Human tribe
              and their penchant for walking around without clothes.
            </p>
            <br />
            <p>
              Satoshi however was impressed with the various tribes&apos; competitiveness, and
              decided to form The Nifty League - a project whereby tribes from all over NiftyWorld
              would be able to channel their grievances into fun, friendly and safe competitive
              games. He formalized anyone&apos;s entrance into the Nifty League by minting them with
              unique attributes in his novel Mint-O-Matic machine, and named those enrollees
              &apos;DEGENs&apos;. Satoshi started up tournaments as a way to formalize the
              competitions, and provided rewards to those who contributed towards the Nifty
              League&apos;s success.
            </p>
            <br />
            <p>
              This culminated in Satoshi building The Citadel; an oasis of peace, prosperity, and
              the occasional bonk on the head with a baseball bat. Any Degen with a special Citadel
              Key would be granted access to this idyllic area, and would be the Degens Satoshi
              considered assets to the Nifty League community, and NiftyWorld as a whole.
            </p>
            <br />
            <p>
              The tribes made a pact that Satoshi&apos;s Nifty League was considered neutral and
              peaceful territory, and with the help of the Degens, Satoshi brought about peace to
              NiftyWorld.
            </p>
            <br />
            <p>
              Inspired by the world growing before him, Satoshi reached out to tribes from other
              universes such as CyberKongz and Forgotten Runes Wizards to share in the fun of what
              he and his faithful Degens were creating in NiftyWorld.
            </p>
            <br />
            <p>
              Satoshi also discovered an ancient 7th tribe - the Hydras. A primordial group long
              forgotten to NiftyWorld, they existed long before Satoshi or any of the other tribes
              had ever lived. He figured out a way to bring them back from extinction, as they
              joined the ranks of Nifty League after some bargaining to get the coolest outfits.
            </p>
            <br />
            <p>
              But Satoshi&apos;s astronomic rise as the savior of NiftyWorld perhaps went a step too
              far, as Satoshi&apos;s tinkering with this parallel world has seen an ancient evil
              once feared in NiftyWorld awaken.
            </p>
            <br />
            <p>
              Known as RugMan, he was once the ruthless ruler of the planet and responsible for
              decimating the Hydras, and finds himself resurrected once more after a failed
              experiment by Satoshi. Along with his grunts in the fiery Mt. Gawx, and his second in
              command Pengweevil who rules the Northern Ice Cap, RugMan seeks to reclaim the planet
              he once ruled over with an iron fist and diamond hands.
            </p>
            <p>
              Feeling responsible for bringing the now peaceful world into danger once more, Satoshi
              has vowed to put an end to RugMan once and for all, and with his faithful army of
              Degens under his control, the battle for NiftyWorld has just begun.
            </p>
          </div>
        </div>
        <div className={styles.satoshiContainer}>
          <div className={cx(styles.satoshi, 'relative flex-1')}>
            <OptimizedImage
              alt="Satoshi"
              src="/img/hero/satoshi.webp"
              width={556}
              height={589}
              sizes="100px"
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className={styles.degensContainer}>
          <div className={cx(styles.degens, 'relative flex-1')}>
            <OptimizedImage
              alt="DEGENs"
              src="/img/degens/community-characters.webp"
              width={1910}
              height={620}
              sizes="300px"
              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className="purple-bg-orb orb-top-right" />
        <div className="purple-bg-orb orb-top-left" />
      </div>

      <ThemeBtnGroup
        className="absolute -mt-50 md:-mt-40 xl:-mt-30"
        primary={{ href: '/docs/overview/intro', title: 'VIEW DOCS', external: true }}
      />
    </div>
  )
}

export default Lore
