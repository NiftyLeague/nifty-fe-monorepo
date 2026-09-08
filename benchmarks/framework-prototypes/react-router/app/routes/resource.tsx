import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'
import type { Route } from './+types/resource'

export function loader({ request }: Route.LoaderArgs) {
  const search = new URL(request.url).searchParams
  const items = readBenchmarkInteger(search.get('items'), 1)
  return Response.json({
    profile: readBenchmarkProfile(search.get('profile')),
    items: Array.from({ length: items }, (_, index) => ({ id: index + 1 })),
  })
}
