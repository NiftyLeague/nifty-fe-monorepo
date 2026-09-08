'use client'

import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'

interface Props {
  handleSearch: (currentValue: string) => void
  placeholder?: string
  value?: string
}

const SearchRental = ({ handleSearch, placeholder, value }: Props): React.ReactNode => {
  return (
    <div className="grid gap-2">
      <Label className="sr-only" htmlFor="search-renters">
        Search renter by name
      </Label>
      <Input
        id="search-renters"
        aria-label="Search renter by name"
        placeholder={placeholder || 'Search renter by name'}
        name="search"
        className="min-w-[480px]"
        value={value}
        onChange={(event) => handleSearch(event.target.value)}
      />
    </div>
  )
}

export default SearchRental
