/**
 * The analytics gate policy (#1903): telemetry collects on production deploys
 * only, with an explicit opt-out flag. Preview deployments and local builds
 * collect nothing, on every surface.
 *
 * `production` is the deployment environment check (`DEPLOY_ENV === 'production'`
 * or the platform equivalent); `telemetry` is the opt-out flag in whatever form
 * the surface reads it (`PUBLIC_TELEMETRY`, `VITE_TELEMETRY`, a dataset string).
 * Anything other than the literal opt-out value keeps telemetry on.
 */
export const productionTelemetryEnabled = (
  production: boolean | undefined,
  telemetry: string | boolean | undefined
): boolean => production === true && telemetry !== 'false'
