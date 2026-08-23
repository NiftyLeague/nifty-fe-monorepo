'use client'

import dynamic from 'next/dynamic'

import type { DegenViewsProps } from './DegenViews'
import styles from '../gltf.module.css'

const DegenViewsClient = dynamic(() => import('./DegenViews'), {
  loading: () => (
    <span className="sr-only" role="status" aria-live="polite" aria-busy="true">
      Loading DEGEN viewer
    </span>
  ),
  ssr: false,
})

export default function DegenViewsRouteBoundary({
  initialImage,
  ...props
}: DegenViewsProps): React.ReactNode {
  return (
    <div className={styles.viewer__shell}>
      <div className={styles.initial__image}>{initialImage}</div>
      <DegenViewsClient {...props} initialImage={null} />
    </div>
  )
}
