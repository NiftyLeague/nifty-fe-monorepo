import { gql } from 'graphql-request';

const DEFAULT_QUERY = gql`
  query defaultCharactersSearch($size: Int!, $lastID: Int) {
    contracts {
      totalSupply
    }
    characters(orderBy: createdAt, first: $size, where: { tokenId_gt: $lastID }) {
      id
      tokenId
      createdAt
      name
      nameHistory
      owner {
        address
      }
      traits {
        tribe
        skinColor
        furColor
        eyeColor
        pupilColor
        hair
        mouth
        beard
        top
        outerwear
        print
        bottom
        footwear
        belt
        hat
        eyewear
        piercing
        wrist
        hands
        neckwear
        leftItem
        rightItem
        background
      }
    }
  }
`;

export default DEFAULT_QUERY;
