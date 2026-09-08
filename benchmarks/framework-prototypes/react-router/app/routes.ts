import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('authenticated', 'routes/authenticated.tsx'),
  route('catalog', 'routes/catalog.tsx'),
  route('interaction', 'routes/interaction.tsx'),
  route('streaming', 'routes/streaming.tsx'),
  route('failure', 'routes/failure.tsx'),
] satisfies RouteConfig
