import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import './styles.css'

export const metadata: Metadata = {
  title: 'M2 Next control',
  description: 'Disposable Next.js framework benchmark control',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav aria-label="Benchmark routes">
          <Link href="/">Public</Link>
          <Link href="/authenticated">Authenticated</Link>
          <Link href="/catalog">Catalog</Link>
          <Link href="/interaction">Interaction</Link>
          <Link href="/streaming">Streaming</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
