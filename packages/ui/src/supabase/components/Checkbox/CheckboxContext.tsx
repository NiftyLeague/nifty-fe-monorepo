'use client';

import { createContext } from 'react';

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!

type CheckboxContextType = {
  parentCallback: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  parentSize: string;
};
export const CheckboxContext = createContext<CheckboxContextType>({
  parentCallback: () => {},
  name: '',
  parentSize: '',
});
