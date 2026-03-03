"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import type { Language } from "@/lib/servicesConfig";

// ─── Types ───────────────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIChatPanelProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

// ─── i18n labels ─────────────────────────────────────────────────────
const labels: Record<
  Language,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    close: string;
    poweredBy: string;
    disclaimer: string;
    welcome: string;
    errorGeneric: string;
    errorRate: string;
    chips: { label: string; prompt: string }[];
  }
> = {
  es: {
    title: "Asistente UNAiFLY",
    subtitle: "IA · Demo",
    placeholder: "Escribe tu pregunta sobre UNAiFLY...",
    close: "Cerrar",
    poweredBy: "UNAiFLY AI · Demo",
    disclaimer:
      "Demo con conocimiento limitado. Solo responde sobre UNAiFLY. Para presupuestos precisos o consultas personalizadas, contáctanos por WhatsApp o reserva una llamada.",
    welcome:
      "¡Hola! Soy el asistente virtual de UNAiFLY. Puedo ayudarte con información sobre nuestros servicios de transformación digital, precios orientativos, proceso de trabajo y cómo contactarnos. Ten en cuenta que soy una demo con conocimiento limitado — para presupuestos exactos, escríbenos por WhatsApp. ¿En qué puedo ayudarte?",
    errorGeneric: "Ha ocurrido un error. Inténtalo de nuevo.",
    errorRate: "Demasiados mensajes. Espera un momento.",
    chips: [
      { label: "Servicios", prompt: "¿Qué servicios ofrecen?" },
      { label: "Precios", prompt: "¿Cuáles son sus precios?" },
      { label: "Reservar", prompt: "¿Cómo puedo reservar una consulta?" },
      { label: "Zonas", prompt: "¿En qué zonas trabajan?" },
    ],
  },
  en: {
    title: "UNAiFLY Assistant",
    subtitle: "AI · Demo",
    placeholder: "Ask about UNAiFLY...",
    close: "Close",
    poweredBy: "UNAiFLY AI · Demo",
    disclaimer:
      "Demo with limited knowledge. Only answers about UNAiFLY. For precise quotes or custom requests, contact us via WhatsApp or book a call.",
    welcome:
      "Hi! I'm UNAiFLY's virtual assistant. I can help with info about our digital transformation services, indicative pricing, our process, and how to contact us. Note that I'm a demo with limited knowledge — for exact quotes, message us on WhatsApp. How can I help?",
    errorGeneric: "An error occurred. Please try again.",
    errorRate: "Too many messages. Please wait a moment.",
    chips: [
      { label: "Services", prompt: "What services do you offer?" },
      { label: "Pricing", prompt: "What are your prices?" },
      { label: "Book", prompt: "How can I book a consultation?" },
      { label: "Areas", prompt: "What areas do you serve?" },
    ],
  },
  ca: {
    title: "Assistent UNAiFLY",
    subtitle: "IA · Demo",
    placeholder: "Escriu la teva pregunta sobre UNAiFLY...",
    close: "Tancar",
    poweredBy: "UNAiFLY AI · Demo",
    disclaimer:
      "Demo amb coneixement limitat. Només respon sobre UNAiFLY. Per a pressupostos precisos, contacta'ns per WhatsApp o reserva una trucada.",
    welcome:
      "Hola! Soc l'assistent virtual d'UNAiFLY. Puc ajudar-te amb informació sobre els nostres serveis, preus orientatius, procés i com contactar-nos. Soc una demo — per a pressupostos exactes, escriu-nos per WhatsApp. En què puc ajudar-te?",
    errorGeneric: "S'ha produït un error. Torna-ho a provar.",
    errorRate: "Massa missatges. Espera un moment.",
    chips: [
      { label: "Serveis", prompt: "Quins serveis oferiu?" },
      { label: "Preus", prompt: "Quins són els vostres preus?" },
      { label: "Reservar", prompt: "Com puc reservar una consulta?" },
      { label: "Zones", prompt: "En quines zones treballeu?" },
    ],
  },
  it: {
    title: "Assistente UNAiFLY",
    subtitle: "IA · Demo",
    placeholder: "Scrivi la tua domanda su UNAiFLY...",
    close: "Chiudi",
    poweredBy: "UNAiFLY AI · Demo",
    disclaimer:
      "Demo con conoscenza limitata. Risponde solo su UNAiFLY. Per preventivi precisi, contattaci su WhatsApp o prenota una chiamata.",
    welcome:
      "Ciao! Sono l'assistente virtuale di UNAiFLY. Posso aiutarti con informazioni sui nostri servizi, prezzi indicativi, processo e come contattarci. Sono una demo — per preventivi esatti, scrivici su WhatsApp. Come posso aiutarti?",
    errorGeneric: "Si è verificato un errore. Riprova.",
    errorRate: "Troppi messaggi. Attendi un momento.",
    chips: [
      { label: "Servizi", prompt: "Quali servizi offrite?" },
      { label: "Prezzi", prompt: "Quali sono i vostri prezzi?" },
      { label: "Prenotare", prompt: "Come posso prenotare una consulta?" },
      { label: "Zone", prompt: "In quali zone lavorate?" },
    ],
  },
};

// ─── Client-side cooldown ────────────────────────────────────────────
const COOLDOWN_MS = 3_000;

// ─── Component ──────────────────────────────────────────────────────
export function AIChatPanel({ language, isOpen, onClose }: AIChatPanelProps) {
  const l = labels[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading || cooldown) return;

      setError(null);
      setInput("");

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);

      // Start cooldown
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);

      // Abort previous request if any
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages,
            locale: language,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 429) {
            setError(l.errorRate);
          } else {
            setError(data.error || l.errorGeneric);
          }
          setIsLoading(false);
          return;
        }

        // Check if it's a non-streaming JSON response (out-of-scope refusal)
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const data = await res.json();
          if (data.message) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: data.message },
            ]);
          }
          setIsLoading(false);
          return;
        }

        // Stream SSE response
        const reader = res.body?.getReader();
        if (!reader) {
          setError(l.errorGeneric);
          setIsLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        let assistantContent = "";
        // Add placeholder assistant message
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;
            const data = trimmedLine.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantContent,
                  };
                  return updated;
                });
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(l.errorGeneric);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, cooldown, language, l]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.8 }}
          className="fixed bottom-32 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-2xl border border-emerald-200/22 bg-gradient-to-br from-slate-900/95 via-emerald-950/80 to-teal-950/85 text-slate-100 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.4)] backdrop-blur-2xl sm:right-6"
          style={{ maxHeight: "min(80vh, 600px)" }}
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/80 to-transparent" />
          <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-teal-400/8 blur-3xl" />

          {/* Header */}
          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-emerald-200/12 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                <Bot className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-emerald-50">
                  {l.title}
                </h3>
                <p className="text-[10px] text-emerald-200/70">{l.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              aria-label={l.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages area */}
          <div
            ref={scrollRef}
            className="relative z-10 flex-1 overflow-y-auto overscroll-contain p-4"
            style={{ minHeight: 200 }}
          >
            {/* Welcome message */}
            {showWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="mb-3 flex justify-start">
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-white/8 px-3.5 py-2.5 text-xs leading-relaxed text-slate-200 ring-1 ring-white/10">
                    {l.welcome}
                  </div>
                </div>

                {/* Quick-reply chips */}
                <div className="flex flex-wrap gap-1.5">
                  {l.chips.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => sendMessage(chip.prompt)}
                      className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-300/20 transition-all hover:bg-emerald-500/25 hover:text-emerald-100 active:scale-95"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <Bot className="h-3 w-3 text-emerald-300" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-emerald-500/25 text-emerald-50 ring-1 ring-emerald-300/20"
                      : "rounded-bl-md bg-white/8 text-slate-200 ring-1 ring-white/10"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="ml-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <User className="h-3 w-3 text-emerald-200/60" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* Loading indicator (when waiting for first token) */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-3 flex justify-start"
              >
                <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                  <Bot className="h-3 w-3 text-emerald-300" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-white/8 px-3.5 py-2.5 ring-1 ring-white/10">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-300/60" />
                </div>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-3 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300 ring-1 ring-red-400/20"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Input area */}
          <div className="relative z-10 shrink-0 border-t border-emerald-200/12 p-3">
            <div className="flex items-end gap-2 rounded-xl bg-white/8 px-3 py-2 ring-1 ring-white/10 focus-within:ring-emerald-300/30">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={l.placeholder}
                rows={1}
                className="min-w-0 max-h-20 flex-1 resize-none bg-transparent text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading || cooldown}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 transition-all hover:bg-emerald-500/30 disabled:opacity-30 disabled:hover:bg-emerald-500/20"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-2 text-center text-[9px] leading-tight text-emerald-200/40">
              {l.disclaimer}
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 shrink-0 border-t border-emerald-200/8 px-4 py-1.5 text-center">
            <span className="text-[9px] text-emerald-200/40">{l.poweredBy}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
