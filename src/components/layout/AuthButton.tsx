"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, LogOut, User, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);

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
      if (session?.user) setShowModal(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Función base para ir a Google
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // 1. NUEVA LÓGICA: Al pulsar "Entrar" en el menú
  const handleLoginClick = () => {
    // Verificamos si ya aceptó los términos en este navegador
    const hasAccepted = localStorage.getItem("moro-privacy-accepted");

    if (hasAccepted === "true") {
      // Si ya aceptó, vamos directo a Google
      handleSignIn();
    } else {
      // Si no, mostramos el modal legal
      setShowModal(true);
    }
  };

  // 2. NUEVA LÓGICA: Al pulsar el botón dentro del Modal
  const handleAcceptAndLogin = async () => {
    // Guardamos la aceptación para el futuro
    localStorage.setItem("moro-privacy-accepted", "true");
    // Vamos a Google
    await handleSignIn();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Opcional: Si quieres que al salir se "olvide" la aceptación, descomenta esto:
    // localStorage.removeItem("moro-privacy-accepted");
  };

  if (isLoading) {
    return <div className="w-8 h-8 bg-dark-800 rounded-full animate-pulse" />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
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
            {/* Desktop: Usamos la nueva función handleLoginClick */}
            <Button
              onClick={handleLoginClick}
              size="sm"
              className="hidden sm:flex"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Entrar
            </Button>

            {/* Mobile: Usamos la nueva función handleLoginClick */}
            <button
              onClick={handleLoginClick}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 text-dark-900 rounded-lg font-semibold text-sm hover:bg-gold-400 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Entrar</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {showModal && !user && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowModal(false)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 20 }}
                  className="relative w-full max-w-sm bg-dark-900 border border-dark-700 rounded-2xl p-6 shadow-2xl shadow-gold-900/10"
                >
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="text-center space-y-5">
                    <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-6 h-6 text-gold-400" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Identifícate
                      </h3>
                      <p className="text-dark-400 text-sm">
                        Accede para nominar y votar
                      </p>
                    </div>

                    {/* Aquí usamos handleAcceptAndLogin para guardar la decisión */}
                    <Button
                      onClick={handleAcceptAndLogin}
                      className="w-full py-6 text-lg relative group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Entrar con Google
                      </span>
                    </Button>

                    <p className="text-xs text-dark-500 leading-relaxed px-2">
                      Si continúas, aceptas la{" "}
                      <Link
                        href="/privacy"
                        onClick={() => setShowModal(false)}
                        className="text-gold-400 hover:underline transition-colors"
                      >
                        política de privacidad
                      </Link>{" "}
                      de la aplicación.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
