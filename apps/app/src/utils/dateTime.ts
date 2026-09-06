export function formatDateTime(timestamp: number | string): string {
  const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
  const date = new Date(timestampNum * 1e3)
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US', { timeStyle: 'short' })}`
}

const timeFormatter = new Intl.DateTimeFormat('default', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export function formatTime(time: number | string): string {
  if (!time) return '00:00:00'
  return timeFormatter.format(new Date(time))
}

export function secondsToHours(seconds: number): number {
  return Math.trunc(seconds / 3600)
}
