import api from "./axios";

/**
 * Login user
 * Expects: { username, password }
 * Returns: { access, refresh }
 */
export const login = (credentials) => {
  return api.post("/auth/login/", credentials);
};

/**
 * Register new user
 * Expects: { username, email, password }
 */
export const register = (data) => {
  return api.post("/auth/register/", data);
};

/**
 * Get current authenticated user profile
 */
export const getMe = () => {
  return api.get("/auth/me/");
};

/**
 * Refresh access token (optional, for later use)
 */
export const refreshToken = (refresh) => {
  return api.post("/auth/refresh/", { refresh });
};
