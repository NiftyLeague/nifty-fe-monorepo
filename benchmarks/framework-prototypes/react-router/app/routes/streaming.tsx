import { Suspense } from 'react'
import { Await } from 'react-router'
import type { Route } from './+types/streaming'

export async function loader(_: Route.LoaderArgs) {
  return {
    deferred: new Promise<string>((resolve) =>
      setTimeout(() => resolve('Deferred server content'), 150)
    ),
  }
}
export default function Streaming({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Streaming fixture</h1>
      <Suspense fallback={<p>Streaming fallback</p>}>
        <Await resolve={loaderData.deferred}>
          {(message: string) => <section className="card">{message}</section>}
        </Await>
      </Suspense>
    </main>
  )
}
