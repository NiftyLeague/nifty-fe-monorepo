/**
 * Collects all values from an (async) iterable and returns them as an array
 */
export default async function all<T>(
  source: AsyncIterable<T> | Iterable<T>
): Promise<Awaited<T>[]> {
  const arr: Awaited<T>[] = []

  for await (const entry of source) {
    arr.push(entry)
  }

  return arr
}
