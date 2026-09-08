'use client'

import { TERMINATE_RENTAL_API_URL } from '@/constants/url'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/query/app-query'
import useAuth from './useAuth'

const useTeminateRental = () => {
  const { authToken } = useAuth()
  const queryClient = useQueryClient()
  const terminalRental = async (rentalId: string | undefined) => {
    if (!authToken || !rentalId) {
      return
    }

    const res = await fetch(
      `${TERMINATE_RENTAL_API_URL}?${new URLSearchParams({ id: rentalId })}`,
      {
        method: 'POST',
        headers: { authorizationToken: authToken },
      }
    )
    return res
  }

  const mutation = useMutation({
    mutationFn: terminalRental,
    onSuccess: async (response) => {
      if (response?.ok) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.rentalsAll })
      }
    },
  })

  return mutation.mutateAsync
}

export default useTeminateRental
