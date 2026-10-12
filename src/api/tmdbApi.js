import axiosClient from './axiosClient';

/**
 * Official TMDb API v3 Service
 * Reference: https://developer.themoviedb.org/reference/getting-started
 */
export const tmdbApi = {
  /**
   * Get trending movies by time window ('day' | 'week')
   * Endpoint: GET /3/trending/movie/{time_window}
   */
  getTrendingMovies: async (timeWindow = 'week') => {
    const data = await axiosClient.get(`/trending/movie/${timeWindow}`);
    return data.results || [];
  },

  /**
   * Get trending TV shows by time window ('day' | 'week')
   * Endpoint: GET /3/trending/tv/{time_window}
   */
  getTrendingSeries: async (timeWindow = 'week') => {
    const data = await axiosClient.get(`/trending/tv/${timeWindow}`);
    return data.results || [];
  },

  /**
   * Get movies currently playing in theaters
   * Endpoint: GET /3/movie/now_playing
   */
  getNowPlayingMovies: async (page = 1) => {
    const data = await axiosClient.get('/movie/now_playing', {
      params: { page },
    });
    return data.results || [];
  },

  /**
   * Get top-rated movies
   * Endpoint: GET /3/movie/top_rated
   */
  getTopRatedMovies: async (page = 1) => {
    const data = await axiosClient.get('/movie/top_rated', {
      params: { page },
    });
    return data.results || [];
  },

  /**
   * Get popular movies
   * Endpoint: GET /3/movie/popular
   */
  getPopularMovies: async (page = 1) => {
    const data = await axiosClient.get('/movie/popular', {
      params: { page },
    });
    return data.results || [];
  },

  /**
   * Search for movies by title
   * Endpoint: GET /3/search/movie
   */
  searchMovies: async (query, page = 1) => {
    if (!query || !query.trim()) {
      return { results: [], page: 1, total_pages: 1, total_results: 0 };
    }
    const data = await axiosClient.get('/search/movie', {
      params: {
        query: query.trim(),
        page,
        include_adult: false,
      },
    });
    return {
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };
  },

  /**
   * Get details for movies or TV series with appended credits, videos, and ratings
   * Endpoint: GET /3/movie/{id} or GET /3/tv/{id}
   */
  getMovieDetails: async (id, mediaType = 'movie') => {
    // If explicitly marked as TV show
    if (mediaType === 'tv') {
      const data = await axiosClient.get(`/tv/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,content_ratings',
        },
      });
      return { ...data, media_type: 'tv' };
    }

    try {
      const data = await axiosClient.get(`/movie/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,release_dates',
        },
      });
      return { ...data, media_type: 'movie' };
    } catch (err) {
      // If /movie/ returns 404, automatically check if it is a TV series!
      if (err.status === 404) {
        try {
          const tvData = await axiosClient.get(`/tv/${id}`, {
            params: {
              append_to_response: 'videos,credits,similar,content_ratings',
            },
          });
          return { ...tvData, media_type: 'tv' };
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },

  /**
   * Get official list of movie genres
   * Endpoint: GET /3/genre/movie/list
   */
  getGenres: async () => {
    const data = await axiosClient.get('/genre/movie/list');
    return data.genres || [];
  },

  /**
   * Discover and filter movies by genre, release year, minimum rating, and sort order
   * Endpoint: GET /3/discover/movie
   */
  discoverMovies: async ({
    genreId = '',
    year = '',
    minRating = 0,
    sortBy = 'popularity.desc',
    page = 1,
  } = {}) => {
    const params = {
      page,
      sort_by: sortBy,
      include_adult: false,
    };

    if (genreId) params.with_genres = genreId;
    if (year) params.primary_release_year = year;
    if (minRating > 0) {
      params['vote_average.gte'] = minRating;
      params['vote_count.gte'] = 50; // Ensure rated films have sufficient votes
    }

    const data = await axiosClient.get('/discover/movie', { params });
    return {
      results: data.results || [],
      page: data.page || 1,
      total_pages: data.total_pages || 1,
      total_results: data.total_results || 0,
    };
  },
};
