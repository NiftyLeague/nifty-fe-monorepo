import { describe, expect, it, spyOn } from 'bun:test'

// calculateGasMargin is pure — test first without module mocks
const { calculateGasMargin, loadGasPrice } = await import('./gas')

describe('calculateGasMargin', () => {
  it('adds a 1000n/1000n = 1n margin when no minimumGas', () => {
    // (value + 1000n) / 1000n
    // For value = 1_000_000n: (1_000_000 + 1000) / 1000 = 1_001_000 / 1000 = 1001
    expect(calculateGasMargin(1_000_000n)).toBe(1001n)
  })

  it('handles zero value with default formula', () => {
    // (0n + 1000n) / 1000n = 1000n / 1000n = 1n
    expect(calculateGasMargin(0n)).toBe(1n)
  })

  it('handles small values rounding down with default formula', () => {
    // (1n + 1000n) / 1000n = 1001n / 1000n = 1n (integer division)
    expect(calculateGasMargin(1n)).toBe(1n)
  })

  it('applies minimum gas when calculated margin (20%) is lower', () => {
    // With minimumGas = 5000n: calculatedWithMargin = (1000n * 1000n + 2000n) / 10000n
    // = (1_000_000n + 2000n) / 10000n = 1_002_000n / 10000n = 100n
    // Since 100n < 5000n, returns 5000n
    expect(calculateGasMargin(1000n, 5_000n)).toBe(5_000n)
  })

  it('uses calculated 20% margin when it exceeds minimum gas', () => {
    // With minimumGas = 100n: calculatedWithMargin = (1_000_000n * 1000n + 2000n) / 10000n
    // = (1_000_000_000n + 2000n) / 10000n = 1_000_002_000n / 10000n = 100_000n
    // Since 100_000n > 100n, returns 100_000n
    expect(calculateGasMargin(1_000_000n, 100n)).toBe(100_000n)
  })

  it('uses default formula when minimumGas is 0 (falsy)', () => {
    // minimumGas = 0n is falsy, so it uses default formula:
    // (500n + 1000n) / 1000n = 1500n / 1000n = 1n
    expect(calculateGasMargin(500n, 0n)).toBe(1n)
  })

  it('uses 20% margin formula when minimumGas is truthy', () => {
    // minimumGas = 1n is truthy, uses (value * 1000n + 2000n) / 10000n
    // (500n * 1000n + 2000n) / 10000n = 502_000n / 10000n = 50n
    expect(calculateGasMargin(500n, 1n)).toBe(50n)
  })

  it('returns minimumGas when it exceeds the calculated 20% margin', () => {
    // value = 1000n, minimumGas = 500n:
    // calculatedWithMargin = (1000n * 1000n + 2000n) / 10000n = 1_002_000n / 10000n = 100n
    // 100n < 500n → true, so returns 500n
    expect(calculateGasMargin(1_000n, 500n)).toBe(500n)
  })

  it('returns calculated margin when it equals minimumGas exactly', () => {
    // value = 8000n, minimumGas = 800n:
    // calculatedWithMargin = (8000n * 1000n + 2000n) / 10000n = 8_002_000n / 10000n = 800n
    // 800n < 800n → false, so returns 800n
    expect(calculateGasMargin(8_000n, 800n)).toBe(800n)
  })
})

describe('loadGasPrice', () => {
  it('returns the network gasPrice when targetNetwork has one set', async () => {
    const price = await loadGasPrice({ gasPrice: 50_000_000_000n, chainId: 1 } as any)
    expect(price).toBe(50_000_000_000n)
  })

  it('returns the default 20 gwei when offline without a network gasPrice', async () => {
    // Force navigator.onLine to false for this test
    const origOnLine = navigator.onLine
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false })

    try {
      const price = await loadGasPrice({ chainId: 1 } as any)
      expect(price).toBe(20_000_000_000n) // parseUnits('20', 'gwei')
    } finally {
      Object.defineProperty(navigator, 'onLine', { configurable: true, value: origOnLine })
    }
  })

  it('handles gas station errors gracefully when online and returns default', async () => {
    const origOnLine = navigator.onLine
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true })
    const fetchMock = spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    try {
      const price = await loadGasPrice({ chainId: 1 } as any)
      expect(price).toBe(20_000_000_000n)
      expect(fetchMock).toHaveBeenCalledWith('https://ethgasstation.info/json/ethgasAPI.json')
    } finally {
      fetchMock.mockRestore()
      Object.defineProperty(navigator, 'onLine', { configurable: true, value: origOnLine })
    }
  })
})
