import { DesktopOnlyImage } from '@nl/ui/custom/responsive-only-image'

export default function CompeteArtwork() {
  return (
    <div class="transition-quick-pop">
      <DesktopOnlyImage
        src="https://cdn.niftyleague.com/media/img/compete-and-earn/animated/competitors.webp"
        alt="Compete and Earn"
        width={668}
        height={535}
        sizes="(min-width: 768px) 50vw, 100vw"
        class="w-full h-auto"
      />
    </div>
  )
}
