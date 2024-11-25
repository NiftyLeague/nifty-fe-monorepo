type Item = {
  Item: string;
  Type: string;
  Rarity: string;
  Weight: string;
};

type CurrencyRange = {
  MIN: number;
  MAX: number;
};

type Crate = {
  TableId: string;
  Items: Item[];
  BonusItemOdds: string;
  CurrencyRewardOdds: Record<string, string>;
  CurrencyMinMax: Record<string, CurrencyRange>;
};

export type CrateData = Record<string, Crate>;
