import type { Route } from './+types/catalog'

export async function loader(_: Route.LoaderArgs) {
  return Array.from({ length: 120 }, (_, index) => ({ id: index + 1, score: (index * 17) % 101 }))
}
export default function Catalog({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Data-heavy fixture</h1>
      <div className="grid">
        {loaderData.map((product) => (
          <article className="card" key={product.id}>
            <h2>Asset {product.id}</h2>
            <p>Score {product.score}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
