import { createContext, useContext, useState } from "react";
import * as authApi from "../api/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    const me = await authApi.me();
    setUser(me.data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);