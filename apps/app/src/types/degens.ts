export interface Degen {
  id: string
  stats: object
  rental_count: number
  is_active: boolean
  last_rented_at: number
  total_rented: number
  price: number
  price_daily: number
  tribe: string
  background: string
  traits_string: string
  multiplier: number
  multipliers: { background: number }
  name: string
  owner: string
  earning_cap: number
  earning_cap_daily: number
  url?: string
}

/**
 * The public catalog only needs the fields used by filtering, cards, and the
 * details dialog. Keep the browser payload separate from the full dashboard
 * degen record so server routes do not accidentally expose or transfer the
 * private/runtime metadata those screens do not use.
 */
export type PublicDegen = Pick<
  Degen,
  'id' | 'name' | 'owner' | 'background' | 'tribe' | 'traits_string' | 'price'
>

export interface CharacterType {
  name: string | null
  owner: string | null
  traitList: bigint[]
}

export interface GetDegenResponse {
  degen: {
    background: string
    id: string
    traits: { [key: string]: number }
    traits_string: string
    tribe: string
  }
  id: string
  is_active: boolean
  last_rented_at: number
  multiplier: number
  multipliers: { background: number }
  price: number
  price_daily: number
  rental_count: number
  rental_ids: string[]
  stats?: object
  total_rented: number
  update_counter: number
  updated_at: number
}
