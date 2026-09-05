type AnyFn<Args extends unknown[] = unknown[]> = (...args: Args) => void

const callAll =
  <Args extends unknown[]>(...fns: (AnyFn<Args> | undefined | null | false)[]) =>
  (...args: Args): void => {
    for (const fn of fns) if (fn) fn(...args)
  }

export default callAll
