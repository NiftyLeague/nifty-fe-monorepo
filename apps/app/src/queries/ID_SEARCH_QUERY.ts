import { gql } from 'graphql-request';

const ID_SEARCH_QUERY = gql`
  query CharacterByID($search: String) {
    characters(where: { tokenId: $search }) {
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

export default ID_SEARCH_QUERY;
