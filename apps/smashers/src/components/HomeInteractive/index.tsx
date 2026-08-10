'use client'

import { useEffect, useState, type PropsWithChildren } from 'react'

import Header, { type ActiveModal } from '@/components/Header'

type HomeInteractiveProps = PropsWithChildren<{ hasReferral: boolean }>

export default function HomeInteractive({ children, hasReferral }: HomeInteractiveProps) {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)

  useEffect(() => {
    if (!hasReferral) return

    const timeoutId = window.setTimeout(() => setActiveModal('play'), 0)
    return () => window.clearTimeout(timeoutId)
  }, [hasReferral])

  return (
    <main>
      <section id="header">
        <Header activeModal={activeModal} />
      </section>
      {children}
    </main>
  )
}
