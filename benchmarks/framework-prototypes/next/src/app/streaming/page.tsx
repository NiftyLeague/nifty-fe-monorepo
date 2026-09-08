import { Suspense } from 'react'
import { readBenchmarkInteger, readBenchmarkProfile, type BenchmarkSearchParams } from '../workload'

export const dynamic = 'force-dynamic'

async function DeferredPanel({ delay }: { delay: number }) {
  await new Promise((resolve) => setTimeout(resolve, delay))
  return <section className="card">Deferred server content</section>
}

export default async function Page({ searchParams }: { searchParams: BenchmarkSearchParams }) {
  const query = await searchParams
  const profile = readBenchmarkProfile(query.profile)
  const delay = readBenchmarkInteger(query.delay, 150, 1_000)
  return (
    <main data-workload-profile={profile}>
      <h1>{profile} streaming fixture</h1>
      <Suspense fallback={<p>Streaming fallback</p>}>
        <DeferredPanel delay={delay} />
      </Suspense>
    </main>
  )
}
