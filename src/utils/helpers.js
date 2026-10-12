// Image base URLs for TMDb
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Returns full image URL for posters or backdrops
 * @param {string} path - TMDb image path (e.g. /abc.jpg)
 * @param {'poster' | 'backdrop' | 'profile' | 'original'} type
 * @returns {string}
 */
export const getImageUrl = (path, type = 'poster') => {
  if (!path) {
    // Fallback placeholder image with glass SVG
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
  }
  if (path.startsWith('http')) return path;

  switch (type) {
    case 'backdrop':
      return `${IMAGE_BASE_URL}/w1280${path}`;
    case 'original':
      return `${IMAGE_BASE_URL}/original${path}`;
    case 'profile':
      return `${IMAGE_BASE_URL}/w185${path}`;
    case 'poster':
    default:
      return `${IMAGE_BASE_URL}/w500${path}`;
  }
};

/**
 * Formats a release date string into just the year
 * @param {string} dateString
 * @returns {string}
 */
export const formatYear = (dateString) => {
  if (!dateString) return 'TBA';
  return dateString.substring(0, 4);
};

/**
 * Formats runtime minutes into "2h 15m" format
 * @param {number} minutes
 * @returns {string}
 */
export const formatRuntime = (minutes) => {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
};

/**
 * Formats vote average to 1 decimal place
 * @param {number} rating
 * @returns {string}
 */
export const formatRating = (rating) => {
  if (rating === undefined || rating === null || Number.isNaN(rating)) return 'NR';
  return Number(rating).toFixed(1);
};

/**
 * Truncates text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 140) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};
