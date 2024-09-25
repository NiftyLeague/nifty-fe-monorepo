import axios, { AxiosResponse } from 'axios';
import { parseUnits } from 'ethers6';
import type { GasStationResponse, Network } from '@/types/web3';

export const loadGasPrice = async (targetNetwork: Network, speed = 'fast'): Promise<bigint> => {
  let gasPrice = parseUnits('20', 'gwei');
  if (targetNetwork.gasPrice) {
    gasPrice = targetNetwork.gasPrice;
  } else if (navigator.onLine) {
    await axios
      .get('https://ethgasstation.info/json/ethgasAPI.json')
      .then((response: AxiosResponse<GasStationResponse>) => {
        gasPrice = BigInt((response.data[speed as keyof GasStationResponse] as number) * 100000000);
      })
      .catch(error => console.error(error));
  }
  return gasPrice;
};

// add 10% margin, set minimumGas for greater of 20% margin or minumum on complex calls
export const calculateGasMargin = (value: bigint, minimumGas?: bigint): bigint => {
  if (minimumGas) {
    const calculatedWithMargin = (value * 1000n + 2000n) / 10000n;
    return calculatedWithMargin < minimumGas ? minimumGas : calculatedWithMargin;
  }
  return (value + 1000n) / 1000n;
};
