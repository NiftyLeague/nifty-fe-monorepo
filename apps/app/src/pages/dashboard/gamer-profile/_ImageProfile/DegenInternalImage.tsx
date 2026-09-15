import NativeImage from '@nl/ui/custom/native-image'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import type { DashboardDegen } from '@/types/degens'

const DegenInternalImage = ({ degen }: { degen: DashboardDegen }) => {
  const style = { height: '320px', 'object-fit': 'cover' as const, display: 'block' }
  const alt = degen?.name || 'Degen'

  if (degen?.background === 'legendary') {
    return (
      <ViewportVideo src={degen?.url ?? ''} style={style} loop muted playsinline aria-label={alt} />
    )
  }

  // Profile media is API-provided and may come from a host that is not known at build time.
  return <NativeImage src={degen?.url} alt={alt} style={style} loading="lazy" />
}
export default DegenInternalImage
