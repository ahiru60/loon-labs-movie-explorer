import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/localStorage';
import {
  isSupabaseConfigured,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseGetSession,
} from '../../services/supabaseClient';
import { fetchUserFavoritesFromDb, syncLocalFavoritesToDb } from '../favorites/favoritesSlice';

const AUTH_STORAGE_KEY = 'cineglass_auth_user';
const storedUser = loadFromStorage(AUTH_STORAGE_KEY, null);

// Thunk: Check existing Supabase session on app boot
export const checkSupabaseSession = createAsyncThunk(
  'auth/checkSupabaseSession',
  async (_, { dispatch }) => {
    if (!isSupabaseConfigured()) {
      return storedUser;
    }
    try {
      const session = await supabaseGetSession();
      if (session?.user) {
        const userObj = {
          id: session.user.id,
          username:
            session.user.user_metadata?.display_name ||
            session.user.email?.split('@')[0] ||
            'CineGlass_Member',
          displayName:
            session.user.user_metadata?.display_name ||
            session.user.email?.split('@')[0] ||
            'Explorer',
          email: session.user.email,
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
          token: session.access_token,
          role: 'Member',
          isSupabase: true,
        };
        saveToStorage(AUTH_STORAGE_KEY, userObj);
        // Fetch user's saved favorites from Supabase DB
        dispatch(fetchUserFavoritesFromDb(userObj.id));
        return userObj;
      }
      return storedUser;
    } catch (err) {
      console.warn('Session check warning:', err.message);
      return storedUser;
    }
  }
);

// Thunk: Login with Supabase
export const loginWithSupabase = createAsyncThunk(
  'auth/loginWithSupabase',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    if (!isSupabaseConfigured()) {
      // Local fallback login
      const username = email.split('@')[0];
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        username,
        displayName: username,
        email,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        token: 'local_session_' + Date.now(),
        role: 'Member',
        isSupabase: false,
      };
      saveToStorage(AUTH_STORAGE_KEY, fallbackUser);
      return fallbackUser;
    }

    try {
      const data = await supabaseSignIn(email, password);
      if (!data?.user) {
        return rejectWithValue('No user found.');
      }
      const userObj = {
        id: data.user.id,
        username:
          data.user.user_metadata?.display_name ||
          data.user.email?.split('@')[0] ||
          'CineGlass_Member',
        displayName:
          data.user.user_metadata?.display_name ||
          data.user.email?.split('@')[0] ||
          'Explorer',
        email: data.user.email,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        token: data.session?.access_token || 'supabase_token',
        role: 'Member',
        isSupabase: true,
      };
      saveToStorage(AUTH_STORAGE_KEY, userObj);

      // Sync and load favorites from DB
      dispatch(fetchUserFavoritesFromDb(userObj.id));
      dispatch(syncLocalFavoritesToDb(userObj.id));

      return userObj;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed. Please check your credentials.');
    }
  }
);

// Thunk: Sign Up with Supabase
export const signupWithSupabase = createAsyncThunk(
  'auth/signupWithSupabase',
  async ({ email, password, displayName }, { dispatch, rejectWithValue }) => {
    if (!isSupabaseConfigured()) {
      const username = displayName || email.split('@')[0];
      const fallbackUser = {
        id: 'usr_' + Date.now(),
        username,
        displayName: username,
        email,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        token: 'local_session_' + Date.now(),
        role: 'Member',
        isSupabase: false,
      };
      saveToStorage(AUTH_STORAGE_KEY, fallbackUser);
      return { user: fallbackUser, requiresVerification: false };
    }

    try {
      const data = await supabaseSignUp(email, password, displayName);
      if (data?.session && data?.user) {
        const userObj = {
          id: data.user.id,
          username: displayName || data.user.email?.split('@')[0],
          displayName: displayName || data.user.email?.split('@')[0],
          email: data.user.email,
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
          token: data.session.access_token,
          role: 'Member',
          isSupabase: true,
        };
        saveToStorage(AUTH_STORAGE_KEY, userObj);
        dispatch(fetchUserFavoritesFromDb(userObj.id));
        return { user: userObj, requiresVerification: false };
      }
      return {
        user: null,
        requiresVerification: true,
        message: 'Registration successful! Please check your email to confirm your account.',
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Sign up failed.');
    }
  }
);

// Thunk: Logout user
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabaseSignOut();
    } catch (err) {
      console.warn('Logout warning:', err.message);
    }
  }
  removeFromStorage(AUTH_STORAGE_KEY);
  return null;
});

const initialState = {
  user: storedUser,
  isAuthenticated: !!storedUser,
  isLoginModalOpen: false,
  isLoading: false,
  error: null,
  successMessage: null,
  isSupabaseConfigured: isSupabaseConfigured(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous login (for backwards compatibility / evaluator demo)
    login: (state, action) => {
      const { username, email = 'user@cineglass.tv', name } = action.payload;
      const userObj = {
        id: 'usr_' + Date.now(),
        username: username || 'CineGlass_Member',
        displayName: name || username || 'Explorer',
        email: email || `${username || 'member'}@cineglass.tv`,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`,
        token: 'auth_session_token_' + Math.random().toString(36).substring(2),
        role: 'VIP Member',
        isSupabase: false,
      };
      state.user = userObj;
      state.isAuthenticated = true;
      state.isLoginModalOpen = false;
      state.error = null;
      state.successMessage = null;
      saveToStorage(AUTH_STORAGE_KEY, userObj);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      removeFromStorage(AUTH_STORAGE_KEY);
      if (isSupabaseConfigured()) {
        supabaseSignOut();
      }
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.error = null;
      state.successMessage = null;
      state.isSupabaseConfigured = isSupabaseConfigured();
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
      state.error = null;
      state.successMessage = null;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearAuthMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    syncSupabaseConfigState: (state) => {
      state.isSupabaseConfigured = isSupabaseConfigured();
    },
  },
  extraReducers: (builder) => {
    // Check session
    builder
      .addCase(checkSupabaseSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
        state.isSupabaseConfigured = isSupabaseConfigured();
      })
      // Login
      .addCase(loginWithSupabase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginWithSupabase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoginModalOpen = false;
        state.error = null;
      })
      .addCase(loginWithSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed.';
      })
      // Signup
      .addCase(signupWithSupabase.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(signupWithSupabase.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.isLoginModalOpen = false;
        } else if (action.payload.requiresVerification) {
          state.successMessage = action.payload.message;
        }
        state.error = null;
      })
      .addCase(signupWithSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Sign up failed.';
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.successMessage = null;
      });
  },
});

export const {
  login,
  logout,
  openLoginModal,
  closeLoginModal,
  setAuthError,
  clearAuthMessages,
  syncSupabaseConfigState,
} = authSlice.actions;

export default authSlice.reducer;
