import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'

export const Route = createFileRoute('/interaction')({
  validateSearch: (search) => ({
    profile: readBenchmarkProfile(search.profile),
    nodes: readBenchmarkInteger(search.nodes, 1),
  }),
  component: Interaction,
})

function Interaction() {
  const { profile, nodes } = Route.useSearch()
  const [selected, setSelected] = useState(false)
  return (
    <main data-workload-profile={profile}>
      <h1>{profile} interaction-heavy fixture</h1>
      <button data-benchmark-interaction onClick={() => setSelected((value) => !value)}>
        Toggle workload
      </button>
      <div className="grid">
        {Array.from({ length: nodes }, (_, index) => (
          <span className={selected ? 'card selected' : 'card'} key={index}>
            Node {index + 1}
          </span>
        ))}
      </div>
    </main>
  )
}
