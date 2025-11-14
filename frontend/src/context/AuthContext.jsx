import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router";
import {
  loginUser,
  logoutUser,
  verifyToken,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users.service.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* =========================================================
     Al montar, verificar sesión con el token guardado
  ========================================================= */
  const checkSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await verifyToken(token);
      setUser(data.user || null);
    } catch (err) {
      console.error("Error verificando token:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  /* =========================================================
     LOGIN
  ========================================================= */
  const login = useCallback(
    async (credentials) => {
      try {
        setError(null);
        const data = await loginUser(credentials); // { token, user }
        localStorage.setItem("token", data.token);
        setUser(data.user);
        navigate("/");
      } catch (err) {
        console.error("Error en login:", err);
        setError(err.message);
        throw err;
      }
    },
    [navigate]
  );

  /* =========================================================
     LOGOUT
  ========================================================= */
  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn("Logout falló (continuando):", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  /* =========================================================
     CRUD DE USUARIOS
  ========================================================= */
  const fetchUsers = useCallback(async () => {
    try {
      const users = await getAllUsers();
      setUsers(users);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchUserById = useCallback(async (id) => {
    try {
      const user = await getUserById(id);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (userData) => {
      try {
        await createUser(userData);
        navigate("/dashboard/users");
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [navigate]
  );

  const modifyUser = useCallback(async (id, userData) => {
    try {
      const user = await updateUser(id, userData);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const removeUser = useCallback(async (id) => {
    try {
      const response = await deleteUser(id);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /* =========================================================
     VALORES EXPUESTOS AL CONTEXTO
  ========================================================= */
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      users,
      setUsers,
      login,
      logout,
      fetchUsers,
      fetchUserById,
      register,
      modifyUser,
      removeUser,
    }),
    [
      user,
      loading,
      error,
      users,
      login,
      logout,
      fetchUsers,
      fetchUserById,
      register,
      modifyUser,
      removeUser,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   Hook personalizado para usar el contexto
========================================================= */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
