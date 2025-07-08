export interface Character {
  id: string;
  tokenId: bigint;
  createdAt: bigint;
  name: string | null;
  nameHistory: string[] | null;
  owner: Pick<Owner, 'address'>;
  traits: Partial<TraitMap>;
  transactionHash?: string;
}

export interface CharactersQueryData {
  characters: Character[];
}

export interface Contract {
  id: string;
  address: string;
  totalSupply: bigint;
  nftPrice: bigint;
  removedTraits: number[];
}

export interface DefaultQueryData {
  characters: Character[];
  contracts: Contract[];
}

export interface Owner {
  id: string;
  address: string;
  createdAt: bigint;
  characters: Character[];
  characterCount: number;
}

export interface OwnerQueryData {
  owner: Owner;
}

export interface TraitMap {
  id: string;
  tokenId: bigint;
  character: Character;
  tribe: number;
  skinColor: number;
  furColor: number;
  eyeColor: number;
  pupilColor: number;
  hair: number;
  mouth: number;
  beard: number;
  top: number;
  outerwear: number;
  print: number;
  bottom: number;
  footwear: number;
  belt: number;
  hat: number;
  eyewear: number;
  piercing: number;
  wrists: number;
  hands: number;
  neckwear: number;
  leftItem: number;
  rightItem: number;
  background: number;
}

export interface TraitMapsQueryData {
  traitMaps: TraitMap[];
}
