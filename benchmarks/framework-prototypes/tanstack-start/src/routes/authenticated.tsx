import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

const getSession = createServerFn({ method: 'GET' }).handler(() => ({
  signedIn: getRequestHeader('cookie')?.includes('m2-session=fixture') ?? false,
}))

export const Route = createFileRoute('/authenticated')({
  loader: () => getSession(),
  component: Authenticated,
})

function Authenticated() {
  const { signedIn } = Route.useLoaderData()
  return (
    <main>
      <h1>Authenticated fixture</h1>
      <p>{signedIn ? 'Audit user' : 'Signed-out fallback'}</p>
    </main>
  )
}
