import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import { API_URL } from "../config/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Memoizamos la función para mantener su referencia estable
  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/employees/me`, {
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
      } else {
        const json = await res.json();
        setUser(json.data);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Solo se ejecuta una vez al montar
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // ✅ Memoizamos login
  const login = useCallback(
    async (usuario, password) => {
      const res = await fetch(`${API_URL}/api/employees/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ usuario, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      setUser(json.data);
      navigate("/");
    },
    [navigate]
  );

  // ✅ Memoizamos logout
  const logout = useCallback(async () => {
    await fetch(`${API_URL}/api/employees/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }, []);

  // ✅ Memoizamos el value del contexto
  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      login,
      logout,
      refresh: fetchMe,
    }),
    [user, loading, login, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para consumir el contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
