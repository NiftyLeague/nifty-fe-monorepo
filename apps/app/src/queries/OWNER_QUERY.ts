import { gql } from 'graphql-request';

const OWNER_QUERY = gql`
  query addressCharactersSearch($address: ID!) {
    owner(id: $address) {
      id
      address
      createdAt
      characterCount
      characters(orderBy: createdAt, first: 500) {
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
  }
`;

export default OWNER_QUERY;
