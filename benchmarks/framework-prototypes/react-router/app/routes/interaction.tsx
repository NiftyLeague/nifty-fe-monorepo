import { useState } from 'react'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'
import type { Route } from './+types/interaction'

export function loader({ request }: Route.LoaderArgs) {
  const search = new URL(request.url).searchParams
  return {
    profile: readBenchmarkProfile(search.get('profile')),
    nodes: readBenchmarkInteger(search.get('nodes'), 1),
  }
}

export default function Interaction({ loaderData }: Route.ComponentProps) {
  const [selected, setSelected] = useState(false)
  return (
    <main data-workload-profile={loaderData.profile}>
      <h1>{loaderData.profile} interaction-heavy fixture</h1>
      <button data-benchmark-interaction onClick={() => setSelected((value) => !value)}>
        Toggle workload
      </button>
      <div className="grid">
        {Array.from({ length: loaderData.nodes }, (_, index) => (
          <span className={selected ? 'card selected' : 'card'} key={index}>
            Node {index + 1}
          </span>
        ))}
      </div>
    </main>
  )
}
