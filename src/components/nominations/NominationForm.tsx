"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Link as LinkIcon,
  User,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { createNomination } from "@/lib/actions/nominations";
import type { Category, NominationMode } from "@/types/database";

interface NominationFormProps {
  categories: Category[];
}

export function NominationForm({ categories }: NominationFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [nominatedUser, setNominatedUser] = useState("");
  const [nominatedLink, setNominatedLink] = useState("");
  const [nominatedText, setNominatedText] = useState("");
  const [isDeletedContent, setIsDeletedContent] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const mode = selectedCategory?.mode as NominationMode | undefined;

  const resetForm = () => {
    setNominatedUser("");
    setNominatedLink("");
    setNominatedText("");
    setIsDeletedContent(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !mode) return;

    setMessage(null);

    startTransition(async () => {
      const result = await createNomination({
        categoryId: selectedCategoryId,
        mode,
        nominatedUser: nominatedUser.trim() || undefined,
        nominatedLink: nominatedLink.trim() || undefined,
        nominatedText: nominatedText.trim() || undefined,
        isDeletedContent,
      });

      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({
          type: "success",
          text: "¡Nominación enviada correctamente!",
        });
        resetForm();
      }
    });
  };

  const getModeIcon = (mode: NominationMode) => {
    switch (mode) {
      case "user":
        return <User className="w-5 h-5" />;
      case "link":
        return <LinkIcon className="w-5 h-5" />;
      case "text":
        return <FileText className="w-5 h-5" />;
      case "link_or_text":
        return <FileText className="w-5 h-5" />;
    }
  };

  const getModeLabel = (mode: NominationMode) => {
    switch (mode) {
      case "user":
        return "Usuario de Twitter";
      case "link":
        return "Enlace";
      case "text":
        return "Descripción";
      case "link_or_text":
        return "Enlace o Descripción";
    }
  };

  return (
    <Card variant="glass" className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Nominación</CardTitle>
        <CardDescription>
          Selecciona una categoría y envía tu nominación
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de categoría */}
          <Select
            label="Categoría"
            placeholder="Selecciona una categoría"
            options={categories.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            value={selectedCategoryId?.toString() || ""}
            onChange={(e) => {
              setSelectedCategoryId(Number(e.target.value));
              resetForm();
              setMessage(null);
            }}
          />

          {/* Descripción de la categoría */}
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-dark-700/50 rounded-xl p-4 border border-dark-600"
              >
                <div className="flex items-center gap-2 text-gold-400 mb-2">
                  {getModeIcon(selectedCategory.mode)}
                  <span className="font-medium">
                    {getModeLabel(selectedCategory.mode)}
                  </span>
                </div>
                <p className="text-dark-300 text-sm">
                  {selectedCategory.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Campos dinámicos según el modo */}
          <AnimatePresence mode="wait">
            {mode && (
              <motion.div
                key={mode + (isDeletedContent ? "-deleted" : "")}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* Modo USER */}
                {mode === "user" && (
                  <Input
                    label="Usuario de Twitter"
                    placeholder="@usuario o enlace al perfil"
                    icon={<User className="w-5 h-5" />}
                    value={nominatedUser}
                    onChange={(e) => setNominatedUser(e.target.value)}
                    required
                  />
                )}

                {/* Modo LINK */}
                {mode === "link" && (
                  <>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isDeletedContent}
                          onChange={(e) =>
                            setIsDeletedContent(e.target.checked)
                          }
                          className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-gold-500 focus:ring-gold-500 focus:ring-offset-dark-900"
                        />
                        <span className="text-dark-300 text-sm">
                          ¿Tweet borrado?
                        </span>
                      </label>
                    </div>

                    {isDeletedContent ? (
                      <Textarea
                        label="Describe el contenido borrado"
                        placeholder="Describe el tweet o contenido que fue borrado..."
                        value={nominatedText}
                        onChange={(e) => setNominatedText(e.target.value)}
                        rows={4}
                        required
                      />
                    ) : (
                      <Input
                        label="Enlace al tweet"
                        placeholder="https://twitter.com/..."
                        icon={<LinkIcon className="w-5 h-5" />}
                        type="url"
                        value={nominatedLink}
                        onChange={(e) => setNominatedLink(e.target.value)}
                        required
                      />
                    )}
                  </>
                )}

                {/* Modo TEXT */}
                {mode === "text" && (
                  <Textarea
                    label="Descripción"
                    placeholder="Describe tu nominación..."
                    value={nominatedText}
                    onChange={(e) => setNominatedText(e.target.value)}
                    rows={4}
                    required
                  />
                )}

                {/* Modo LINK_OR_TEXT */}
                {mode === "link_or_text" && (
                  <>
                    <Input
                      label="Enlace (opcional)"
                      placeholder="https://twitter.com/..."
                      icon={<LinkIcon className="w-5 h-5" />}
                      type="url"
                      value={nominatedLink}
                      onChange={(e) => setNominatedLink(e.target.value)}
                    />
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-dark-600" />
                      </div>
                      <span className="relative bg-dark-800 px-4 text-sm text-dark-400">
                        o
                      </span>
                    </div>
                    <Textarea
                      label="Descripción (opcional)"
                      placeholder="Describe tu nominación..."
                      value={nominatedText}
                      onChange={(e) => setNominatedText(e.target.value)}
                      rows={3}
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensaje de feedback */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón de envío */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!selectedCategoryId || isPending}
            isLoading={isPending}
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar Nominación
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
