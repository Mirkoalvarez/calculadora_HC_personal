import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authApi } from "../services/api";
import type { AuthTokens, UserProfile } from "../types";

interface AuthContextType {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(() => {
    const stored = localStorage.getItem("tokens");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tokens) {
      authApi
        .profile()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("tokens");
          setTokens(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [tokens]);

  const login = async (username: string, password: string) => {
    const { data } = await authApi.login({ username, password });
    localStorage.setItem("tokens", JSON.stringify(data));
    setTokens(data);
  };

  const register = async (username: string, email: string, password: string) => {
    await authApi.register({
      username,
      email,
      password,
      password_confirm: password,
    });
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("tokens");
    setTokens(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, tokens, isAuthenticated: !!user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
