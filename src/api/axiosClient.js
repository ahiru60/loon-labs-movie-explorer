import axios from 'axios';

// Read strictly from environment variable (NEVER HARDCODE OR EXPOSE TO UI)
const ENV_API_KEY = (import.meta.env.VITE_TMDB_API_KEY || '').trim();
const BASE_URL = (import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3').trim();

/**
 * Resolves active TMDb API Key strictly from environment variable.
 */
export const getActiveApiKey = () => {
  return ENV_API_KEY;
};

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically append sanitized api_key
axiosClient.interceptors.request.use(
  (config) => {
    const key = getActiveApiKey();
    if (!key) {
      return Promise.reject(new Error('Missing TMDb API Key. Please configure VITE_TMDB_API_KEY in your .env file.'));
    }
    config.params = {
      ...config.params,
      api_key: key,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful error normalization & security sanitization
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Sanitize error: never leak authorization keys or raw request parameters in error object
    const status = error.response?.status || 500;
    let message = 'Unable to communicate with TMDb servers. Please check your network or API key configuration.';

    if (error.response?.data?.status_message) {
      message = error.response.data.status_message;
    } else if (error.message && !error.message.includes('key')) {
      message = error.message;
    }

    return Promise.reject({
      status,
      message,
    });
  }
);

export default axiosClient;
