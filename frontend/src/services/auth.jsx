import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { api } from "./api";
import Loader from "../components/Loader.jsx";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        api.me()
            .then(setUser)
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    const login = useCallback(async (identifier, password) => {
        const data = await api.login({ identifier, password });
        localStorage.setItem("token", data.token);
        setUser(data.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        const u = await api.me();
        setUser(u);
        return u;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {loading ? <Loader label="Opening your diary..." /> : children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
