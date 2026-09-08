import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getProducts = createServerFn({ method: 'GET' }).handler(() =>
  Array.from({ length: 120 }, (_, index) => ({ id: index + 1, score: (index * 17) % 101 }))
)

export const Route = createFileRoute('/catalog')({
  loader: () => getProducts(),
  component: Catalog,
})

function Catalog() {
  return (
    <main>
      <h1>Data-heavy fixture</h1>
      <div className="grid">
        {Route.useLoaderData().map((product) => (
          <article className="card" key={product.id}>
            <h2>Asset {product.id}</h2>
            <p>Score {product.score}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
