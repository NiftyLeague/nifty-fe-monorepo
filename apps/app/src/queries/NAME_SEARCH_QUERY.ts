import { gql } from 'graphql-request';

const NAME_SEARCH_QUERY = gql`
  query CharactersLikeName($search: String) {
    characters(orderBy: createdAt, where: { name_contains: $search }) {
      id
      tokenId
      createdAt
      name
      nameHistory
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
      }
    }
  }
`;

export default NAME_SEARCH_QUERY;
