import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "./api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  school_id: string;
  phone?: string;
  avatar_url?: string;
  schools?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  student_details?: {
    student_id?: string;
    dob?: string;
    gender?: string;
    parent_name?: string;
    parent_phone?: string;
    address?: string;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("student_token");
    const savedUser = localStorage.getItem("student_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("student_token");
        localStorage.removeItem("student_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: newToken, user: userData } = response.data;

      if (userData.role !== "student") {
        return { success: false, error: "Access denied. Student credentials required." };
      }

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("student_token", newToken);
      localStorage.setItem("student_user", JSON.stringify(userData));
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed. Please try again.";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("student_token");
    localStorage.removeItem("student_user");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("student_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token && !!user, user, token, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
