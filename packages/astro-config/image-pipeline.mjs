import { availableParallelism } from 'node:os'

const DEFAULT_CONCURRENCY = Math.min(4, Math.max(1, availableParallelism() - 1))
const configuredConcurrency = Number.parseInt(process.env.IMAGE_GENERATION_CONCURRENCY ?? '', 10)

/**
 * Keep image transforms bounded while allowing multi-core local builds to use
 * the native image pipeline. CI can set IMAGE_GENERATION_CONCURRENCY=1 when
 * memory is constrained.
 */
export const imageGenerationConcurrency =
  Number.isInteger(configuredConcurrency) && configuredConcurrency > 0
    ? configuredConcurrency
    : DEFAULT_CONCURRENCY

const GENERATED_OR_TEST_PATH = /(?:^|[/\\])typechain(?:[/\\]|$)|\.(?:test|spec|stories?)\.[^.]+$/i

export function isProductionImageSource(path, extensions) {
  return (
    extensions.includes(path.slice(path.lastIndexOf('.'))) && !GENERATED_OR_TEST_PATH.test(path)
  )
}

export async function runWithConcurrency(items, worker, concurrency = imageGenerationConcurrency) {
  if (items.length === 0) return

  let nextIndex = 0
  const workerCount = Math.min(Math.max(1, concurrency), items.length)
  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < items.length) {
        const item = items[nextIndex++]
        await worker(item)
      }
    })
  )
}
