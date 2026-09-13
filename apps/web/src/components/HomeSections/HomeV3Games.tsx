import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

import { NIFTY_WORLD_APP_URL } from '@/constants/links'

export default function HomeV3Games() {
  return (
    <section
      aria-labelledby="home-v3-games-heading"
      className="home-v3 home-v3-games"
      data-home-section="games"
      id="games"
    >
      <div className="home-v3-wide home-v3-games-label">
        <p className="home-v3-eyebrow">PICK YOUR NEXT ADVENTURE</p>
        <h2 id="home-v3-games-heading" className="home-v3-large-heading">
          OUR GAMES
        </h2>
      </div>

      <article aria-labelledby="home-v3-smashers-heading" className="home-v3-smashers-spotlight">
        <div className="home-v3-smashers-art">
          <div className="home-v3-smashers-glow" aria-hidden="true" />
          <a
            className="home-v3-smashers-picture"
            href="https://niftysmashers.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Explore Nifty Smashers (opens in a new tab)"
          >
            <OptimizedImage
              src="/img/home/smashers-spotlight.webp"
              alt="Nifty Smashers game artwork featuring the DEGEN cast"
              width={1280}
              height={720}
              loading="lazy"
              className="w-full h-auto"
            />
          </a>
          <div className="home-v3-floating-mascot" aria-hidden="true">
            <OptimizedImage
              src="/img/degens/specials/cat.gif"
              alt=""
              width={512}
              height={512}
              loading="lazy"
              className="pixelated"
            />
          </div>
          <span className="home-v3-art-caption">FRIENDS. RIVALS. REMATCHES.</span>
        </div>

        <div className="home-v3-smashers-copy">
          <p className="home-v3-eyebrow">MULTIPLAYER BRAWLER</p>
          <h3 id="home-v3-smashers-heading" className="home-v3-large-heading">
            NIFTY
            <br />
            <span className="home-v3-accent-text">SMASHERS.</span>
          </h3>
          <p className="home-v3-display-line">
            BIG PERSONALITIES.
            <br />
            GLORIOUS CHAOS.
          </p>
          <p className="home-v3-readable">
            Pick your DEGEN. Rally your crew. Nifty Smashers is a fast, chaotic brawler built for
            rivalries, rematches, and one-more-match energy.
          </p>
          <ThemeButtonGroup
            className="home-v3-buttons"
            primary={{
              href: 'https://niftysmashers.com',
              title: 'LET’S BRAWL!',
              external: true,
            }}
            secondary={{ href: '#gaming-section', title: 'WATCH GAMEPLAY' }}
          />
        </div>
      </article>

      <article
        aria-labelledby="home-v3-world-heading"
        className="home-v3-browser-world"
        id="nifty-world"
      >
        <div className="home-v3-laptop-stage">
          <OptimizedImage
            src="/img/home/niftyworld-laptop.webp"
            alt="Nifty League’s illustrated laptop, desk, and DEGEN coffee mug"
            width={1920}
            height={1172}
            loading="lazy"
            className="home-v3-laptop-backdrop"
          />
          <a
            className="home-v3-laptop-screen"
            href={NIFTY_WORLD_APP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Explore Nifty World (opens in a new tab)"
          >
            <OptimizedImage
              src="/img/home/niftyworld-marina.webp"
              alt="Nifty World marina environment artwork displayed on the laptop"
              width={1280}
              height={720}
              loading="lazy"
              className="home-v3-screen-poster"
            />
          </a>
          <div className="home-v3-laptop-shade" aria-hidden="true" />
        </div>

        <div className="home-v3-world-copy">
          <p className="home-v3-eyebrow">NIFTY WORLD · A SOCIAL HUB</p>
          <h3 id="home-v3-world-heading" className="home-v3-large-heading home-v3-world-heading">
            A WHOLE WORLD.
            <br />
            <span className="home-v3-accent-text">ANY BROWSER.</span>
          </h3>
          <p className="home-v3-readable">
            Meet friends, chase curiosities, and see what’s around the next corner. Nifty World
            brings our characters, communities, and stories together in one living playground.
          </p>
          <ThemeButtonGroup
            className="home-v3-buttons"
            primary={{
              href: NIFTY_WORLD_APP_URL,
              title: 'EXPLORE NIFTY WORLD',
              external: true,
            }}
          />
          <a className="home-v3-text-link home-v3-world-more" href="/niftyworld">
            MORE ABOUT THE WORLD <span aria-hidden="true">→</span>
          </a>
        </div>
      </article>
    </section>
  )
}
