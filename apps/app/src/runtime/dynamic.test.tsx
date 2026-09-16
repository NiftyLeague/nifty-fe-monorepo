import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import dynamic from '@/runtime/dynamic'

const Named = () => <div>function-card</div>
const MemoCard = function MemoCard() {
  return <div>memo-card</div>
}

describe('dynamic loader shapes', () => {
  it('mounts a default-export loader', async () => {
    const Loaded = dynamic(() => Promise.resolve({ default: () => <div>default-card</div> }))
    render(() => <Loaded />)
    expect(await screen.findByText('default-card')).toBeTruthy()
  })

  it('mounts a named function export', async () => {
    const Loaded = dynamic(() => Promise.resolve({ Named }).then((module) => module.Named))
    render(() => <Loaded />)
    expect(await screen.findByText('function-card')).toBeTruthy()
  })

  it('mounts a memoized named export', async () => {
    // () returns an exotic element object rather than a function, which is
    // what previously broke lazy() with React error #306.
    const Loaded = dynamic(() => Promise.resolve({ Named: MemoCard }).then((m) => m.Named))
    render(() => <Loaded />)
    expect(await screen.findByText('memo-card')).toBeTruthy()
  })
})
