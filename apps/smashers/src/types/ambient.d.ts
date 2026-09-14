// The adapter publishes its image service as a JavaScript-only subpath, so
// the astro language server cannot see its shape. It is the adapter's
// `ExternalImageService` build service (dist/image/build-service.d.ts).
declare module '@astrojs/vercel/build-image-service' {
  import type { ExternalImageService } from 'astro'
  const service: ExternalImageService
  export default service
}
