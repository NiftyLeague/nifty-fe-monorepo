import { useContext } from 'react';
import { UserContext } from '../components/UserContextProvider';
import type { UserContextType } from '../types';

export default function useUserContext(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUserContext must be used within a UserContextProvider.`);
  }
  return context;
}
