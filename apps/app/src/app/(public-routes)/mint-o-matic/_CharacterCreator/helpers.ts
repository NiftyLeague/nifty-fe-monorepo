export type TraitArray = [
  [Tribe: 'Tribe', trait: number],
  [SkinColor: 'Skin Color', trait: number],
  [FurColor: 'Fur Color', trait: number],
  [EyeColor: 'Eye Color', trait: number],
  [PupilColor: 'Pupil Color', trait: number],
  [Hair: 'Hair', trait: number],
  [Mouth: 'Mouth', trait: number],
  [Beard: 'Beard', trait: number],
  [Top: 'Top', trait: number],
  [Outerwear: 'Outerwear', trait: number],
  [Print: 'Print', trait: number],
  [Bottom: 'Bottom', trait: number],
  [Footwear: 'Footwear', trait: number],
  [Belt: 'Belt', trait: number],
  [Hat: 'Hat', trait: number],
  [Eyewear: 'Eyewear', trait: number],
  [Piercing: 'Piercing', trait: number],
  [Wrist: 'Wrist', trait: number],
  [Hands: 'Hands', trait: number],
  [Neckwear: 'Neckwear', trait: number],
  [LeftItem: 'Left Item', trait: number],
  [RightItem: 'Right Item', trait: number],
];

type TraitObject = {
  Tribe?: number;
  SkinColor?: number;
  FurColor?: number;
  EyeColor?: number;
  PupilColor?: number;
  Hair?: number;
  Mouth?: number;
  Beard?: number;
  Top?: number;
  Outerwear?: number;
  Print?: number;
  Bottom?: number;
  Footwear?: number;
  Belt?: number;
  Hat?: number;
  Eyewear?: number;
  Piercing?: number;
  Wrist?: number;
  Hands?: number;
  Neckwear?: number;
  LeftItem?: number;
  RightItem?: number;
};

const objectify = (array: TraitArray): TraitObject => {
  return array.reduce((p: TraitObject, c) => {
    const [type, traitId] = c;
    // eslint-disable-next-line no-param-reassign
    p[type.replace(' ', '') as keyof TraitObject] = traitId;
    return p;
  }, {} as TraitObject);
};

type MintableTraits = {
  character: number[];
  head: number[];
  clothing: number[];
  accessories: number[];
  items: number[];
};

export const getMintableTraits = ({ traits }: { traits: TraitArray }): MintableTraits => {
  const traitObject = objectify(traits);
  const {
    Tribe,
    SkinColor,
    FurColor,
    EyeColor,
    PupilColor,
    Hair,
    Mouth,
    Beard,
    Top,
    Outerwear,
    Print,
    Bottom,
    Footwear,
    Belt,
    Hat,
    Eyewear,
    Piercing,
    Wrist,
    Hands,
    Neckwear,
    LeftItem,
    RightItem,
  } = traitObject;
  const character = [Tribe ?? 0, SkinColor ?? 0, FurColor ?? 0, EyeColor ?? 0, PupilColor ?? 0];
  const head = [Hair ?? 0, Mouth ?? 0, Beard ?? 0];
  const clothing = [Top ?? 0, Outerwear ?? 0, Print ?? 0, Bottom ?? 0, Footwear ?? 0, Belt ?? 0];
  const accessories = [Hat ?? 0, Eyewear ?? 0, Piercing ?? 0, Wrist ?? 0, Hands ?? 0, Neckwear ?? 0];
  const items = [LeftItem ?? 0, RightItem ?? 0];
  return { character, head, clothing, accessories, items };
};
