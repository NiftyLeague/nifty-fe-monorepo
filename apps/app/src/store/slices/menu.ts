import { createSlice } from '@reduxjs/toolkit';
import type { MenuProps } from '@/types/menu';

// initial state
const initialState: MenuProps = { openItem: ['dashboard'], drawerOpen: false };

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload;
    },
  },
});

export default menu.reducer;

export const { activeItem, openDrawer } = menu.actions;
