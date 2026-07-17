import { describe, expect, it } from 'bun:test';
import { getMintableTraits, type TraitArray } from './helpers';

describe('getMintableTraits', () => {
  it('groups every configured trait for the minting contract', () => {
    const traits = [
      ['Tribe', 1],
      ['Skin Color', 2],
      ['Fur Color', 3],
      ['Eye Color', 4],
      ['Pupil Color', 5],
      ['Hair', 6],
      ['Mouth', 7],
      ['Beard', 8],
      ['Top', 9],
      ['Outerwear', 10],
      ['Print', 11],
      ['Bottom', 12],
      ['Footwear', 13],
      ['Belt', 14],
      ['Hat', 15],
      ['Eyewear', 16],
      ['Piercing', 17],
      ['Wrist', 18],
      ['Hands', 19],
      ['Neckwear', 20],
      ['Left Item', 21],
      ['Right Item', 22],
    ] as TraitArray;

    expect(getMintableTraits({ traits })).toEqual({
      character: [1, 2, 3, 4, 5],
      head: [6, 7, 8],
      clothing: [9, 10, 11, 12, 13, 14],
      accessories: [15, 16, 17, 18, 19, 20],
      items: [21, 22],
    });
  });

  it('uses zero for every absent trait', () => {
    expect(getMintableTraits({ traits: [] as unknown as TraitArray })).toEqual({
      character: [0, 0, 0, 0, 0],
      head: [0, 0, 0],
      clothing: [0, 0, 0, 0, 0, 0],
      accessories: [0, 0, 0, 0, 0, 0],
      items: [0, 0],
    });
  });
});
