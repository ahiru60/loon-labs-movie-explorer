import { createClient } from '@supabase/supabase-js';
import { sanitizeText, isValidId } from '../utils/validation';

// Security cleanup: purge any legacy credentials from client-side localStorage
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem('cineglass_supabase_url');
    window.localStorage.removeItem('cineglass_supabase_anon_key');
    window.localStorage.removeItem('cineglass_custom_tmdb_key');
  }
} catch {
  // Silent fallback
}

// Read strictly from environment variables (NEVER EXPOSE VIA UI OR PERSIST IN LOCALSTORAGE)
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

let supabaseInstance = null;

// Initialize Supabase client if valid credentials exist in environment
export const initSupabaseClient = () => {
  if (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('http') &&
    SUPABASE_ANON_KEY.length > 10
  ) {
    try {
      supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
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
  if (!supabaseInstance && SUPABASE_URL && SUPABASE_ANON_KEY) {
    return initSupabaseClient();
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseInstance ||
      (SUPABASE_URL &&
        SUPABASE_URL.startsWith('http') &&
        SUPABASE_ANON_KEY &&
        SUPABASE_ANON_KEY.length > 10)
  );
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
  if (!client || !userId || !isValidId(userId)) return [];

  try {
    const { data, error } = await client
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching favorites:', error.message);
      throw new Error('Unable to retrieve watchlist from database.');
    }

    // Map database columns to app movie card structure with sanitization
    return (data || []).map((row) => ({
      id: Number(row.movie_id),
      title: sanitizeText(row.title, 200),
      name: sanitizeText(row.title, 200),
      poster_path: row.poster_path,
      backdrop_path: row.backdrop_path,
      vote_average: Math.min(10, Math.max(0, Number(row.vote_average) || 0)),
      release_date: row.release_date,
      first_air_date: row.release_date,
      overview: sanitizeText(row.overview || '', 1000),
      media_type: row.media_type === 'tv' ? 'tv' : 'movie',
      created_at: row.created_at,
    }));
  } catch (err) {
    throw new Error(err.message || 'Database query failed.');
  }
};

/**
 * Add a movie to user's favorites in Supabase
 */
export const supabaseAddFavorite = async (userId, movie) => {
  const client = getSupabase();
  if (!client || !userId || !isValidId(userId) || !movie || !isValidId(movie.id)) {
    return null;
  }

  const sanitizedRow = {
    user_id: userId,
    movie_id: Math.floor(Number(movie.id)),
    title: sanitizeText(movie.title || movie.name || 'Untitled', 200),
    poster_path: movie.poster_path ? String(movie.poster_path).slice(0, 255) : null,
    backdrop_path: movie.backdrop_path ? String(movie.backdrop_path).slice(0, 255) : null,
    vote_average: Math.min(10, Math.max(0, Number(movie.vote_average) || 0)),
    release_date: movie.release_date || movie.first_air_date || null,
    overview: sanitizeText(movie.overview || '', 1000),
    media_type: movie.media_type === 'tv' ? 'tv' : 'movie',
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await client
      .from('favorites')
      .upsert(sanitizedRow, { onConflict: 'user_id,movie_id' });

    if (error) {
      console.warn('Error adding favorite:', error.message);
      throw new Error('Unable to save item to database.');
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Database insert failed.');
  }
};

/**
 * Remove a movie from user's favorites in Supabase
 */
export const supabaseRemoveFavorite = async (userId, movieId) => {
  const client = getSupabase();
  if (!client || !userId || !isValidId(userId) || !movieId || !isValidId(movieId)) {
    return null;
  }

  try {
    const numericMovieId = Math.floor(Number(movieId));
    const { data, error } = await client
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('movie_id', numericMovieId);

    if (error) {
      console.warn('Error removing favorite:', error.message);
      throw new Error('Unable to remove item from database.');
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Database delete failed.');
  }
};

/**
 * Sync local array of favorites up to Supabase database for a user
 */
export const supabaseSyncFavorites = async (userId, localFavorites = []) => {
  const client = getSupabase();
  if (!client || !userId || !isValidId(userId) || !Array.isArray(localFavorites) || !localFavorites.length) {
    return [];
  }

  const validRows = localFavorites
    .filter((movie) => movie && isValidId(movie.id))
    .map((movie) => ({
      user_id: userId,
      movie_id: Math.floor(Number(movie.id)),
      title: sanitizeText(movie.title || movie.name || 'Untitled', 200),
      poster_path: movie.poster_path ? String(movie.poster_path).slice(0, 255) : null,
      backdrop_path: movie.backdrop_path ? String(movie.backdrop_path).slice(0, 255) : null,
      vote_average: Math.min(10, Math.max(0, Number(movie.vote_average) || 0)),
      release_date: movie.release_date || movie.first_air_date || null,
      overview: sanitizeText(movie.overview || '', 1000),
      media_type: movie.media_type === 'tv' ? 'tv' : 'movie',
      created_at: new Date().toISOString(),
    }));

  if (!validRows.length) return [];

  try {
    const { data, error } = await client
      .from('favorites')
      .upsert(validRows, { onConflict: 'user_id,movie_id' });

    if (error) {
      console.warn('Error syncing favorites:', error.message);
      throw new Error('Unable to synchronize watchlist.');
    }
    return data;
  } catch (err) {
    throw new Error(err.message || 'Database synchronization failed.');
  }
};
