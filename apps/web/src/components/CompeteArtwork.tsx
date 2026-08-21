import { DesktopOnlyImage } from '@nl/ui/custom/responsive-only-image'

export default function CompeteArtwork() {
  return (
    <div className="transition-quick-pop">
      <DesktopOnlyImage
        src="/img/compete-and-earn/animated/competitors.webp"
        alt="Compete and Earn"
        width={668}
        height={535}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="w-full h-auto"
      />
    </div>
  )
}
