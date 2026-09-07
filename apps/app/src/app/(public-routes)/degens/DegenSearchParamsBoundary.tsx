'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface DegenSearchParamsBoundaryProps {
  onChange: (searchParams: Record<string, string>) => void
}

export default function DegenSearchParamsBoundary({
  onChange,
}: DegenSearchParamsBoundaryProps): null {
  const searchParams = useSearchParams()

  useEffect(() => {
    onChange(Object.fromEntries(searchParams.entries()))
  }, [onChange, searchParams])

  return null
}
