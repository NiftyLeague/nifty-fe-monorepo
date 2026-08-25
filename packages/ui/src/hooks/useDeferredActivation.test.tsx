import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let activate: (() => void) | undefined

beforeEach(() => {
  activate = undefined
  mock.module('@nl/ui/lib/deferred-activation', () => ({
    scheduleDeferredActivation: ({ onActivate }: { onActivate: () => void }) => {
      activate = onActivate
      return () => undefined
    },
  }))
})

describe('useDeferredActivation', () => {
  it('waits for the shared activation callback before enabling deferred work', async () => {
    const { default: useDeferredActivation } = await import('./useDeferredActivation')

    function Fixture() {
      const isActivated = useDeferredActivation()
      return <span>{isActivated ? 'active' : 'waiting'}</span>
    }

    render(<Fixture />)
    expect(screen.getByText('waiting')).not.toBeNull()

    act(() => activate?.())

    expect(screen.getByText('active')).not.toBeNull()
  })

  it('stays disabled when explicitly disabled', async () => {
    const { default: useDeferredActivation } = await import('./useDeferredActivation')

    function Fixture() {
      const isActivated = useDeferredActivation({ enabled: false })
      return <span>{isActivated ? 'active' : 'waiting'}</span>
    }

    render(<Fixture />)
    expect(screen.getByText('waiting')).not.toBeNull()
    expect(activate).toBeUndefined()
  })
})
