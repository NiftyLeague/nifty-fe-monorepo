/**
 * Responsive image candidates shared by every Next.js app.
 *
 * Keep the small candidates explicit so the shared image configuration stays
 * stable across Next.js upgrades. The 384px candidate belongs to the device
 * ladder below, not both ladders, so generated srcsets never repeat it.
 */
export const IMAGE_DEVICE_SIZES = [
  384, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840,
] as const

/** Next.js' default small-image sizes, excluding the shared 384px device size. */
export const IMAGE_SMALL_SIZES = [32, 48, 64, 96, 128, 256] as const
