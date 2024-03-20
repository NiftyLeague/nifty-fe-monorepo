import { createContext } from 'react';

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!

type RadioContextType = {
  parentCallback: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name: string;
  activeId: string;
  parentSize: string;
};

export const RadioContext = createContext<RadioContextType>({
  parentCallback: () => {},
  type: '',
  name: '',
  activeId: '',
  parentSize: '',
});
