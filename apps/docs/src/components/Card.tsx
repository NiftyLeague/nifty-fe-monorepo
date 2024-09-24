import styled from '@emotion/styled';
import { ComponentProps } from 'react';

const Card: React.FC<ComponentProps<'div'>> = styled.div`
  display: flex;
  max-height: 250px;
  padding: 1rem;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 20px;
  border: 1px solid var(--ifm-color-emphasis-200);

  &:hover {
    border: 1px solid var(--ifm-color-emphasis-400);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 960px) {
    width: 100%;
  }
`;

export const CenterCard: React.FC<ComponentProps<typeof Card>> = styled(Card)`
  min-width: 250px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 24px;

  h3 {
    margin-bottom: 0.25rem;
  }
  p {
    margin-bottom: 0px;
  }
`;

export const ShadowCard: React.FC<ComponentProps<typeof Card>> = styled(Card)`
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.05);
  background-color: #ffffff10;
  backdrop-filter: blur(10px);
  min-height: 200px;
`;

export const WideCard: React.FC<ComponentProps<typeof ShadowCard>> = styled(ShadowCard)`
  max-height: auto;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 24px;

  @media (max-width: 960px) {
    margin: 0;
    max-height: fit-content;
    width: fit-content;
  }
`;

export default Card;
