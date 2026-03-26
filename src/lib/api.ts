/**
 * Centralized API URL Management
 * Ensures consistent URL formatting (no trailing slashes) 
 * across the entire application.
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Remove any trailing slash to prevent double-slash issues in fetches
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, '');

export const getApiUrl = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
