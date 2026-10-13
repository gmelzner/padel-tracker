"use client";

import { createContext, useContext, useCallback, useMemo } from "react";
import {
  SessionProvider,
  useSession,
  signIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const id = session?.user?.id;
  const email = session?.user?.email;
  const name = session?.user?.name ?? null;
  const avatarUrl = session?.user?.image ?? null;
  const user = useMemo<AuthUser | null>(
    () => (id && email ? { id, email, name, avatarUrl } : null),
    [id, email, name, avatarUrl]
  );

  const signInWithGoogle = useCallback(async (redirectTo?: string) => {
    const callbackUrl = redirectTo ?? window.location.pathname + window.location.hash;
    await signIn("google", { callbackUrl });
  }, []);

  const signOut = useCallback(async () => {
    await nextAuthSignOut({ redirect: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading: status === "loading", signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
}
