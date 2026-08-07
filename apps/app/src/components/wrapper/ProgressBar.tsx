'use client'

import { FC, ReactNode, useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
  value: number
  children: string | ReactNode
}

const ProgressBar: FC<ProgressBarProps> = ({ value, children }) => {
  const centerTextRef = useRef<HTMLParagraphElement>(null)
  const progressContainerRef = useRef<HTMLDivElement>(null)
  const [rect, setRect] = useState<{ left: number }>({ left: 0 })
  useEffect(() => {
    if (centerTextRef.current && progressContainerRef.current) {
      const textRect = centerTextRef.current.getBoundingClientRect()
      const containerRect = progressContainerRef.current.getBoundingClientRect()
      setRect({ left: textRect.left - containerRect.left })
    }
  }, [value])
  return (
    <div className="relative">
      <div
        className="absolute flex h-4 w-full items-center rounded-3xl"
        style={{ backgroundColor: 'var(--color-muted-foreground)' }}
      >
        <p
          ref={centerTextRef}
          className="absolute whitespace-nowrap"
          style={{
            fontSize: 10,
            left: `50%`,
            transform: `translateX(-50%)`,
            color: 'var(--color-purple)',
          }}
        >
          {children}
        </p>
      </div>
      <div
        ref={progressContainerRef}
        className="absolute z-[1] flex h-4 items-center overflow-hidden rounded-3xl"
        style={{ width: `${value}%`, backgroundColor: 'var(--color-purple)' }}
      >
        <p className="absolute whitespace-nowrap" style={{ fontSize: 10, left: `${rect.left}px` }}>
          {children}
        </p>
      </div>
    </div>
  )
}

export default ProgressBar
