import heroUrl from '../../../../../assets/img/misc/trio.webp'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'
import type { Route } from './+types/home'

export function meta() {
  return [
    { title: 'M2 React Router prototype' },
    { name: 'description', content: 'Disposable React Router framework benchmark prototype' },
  ]
}
export function loader({ request }: Route.LoaderArgs) {
  const search = new URL(request.url).searchParams
  return {
    profile: readBenchmarkProfile(search.get('profile')),
    assets: readBenchmarkInteger(search.get('assets'), 1, 64),
    sections: readBenchmarkInteger(search.get('sections'), 1),
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main data-workload-profile={loaderData.profile}>
      <h1>M2 {loaderData.profile} public fixture</h1>
      <p>SSR framework-candidate content with production metadata.</p>
      {Array.from({ length: loaderData.sections }, (_, index) => (
        <p key={index}>Representative content section {index + 1}</p>
      ))}
      <div className="grid">
        {Array.from({ length: loaderData.assets }, (_, index) => (
          <img
            key={index}
            src={`${heroUrl}?m2-asset=${index}`}
            width={601}
            height={599}
            alt={`Three Nifty League characters, fixture ${index + 1}`}
          />
        ))}
      </div>
    </main>
  )
}
