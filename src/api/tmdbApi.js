import axiosClient from './axiosClient';
import {
  MOCK_TRENDING_MOVIES,
  MOCK_TRENDING_SERIES,
  MOCK_GENRES,
  MOCK_CAST,
} from './mockData';

export const tmdbApi = {
  /**
   * Fetch Trending Movies (day or week)
   */
  getTrendingMovies: async (timeWindow = 'week') => {
    try {
      const data = await axiosClient.get(`/trending/movie/${timeWindow}`);
      return data.results || [];
    } catch (err) {
      console.warn('TMDb trending fetch failed, using fallback data:', err);
      return MOCK_TRENDING_MOVIES;
    }
  },

  /**
   * Fetch Trending Series (day or week)
   */
  getTrendingSeries: async (timeWindow = 'week') => {
    try {
      const data = await axiosClient.get(`/trending/tv/${timeWindow}`);
      return data.results || [];
    } catch (err) {
      console.warn('TMDb series fetch failed, using fallback data:', err);
      return MOCK_TRENDING_SERIES;
    }
  },

  /**
   * Search Movies by Query (supports pagination for Infinite Scroll and Load More)
   */
  searchMovies: async (query, page = 1) => {
    if (!query || !query.trim()) {
      return { results: [], page: 1, total_pages: 1, total_results: 0 };
    }
    try {
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
    } catch (err) {
      console.warn('TMDb search failed, searching mock dataset:', err);
      const lower = query.toLowerCase();
      const matched = MOCK_TRENDING_MOVIES.filter(
        (m) =>
          m.title.toLowerCase().includes(lower) ||
          m.overview?.toLowerCase().includes(lower)
      );
      return {
        results: matched.length > 0 ? matched : MOCK_TRENDING_MOVIES.slice(0, 3),
        page: 1,
        total_pages: 1,
        total_results: matched.length,
      };
    }
  },

  /**
   * Fetch Full Movie Details (including credits & videos appended)
   */
  getMovieDetails: async (movieId) => {
    try {
      const data = await axiosClient.get(`/movie/${movieId}`, {
        params: {
          append_to_response: 'videos,credits,similar,release_dates',
        },
      });
      return data;
    } catch (err) {
      console.warn(`TMDb movie detail (${movieId}) failed, using fallback:`, err);
      const mock =
        MOCK_TRENDING_MOVIES.find((m) => m.id === Number(movieId)) ||
        MOCK_TRENDING_MOVIES[0];
      return {
        ...mock,
        credits: { cast: MOCK_CAST },
        videos: {
          results: [
            {
              id: 'fallback_trailer',
              key: mock.trailer_key || 'dQw4w9WgXcQ',
              site: 'YouTube',
              type: 'Trailer',
              name: `${mock.title} Official Trailer`,
            },
          ],
        },
        similar: { results: MOCK_TRENDING_MOVIES.filter((m) => m.id !== mock.id) },
      };
    }
  },

  /**
   * Fetch Movie Videos/Trailers
   */
  getMovieVideos: async (movieId) => {
    try {
      const data = await axiosClient.get(`/movie/${movieId}/videos`);
      return data.results || [];
    } catch (err) {
      console.warn('TMDb video fetch failed:', err);
      return [
        {
          key: 'dQw4w9WgXcQ',
          site: 'YouTube',
          type: 'Trailer',
          name: 'Official Trailer',
        },
      ];
    }
  },

  /**
   * Fetch Official Movie Genres List
   */
  getGenres: async () => {
    try {
      const data = await axiosClient.get('/genre/movie/list');
      return data.genres || MOCK_GENRES;
    } catch (err) {
      console.warn('TMDb genres fetch failed, using fallback:', err);
      return MOCK_GENRES;
    }
  },

  /**
   * Discover & Filter Movies by Genre, Year, Rating, Sort
   */
  discoverMovies: async ({
    genreId = '',
    year = '',
    minRating = 0,
    sortBy = 'popularity.desc',
    page = 1,
  } = {}) => {
    try {
      const params = {
        page,
        sort_by: sortBy,
        include_adult: false,
      };
      if (genreId) params.with_genres = genreId;
      if (year) params.primary_release_year = year;
      if (minRating > 0) params['vote_average.gte'] = minRating;

      const data = await axiosClient.get('/discover/movie', { params });
      return {
        results: data.results || [],
        page: data.page || 1,
        total_pages: data.total_pages || 1,
        total_results: data.total_results || 0,
      };
    } catch (err) {
      console.warn('TMDb discover failed, filtering fallback data:', err);
      let list = [...MOCK_TRENDING_MOVIES];
      if (genreId) {
        list = list.filter((m) =>
          m.genres?.some((g) => g.id === Number(genreId))
        );
      }
      if (minRating > 0) {
        list = list.filter((m) => m.vote_average >= minRating);
      }
      return {
        results: list,
        page: 1,
        total_pages: 1,
        total_results: list.length,
      };
    }
  },
};
