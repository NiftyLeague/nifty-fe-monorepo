'use client'

import { Ref, ReactElement, forwardRef } from 'react'
// third-party
import { motion, type Variants } from 'framer-motion'

// ==============================|| TRANSITIONS ||============================== //

interface TSProps {
  children?: ReactElement
  position?: string
  sx?: React.CSSProperties
  in?: boolean
  type?: string
  direction?: 'up' | 'right' | 'left' | 'down'
}

const Transitions = forwardRef(
  (
    { children, type = 'grow', position = 'top-left', direction = 'up', sx }: TSProps,
    ref: Ref<HTMLDivElement>
  ) => {
    let transformOrigin: string

    switch (position) {
      case 'top-right':
        transformOrigin = 'top right'
        break
      case 'top':
        transformOrigin = 'top'
        break
      case 'bottom-left':
        transformOrigin = 'bottom left'
        break
      case 'bottom-right':
        transformOrigin = 'bottom right'
        break
      case 'bottom':
        transformOrigin = 'bottom'
        break
      case 'top-left':
      default:
        transformOrigin = '0 0 0'
        break
    }

    const variants: Record<string, Variants> = {
      grow: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
      collapse: { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 } },
      fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
      slide: {
        initial: {
          x: direction === 'right' ? 20 : direction === 'left' ? -20 : 0,
          y: direction === 'down' ? 20 : direction === 'up' ? -20 : 0,
        },
        animate: { x: 0, y: 0 },
      },
      zoom: { initial: { scale: 0.5 }, animate: { scale: 1 } },
    }

    const selected = variants[type] || variants.grow

    return (
      <motion.div
        ref={ref}
        style={{ transformOrigin, ...sx }}
        initial="initial"
        animate="animate"
        variants={selected}
      >
        {children}
      </motion.div>
    )
  }
)

Transitions.displayName = 'Transitions'
export default Transitions
