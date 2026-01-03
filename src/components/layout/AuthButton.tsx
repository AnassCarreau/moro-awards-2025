"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div className="w-8 h-8 bg-dark-800 rounded-full animate-pulse" />;
  }

  return (
    <AnimatePresence mode="wait">
      {user ? (
        <motion.div
          key="user"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2"
        >
          {/* Avatar */}
          {user.user_metadata.picture ? (
            <img
              src={user.user_metadata.picture}
              alt=""
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gold-500/50"
            />
          ) : (
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-gold-400" />
            </div>
          )}

          {/* Logout button */}
          <button
            onClick={handleSignOut}
            className="p-1.5 text-dark-400 hover:text-red-400 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Desktop: botón completo */}
          <Button onClick={handleSignIn} size="sm" className="hidden sm:flex">
            <LogIn className="w-4 h-4 mr-2" />
            Entrar
          </Button>

          {/* Mobile: solo icono */}
          <button
            onClick={handleSignIn}
            className="sm:hidden p-2 text-gold-400 hover:bg-gold-400/10 rounded-lg transition-colors"
            aria-label="Iniciar sesión"
          >
            <LogIn className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
