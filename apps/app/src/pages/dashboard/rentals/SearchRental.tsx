'use client'

import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'

interface Props {
  handleSearch: (currentValue: string) => void
  placeholder?: string
  value?: string
}

const SearchRental = ({ handleSearch, placeholder, value }: Props): JSX.Element => {
  return (
    <div class="grid gap-2">
      <Label class="sr-only" htmlFor="search-renters">
        Search renter by name
      </Label>
      <Input
        id="search-renters"
        aria-label="Search renter by name"
        placeholder={placeholder || 'Search renter by name'}
        name="search"
        class="min-w-[480px]"
        value={value}
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>
  )
}

export default SearchRental
