import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('DeferredComponent', () => {
  let DeferredComponent: typeof import('./index').DeferredComponent

  beforeEach(async () => {
    DeferredComponent = (await import('./index')).DeferredComponent
  })

  it('exposes an accessible loading state before a component resolves', () => {
    render(
      <DeferredComponent
        label="dashboard data"
        load={() => new Promise(() => undefined)}
        props={{}}
      />
    )

    expect(screen.getByRole('status').textContent).toContain('Loading dashboard data')
  })

  it('renders loaded props and retries a failed import', async () => {
    const load = mock()
    load
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce({ default: ({ name }: { name: string }) => <p>Hello {name}</p> })

    render(<DeferredComponent label="profile" load={load} props={{ name: 'Nifty' }} />)

    expect((await screen.findByRole('alert')).textContent).toContain('profile could not be loaded.')

    await act(async () => {
      screen.getByRole('button', { name: 'Retry' }).click()
    })

    expect(await screen.findByText('Hello Nifty')).toBeTruthy()
    expect(load).toHaveBeenCalledTimes(2)
  })

  it('does not load disabled components', () => {
    const load = mock()
    render(<DeferredComponent enabled={false} label="disabled" load={load} props={{}} />)

    expect(load).not.toHaveBeenCalled()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('keeps a caller-provided placeholder while disabled', () => {
    const load = mock()
    render(
      <DeferredComponent
        disabledFallback={<div role="status">Waiting for visibility</div>}
        enabled={false}
        label="disabled"
        load={load}
        props={{}}
      />
    )

    expect(screen.getByRole('status').textContent).toContain('Waiting for visibility')
    expect(load).not.toHaveBeenCalled()
  })
})
