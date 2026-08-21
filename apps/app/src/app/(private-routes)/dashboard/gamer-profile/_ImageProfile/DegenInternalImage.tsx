import { memo } from 'react'
import type { DashboardDegen } from '@/types/degens'

const DegenInternalImage = memo(({ degen }: { degen: DashboardDegen }) => {
  const style = { height: 320, objectFit: 'cover' as const, display: 'block' }
  const alt = degen?.name || 'Degen'

  if (degen?.background === 'legendary') {
    return (
      <video
        src={degen?.url}
        style={style}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    )
  }

  // Profile media is API-provided and may come from a host that is not known at build time.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={degen?.url} alt={alt} style={style} loading="lazy" decoding="async" />
})

DegenInternalImage.displayName = 'DegenInternalImage'
export default DegenInternalImage
