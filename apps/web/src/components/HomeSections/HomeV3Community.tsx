import OptimizedImage from '@nl/ui/custom/optimized-image'
import { ThemeButtonGroup } from '@nl/ui/custom/theme-button-group'

export default function HomeV3Community() {
  return (
    <section
      aria-labelledby="home-v3-community-heading"
      className="home-v3 home-v3-community"
      data-home-section="community"
      id="community"
    >
      <div className="home-v3-community-copy">
        <h2 id="home-v3-community-heading" className="home-v3-large-heading">
          COMMUNITY
        </h2>
        <p className="home-v3-readable">
          Good games are better together. Meet your next friendly rival, share ideas, join
          playtests, and help shape what Nifty League builds next.
        </p>
        <ThemeButtonGroup
          className="home-v3-buttons"
          primary={{
            href: 'https://discord.gg/niftyleague',
            title: 'JOIN DISCORD',
            external: true,
          }}
          secondary={{ href: '/community', title: 'MORE LINKS' }}
        />
        <div className="home-v3-community-cast">
          <OptimizedImage
            src="/img/degens/community-characters.webp"
            alt="Community DEGENs"
            width={596}
            height={194}
            loading="lazy"
            className="pixelated w-full h-auto"
          />
        </div>
      </div>

      <div className="home-v3-community-art" aria-hidden="true">
        <div className="purple-bg-orb orb-top-right" />
        <OptimizedImage
          src="/img/leaderboards/podium.webp"
          alt=""
          width={382}
          height={411}
          loading="lazy"
          className="w-85 h-auto"
        />
      </div>
    </section>
  )
}
