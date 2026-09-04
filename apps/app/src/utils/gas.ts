import { parseUnits } from 'ethers'
import type { GasStationResponse, Network } from '@/types/web3'

export const loadGasPrice = async (targetNetwork: Network, speed = 'fast'): Promise<bigint> => {
  let gasPrice = parseUnits('20', 'gwei')
  if (targetNetwork.gasPrice) {
    gasPrice = targetNetwork.gasPrice
  } else if (navigator.onLine) {
    try {
      const response = await fetch('https://ethgasstation.info/json/ethgasAPI.json')
      if (!response.ok) throw new Error(`Gas station request failed: ${response.status}`)

      const data = (await response.json()) as GasStationResponse
      gasPrice = BigInt((data[speed as keyof GasStationResponse] as number) * 100000000)
    } catch (error) {
      console.error(error)
    }
  }
  return gasPrice
}

// Default: ~0.1% ceiling buffer for simple calls where estimation is accurate.
// With minimumGas: 10% margin (value * 10%) or the caller-provided minimum, whichever is larger.
export const calculateGasMargin = (value: bigint, minimumGas?: bigint): bigint => {
  if (minimumGas) {
    const calculatedWithMargin = (value * 1000n + 2000n) / 10000n
    return calculatedWithMargin < minimumGas ? minimumGas : calculatedWithMargin
  }
  return (value + 1000n) / 1000n
}
