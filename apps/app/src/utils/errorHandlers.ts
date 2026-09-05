export function errorMsgHandler(e: unknown): string {
  if (e instanceof Error) {
    return e.message
  }
  if (typeof e === 'object' && e !== null && 'message' in e) {
    const message = (e as { message: unknown }).message
    if (typeof message === 'string' && message.length > 0) return message
  }
  console.error(e)
  return `Unknown error: ${String(e)}`
}
