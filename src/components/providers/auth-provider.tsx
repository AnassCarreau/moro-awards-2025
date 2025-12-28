"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (provider: "x" | "google" | "discord") => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Usar memo para el cliente (aunque ya es singleton, por seguridad)
  const supabase = useMemo(() => createClient(), []);

  // Función para cargar el perfil con reintentos
  const loadProfile = useCallback(
    async (userId: string, retries = 3): Promise<Profile | null> => {
      for (let i = 0; i < retries; i++) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (data) {
          return data as Profile;
        }

        if (error && i < retries - 1) {
          // Esperar un poco antes de reintentar (el trigger puede estar creando el perfil)
          await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
        }
      }
      return null;
    },
    [supabase]
  );

  // Función para refrescar el perfil manualmente
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const newProfile = await loadProfile(user.id);
    if (newProfile) {
      setProfile(newProfile);
    }
  }, [user, loadProfile]);

  // Cargar sesión inicial
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Obtener sesión actual
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Cargar perfil con reintentos
          const userProfile = await loadProfile(currentSession.user.id);
          if (mounted && userProfile) {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Suscribirse a cambios de auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      console.log("Auth state changed:", event);

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Cargar perfil con reintentos
        const userProfile = await loadProfile(newSession.user.id);
        if (mounted) {
          setProfile(userProfile);
        }
      } else {
        setProfile(null);
      }

      // Asegurar que loading es false después de cualquier cambio
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signIn = useCallback(
    async (provider: "x" | "google" | "discord") => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Error signing in:", error);
        throw error;
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
    setUser(null);
    setProfile(null);
    setSession(null);
    setLoading(false);
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      profile,
      session,
      loading,
      signIn,
      signOut,
      refreshProfile,
    }),
    [user, profile, session, loading, signIn, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
