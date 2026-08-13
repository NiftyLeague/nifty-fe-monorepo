import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import { useDeferredComponent } from './useDeferredComponent'

interface PreviewProps {
  label: string
}

const Preview = ({ label }: PreviewProps) => <span>{label}</span>

describe('useDeferredComponent', () => {
  it('loads an enabled component and exposes it after the promise resolves', async () => {
    const load = mock(async () => ({ default: Preview }))
    const { result } = renderHook(() => useDeferredComponent<PreviewProps>(load))

    expect(result.current.Component).toBeNull()
    await waitFor(() => expect(result.current.Component).toBe(Preview))
    expect(load).toHaveBeenCalledTimes(1)
  })

  it('does not load disabled components', () => {
    const load = mock(async () => ({ default: Preview }))
    const { result } = renderHook(() => useDeferredComponent<PreviewProps>(load, false))

    expect(result.current.Component).toBeNull()
    expect(result.current.hasError).toBe(false)
    expect(load).not.toHaveBeenCalled()
  })

  it('reports failures and retries through the shared callback', async () => {
    const load = mock()
    load
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce({ default: Preview })

    const { result } = renderHook(() => useDeferredComponent<PreviewProps>(load))

    await waitFor(() => expect(result.current.hasError).toBe(true))
    await act(async () => result.current.retry())
    await waitFor(() => expect(result.current.Component).toBe(Preview))
    expect(load).toHaveBeenCalledTimes(2)
  })
})
