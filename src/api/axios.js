import axios from "axios";

/**
 * Creates an Axios instance configured for API calls.
 * - Sets a relative baseURL to '/api' to work with reverse proxies in
 *   development (Cloud Workstations) and production. This avoids CORS issues.
 * - Does not use `withCredentials: true` as it's not needed for Bearer token auth.
 */
const api = axios.create({
  baseURL: "/api",
});

/**
 * Sets the Authorization header for all subsequent requests made with the api instance.
 * @param {string} token The JWT access token.
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("access_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("access_token");
  }
};

/**
 * Removes auth tokens from the api instance and localStorage.
 */
export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

/**
 * Retrieves the access token from localStorage.
 * @returns {string|null}
 */
export const getAuthToken = () => {
  return localStorage.getItem("access_token");
};

/**
 * Axios response interceptor for handling 401 Unauthorized errors.
 * If a 401 is received, it clears the user's session and redirects to the login page.
 */
api.interceptors.response.use(
  (response) => response, // Pass through successful responses.
  (error) => {
    // Check if the error is a 401 Unauthorized.
    if (error.response && error.response.status === 401) {
      clearAuthToken();
      // Redirect to the login page.
      // This ensures the user can re-authenticate.
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    // Reject the promise for all other errors.
    return Promise.reject(error);
  }
);

/**
 * On initial application load, this block checks for an existing access token in
 * localStorage. If found, it sets the token on the Axios instance, ensuring
 * that the user remains authenticated across page refreshes.
 */
const initialToken = getAuthToken();
if (initialToken) {
  setAuthToken(initialToken);
}

export default api;
