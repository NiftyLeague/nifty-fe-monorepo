import type { Degen, PublicDegen } from '@/types/degens'

export const PUBLIC_DEGENS_WIRE_MEDIA_TYPE = 'application/vnd.niftyleague.degens.v1+json'

/**
 * The public catalog is large enough for repeated object keys to become a
 * meaningful parse and transfer cost. Keep the wire order explicit so the
 * compact response remains easy to decode and version independently.
 */
export type PublicDegenWire = [
  id: string,
  name: string,
  owner: string,
  background: string,
  tribe: string,
  traits_string: string,
  price: number,
]

/** Keep the public catalog response limited to fields used by public screens. */
export const toPublicDegen = (degen: Degen, fallbackId?: string): PublicDegen => ({
  id: degen.id || fallbackId || '',
  name: degen.name,
  owner: degen.owner,
  background: degen.background,
  tribe: degen.tribe,
  traits_string: degen.traits_string,
  price: degen.price,
})

export const toPublicDegenWire = (degen: PublicDegen): PublicDegenWire => [
  degen.id,
  degen.name,
  degen.owner,
  degen.background,
  degen.tribe,
  degen.traits_string,
  degen.price,
]

export const fromPublicDegenWire = (degen: PublicDegen | PublicDegenWire): PublicDegen => {
  if (!Array.isArray(degen)) return degen

  const [id, name, owner, background, tribe, traits_string, price] = degen
  return { id, name, owner, background, tribe, traits_string, price }
}
