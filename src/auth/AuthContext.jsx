
import { createContext, useState, useEffect, useContext } from "react";
import { login as loginApi, register as registerApi, me } from "../api/auth.api";
import { setAuthToken, clearAuthToken, getAuthToken } from "../api/axios";

export const AuthContext = createContext();

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

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = getAuthToken();
            if (token) {
                setAuthToken(token);
                try {
                    const res = await me();
                    setUser(res.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    clearAuthToken();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoginStatus();
    }, []);

    const login = async (credentials) => {
        const res = await loginApi(credentials);
        const { access, refresh } = res.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        setAuthToken(access);
        const userRes = await me();
        setUser(userRes.data);
        setIsAuthenticated(true);
    };
    
    const register = async (data) => {
        await registerApi(data);
        // After successful registration, log the user in
        await login({ username: data.username, password: data.password });
    };

    const logout = () => {
        clearAuthToken();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};
