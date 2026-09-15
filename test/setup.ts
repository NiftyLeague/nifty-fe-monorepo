import { cleanup as cleanupSolid } from '@solidjs/testing-library'
import { afterEach, mock } from 'bun:test'

afterEach(() => {
  cleanupSolid()
  mock.restore()
})
