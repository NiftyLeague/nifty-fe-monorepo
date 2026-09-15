'use client'

import type { Accessor } from 'solid-js'
import { RENT_URL } from '@/constants/url'
import type { MyRental } from '@/types/rental'
import { useMutation, useQueryClient } from '@tanstack/solid-query'
import { queryKeys } from '@/query/app-query'
import useAuth from './useAuth'

type MaybeAccessor<T> = T | Accessor<T>
const resolve = <T,>(value: MaybeAccessor<T>): T =>
  typeof value === 'function' ? (value as Accessor<T>)() : value

const useRent = (
  degenId: MaybeAccessor<string | undefined>,
  position: MaybeAccessor<number>,
  price: MaybeAccessor<number | undefined>,
  address: MaybeAccessor<string>,
  isUseRentalPass: MaybeAccessor<boolean>
): { rent: () => Promise<MyRental | undefined>; readonly isPending: boolean } => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const rent = async (): Promise<MyRental | undefined> => {
    const token = auth.authToken
    const resolvedPrice = resolve(price)
    if (!token || !resolve(degenId) || !resolvedPrice) {
      return undefined
    }

    const res = await fetch(RENT_URL, {
      method: 'POST',
      headers: { authorizationToken: token },
      body: JSON.stringify({
        degen_id: resolve(degenId),
        position: resolve(position),
        price: resolvedPrice,
        address: resolve(address),
        use_item: resolve(isUseRentalPass) ? 'rental-pass-base' : undefined,
      }),
    })
    if (res.status === 404) {
      throw Error('Not Found')
    }
    if (res.status === 200) {
      const json = await res.json()
      if (json.statusCode === 400) {
        throw Error(json.body)
      }
      return json as MyRental
    }
    throw Error('Something wrong!')
  }

  const mutation = useMutation(() => ({
    mutationFn: rent,
    onSuccess: async (rental) => {
      if (!rental) return
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rentalsAll }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicDegens.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.account.all }),
      ])
    },
  }))

  return {
    rent: () => mutation.mutateAsync(),
    get isPending() {
      return mutation.isPending
    },
  }
}

export default useRent
