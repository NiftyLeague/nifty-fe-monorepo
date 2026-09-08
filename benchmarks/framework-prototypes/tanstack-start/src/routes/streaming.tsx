import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'

export const Route = createFileRoute('/streaming')({
  loader: () => ({
    deferred: new Promise<string>((resolve) =>
      setTimeout(() => resolve('Deferred server content'), 150)
    ),
  }),
  component: Streaming,
})

function DeferredPanel({ promise }: { promise: Promise<string> }) {
  return <section className="card">{use(promise)}</section>
}

function Streaming() {
  return (
    <main>
      <h1>Streaming fixture</h1>
      <Suspense fallback={<p>Streaming fallback</p>}>
        <DeferredPanel promise={Route.useLoaderData().deferred} />
      </Suspense>
    </main>
  )
}
