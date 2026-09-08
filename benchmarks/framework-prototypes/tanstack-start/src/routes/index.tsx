import { createFileRoute } from '@tanstack/react-router'

import heroUrl from '../../../../../assets/img/misc/trio.webp'

export const Route = createFileRoute('/')({
  component: () => (
    <main>
      <h1>M2 public fixture</h1>
      <p>Static framework-candidate content with production metadata.</p>
      <img src={heroUrl} width={601} height={599} alt="Three Nifty League characters" />
    </main>
  ),
})
