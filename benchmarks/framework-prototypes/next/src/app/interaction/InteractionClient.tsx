'use client'

import { useState } from 'react'

export default function InteractionClient({ nodes }: { nodes: number }) {
  const [selected, setSelected] = useState(false)
  return (
    <>
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
    </>
  )
}
