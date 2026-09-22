import OptimizedImage from '@nl/ui/custom/optimized-image'

import { COMMUNITY_DEGEN_LIST } from '@/constants/degens'

const CAST = COMMUNITY_DEGEN_LIST.map(({ name, source }) => ({ name, source }))

const CHARACTER_STAGES = [
  {
    name: 'DOGE',
    tagline: 'SAME GRIN. NEW WOW.',
    pixelArt: 'https://cdn.niftyleague.com/media/img/home/degen-doge-2d.webp',
    model: 'https://cdn.niftyleague.com/media/img/home/degen-doge-3d.webp',
    pixelAlt: 'Original pixel-art Doge DEGEN',
    modelAlt: 'Matching 3D Doge character model',
  },
  {
    name: 'ALIEN',
    tagline: 'OUT OF THIS WORLD.',
    pixelArt: 'https://cdn.niftyleague.com/media/img/home/degen-alien-2d.webp',
    model: 'https://cdn.niftyleague.com/media/img/home/degen-alien-3d.webp',
    pixelAlt: 'Original pixel-art Alien DEGEN',
    modelAlt: 'Matching 3D Alien character model',
  },
] as const

function CharacterStage({ alt, src, variant }: { alt: string; src: string; variant: '2d' | '3d' }) {
  const isPixelArt = variant === '2d'

  return (
    <figure class={`home-v3-stage home-v3-stage-${variant}`}>
      <figcaption>{isPixelArt ? 'ORIGINAL 2D' : 'REIMAGINED IN 3D'}</figcaption>
      <div class="home-v3-character-frame">
        <OptimizedImage
          src={src}
          alt={alt}
          width={isPixelArt ? 23 : 205}
          height={isPixelArt ? 46 : 235}
          loading="lazy"
          class={isPixelArt ? 'home-v3-character-pixel pixelated' : 'home-v3-character-model'}
        />
      </div>
    </figure>
  )
}

function EvolutionCard({
  model,
  modelAlt,
  name,
  pixelAlt,
  pixelArt,
  tagline,
}: (typeof CHARACTER_STAGES)[number]) {
  return (
    <article class="home-v3-evolution-card" aria-label={`${name}: from 2D to 3D`}>
      <header class="home-v3-card-header">
        <h3>{name}</h3>
        <span>{tagline}</span>
      </header>
      <div class="home-v3-evolution-pair">
        <CharacterStage alt={pixelAlt} src={pixelArt} variant="2d" />
        <span class="home-v3-evolution-arrow" aria-hidden="true">
          →
        </span>
        <CharacterStage alt={modelAlt} src={model} variant="3d" />
      </div>
    </article>
  )
}

function CastRibbon() {
  return (
    <div class="home-v3-cast-ribbon" aria-hidden="true">
      <div class="home-v3-cast-track">
        {[0, 1].map(() => (
          <div class="home-v3-cast-group">
            {CAST.map(({ source }, index) => (
              <OptimizedImage
                src={source}
                alt=""
                width={258}
                height={278}
                loading="lazy"
                class={
                  index % 2 === 1 ? 'home-v3-cast-image home-v3-cast-offset' : 'home-v3-cast-image'
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function HomeV3Characters() {
  return (
    <section
      aria-labelledby="home-v3-character-heading"
      class="home-v3 home-v3-characters"
      data-home-section="characters"
      id="characters"
    >
      <div class="home-v3-wide">
        <div class="home-v3-section-intro">
          <div>
            <p class="home-v3-eyebrow">MEET THE DEGENS</p>
            <h2
              id="home-v3-character-heading"
              class="home-v3-large-heading home-v3-character-heading"
            >
              PIXEL ROOTS.
              <br />
              <span class="home-v3-accent-text">A NEW DIMENSION.</span>
            </h2>
          </div>
          <div class="home-v3-section-intro-copy">
            <p>
              Our original cast, reimagined in 3D. The same unmistakable personalities, with a whole
              new world of possibilities.
            </p>
            <a class="home-v3-text-link" href="/degens">
              GET TO KNOW THE DEGENS <span aria-hidden="true">↗︎</span>
            </a>
          </div>
        </div>

        <div class="home-v3-character-grid">
          {CHARACTER_STAGES.map((character) => (
            <EvolutionCard {...character} />
          ))}
        </div>

        <div class="home-v3-character-notes">
          <p>
            3D character development:{' '}
            <a
              class="home-v3-inline-link"
              href="https://retrostylegames.com/portfolio/nifty-league-pixel-nft-characters-and-animations/"
              target="_blank"
              rel="noreferrer"
            >
              RetroStyle Games
            </a>
            .
          </p>
          <details class="home-v3-character-sheet">
            <summary>
              SEE THE CHARACTER DEVELOPMENT SHEET <span aria-hidden="true">+</span>
            </summary>
            <div>
              <OptimizedImage
                src="https://cdn.niftyleague.com/media/img/home/degen-character-sheet.webp"
                alt="Character development sheet showing original pixel characters and their corresponding 3D models"
                width={1280}
                height={720}
                loading="lazy"
                class="w-full h-auto"
              />
            </div>
          </details>
        </div>
      </div>

      <CastRibbon />
    </section>
  )
}
