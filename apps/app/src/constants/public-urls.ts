const DEGEN_MAINNET_CONTRACT_ADDRESS = '0x986aea67C7d6A15036e18678065eb663Fc5BE883'
const NFTL_IMX_CONTRACT_ADDRESS = '0xB0d7e9Ff5fb8E739c4990f7920d8047AcfAe4884'

export const DEGEN_PURCHASE_URL = (id: string | number) =>
  `https://opensea.io/item/ethereum/${DEGEN_MAINNET_CONTRACT_ADDRESS}/${id}`

export const NFTL_PURCHASE_URL = `https://quickswap.exchange/#/analytics/v3/token/${NFTL_IMX_CONTRACT_ADDRESS}`
