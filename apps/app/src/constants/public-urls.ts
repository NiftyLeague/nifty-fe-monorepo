const DEGEN_MAINNET_CONTRACT_ADDRESS = '0x986aea67C7d6A15036e18678065eb663Fc5BE883'

export const DEGEN_PURCHASE_URL = (id: string | number) =>
  `https://opensea.io/item/ethereum/${DEGEN_MAINNET_CONTRACT_ADDRESS}/${id}`
