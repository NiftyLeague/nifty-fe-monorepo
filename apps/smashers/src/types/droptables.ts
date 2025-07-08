type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | string;

type Item = { Item: string; Type: string; Rarity: Rarity; Weight: string | number };

type CurrencyRange = { MIN: number; MAX: number };

type Crate = {
  TableId: string;
  Items: Item[];
  BonusItemOdds: string;
  CurrencyRewardOdds: Record<string, string>;
  CurrencyMinMax: Record<string, CurrencyRange>;
};

export type CrateData = Record<string, Crate>;
