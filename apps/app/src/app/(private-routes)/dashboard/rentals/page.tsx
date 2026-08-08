'use client'

import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import MyRentalsDataGrid from './MyRentalsDataGrid'

import {
  ALL_RENTAL_API_URL,
  ALL_RENTAL_API_URL_INACTIVE,
  MY_RENTAL_API_URL,
  MY_RENTAL_API_URL_INACTIVE,
  RENTED_FROM_ME_API_URL,
} from '@/constants/url'
import type { Rentals, RentalType } from '@/types/rentals'
import SearchRental from './SearchRental'

import { Label } from '@nl/ui/base/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@nl/ui/base/select'
import { getUniqueListBy } from '@/utils/array'
import useTeminateRental from '@/hooks/useTeminateRental'
import useAuth from '@/hooks/useAuth'

const DashboardRentalPage = (): React.ReactNode => {
  const { authToken } = useAuth()
  const headers = { authorizationToken: authToken || '' }
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState<RentalType>('all')
  const terminalRental = useTeminateRental()

  const getFetchUrl = (): string[] => {
    switch (category) {
      case 'all':
        return [
          ALL_RENTAL_API_URL,
          ALL_RENTAL_API_URL_INACTIVE,
          RENTED_FROM_ME_API_URL,
          MY_RENTAL_API_URL,
          MY_RENTAL_API_URL_INACTIVE,
        ]
      case 'owned-sponsorship':
      case 'non-owned-sponsorship':
        return [ALL_RENTAL_API_URL, ALL_RENTAL_API_URL_INACTIVE]
      case 'direct-rental':
      case 'recruited':
        return [MY_RENTAL_API_URL, MY_RENTAL_API_URL_INACTIVE]
      case 'direct-renter':
        return [RENTED_FROM_ME_API_URL]
      default:
        return [ALL_RENTAL_API_URL, ALL_RENTAL_API_URL_INACTIVE]
    }
  }

  const fetchRentals = async (): Promise<Rentals[]> => {
    const urls = getFetchUrl()
    const responses = await Promise.all(urls.map((url) => fetch(url, { method: 'GET', headers })))
    const rentalArrays = await Promise.all(responses.map((response) => response.json()))
    const totalRentals = rentalArrays.reduce((flattened, arr) => [...flattened, ...arr])
    return getUniqueListBy<Rentals>(totalRentals, 'id')
  }

  const { data, isLoading, isFetching, refetch } = useQuery<Rentals[]>({
    queryKey: ['rentals'],
    queryFn: fetchRentals,
    // TODO: enable if query needed
    enabled: false,
  })

  const rentals = useMemo(() => {
    if (!data) return []
    if (searchTerm.trim() === '') return data

    const lowercasedValue = searchTerm.toLowerCase()
    return data.filter(
      (rental: Rentals) =>
        rental?.accounts?.player?.address?.toLowerCase().includes(lowercasedValue) ||
        rental?.degen?.id?.toLowerCase().includes(lowercasedValue) ||
        rental?.accounts?.player?.name?.toLowerCase().includes(lowercasedValue)
    )
  }, [data, searchTerm])

  const terminateRentalById = async (rentalId: string) => {
    try {
      const result = await terminalRental(rentalId)
      if (result && !result.ok) {
        const errMsg = await result.text()
        toast.error(`Can not terminate the rental: ${errMsg}`)
        return
      }
      const res = await result?.json()
      if (res) {
        toast.success('Terminate rental successfully!')
        refetch()
      }
    } catch (error) {
      toast.error(`Can not terminate the rental: ${error}`)
    }
  }

  const updateRentalName = () => {
    refetch()
  }

  const handleSearch = (currentValue: string) => {
    setSearchTerm(currentValue)
  }

  const handleChangeCategory = (value: string) => {
    const newCategory = value as RentalType
    if (newCategory !== category) {
      setCategory(newCategory)
    } else {
      refetch()
    }
  }

  useEffect(() => {
    if (!authToken) {
      return
    }

    refetch()
  }, [authToken, category, refetch])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-2xl font-bold">My Rentals</span>
        {/* Header form */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[200px]">
            <Label htmlFor="category" className="mb-1 block text-xs text-muted-foreground">
              Category
            </Label>
            <Select value={category} onValueChange={handleChangeCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="direct-rental">Direct Rental</SelectItem>
                <SelectItem value="recruited">Recruited</SelectItem>
                <SelectItem value="owned-sponsorship">Owned Sponsorship</SelectItem>
                <SelectItem value="non-owned-sponsorship">Non-Owned Sponsorship</SelectItem>
                <SelectItem value="direct-renter">Direct Renter</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="full-history">Full History</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <SearchRental handleSearch={handleSearch} />
        </div>
      </div>
      <div className="h-[calc(100vh-208px)]">
        <MyRentalsDataGrid
          loading={isLoading || isFetching}
          rows={rentals}
          category={category}
          onTerminateRental={terminateRentalById}
          updateRentalName={updateRentalName}
        />
      </div>
    </div>
  )
}

export default DashboardRentalPage
