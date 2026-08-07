import { memo } from 'react'
import type { Degen } from '@/types/degens'

type DegenMediaProps = {
  alt?: string
  src?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  style?: React.CSSProperties
}

const DegenInternalImage = memo(({ degen }: { degen: Degen }) => {
  const setting: DegenMediaProps = {
    style: { height: 320, objectFit: 'cover', display: 'block' },
    src: degen?.url,
    alt: degen?.name,
  }
  if (degen?.background === 'legendary') {
    return <video {...setting} autoPlay loop muted />
  }
  return <img {...setting} />
})

DegenInternalImage.displayName = 'DegenInternalImage'
export default DegenInternalImage
