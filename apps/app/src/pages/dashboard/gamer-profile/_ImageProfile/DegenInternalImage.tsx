import { memo } from 'react'
import NativeImage from '@nl/ui/custom/native-image'
import { ViewportVideo } from '@nl/ui/custom/viewport-video'
import type { DashboardDegen } from '@/types/degens'

const DegenInternalImage = memo(({ degen }: { degen: DashboardDegen }) => {
  const style = { height: 320, objectFit: 'cover' as const, display: 'block' }
  const alt = degen?.name || 'Degen'

  if (degen?.background === 'legendary') {
    return (
      <ViewportVideo src={degen?.url ?? ''} style={style} loop muted playsInline aria-label={alt} />
    )
  }

  // Profile media is API-provided and may come from a host that is not known at build time.
  return <NativeImage src={degen?.url} alt={alt} style={style} loading="lazy" />
})

DegenInternalImage.displayName = 'DegenInternalImage'
export default DegenInternalImage
