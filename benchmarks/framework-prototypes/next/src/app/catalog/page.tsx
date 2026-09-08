import { readBenchmarkInteger, readBenchmarkProfile, type BenchmarkSearchParams } from '../workload'

export default async function Page({ searchParams }: { searchParams: BenchmarkSearchParams }) {
  const query = await searchParams
  const profile = readBenchmarkProfile(query.profile)
  const itemCount = readBenchmarkInteger(query.items, 120)
  const products = Array.from({ length: itemCount }, (_, index) => ({
    id: index + 1,
    score: (index * 17) % 101,
  }))

  return (
    <main data-workload-profile={profile}>
      <h1>{profile} data-heavy fixture</h1>
      <div className="grid">
        {products.map((product) => (
          <article className="card" key={product.id}>
            <h2>Asset {product.id}</h2>
            <p>Score {product.score}</p>
          </article>
        ))}
      </div>
    </main>
  )
}
