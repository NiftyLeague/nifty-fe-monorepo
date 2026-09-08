import { cookies } from 'next/headers'

export default async function Page() {
  const signedIn = (await cookies()).get('m2-session')?.value === 'fixture'
  return (
    <main>
      <h1>Authenticated fixture</h1>
      <p>{signedIn ? 'Audit user' : 'Signed-out fallback'}</p>
    </main>
  )
}
