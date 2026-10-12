import axios from 'axios';
import { loadFromStorage } from '../utils/localStorage';

// Default working key or env variable
const DEFAULT_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

export const getActiveApiKey = () => {
  // Check if user set a custom key in localStorage settings
  const customKey = loadFromStorage('cineglass_custom_tmdb_key', null);
  if (customKey && customKey.trim().length > 10) {
    return customKey.trim();
  }
  return DEFAULT_API_KEY;
};

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically append api_key
axiosClient.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      api_key: getActiveApiKey(),
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: graceful error normalization
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const formattedError = {
      status: error.response?.status || 500,
      message:
        error.response?.data?.status_message ||
        error.message ||
        'Unable to communicate with TMDb servers. Please check your network or API key.',
    };
    return Promise.reject(formattedError);
  }
);

export default axiosClient;
