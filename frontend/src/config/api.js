/**
 * ============================================================
 * API Configuration (frontend/src/config/api.js)
 * ============================================================
 * Exports the base URL and endpoint builder for API requests and uploaded assets.
 * 
 * In Production (Vercel):
 * Reads VITE_API_URL or VITE_API_BASE_URL (pointing to your Render backend)
 *
 * In Local Development:
 * Defaults to empty string or VITE_API_BASE_URL, utilizing Vite proxy (/api -> :5000)
 * ============================================================
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).replace(/\/$/, '');

/**
 * Builds a full API endpoint URL
 * @param {string} endpoint - Relative API path, e.g. '/api/auth/login'
 * @returns {string} Full destination URL
 */
export const apiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

/**
 * Builds a full static upload URL (for memory capsule photos)
 * @param {string} path - Relative file path, e.g. '/uploads/image.jpg'
 * @returns {string} Full image source URL
 */
export const getUploadUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export default {
  API_BASE_URL,
  apiUrl,
  getUploadUrl,
};
