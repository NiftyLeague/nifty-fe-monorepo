import type { Degen, PublicDegen } from '@/types/degens'

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
