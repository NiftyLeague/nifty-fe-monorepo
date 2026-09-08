import { useState } from 'react'

export default function Interaction() {
  const [count, setCount] = useState(0)
  return (
    <main>
      <h1>Interaction-heavy fixture</h1>
      <button data-benchmark-interaction onClick={() => setCount((value) => value + 1)}>
        Interactions: {count}
      </button>
    </main>
  )
}
