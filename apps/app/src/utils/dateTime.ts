export function formatDateTime(timestamp: number | string): string {
  const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
  const date = new Date(timestampNum * 1e3);
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString('en-US', { timeStyle: 'short' })}`;
}

export function formatTime(time: number | string): string {
  return time
    ? new Intl.DateTimeFormat('default', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(new Date(time))
    : '00:00:00';
}

export function secondsToHours(seconds: number): number {
  const hours = seconds / 3600;
  return Math.trunc(hours);
}

export default formatDateTime;
