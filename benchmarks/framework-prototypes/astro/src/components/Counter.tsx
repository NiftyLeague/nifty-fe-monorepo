import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button data-benchmark-interaction onClick={() => setCount((value) => value + 1)}>
      Interactions: {count}
    </button>
  )
}
