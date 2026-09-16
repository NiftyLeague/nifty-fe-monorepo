import { createMemo, type JSX } from 'solid-js'
import { useQuery } from '@tanstack/solid-query'
import { useQueryStates } from '@/url/nuqs-solid'
import { toast } from 'solid-sonner'
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
import { filterBySearch } from '@/utils/search'
import useTeminateRental from '@/hooks/useTeminateRental'
import useAuth from '@/hooks/useAuth'
import {
  AUTHENTICATED_STALE_TIME_MS,
  fetchApiQuery,
  getAuthQueryScope,
  queryKeys,
} from '@/query/app-query'
import { rentalSearchParsers } from '@/url/search-state'

const CATEGORY_OPTIONS: { value: RentalType | 'full-history'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'direct-rental', label: 'Direct Rental' },
  { value: 'recruited', label: 'Recruited' },
  { value: 'owned-sponsorship', label: 'Owned Sponsorship' },
  { value: 'non-owned-sponsorship', label: 'Non-Owned Sponsorship' },
  { value: 'direct-renter', label: 'Direct Renter' },
  { value: 'terminated', label: 'Terminated' },
  { value: 'full-history', label: 'Full History' },
]

const DashboardRentalPage = (): JSX.Element => {
  const auth = useAuth()
  const [searchState, setSearchState] = useQueryStates(rentalSearchParsers, {
    history: 'push',
  })
  const searchTerm = () => searchState.search
  const category = () => searchState.category as RentalType
  const terminalRental = useTeminateRental()

  const getFetchUrl = (): string[] => {
    switch (category()) {
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

  const fetchRentals = async (signal: AbortSignal): Promise<Rentals[]> => {
    const urls = getFetchUrl()
    const rentalArrays = await Promise.all(
      urls.map((url) =>
        fetchApiQuery<Rentals[]>(url, {
          signal,
          init: { method: 'GET', headers: { authorizationToken: auth.authToken || '' } },
        })
      )
    )
    const totalRentals = rentalArrays.reduce((flattened, arr) => [...flattened, ...arr])
    return getUniqueListBy(totalRentals as Rentals[], 'id')
  }

  const rentalsQuery = useQuery(() => ({
    queryKey: queryKeys.rentals(getAuthQueryScope(auth.authToken), category()),
    queryFn: ({ signal }) => fetchRentals(signal),
    enabled: !!auth.authToken,
    staleTime: AUTHENTICATED_STALE_TIME_MS,
  }))

  const rentals = createMemo(() => {
    const data = rentalsQuery.data
    if (!data) return []
    return filterBySearch(data, searchTerm(), (rental: Rentals) => [
      rental?.accounts?.player?.address,
      rental?.degen?.id,
      rental?.accounts?.player?.name,
    ])
  })

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
        rentalsQuery.refetch()
      }
    } catch (error) {
      toast.error(`Can not terminate the rental: ${error}`)
    }
  }

  const updateRentalName = () => {
    rentalsQuery.refetch()
  }

  const handleSearch = (currentValue: string) => {
    void setSearchState({ search: currentValue || null, page: 1 }, { history: 'replace' })
  }

  const handleChangeCategory = (value: string) => {
    void setSearchState({ category: value as typeof searchState.category, page: 1 })
  }

  return (
    <div class="flex flex-col gap-6">
      {/* Header */}
      <div class="flex flex-wrap items-center justify-between gap-4">
        <span class="text-2xl font-bold">My Rentals</span>
        {/* Header form */}
        <div class="flex flex-wrap items-center gap-2">
          <div class="min-w-50">
            <Label for="category" class="mb-1 block text-xs text-muted-foreground">
              Category
            </Label>
            <Select<(typeof CATEGORY_OPTIONS)[number]>
              options={CATEGORY_OPTIONS}
              optionValue="value"
              optionTextValue="label"
              value={CATEGORY_OPTIONS.find((option) => option.value === category())}
              onValueChange={(option) =>
                option && handleChangeCategory((option as (typeof CATEGORY_OPTIONS)[number]).value)
              }
              itemComponent={(itemProps) => (
                <SelectItem item={itemProps.item}>{itemProps.item.rawValue.label}</SelectItem>
              )}
            >
              <SelectTrigger id="category">
                <SelectValue<(typeof CATEGORY_OPTIONS)[number]> />
              </SelectTrigger>
              <SelectContent />
            </Select>
          </div>
          <SearchRental handleSearch={handleSearch} value={searchTerm()} />
        </div>
      </div>
      <div class="h-[calc(100vh-208px)]">
        {/* Initial load only: background refetches (reconnect, post-terminate)
            keep showing the current rows instead of blanking the grid. */}
        <MyRentalsDataGrid
          loading={rentalsQuery.isLoading}
          rows={rentals()}
          category={category()}
          onTerminateRental={terminateRentalById}
          updateRentalName={updateRentalName}
        />
      </div>
    </div>
  )
}

export default DashboardRentalPage
