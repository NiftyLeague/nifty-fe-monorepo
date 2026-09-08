import hero from '../../../../../assets/img/misc/trio.webp'
import { readBenchmarkInteger, readBenchmarkProfile, type BenchmarkSearchParams } from './workload'

export default async function Page({ searchParams }: { searchParams: BenchmarkSearchParams }) {
  const query = await searchParams
  const profile = readBenchmarkProfile(query.profile)
  const assetCount = readBenchmarkInteger(query.assets, 1, 64)
  const sectionCount = readBenchmarkInteger(query.sections, 1)

  return (
    <main data-workload-profile={profile}>
      <h1>M2 {profile} public fixture</h1>
      <p>Static framework-control content with production metadata.</p>
      {Array.from({ length: sectionCount }, (_, index) => (
        <p key={index}>Representative content section {index + 1}</p>
      ))}
      <div className="grid">
        {Array.from({ length: assetCount }, (_, index) => (
          <img
            key={index}
            src={`${hero.src}?m2-asset=${index}`}
            width={601}
            height={599}
            alt={`Three Nifty League characters, fixture ${index + 1}`}
          />
        ))}
      </div>
    </main>
  )
}
