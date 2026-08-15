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

// add 10% margin, set minimumGas for greater of 20% margin or minumum on complex calls
export const calculateGasMargin = (value: bigint, minimumGas?: bigint): bigint => {
  if (minimumGas) {
    const calculatedWithMargin = (value * 1000n + 2000n) / 10000n
    return calculatedWithMargin < minimumGas ? minimumGas : calculatedWithMargin
  }
  return (value + 1000n) / 1000n
}
