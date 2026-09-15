import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js'

import { useDocumentVisibility } from '@nl/ui/hooks/useDocumentVisibility'

const zeroPad = (value: number, length = 2) => String(value).padStart(length, '0')

interface CountdownProps {
  date: Date
  class?: string
  className?: string
}

const Countdown = (props: CountdownProps) => {
  const [now, setNow] = createSignal(Date.now())
  const isDocumentVisible = useDocumentVisibility()

  createEffect(() => {
    if (!isDocumentVisible()) return

    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    onCleanup(() => clearInterval(timer))
  })

  const parts = createMemo(() => {
    const total = Math.floor((props.date.getTime() - now()) / 1000)
    const isNegative = total < 0
    const absTotal = Math.abs(total)
    return {
      isNegative,
      days: zeroPad(Math.floor(absTotal / 86400), 2),
      hours: zeroPad(Math.floor((absTotal / 3600) % 24), 2),
      minutes: zeroPad(Math.floor((absTotal / 60) % 60), 2),
      seconds: zeroPad(absTotal % 60, 2),
    }
  })

  const showDays = () => parts().days !== '00'

  return (
    <span class={props.class ?? props.className}>
      {parts().isNegative ? '-' : ''}
      {showDays() ? `${parts().days}:` : ''}
      {parts().hours}:{parts().minutes}:{parts().seconds}
    </span>
  )
}

export { Countdown }
export default Countdown
