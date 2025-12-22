import { createContext, useState, useEffect, useContext } from "react";
import {
  login as loginApi,
  register as registerApi,
  getMe,
} from "../api/auth.api";
import { setAuthToken, clearAuthToken, getAuthToken } from "../api/axios";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Restore session on page refresh
   */
  useEffect(() => {
    const restoreSession = async () => {
      const token = getAuthToken();

      if (!token) {
        setLoading(false);
        return;
      }

      setAuthToken(token);

      try {
        const res = await getMe();
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        clearAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  /**
   * Login
   */
  const login = async (credentials) => {
    const res = await loginApi(credentials);

    const { access, refresh } = res.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    setAuthToken(access);

    const userRes = await getMe();
    setUser(userRes.data);
    setIsAuthenticated(true);
  };

  /**
   * Register + auto login
   */
  const register = async (data) => {
    await registerApi(data);
    await login({ username: data.username, password: data.password });
  };

  /**
   * Logout
   */
  const logout = () => {
    clearAuthToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
