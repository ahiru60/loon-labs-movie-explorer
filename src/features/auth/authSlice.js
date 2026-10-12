import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/localStorage';

const AUTH_STORAGE_KEY = 'cineglass_auth_user';
const storedUser = loadFromStorage(AUTH_STORAGE_KEY, null);

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoginModalOpen: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, email = 'user@cineglass.tv', name } = action.payload;
      const userObj = {
        id: 'usr_' + Date.now(),
        username: username || 'AppleTV_Explorer',
        displayName: name || username || 'Explorer',
        email: email || `${username}@cineglass.tv`,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        token: 'mock_jwt_token_' + Math.random().toString(36).substring(2),
        role: 'VIP Member',
      };
      state.user = userObj;
      state.isAuthenticated = true;
      state.isLoginModalOpen = false;
      state.error = null;
      saveToStorage(AUTH_STORAGE_KEY, userObj);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      removeFromStorage(AUTH_STORAGE_KEY);
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.error = null;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
      state.error = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  login,
  logout,
  openLoginModal,
  closeLoginModal,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;
