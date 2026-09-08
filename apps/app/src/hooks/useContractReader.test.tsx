import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test'

import { DEGEN_CONTRACT } from '@/constants/contracts'
import type { Contracts } from '@/types/web3'

import useContractReader from './useContractReader'

type ContractMethod = (...args: unknown[]) => Promise<unknown>

type ContractDouble = Record<string, ContractMethod>

const makeContracts = (contract: ContractDouble): Contracts =>
  ({ [DEGEN_CONTRACT]: contract }) as unknown as Contracts

const POLL_TIME = 1_000

afterEach(() => {
  mock.restore()
})

describe('useContractReader', () => {
  it('reads methods with arguments, formats the result, and stores the value', async () => {
    const readBalance = mock(async (...args: unknown[]) => {
      expect(args).toEqual(['42'])
      return { balance: 7 }
    })
    const { result, unmount } = renderHook(() =>
      useContractReader(
        makeContracts({ balanceOf: readBalance }),
        DEGEN_CONTRACT,
        'balanceOf',
        ['42'],
        POLL_TIME,
        (value) => (value as { balance: number }).balance * 2
      )
    )

    await waitFor(() => expect(result.current).toBe(14))
    expect(readBalance).toHaveBeenCalledWith('42')
    unmount()
  })

  it('reads methods without arguments', async () => {
    const readRemovedTraits = mock(async () => ['trait-a', 'trait-b'])
    const { result, unmount } = renderHook(() =>
      useContractReader(
        makeContracts({ getRemovedTraits: readRemovedTraits }),
        DEGEN_CONTRACT,
        'getRemovedTraits',
        undefined,
        POLL_TIME
      )
    )

    await waitFor(() => expect(result.current).toEqual(['trait-a', 'trait-b']))
    expect(readRemovedTraits).toHaveBeenCalledWith()
    unmount()
  })

  it('skips reads when explicitly disabled or when the contract is unavailable', async () => {
    const read = mock(async () => 'unexpected')
    const skipped = renderHook(() =>
      useContractReader(
        makeContracts({ read }),
        DEGEN_CONTRACT,
        'read',
        undefined,
        POLL_TIME,
        undefined,
        undefined,
        true
      )
    )
    const missing = renderHook(() =>
      useContractReader({} as Contracts, DEGEN_CONTRACT, 'read', undefined, POLL_TIME)
    )

    await Promise.resolve()
    expect(read).not.toHaveBeenCalled()
    skipped.unmount()
    missing.unmount()
  })

  it('logs read failures without replacing the current value', async () => {
    const error = new Error('wallet disconnected')
    const read = mock(async () => {
      throw error
    })
    const consoleError = spyOn(console, 'error').mockImplementation(() => undefined)
    const { result, unmount } = renderHook(() =>
      useContractReader(makeContracts({ read }), DEGEN_CONTRACT, 'read', undefined, POLL_TIME)
    )

    await waitFor(() => expect(consoleError).toHaveBeenCalled())
    expect(consoleError).toHaveBeenCalledWith('Read Contract Error:', DEGEN_CONTRACT, error)
    expect(result.current).toBeUndefined()
    unmount()
  })
})
