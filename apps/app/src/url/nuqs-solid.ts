import { useNavigate, useSearch } from '@tanstack/solid-router'

/**
 * Minimal Solid adapter for the nuqs parsers the app already defines.
 *
 * URL state belongs to nuqs in this app: components read and write it with
 * `useQueryStates`, and the parsers supply defaults as values are read. nuqs'
 * hook layer is React-specific, so this module re-implements just that hook
 * over TanStack Solid Router's reactive search state while reusing the pure
 * parsers from `nuqs/server` unchanged.
 *
 * The returned state object exposes one getter per parser key, so reads stay
 * reactive and destructuring at the call site keeps working exactly like the
 * React version's snapshot object.
 */

type Parser = { parse: (v: string) => unknown; defaultValue?: unknown }

type Parsers = Record<string, Parser>

type ValuesOf<P extends Parsers> = {
  [K in keyof P]: P[K] extends { parse: (v: string) => infer T } ? T : never
}

type SetValues<P extends Parsers> = Partial<{ [K in keyof P]: ValuesOf<P>[K] | null }>

type HistoryMode = 'push' | 'replace'

interface QueryStatesOptions {
  history?: HistoryMode
  /** Accepted for call-site compatibility; router search updates are always reactive. */
  shallow?: boolean
}

export function useQueryStates<P extends Parsers>(
  parsers: P,
  options: QueryStatesOptions = {}
): [ValuesOf<P>, (values: SetValues<P>, setOptions?: { history?: HistoryMode }) => Promise<void>] {
  const search = useSearch({ strict: false })
  const searchValues = () =>
    (search() ?? {}) as Record<string, string | string[] | undefined>
  const navigate = useNavigate()

  const state = {} as ValuesOf<P>
  for (const key of Object.keys(parsers) as Array<keyof P & string>) {
    const parser: Parser | undefined = parsers[key]
    if (!parser) continue
    Object.defineProperty(state, key, {
      get: () => {
        const value = searchValues()[key]
        if (value === undefined) return parser.defaultValue
        return parser.parse(value as string)
      },
      enumerable: true,
    })
  }

  const setState = async (
    values: SetValues<P>,
    setOptions?: { history?: HistoryMode }
  ): Promise<void> => {
    const next: Record<string, unknown> = { ...searchValues() }
    for (const key of Object.keys(parsers) as Array<keyof P & string>) {
      if (!(key in values)) continue
      const parser: Parser | undefined = parsers[key]
      if (!parser) continue
      const incoming = values[key]
      if (incoming === null) {
        // Reset to the parser default; drop the param entirely when the
        // default is undefined so URLs never carry explicit defaults.
        if (parser.defaultValue === undefined) delete next[key]
        else next[key] = String(parser.defaultValue)
      } else {
        next[key] = String(incoming)
      }
    }
    await navigate({
      to: '.',
      search: next as never,
      replace: (setOptions?.history ?? options.history ?? 'push') === 'replace',
    })
  }

  return [state, setState]
}
