import type { Route } from './+types/authenticated'

export async function loader({ request }: Route.LoaderArgs) {
  return { signedIn: request.headers.get('cookie')?.includes('m2-session=fixture') ?? false }
}
export default function Authenticated({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <h1>Authenticated fixture</h1>
      <p>{loaderData.signedIn ? 'Audit user' : 'Signed-out fallback'}</p>
    </main>
  )
}
