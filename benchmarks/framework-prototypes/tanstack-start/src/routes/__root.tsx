import { HeadContent, Link, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'M2 TanStack Start prototype' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
  errorComponent: () => (
    <RootDocument>
      <main>
        <h1>Controlled error boundary</h1>
        <p>M2 controlled failure</p>
      </main>
    </RootDocument>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <nav aria-label="Benchmark routes">
          <Link to="/">Public</Link>
          <Link to="/authenticated">Authenticated</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/interaction">Interaction</Link>
          <Link to="/streaming">Streaming</Link>
        </nav>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
