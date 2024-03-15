export interface Comic {
  id: number;
  title: string;
  multiplier: number;
  wearableName?: string;
  viewsCount: number;
  balance?: number;
  image: string;
  thumbnail: string;
}

export interface Item {
  id: number | null;
  title: string;
  multiplier?: number;
  wearableName?: string;
  balance?: number;
  image: string;
  thumbnail?: string;
  empty?: string;
  isNew?: boolean;
  equipped?: boolean;
}
