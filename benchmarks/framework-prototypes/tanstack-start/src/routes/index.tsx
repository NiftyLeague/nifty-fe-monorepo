import { createFileRoute } from '@tanstack/react-router'

import heroUrl from '../../../../../assets/img/misc/trio.webp'
import { readBenchmarkInteger, readBenchmarkProfile } from '../workload'

export const Route = createFileRoute('/')({
  validateSearch: (search) => ({
    profile: readBenchmarkProfile(search.profile),
    assets: readBenchmarkInteger(search.assets, 1, 64),
    sections: readBenchmarkInteger(search.sections, 1),
  }),
  component: PublicFixture,
})

function PublicFixture() {
  const { profile, assets, sections } = Route.useSearch()
  return (
    <main data-workload-profile={profile}>
      <h1>M2 {profile} public fixture</h1>
      <p>Static framework-candidate content with production metadata.</p>
      {Array.from({ length: sections }, (_, index) => (
        <p key={index}>Representative content section {index + 1}</p>
      ))}
      <div className="grid">
        {Array.from({ length: assets }, (_, index) => (
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
