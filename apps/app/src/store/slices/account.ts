import { createSlice } from '@reduxjs/toolkit';
// action - state management
import type { InitialLoginContextProps } from '@/types/auth';

export const initialState: InitialLoginContextProps = { isLoggedIn: false };

// ==============================|| SLICE - ACCOUNT ||============================== //

const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    login(state) {
      state.isLoggedIn = true;
    },
    logout(state) {
      state.isLoggedIn = false;
    },
  },
});

export default account.reducer;

export const { login, logout } = account.actions;
