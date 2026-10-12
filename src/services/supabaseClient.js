import { createClient } from '@supabase/supabase-js';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';

export const SUPABASE_URL_KEY = 'cineglass_supabase_url';
export const SUPABASE_ANON_KEY_KEY = 'cineglass_supabase_anon_key';

// Read from env or local storage
const getInitialUrl = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL ||
    loadFromStorage(SUPABASE_URL_KEY, '') ||
    ''
  );
};

const getInitialKey = () => {
  return (
    import.meta.env.VITE_SUPABASE_ANON_KEY ||
    loadFromStorage(SUPABASE_ANON_KEY_KEY, '') ||
    ''
  );
};

let currentUrl = getInitialUrl();
let currentKey = getInitialKey();
let supabaseInstance = null;

// Initialize Supabase client if valid credentials exist
export const initSupabaseClient = (url = currentUrl, key = currentKey) => {
  if (url && key && typeof url === 'string' && url.startsWith('http') && key.length > 10) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      currentUrl = url;
      currentKey = key;
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
      return null;
    }
  }
  supabaseInstance = null;
  return null;
};

// Initial boot
initSupabaseClient();

export const getSupabase = () => {
  if (!supabaseInstance && currentUrl && currentKey) {
    return initSupabaseClient(currentUrl, currentKey);
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseInstance ||
      (currentUrl && currentUrl.startsWith('http') && currentKey && currentKey.length > 10)
  );
};

export const getSupabaseConfig = () => ({
  url: currentUrl,
  anonKey: currentKey,
  isConfigured: isSupabaseConfigured(),
});

export const saveSupabaseConfig = (url, anonKey) => {
  currentUrl = (url || '').trim();
  currentKey = (anonKey || '').trim();
  saveToStorage(SUPABASE_URL_KEY, currentUrl);
  saveToStorage(SUPABASE_ANON_KEY_KEY, currentKey);
  return initSupabaseClient(currentUrl, currentKey);
};

// Test connection
export const testSupabaseConnection = async (testUrl = currentUrl, testKey = currentKey) => {
  if (!testUrl || !testKey) {
    return { success: false, error: 'URL and Anon Key are required.' };
  }
  try {
    const client = createClient(testUrl, testKey);
    // Simple ping check via getSession or table count
    const { error } = await client.auth.getSession();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message || 'Connection failed' };
  }
};

/* ==========================================================================
   Supabase Authentication Helpers
   ========================================================================== */

export const supabaseSignUp = async (email, password, displayName = '') => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase client is not configured.');

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  });

  if (error) throw error;
  return data;
};

export const supabaseSignIn = async (email, password) => {
  const client = getSupabase();
  if (!client) throw new Error('Supabase client is not configured.');

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const supabaseSignOut = async () => {
  const client = getSupabase();
  if (!client) return;

  const { error } = await client.auth.signOut();
  if (error) {
    console.warn('Supabase sign out error:', error.message);
  }
};

export const supabaseGetSession = async () => {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.getSession();
    if (error || !data) return null;
    return data.session;
  } catch (err) {
    console.warn('Error fetching Supabase session:', err);
    return null;
  }
};

export const supabaseOnAuthStateChange = (callback) => {
  const client = getSupabase();
  if (!client) return () => {};

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return () => {
    subscription?.unsubscribe();
  };
};

/* ==========================================================================
   Supabase Database Helpers (Favorites / Watchlist)
   ========================================================================== */

/**
 * Fetch all favorites for a user from Supabase database table 'favorites'
 */
export const supabaseGetFavorites = async (userId) => {
  const client = getSupabase();
  if (!client || !userId) return [];

  const { data, error } = await client
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching favorites from Supabase:', error.message);
    throw error;
  }

  // Map database columns to app movie card structure
  return (data || []).map((row) => ({
    id: Number(row.movie_id),
    title: row.title,
    name: row.title,
    poster_path: row.poster_path,
    backdrop_path: row.backdrop_path,
    vote_average: Number(row.vote_average) || 0,
    release_date: row.release_date,
    first_air_date: row.release_date,
    overview: row.overview || '',
    media_type: row.media_type || 'movie',
    created_at: row.created_at,
  }));
};

/**
 * Add a movie to user's favorites in Supabase
 */
export const supabaseAddFavorite = async (userId, movie) => {
  const client = getSupabase();
  if (!client || !userId || !movie) return null;

  const row = {
    user_id: userId,
    movie_id: movie.id,
    title: movie.title || movie.name || 'Untitled',
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    vote_average: Number(movie.vote_average) || 0,
    release_date: movie.release_date || movie.first_air_date || null,
    overview: movie.overview || '',
    media_type: movie.media_type || 'movie',
    created_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('favorites')
    .upsert(row, { onConflict: 'user_id,movie_id' });

  if (error) {
    console.warn('Error adding favorite to Supabase:', error.message);
    throw error;
  }
  return data;
};

/**
 * Remove a movie from user's favorites in Supabase
 */
export const supabaseRemoveFavorite = async (userId, movieId) => {
  const client = getSupabase();
  if (!client || !userId || !movieId) return null;

  const { data, error } = await client
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);

  if (error) {
    console.warn('Error removing favorite from Supabase:', error.message);
    throw error;
  }
  return data;
};

/**
 * Sync local array of favorites up to Supabase database for a user
 */
export const supabaseSyncFavorites = async (userId, localFavorites = []) => {
  const client = getSupabase();
  if (!client || !userId || !localFavorites.length) return [];

  const rows = localFavorites.map((movie) => ({
    user_id: userId,
    movie_id: movie.id,
    title: movie.title || movie.name || 'Untitled',
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    vote_average: Number(movie.vote_average) || 0,
    release_date: movie.release_date || movie.first_air_date || null,
    overview: movie.overview || '',
    media_type: movie.media_type || 'movie',
    created_at: new Date().toISOString(),
  }));

  const { data, error } = await client
    .from('favorites')
    .upsert(rows, { onConflict: 'user_id,movie_id' });

  if (error) {
    console.warn('Error syncing favorites to Supabase:', error.message);
    throw error;
  }
  return data;
};
