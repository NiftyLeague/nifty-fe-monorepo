'use client';

import { createContext } from 'react';

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!

type OverlayContextType = { onClick: React.MouseEventHandler<HTMLDivElement> };
export const DropdownContext = createContext<OverlayContextType>({ onClick: () => {} });
