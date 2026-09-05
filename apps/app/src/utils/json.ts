export function safeJSONParse(input: unknown): unknown {
  try {
    return JSON.parse(input as string)
  } catch {
    return input
  }
}
