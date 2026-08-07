'use client'

import { useEffect, useRef } from 'react'
import { Input } from '@nl/ui/custom/input'

interface Props {
  handleSearch: (currentValue: string) => void
  placeholder?: string
}

const SearchRental = ({ handleSearch, placeholder }: Props): React.ReactNode => {
  const inputEl = useRef<HTMLInputElement>(null)
  const typingTimer = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current)
      }
    }
  }, [])

  const onSearchLocation = () => {
    const currentValue = inputEl?.current?.value ?? ''
    handleSearch(currentValue)
  }

  const doneTyping = () => {
    onSearchLocation()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchLocation()
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') return
    if (typingTimer.current) {
      clearTimeout(typingTimer.current)
    }
    typingTimer.current = setTimeout(doneTyping, 500)
  }

  const handleKeyDown = () => {
    if (typingTimer.current) {
      clearTimeout(typingTimer.current)
    }
  }

  return (
    <div>
      <Input
        placeholder={placeholder || 'Search renter by name'}
        name="search"
        className="min-w-[480px]"
        ref={inputEl}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}

export default SearchRental
