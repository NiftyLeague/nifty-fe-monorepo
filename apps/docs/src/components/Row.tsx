import styled from '@emotion/styled';
import { ComponentProps } from 'react';

const Row: React.FC<ComponentProps<'div'>> = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  margin: 0 auto;
  padding: 1rem 0;
  max-width: 900px;

  @media (max-width: 960px) {
    padding: 1rem;
    max-width: 100%;
    margin: 0 1rem;
  }
`;

export const RowTwo: React.FC<ComponentProps<typeof Row>> = styled(Row)`
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 48px;
  gap: 56px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const RowThree: React.FC<ComponentProps<typeof Row>> = styled(Row)`
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export default Row;
