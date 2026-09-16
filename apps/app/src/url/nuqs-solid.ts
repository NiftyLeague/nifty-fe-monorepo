import { useNavigate, useSearch } from '@tanstack/solid-router'

import type { UrlParser } from '@/url/parsers'

/**
 * Solid adapter for the typed URL parsers the app defines in `search-state`.
 *
 * URL state belongs to those parsers in this app: components read and write it
 * with `useQueryStates`, and the parsers supply defaults as values are read.
 * nuqs' hook layer is React-specific, so this module implements just that hook
 * over TanStack Solid Router's reactive search state while reusing the pure
 * parsers unchanged.
 *
 * The returned state object exposes one getter per parser key, so reads stay
 * reactive and destructuring at the call site keeps working exactly like the
 * React version's snapshot object.
 */

type Parsers = Record<string, UrlParser<any>>

type ValuesOf<P extends Parsers> = {
  [K in keyof P]: P[K] extends UrlParser<infer T>
    ? P[K] extends { defaultValue: unknown }
      ? NonNullable<T>
      : T | null
    : never
}

type SetValues<P extends Parsers> = Partial<{ [K in keyof P]: ValuesOf<P>[K] | null | undefined }>

type HistoryMode = 'push' | 'replace'

export interface QueryStatesOptions {
  history?: HistoryMode
}

export function useQueryStates<P extends Parsers>(
  parsers: P,
  options: QueryStatesOptions = {}
): [ValuesOf<P>, (values: SetValues<P>, setOptions?: { history?: HistoryMode }) => Promise<void>] {
  const search = useSearch({ strict: false })
  const searchValues = () => (search() ?? {}) as Record<string, string | string[] | undefined>
  const navigate = useNavigate()

  const state = {} as ValuesOf<P>
  for (const key of Object.keys(parsers) as Array<keyof P & string>) {
    const parser = parsers[key]
    if (!parser) continue
    Object.defineProperty(state, key, {
      get: () => {
        const raw = searchValues()[key]
        // Multi-value params resolve to their first entry, matching the
        // loader's URLSearchParams.get semantics.
        const value = Array.isArray(raw) ? raw[0] : raw
        if (value === undefined) return parser.defaultValue ?? null
        const parsed = parser.parse(value)
        // A failed parse means "clear"; parsers with defaults fall back.
        if (parsed === null && parser.defaultValue !== undefined) return parser.defaultValue
        return parsed
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
      const parser = parsers[key]
      if (!parser) continue
      const incoming = values[key]
      // `undefined` leaves the param untouched; `null` resets it.
      if (incoming === undefined) continue
      if (incoming === null) {
        // Reset to the parser default; drop the param entirely when the
        // default is undefined so URLs never carry explicit defaults.
        if (parser.defaultValue === undefined) delete next[key]
        else next[key] = parser.serialize(parser.defaultValue)
      } else {
        // Route through the parser's serializer so separator-joined values
        // (e.g. '-' arrays) spell exactly what `parse` expects to read back.
        next[key] = parser.serialize(incoming)
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
