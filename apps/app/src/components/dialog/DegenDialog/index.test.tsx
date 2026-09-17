import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import { render, screen } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { writeFileSync } from 'node:fs'

import type { JSX } from 'solid-js'

import type { DashboardDegen } from '@/types/degens'

const renderWithClient = (fn: () => JSX.Element) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    () => <QueryClientProvider client={queryClient}>{fn()}</QueryClientProvider>
  )
}

mock.module('@/runtime/dynamic', () => ({
  default:
    () =>
    (props: {
      displayName?: string
      traits?: string | readonly bigint[] | Record<string, bigint>
    }) => (
      <div data-testid="degen-dialog-content">
        {props.displayName}{' '}
        {typeof props.traits === 'string'
          ? props.traits
          : Array.isArray(props.traits)
            ? props.traits[0]?.toString()
            : props.traits?.tribe?.toString()}
      </div>
    ),
}))

mock.module('@nl/ui/base/dialog', () => ({
  Dialog: ({ children }: { children: JSX.Element }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: JSX.Element }) => <div>{children}</div>,
}))

mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  useMediaQuery: () => () => false,
}))

const getName = mock(async () => 'Chain Name')
const ownerOf = mock(async () => '0x1234567890abcdef')
const getCharacterTraits = mock(async () => ({ tribe: 1n, skinColor: 17n, mouth: 263n }))

mock.module('@wagmi/core', () => ({
  readContract: (_config: unknown, params: { functionName: string }) => {
    switch (params.functionName) {
      case 'getName':
        return getName(params)
      case 'ownerOf':
        return ownerOf(params)
      case 'getCharacterTraits':
        return getCharacterTraits(params)
      default:
        throw new Error(`unexpected call: ${params.functionName}`)
    }
  },
}))

mock.module('@/runtime/wagmi', () => ({
  useWagmiConfig: () => ({}) as never,
  useAccount: () => ({ address: undefined, isConnected: false }),
}))

const originalFetch = globalThis.fetch

describe('DegenDialog', () => {
  beforeEach(() => {
    globalThis.fetch = fetchMock as unknown as typeof fetch
    getName.mockClear()
    ownerOf.mockClear()
    getCharacterTraits.mockClear()
    fetchMock.mockClear()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    mock.restore()
  })

  const fetchMock = mock(() => Promise.resolve(new Response('{}')))

  it('loads contract traits without blocking on a redundant metadata request', async () => {
    const { default: DegenDialog } = await import('./index')

    renderWithClient(() => (
      <DegenDialog
        open
        degen={{ id: '1', name: 'Fallback Name' } as DashboardDegen}
        setIsRent={() => undefined}
      />
    ))

    expect(await screen.findByText('Chain Name 1')).not.toBeNull()
    writeFileSync('/tmp/getname-calls.txt', JSON.stringify(getName.mock.calls.map(c => c[1]?.functionName)) + ' rendered=' + !!screen.queryByText('Chain Name 1'))
    expect(getName).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'getName', args: [1n] })
    )
    expect(ownerOf).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'ownerOf', args: [1n] })
    )
    expect(getCharacterTraits).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: 'getCharacterTraits', args: [1n] })
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('uses catalog traits while contract data is unavailable', async () => {
    getName.mockImplementationOnce(() => new Promise(() => undefined))

    const { default: DegenDialog } = await import('./index')

    renderWithClient(() => (
      <DegenDialog
        open
        degen={
          {
            id: '1',
            name: 'Fallback Name',
            traits_string: '1,17,0,0,0,0,263',
          } as DashboardDegen
        }
        setIsRent={() => undefined}
      />
    ))

    expect(await screen.findByText('Fallback Name 1,17,0,0,0,0,263')).not.toBeNull()
  })
})
