import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

async function DeferredPanel() {
  await new Promise((resolve) => setTimeout(resolve, 150))
  return <section className="card">Deferred server content</section>
}

export default function Page() {
  return (
    <main>
      <h1>Streaming fixture</h1>
      <Suspense fallback={<p>Streaming fallback</p>}>
        <DeferredPanel />
      </Suspense>
    </main>
  )
}
