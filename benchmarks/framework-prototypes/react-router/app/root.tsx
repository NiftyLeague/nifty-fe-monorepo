import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'
import type { Route } from './+types/root'
import './styles.css'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav aria-label="Benchmark routes">
          <NavLink to="/">Public</NavLink>
          <NavLink to="/authenticated">Authenticated</NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/interaction">Interaction</NavLink>
          <NavLink to="/streaming">Streaming</NavLink>
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const details = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'Unexpected failure'
  return (
    <main>
      <h1>Controlled error boundary</h1>
      <p>{details}</p>
    </main>
  )
}
