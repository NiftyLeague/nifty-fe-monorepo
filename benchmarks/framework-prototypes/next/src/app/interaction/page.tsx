import {
  readBenchmarkInteger,
  readBenchmarkProfile,
  type BenchmarkSearchParams,
} from '../workload'
import InteractionClient from './InteractionClient'

export default async function Page({ searchParams }: { searchParams: BenchmarkSearchParams }) {
  const query = await searchParams
  const profile = readBenchmarkProfile(query.profile)
  const nodes = readBenchmarkInteger(query.nodes, 1)
  return (
    <main data-workload-profile={profile}>
      <h1>{profile} interaction-heavy fixture</h1>
      <InteractionClient nodes={nodes} />
    </main>
  )
}
