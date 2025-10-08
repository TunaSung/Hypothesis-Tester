import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { saveToken, clearToken } from "../../service/auth.service";
import { getHistory } from "../../service/analyze.service";
import type { HistoryItem } from "../../types/Analyze";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  history: HistoryItem[]
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      setIsAuthenticated(!!token)

      if (!token) return

      try {
        const data = await getHistory()
        setHistory(data.history)
      } catch (error) {
        console.log("load user data failed", error)
      }
    };
    fetchUser()
  }, []);

  const login = async (token: string) => {
    saveToken(token)
    setIsAuthenticated(true)
    try {
      const data = await getHistory();
      setHistory(data.history);
    } catch (error) {
      console.error("fetch history failed", error);
    }
  };
  
  const logout = useCallback(async () => {
    clearToken()
    setIsAuthenticated(false)
    setHistory([])
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    login,
    logout,
    history
  }), [isAuthenticated, login, logout, history])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}