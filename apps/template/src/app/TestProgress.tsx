'use client'

import { useEffect, useState } from 'react'

import { Preloader } from '@nl/ui/custom/preloader'

export default function TestProgress(): React.ReactNode {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 5
        if (newProgress > 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 75)
    return () => clearInterval(interval)
  }, [])

  return <Preloader ready={progress === 100} progress={progress} />
}
