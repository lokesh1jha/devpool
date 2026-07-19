import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { auth, saveToken, clearToken, type AuthUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string,
    role?: "CANDIDATE" | "EMPLOYER",
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate from token on mount
  useEffect(() => {
    const token = localStorage.getItem("dp_token");
    if (!token) {
      setLoading(false);
      return;
    }
    auth
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, user } = await auth.login({ email, password });
    saveToken(token);
    setUser(user);
  }, []);

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: "CANDIDATE" | "EMPLOYER" = "CANDIDATE",
    ) => {
      const { token, user } = await auth.register({ name, email, password, role });
      saveToken(token);
      setUser(user);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await auth.logout().catch(() => {});
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
