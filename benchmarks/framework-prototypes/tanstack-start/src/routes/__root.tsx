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
          <Link to="/" search={{ profile: 'generic', assets: 1, sections: 1 }}>
            Public
          </Link>
          <Link to="/authenticated">Authenticated</Link>
          <Link to="/catalog" search={{ profile: 'generic', items: 120 }}>
            Catalog
          </Link>
          <Link to="/interaction" search={{ profile: 'generic', nodes: 1 }}>
            Interaction
          </Link>
          <Link to="/streaming" search={{ profile: 'generic', delay: 150 }}>
            Streaming
          </Link>
        </nav>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
