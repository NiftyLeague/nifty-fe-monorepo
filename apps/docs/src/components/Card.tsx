import styled from '@emotion/styled';
import { ComponentProps } from 'react';

const Card: React.FC<ComponentProps<'div'>> = styled.div`
  background-color: var(--ifm-color-emphasis-100);
  border-radius: 20px;
  border: 1px solid var(--ifm-color-emphasis-400);
  color: var(--ifm-font-color-base);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: var(--ifm-color-emphasis-200);
    border: 1px solid var(--ifm-color-emphasis-400);
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.05);
    transform: scale(1.01);
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

  h4 {
    margin-bottom: 0.25rem;
  }
  p {
    margin-bottom: 0px;
  }
`;

export const ShadowCard: React.FC<ComponentProps<typeof Card>> = styled(Card)`
  background-color: transparent;
  backdrop-filter: blur(10px);
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.05);
  min-height: 220px;

  &:hover {
    background-color: var(--ifm-color-emphasis-100);
  }
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
