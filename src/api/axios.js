import axios from "axios";

/**
 * Base API URL
 * - Uses Vite env variable if defined
 * - Falls back to Render backend in production
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://ecommerce-backend-kch0.onrender.com";

/**
 * Axios instance configured for the Django REST API
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sets the Authorization header for all subsequent requests
 * @param {string|null} token JWT access token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("access_token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("access_token");
  }
};

/**
 * Clears auth tokens and axios headers
 */
export const clearAuthToken = () => {
  delete api.defaults.headers.common.Authorization;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

/**
 * Get stored access token
 */
export const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

/**
 * Response interceptor
 * - Auto-logout on 401 (expired / invalid token)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Restore token on app reload
 */
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

export default api;
