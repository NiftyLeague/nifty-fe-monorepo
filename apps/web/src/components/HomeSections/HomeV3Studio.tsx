import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

const PRINCIPLES = [
  {
    number: '01',
    title: 'GAMEPLAY FIRST.',
    description: 'Games worth coming back to. Characters worth getting attached to.',
  },
  {
    number: '02',
    title: 'OPEN TO BUILDERS.',
    description: 'Explore our open-source web tools, share ideas, and help build what comes next.',
  },
  {
    number: '03',
    title: 'SHAPED TOGETHER.',
    description: 'From playtests to community governance, players have a voice in our future.',
  },
] as const

export default function HomeV3Studio() {
  return (
    <section
      aria-labelledby="home-v3-studio-heading"
      class="home-v3 home-v3-studio"
      data-home-section="studio"
      id="studio"
    >
      <div class="home-v3-studio-backdrop" aria-hidden="true">
        <OptimizedImage
          src="/img/backgrounds/banner-dark.webp"
          alt=""
          width={2000}
          height={1000}
          loading="lazy"
          class="home-v3-studio-scene"
        />
      </div>
      <div class="home-v3-studio-shade" aria-hidden="true" />

      <div class="home-v3-wide home-v3-studio-content">
        <div class="home-v3-studio-copy">
          <p class="home-v3-eyebrow">THE STUDIO</p>
          <h2 id="home-v3-studio-heading" class="home-v3-large-heading">
            BY GAMERS.
            <br />
            <span class="home-v3-accent-text">FOR GAMERS.</span>
          </h2>
          <p class="home-v3-readable">
            We make games with personality, shaped by the people who play them.
          </p>

          <div class="home-v3-principles">
            {PRINCIPLES.map(({ description, number, title }) => (
              <div>
                <span aria-hidden="true">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </div>
            ))}
          </div>

          <ThemeButtonGroup
            class="home-v3-buttons"
            primary={{
              href: 'https://github.com/NiftyLeague',
              title: 'EXPLORE THE CODE',
              external: true,
            }}
            secondary={{ href: '/overview', title: 'MEET THE STUDIO' }}
          />
        </div>
      </div>
    </section>
  )
}
