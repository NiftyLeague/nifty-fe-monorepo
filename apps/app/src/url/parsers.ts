/**
 * Typed URL search-param parsers — local replacement for `nuqs/server`.
 *
 * The app only ever used nuqs' pure parser builders and `createLoader` (its
 * hook layer is React-specific and the server entry pulls React into the
 * dependency graph), so this module implements the same contract directly:
 *
 * - `parse` maps a raw string to a value or `null` on failure.
 * - `withDefault` returns a parser that carries a `defaultValue`, applied
 *   whenever the param is absent or fails to parse.
 * - `createLoader` reads a search record into typed values, applying the same
 *   absent/invalid -> default fallback nuqs performs.
 *
 * Multi-value params (`key=a&key=b`) resolve to their first value, matching
 * nuqs' `parseServerSide` behavior for single parsers.
 */

const safeParse = <T>(parse: (value: string) => T | null, value: string): T | null => {
  try {
    return parse(value)
  } catch {
    return null
  }
}

declare const parserValueMarker: unique symbol

export interface UrlParser<T> {
  /** Phantom marker so the value type is inferred exactly, not through `T | null`. */
  readonly [parserValueMarker]?: T
  readonly type: 'single'
  parse: (value: string) => T | null
  serialize: (value: T) => string
  eq: (a: T, b: T) => boolean
  defaultValue?: T
  withDefault: (defaultValue: NonNullable<T>) => UrlParserWithDefault<T>
}

export interface UrlParserWithDefault<T> extends UrlParser<T> {
  defaultValue: NonNullable<T>
}

const createParser = <T>(parser: {
  parse: (value: string) => T | null
  serialize: (value: T) => string
  eq?: (a: T, b: T) => boolean
}): UrlParser<T> => ({
  type: 'single',
  eq: (a, b) => a === b,
  ...parser,
  withDefault(defaultValue: NonNullable<T>) {
    return { ...this, defaultValue } as UrlParserWithDefault<T>
  },
})

export const parseAsString: UrlParser<string> = createParser({
  parse: (value) => value,
  serialize: String,
})

export const parseAsInteger: UrlParser<number> = createParser({
  parse: (value) => {
    const int = Number.parseInt(value)
    return Number.isNaN(int) ? null : int
  },
  serialize: (value) => String(Math.round(value)),
})

export const parseAsStringLiteral = <const Literal extends string>(
  validValues: readonly Literal[]
): UrlParser<Literal> =>
  createParser({
    parse: (value) => (validValues.includes(value as Literal) ? (value as Literal) : null),
    serialize: String,
  })

const arrayEquals = <T>(a: T[], b: T[], itemEq: (x: T, y: T) => boolean) =>
  a.length === b.length && a.every((item, index) => itemEq(item, b[index] as T))

export const parseAsArrayOf = <T>(
  itemParser: UrlParser<T>,
  separator = ','
): UrlParserWithDefault<T[]> => {
  const encodedSeparator = encodeURIComponent(separator)
  const itemEq = itemParser.eq
  return createParser<T[]>({
    parse: (query) => {
      if (query === '') return []
      return query
        .split(separator)
        .map((item) => safeParse(itemParser.parse, item.replaceAll(encodedSeparator, separator)))
        .filter((value): value is T => value !== null && value !== undefined)
    },
    serialize: (values) =>
      values
        .map((value) => itemParser.serialize(value).replaceAll(separator, encodedSeparator))
        .join(separator),
    eq: (a, b) => arrayEquals(a, b, itemEq),
  }).withDefault([] as T[])
}

type InferParserValue<P> = P extends { readonly [parserValueMarker]?: infer Value }
  ? P extends { defaultValue: unknown }
    ? Value
    : Value | null
  : never

export type inferParserType<Map extends Record<string, UrlParser<any>>> = {
  [Key in keyof Map]: InferParserValue<Map[Key]>
}

type SearchInput = Record<string, string | string[] | undefined>

/**
 * nuqs-compatible loader: absent or unparseable params resolve to the parser's
 * default (or null). Plain-object inputs keep only the first value per key,
 * like `URLSearchParams.get`.
 */
export const createLoader =
  <Map extends Record<string, UrlParser<any>>>(parsers: Map) =>
  (input: SearchInput): inferParserType<Map> => {
    const result = {} as Record<string, unknown>
    for (const key of Object.keys(parsers)) {
      const parser = parsers[key] as UrlParser<unknown>
      const raw = input[key]
      const first = Array.isArray(raw) ? raw[0] : raw
      const parsed = first === undefined ? null : safeParse(parser.parse, first)
      result[key] = parsed ?? parser.defaultValue ?? null
    }
    return result as inferParserType<Map>
  }
