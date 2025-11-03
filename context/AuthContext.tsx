import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { getApiUrl, API_CONFIG } from "../config/api";

type User = {
  email?: string;
  [key: string]: any;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  setUser: (userData: User) => void;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await SecureStore.getItemAsync("user");
      console.log("user", user);
      const response = await fetch(
        getApiUrl(API_CONFIG.ENDPOINTS.USERS + "/me"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: user ? `Bearer ${JSON.parse(user).token}` : "",
          },
        }
      );
      const data = await response.json();
      console.log("data", data);
      if (response.ok) {
        setUser({ ...data.user, token: data.token });
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!user, user, login, logout, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};

export default AuthContext;
