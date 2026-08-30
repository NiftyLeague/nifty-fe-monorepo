import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

import { DEGEN_CONTRACT } from '@/constants/contracts'
import type { DashboardDegen } from '@/types/degens'

mock.module('next/dynamic', () => ({
  default:
    () =>
    ({
      displayName,
      traits,
    }: {
      displayName?: string
      traits?: string | readonly bigint[] | Record<string, bigint>
    }) => (
      <div data-testid="degen-dialog-content">
        {displayName}{' '}
        {typeof traits === 'string'
          ? traits
          : Array.isArray(traits)
            ? traits[0]?.toString()
            : traits?.tribe?.toString()}
      </div>
    ),
}))

mock.module('@nl/ui/base/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div role="dialog">{children}</div>
  ),
}))

mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  useMediaQuery: () => false,
}))

const getName = mock(async () => 'Chain Name')
const ownerOf = mock(async () => '0x1234567890abcdef')
const getCharacterTraits = mock(async () => ({ tribe: 1n, skinColor: 17n, mouth: 263n }))
const fetchMock = mock(() => Promise.resolve(new Response('{}')))

mock.module('@/hooks/useNetworkContext', () => ({
  default: () => ({
    readContracts: {
      [DEGEN_CONTRACT]: { getName, ownerOf, getCharacterTraits },
    },
  }),
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

  it('loads contract traits without blocking on a redundant metadata request', async () => {
    const { default: DegenDialog } = await import('./index')

    render(
      <DegenDialog
        open
        degen={{ id: '1', name: 'Fallback Name' } as DashboardDegen}
        setIsRent={() => undefined}
      />
    )

    expect(await screen.findByText('Chain Name 1')).not.toBeNull()
    expect(getName).toHaveBeenCalledWith('1')
    expect(ownerOf).toHaveBeenCalledWith('1')
    expect(getCharacterTraits).toHaveBeenCalledWith('1')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('uses catalog traits while contract data is unavailable', async () => {
    getName.mockImplementationOnce(() => new Promise(() => undefined))

    const { default: DegenDialog } = await import('./index')

    render(
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
    )

    expect(await screen.findByText('Fallback Name 1,17,0,0,0,0,263')).not.toBeNull()
  })
})
