'use client'

import { useEffect, useMemo, useState } from 'react'

import { useDocumentVisibility } from '@nl/ui/hooks/useDocumentVisibility'

const zeroPad = (value: number, length = 2) => String(value).padStart(length, '0')

interface CountdownProps {
  date: Date
  className?: string
}

const Countdown = ({ date, className }: CountdownProps) => {
  const [now, setNow] = useState(() => Date.now())
  const isDocumentVisible = useDocumentVisibility()

  useEffect(() => {
    if (!isDocumentVisible) return

    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [isDocumentVisible])

  const { isNegative, days, hours, minutes, seconds } = useMemo(() => {
    const total = Math.floor((date.getTime() - now) / 1000)
    const isNegative = total < 0
    const absTotal = Math.abs(total)
    return {
      isNegative,
      days: zeroPad(Math.floor(absTotal / 86400), 2),
      hours: zeroPad(Math.floor((absTotal / 3600) % 24), 2),
      minutes: zeroPad(Math.floor((absTotal / 60) % 60), 2),
      seconds: zeroPad(absTotal % 60, 2),
    }
  }, [date, now])

  const showDays = days !== '00'

  return (
    <span className={className}>
      {isNegative ? '-' : ''}
      {showDays ? `${days}:` : ''}
      {hours}:{minutes}:{seconds}
    </span>
  )
}

Countdown.displayName = 'Countdown'

export { Countdown }
export default Countdown
