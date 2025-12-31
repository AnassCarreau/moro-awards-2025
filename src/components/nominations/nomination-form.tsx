"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Category } from "@/types/database";
import { useAuth } from "@/components/providers/auth-provider";
import { Send, Link, User, FileText, AlertCircle } from "lucide-react";

interface NominationFormProps {
  category: Category;
  onSuccess: () => void;
  onLoginRequired: () => void;
}

export function NominationForm({
  category,
  onSuccess,
  onLoginRequired,
}: NominationFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeletedContent, setIsDeletedContent] = useState(false);

  const [formData, setFormData] = useState({
    nominated_user: "",
    nominated_link: "",
    nominated_text: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onLoginRequired();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/nominations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: category.id,
          ...formData,
          is_deleted_content: isDeletedContent,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al enviar nominación");
      }

      setFormData({
        nominated_user: "",
        nominated_link: "",
        nominated_text: "",
      });
      setIsDeletedContent(false);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (category.mode) {
      case "user":
        return (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <User size={16} />
              Usuario de Twitter/X
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                @
              </span>
              <input
                type="text"
                value={formData.nominated_user}
                onChange={(e) =>
                  setFormData({ ...formData, nominated_user: e.target.value })
                }
                placeholder="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                required
              />
            </div>
          </div>
        );

      case "link":
        return (
          <div className="space-y-4">
            {/* Toggle para contenido borrado */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <AlertCircle size={18} className="text-yellow-500" />
                <span className="text-sm text-gray-300">
                  ¿El tweet ha sido borrado?
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDeletedContent(!isDeletedContent)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDeletedContent ? "bg-yellow-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isDeletedContent ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {!isDeletedContent ? (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Link size={16} />
                  Enlace al tweet/hilo
                </label>
                <input
                  type="url"
                  value={formData.nominated_link}
                  onChange={(e) =>
                    setFormData({ ...formData, nominated_link: e.target.value })
                  }
                  placeholder="https://twitter.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                  required={!isDeletedContent}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <FileText size={16} />
                  Describe el tweet borrado
                </label>
                <textarea
                  value={formData.nominated_text}
                  onChange={(e) =>
                    setFormData({ ...formData, nominated_text: e.target.value })
                  }
                  placeholder="El tuit de @usuario donde decía que..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                  required={isDeletedContent}
                />
              </div>
            )}
          </div>
        );

      case "link_or_text":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <span className="text-sm text-gray-300">
                ¿El tweet ha sido borrado?
              </span>
              <button
                type="button"
                onClick={() => setIsDeletedContent(!isDeletedContent)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isDeletedContent ? "bg-yellow-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isDeletedContent ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>

            {!isDeletedContent ? (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                  <Link size={16} />
                  Enlace (opcional si describes abajo)
                </label>
                <input
                  type="url"
                  value={formData.nominated_link}
                  onChange={(e) =>
                    setFormData({ ...formData, nominated_link: e.target.value })
                  }
                  placeholder="https://twitter.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <FileText size={16} />
                Descripción
              </label>
              <textarea
                value={formData.nominated_text}
                onChange={(e) =>
                  setFormData({ ...formData, nominated_text: e.target.value })
                }
                placeholder="Describe lo que quieres nominar..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                required={isDeletedContent || !formData.nominated_link}
              />
            </div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <FileText size={16} />
              Descripción
            </label>
            <textarea
              value={formData.nominated_text}
              onChange={(e) =>
                setFormData({ ...formData, nominated_text: e.target.value })
              }
              placeholder="Describe tu nominación en detalle..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {renderFields()}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full gold-gradient text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
        ) : (
          <>
            <Send size={18} />
            <span>Enviar Nominación</span>
          </>
        )}
      </button>
    </form>
  );
}
