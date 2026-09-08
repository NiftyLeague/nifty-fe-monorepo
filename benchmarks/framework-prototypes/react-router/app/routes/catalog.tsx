import type { Route } from './+types/catalog'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'

export async function loader({ request }: Route.LoaderArgs) {
  const search = new URL(request.url).searchParams
  const itemCount = readBenchmarkInteger(search.get('items'), 120)
  return {
    profile: readBenchmarkProfile(search.get('profile')),
    products: Array.from({ length: itemCount }, (_, index) => ({
      id: index + 1,
      score: (index * 17) % 101,
    })),
  }
}
export default function Catalog({ loaderData }: Route.ComponentProps) {
  return (
    <main data-workload-profile={loaderData.profile}>
      <h1>{loaderData.profile} data-heavy fixture</h1>
      <div className="grid">
        {loaderData.products.map((product) => (
          <article className="card" key={product.id}>
            <h2>Asset {product.id}</h2>
            <p>Score {product.score}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
