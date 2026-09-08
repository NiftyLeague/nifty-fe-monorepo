import { Suspense } from 'react'
import { Await } from 'react-router'
import type { Route } from './+types/streaming'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'

export async function loader({ request }: Route.LoaderArgs) {
  const search = new URL(request.url).searchParams
  const delay = readBenchmarkInteger(search.get('delay'), 150, 1_000)
  return {
    profile: readBenchmarkProfile(search.get('profile')),
    deferred: new Promise<string>((resolve) =>
      setTimeout(() => resolve('Deferred server content'), delay)
    ),
  }
}
export default function Streaming({ loaderData }: Route.ComponentProps) {
  return (
    <main data-workload-profile={loaderData.profile}>
      <h1>{loaderData.profile} streaming fixture</h1>
      <Suspense fallback={<p>Streaming fallback</p>}>
        <Await resolve={loaderData.deferred}>
          {(message: string) => <section className="card">{message}</section>}
        </Await>
      </Suspense>
    </main>
  )
}
