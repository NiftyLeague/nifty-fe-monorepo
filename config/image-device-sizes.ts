/**
 * Responsive image candidates shared by every Next.js app.
 *
 * The intermediate candidates keep small cards from downloading oversized
 * variants while high-density 1,280px and 1,440px screens avoid the 3,840px
 * source when a 2,560px candidate is sufficient.
 */
export const IMAGE_DEVICE_SIZES = [
  384, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840,
] as const
