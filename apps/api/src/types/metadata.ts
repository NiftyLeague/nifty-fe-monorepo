export type Attribute = { trait_type?: string; value: string }

export type Metadata = {
  id: number
  token_id: string
  name: string
  description: string
  image?: string
  animation_url?: string
  youtube_url?: string
  external_url?: string
  background_color?: string
  attributes: Attribute[]
}

type CreationInfo = { blockNumber: number; creatorAddress: string }

export type NFTInfo = {
  tokenId: string | number
  metadata: Metadata
  metadataURI?: string
  metadataGatewayURL?: string
  ownerAddress?: string
  assetURI?: string
  assetGatewayURL?: string
  assetDataBase64?: string
  creationInfo?: CreationInfo
}

export enum ItemType {
  Comic = 'Comic',
  Wearable = 'Wearable',
  Weapon = 'Weapon',
  Emote = 'Emote',
  Item = 'Item',
  Consumable = 'Consumable',
}

export enum ItemSource {
  DegenMint = 'DEGEN Mint',
  ComicsBurn1 = 'Comic #1 Burn',
  ComicsBurn2 = 'Comic #2 Burn',
  ComicsBurn3 = 'Comic #3 Burn',
  ComicsBurn4 = 'Comic #4 Burn',
  ComicsBurn5 = 'Comic #5 Burn',
  ComicsBurn6 = 'Comic #6 Burn',
  ComicsBurnSet = 'Comics Set #1-6 Burn',
  Purchase = 'In-App Purchase',
  Reward = 'In-App Reward',
}

export enum ItemTier {
  None = 'None',
  Epic = 'Epic',
  Legendary = 'Legendary',
  Mythic = 'Mythic',
}

export enum CharacterItemSlotType {
  None = 'None',
  Hat = 'Hat',
  Back = 'Back',
  Primary = 'Primary',
  Special = 'Special',
}
