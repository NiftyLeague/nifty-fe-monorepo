import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'

const getProducts = createServerFn({ method: 'GET' }).handler(() =>
  Array.from({ length: 200 }, (_, index) => ({ id: index + 1, score: (index * 17) % 101 }))
)

export const Route = createFileRoute('/catalog')({
  validateSearch: (search) => ({
    profile: readBenchmarkProfile(search.profile),
    items: readBenchmarkInteger(search.items, 120),
  }),
  loader: () => getProducts(),
  component: Catalog,
})

function Catalog() {
  const { profile, items } = Route.useSearch()
  return (
    <main data-workload-profile={profile}>
      <h1>{profile} data-heavy fixture</h1>
      <div className="grid">
        {Route.useLoaderData()
          .slice(0, items)
          .map((product) => (
            <article className="card" key={product.id}>
              <h2>Asset {product.id}</h2>
              <p>Score {product.score}</p>
            </article>
          ))}
      </div>
    </main>
  )
}
