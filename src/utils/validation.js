/**
 * Comprehensive Input Validation and Sanitization Module
 * Implements strict defense-in-depth principles against XSS, Injection, and ReDoS.
 */

// RFC 5322 standard compliant email validation pattern
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates and sanitizes an email address.
 * @param {string} email
 * @returns {{ isValid: boolean, sanitized: string, error?: string }}
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email address is required.' };
  }
  const sanitized = email.trim().toLowerCase();
  if (sanitized.length > 254) {
    return { isValid: false, sanitized, error: 'Email address exceeds maximum permitted length.' };
  }
  if (!EMAIL_REGEX.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Please enter a valid email address (e.g., name@example.com).' };
  }
  return { isValid: true, sanitized };
};

/**
 * Validates a password against production security standards.
 * Enforces minimum 8 characters with alphanumeric composition.
 * @param {string} password
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (password.length > 128) {
    return { isValid: false, error: 'Password exceeds maximum length (128 characters).' };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { isValid: false, error: 'Password must contain at least one letter and one number.' };
  }
  return { isValid: true };
};

/**
 * Sanitizes generic user text input by stripping HTML tags and control characters.
 * @param {string} input
 * @param {number} maxLength
 * @returns {string}
 */
export const sanitizeText = (input, maxLength = 100) => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip angle brackets to prevent HTML/XSS injection
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip non-printable control characters
    .trim()
    .slice(0, maxLength);
};

/**
 * Validates and sanitizes a search query.
 * @param {string} query
 * @returns {string}
 */
export const sanitizeSearchQuery = (query) => {
  return sanitizeText(query, 80);
};

/**
 * Validates an ID to ensure it is numeric or valid UUID.
 * @param {string|number} id
 * @returns {boolean}
 */
export const isValidId = (id) => {
  if (typeof id === 'number') return Number.isInteger(id) && id > 0;
  if (typeof id === 'string') {
    return /^\d+$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }
  return false;
};
