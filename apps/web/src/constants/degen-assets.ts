const DEGEN_CDN_BASE_URL = 'https://cdn.niftyleague.com'
// Per-degen run-cycle sprites: lossless animated WebP (converted from the
// retired GIF set), served from R2 under animated/{variant}.
export const DEGEN_BASE_SPRITE_URL = `${DEGEN_CDN_BASE_URL}/degens/animated/retro`
// 2D stills on R2 in three sizes; md (584x640) is the OpenSea-tuned size.
// Leggy degens ship as animated WebP at the same path.
export const DEGEN_2D_IMAGE_URL = `${DEGEN_CDN_BASE_URL}/degens/images/bg/md`
// One-off site artwork (team, specials, marketing) mirrored to R2 under site/.
export const DEGEN_SITE_ASSETS_URL = `${DEGEN_CDN_BASE_URL}/degens/site`
// 3D models live on R2 as single-file GLBs (Draco geometry, AVIF box art,
// lossless PNG traits) under the CDN — one request per degen.
export const DEGEN_3D_MODEL_URL = `${DEGEN_CDN_BASE_URL}/degens/boxed`
export const DEGEN_COLLECTION_URL = 'https://opensea.io/collection/niftydegen'
