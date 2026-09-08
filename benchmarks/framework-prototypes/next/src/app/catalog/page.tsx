const products = Array.from({ length: 120 }, (_, index) => ({
  id: index + 1,
  score: (index * 17) % 101,
}))

export default function Page() {
  return (
    <main>
      <h1>Data-heavy fixture</h1>
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
