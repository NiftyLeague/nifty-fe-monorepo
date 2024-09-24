import styled from '@emotion/styled';
import ThemedImage from '@theme/ThemedImage';
import { ComponentProps } from 'react';

const StyledImage: React.FC<ComponentProps<typeof ThemedImage>> = styled(ThemedImage)`
  position: relative;
  z-index: -1;
  width: 100%;
  object-fit: cover;
`;

export default StyledImage;
