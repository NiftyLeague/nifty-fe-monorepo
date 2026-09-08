'use client'

export default function ErrorBoundary({ reset }: { reset: () => void }) {
  return (
    <main>
      <h1>Controlled error boundary</h1>
      <button onClick={reset}>Retry</button>
    </main>
  )
}
