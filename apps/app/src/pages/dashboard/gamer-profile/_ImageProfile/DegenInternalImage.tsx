import NativeImage from '@nl/ui/custom/native-image'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import type { DashboardDegen } from '@/types/degens'

const DegenInternalImage = ({ degen }: { degen: DashboardDegen }) => {
  const alt = degen?.name || 'Degen'

  if (degen?.background === 'legendary') {
    return (
      <ViewportVideo
        src={degen?.url ?? ''}
        class="block h-80 object-cover"
        loop
        muted
        playsinline
        aria-label={alt}
      />
    )
  }

  // Profile media is API-provided and may come from a host that is not known at build time.
  return <NativeImage src={degen?.url} alt={alt} class="block h-80 object-cover" loading="lazy" />
}
export default DegenInternalImage
