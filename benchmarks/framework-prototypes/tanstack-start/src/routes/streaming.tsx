import { createFileRoute } from '@tanstack/react-router'
import { Suspense, use } from 'react'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'

export const Route = createFileRoute('/streaming')({
  validateSearch: (search) => ({
    profile: readBenchmarkProfile(search.profile),
    delay: readBenchmarkInteger(search.delay, 150, 1_000),
  }),
  loaderDeps: ({ search }) => ({ delay: search.delay }),
  loader: ({ deps }) => ({
    deferred: new Promise<string>((resolve) =>
      setTimeout(() => resolve('Deferred server content'), deps.delay)
    ),
  }),
  component: Streaming,
})

function DeferredPanel({ promise }: { promise: Promise<string> }) {
  return <section className="card">{use(promise)}</section>
}

function Streaming() {
  const { profile } = Route.useSearch()
  return (
    <main data-workload-profile={profile}>
      <h1>{profile} streaming fixture</h1>
      <Suspense fallback={<p>Streaming fallback</p>}>
        <DeferredPanel promise={Route.useLoaderData().deferred} />
      </Suspense>
    </main>
  )
}
