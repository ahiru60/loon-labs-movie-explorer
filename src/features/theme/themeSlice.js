import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/localStorage';

const THEME_STORAGE_KEY = 'cineglass_theme';
const initialMode = loadFromStorage(THEME_STORAGE_KEY, 'dark');

const initialState = {
  mode: initialMode, // 'dark' | 'light'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      saveToStorage(THEME_STORAGE_KEY, state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      saveToStorage(THEME_STORAGE_KEY, state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
