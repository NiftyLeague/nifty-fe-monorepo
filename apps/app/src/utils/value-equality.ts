/**
 * Compares the JSON-like values used by local storage and contract polling
 * without pulling a general-purpose equality implementation into the app shell.
 */
export function areValuesEqual(
  left: unknown,
  right: unknown,
  seen: WeakMap<object, object> = new WeakMap()
): boolean {
  if (Object.is(left, right)) return true
  if (left === null || right === null || typeof left !== 'object' || typeof right !== 'object') {
    return false
  }

  if (left instanceof Date || right instanceof Date) {
    return left instanceof Date && right instanceof Date && left.getTime() === right.getTime()
  }

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false

    const previous = seen.get(left)
    if (previous) return previous === right
    seen.set(left, right)

    return left.every((value, index) => areValuesEqual(value, right[index], seen))
  }

  if (Object.getPrototypeOf(left) !== Object.getPrototypeOf(right)) return false

  const previous = seen.get(left)
  if (previous) return previous === right
  seen.set(left, right)

  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  if (leftKeys.length !== rightKeys.length) return false

  const leftRecord = left as Record<string, unknown>
  const rightRecord = right as Record<string, unknown>

  return leftKeys.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(rightRecord, key) &&
      areValuesEqual(leftRecord[key], rightRecord[key], seen)
  )
}
