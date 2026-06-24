import { createContext, useContext, useMemo, useState } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "authUser";

function readStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const isAuthenticated = Boolean(user?.id);

  const persistUser = (nextUser) => {
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  };

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const login = async (email, password) => {
    const response = await api.post("/sessions/signin", { email, password });
    persistUser(response.data.user);
  };

  const register = async ({ username, email, password }) => {
    await api.post("/users", { username, email, password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      await api.delete("/sessions/signout");
    } finally {
      clearAuth();
    }
  };

  const value = useMemo(
    () => ({
      user,
      userId: user?.id ?? null,
      isAdmin: user?.is_admin === 1,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
