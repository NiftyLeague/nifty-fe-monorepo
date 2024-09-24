import styled from '@emotion/styled';
import { ComponentProps } from 'react';

const StyledIcon: React.FC<ComponentProps<'div'>> = styled.div`
  svg {
    fill: var(--ifm-font-color-base);
  }
  display: flex;
  align-items: center;
`;

export default StyledIcon;
