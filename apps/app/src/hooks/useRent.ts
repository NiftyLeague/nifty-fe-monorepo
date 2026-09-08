'use client'

import { RENT_URL } from '@/constants/url'
import type { MyRental } from '@/types/rental'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/query/app-query'
import useAuth from './useAuth'

const useRent = (
  degenId: string | undefined,
  position: number,
  price: number | undefined,
  address: string,
  isUseRentalPass: boolean
): { rent: () => Promise<MyRental | undefined>; isPending: boolean } => {
  const { authToken } = useAuth()
  const queryClient = useQueryClient()
  const rent = async (): Promise<MyRental | undefined> => {
    if (!authToken || !degenId || !price) {
      return undefined
    }

    const res = await fetch(RENT_URL, {
      method: 'POST',
      headers: { authorizationToken: authToken },
      body: JSON.stringify({
        degen_id: degenId,
        position,
        price,
        address,
        use_item: isUseRentalPass ? 'rental-pass-base' : undefined,
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

  const mutation = useMutation({
    mutationFn: rent,
    onSuccess: async (rental) => {
      if (!rental) return
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.rentalsAll }),
        queryClient.invalidateQueries({ queryKey: queryKeys.publicDegens.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.account.all }),
      ])
    },
  })

  return { rent: mutation.mutateAsync, isPending: mutation.isPending }
}

export default useRent
