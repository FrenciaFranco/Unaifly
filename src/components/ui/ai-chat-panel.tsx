"use client";

import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
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
  anchorCorner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  bubbleColumn?: "left" | "right";
  triggerRef?: React.RefObject<HTMLElement | null>;
  useTriggerAnchor?: boolean;
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
    subtitle: "IA aplicada a tu empresa",
    placeholder: "Escribe un mensaje...",
    close: "Cerrar",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "Este es un ejemplo de lo que podría hacer una IA en tu web. ¿Te imaginas algo así para tu negocio? Contáctanos por WhatsApp para saber más.",
    welcome:
      "¡Hola! Esto es una demostración de cómo una inteligencia artificial podría atender a los visitantes de tu web las 24 horas del día. ¿Te gustaría saber más?",
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
    subtitle: "AI for your business",
    placeholder: "Type a message...",
    close: "Close",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "This is an example of what an AI could do on your website. Imagine this for your business? Contact us on WhatsApp to learn more.",
    welcome:
      "Hi! This is a demonstration of how an artificial intelligence could attend your website visitors 24/7. Would you like to know more?",
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
    subtitle: "IA aplicada a la teva empresa",
    placeholder: "Escriu un missatge...",
    close: "Tancar",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "Això és un exemple del que podria fer una IA al teu web. T'imagines algo així pel teu negoci? Contacta'ns per WhatsApp per saber-ne més.",
    welcome:
      "Hola! Això és una demostració de com una intel·ligència artificial podria atendre els visitants del teu web les 24 hores del dia. Vols saber més?",
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
    subtitle: "IA per la tua impresa",
    placeholder: "Scrivi un messaggio...",
    close: "Chiudi",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "Questo è un esempio di cosa potrebbe fare un'IA sul tuo sito. Te lo immagini per la tua attività? Contattaci su WhatsApp per saperne di più.",
    welcome:
      "Ciao! Questa è una dimostrazione di come un'intelligenza artificiale potrebbe servire i visitatori del tuo sito 24 ore su 24. Vuoi saperne di più?",
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
const INPUT_MAX_HEIGHT_PX = 120;

// ─── Component ──────────────────────────────────────────────────────
export function AIChatPanel({
  language,
  isOpen,
  onClose,
  anchorCorner = "bottom-right",
  bubbleColumn = "right",
  triggerRef,
  useTriggerAnchor = false,
}: AIChatPanelProps) {
  const l = labels[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  const panelRef = useRef<HTMLDivElement>(null);
  const [anchoredStyle, setAnchoredStyle] = useState<React.CSSProperties>({});
  const adjustInputHeight = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "0px";
    const nextHeight = Math.min(el.scrollHeight, INPUT_MAX_HEIGHT_PX);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY =
      el.scrollHeight > INPUT_MAX_HEIGHT_PX ? "auto" : "hidden";
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input only on desktop when opened (mobile: avoid popping keyboard)
  useEffect(() => {
    if (isOpen && inputRef.current && window.innerWidth >= 640) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    adjustInputHeight();
  }, [input, isOpen, adjustInputHeight]);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef?.current || !panelRef.current) return;

    const updatePosition = () => {
      const anchor = triggerRef.current;
      if (!anchor) return;

      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;

      // On mobile: full-width panel opens up/down based on trigger position
      if (vw < 640) {
        const anchorRect = anchor.getBoundingClientRect();
        const viewportPadding = 8;
        const offset = 8;
        const openDown = anchorRect.top < vh / 2;

        if (openDown) {
          const top = Math.max(anchorRect.bottom + offset, viewportPadding);
          const maxHeight = Math.max(220, vh - top - viewportPadding);
          setAnchoredStyle({
            left: 8,
            right: 8,
            top,
            bottom: "auto",
            width: "auto",
            maxHeight: `${maxHeight}px`,
          });
          return;
        }

        const bottom = Math.max(vh - anchorRect.top + offset, viewportPadding);
        const maxHeight = Math.max(220, vh - bottom - viewportPadding);
        setAnchoredStyle({
          left: 8,
          right: 8,
          bottom,
          top: "auto",
          width: "auto",
          maxHeight: `${maxHeight}px`,
        });
        return;
      }

      const anchorRect = anchor.getBoundingClientRect();
      const viewportPadding = 8;
      const offset = 8;

      // Vertical: open above if more space there, otherwise below
      const openAbove = anchorRect.top > vh - anchorRect.bottom;
      const vertStyle: React.CSSProperties = openAbove
        ? { bottom: Math.max(vh - anchorRect.top + offset, viewportPadding), top: "auto" }
        : { top: Math.max(anchorRect.bottom + offset, viewportPadding), bottom: "auto" };

      // Horizontal: align to same side as anchor to stay on-screen
      const anchorIsOnRight = anchorRect.right > vw / 2;
      const horizStyle: React.CSSProperties = anchorIsOnRight
        ? { right: Math.max(vw - anchorRect.right, viewportPadding), left: "auto" }
        : { left: Math.max(anchorRect.left, viewportPadding), right: "auto" };

      setAnchoredStyle({ ...vertStyle, ...horizStyle });
    };

    const raf = requestAnimationFrame(updatePosition);
    const onScrollOrResize = () => requestAnimationFrame(updatePosition);
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onScrollOrResize);
      window.removeEventListener("scroll", onScrollOrResize, true);
    };
  }, [isOpen, triggerRef, messages.length, isLoading, anchorCorner]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const panel = panelRef.current;
      const anchor = triggerRef?.current;
      if (panel?.contains(target) || anchor?.contains(target)) return;
      onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, onClose, triggerRef]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading || cooldown) return;

      setError(null);
      setInput("");

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const newMessages = [...messagesRef.current, userMsg];
      setMessages(newMessages);
      setIsLoading(true);

      // Start cooldown
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);

      // Simulate typing delay then respond with fixed phrase
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Tu negocio podría tener una inteligencia artificial respondiendo 24/7",
          },
        ]);
        setIsLoading(false);
      }, 800);
    },
    [isLoading, cooldown]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showWelcome = messages.length === 0 && !isLoading;
  const panelPositionClasses: Record<
    NonNullable<AIChatPanelProps["anchorCorner"]>,
    string
  > = {
    "top-left": "top-24 left-4 sm:left-6",
    "top-right": "top-24 right-4 sm:right-6",
    "bottom-left": "bottom-24 left-4 sm:left-6",
    "bottom-right": "bottom-24 right-4 sm:right-6",
  };
  void bubbleColumn;
  const useAnchoredPosition = useTriggerAnchor;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 360, damping: 30, mass: 0.8 }}
          data-chat-panel="true"
          ref={panelRef}
          className={`fixed z-[80] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-visible rounded-2xl border border-violet-200/40 bg-gradient-to-br from-white/95 via-violet-50/80 to-fuchsia-50/85 text-slate-800 shadow-[0_20px_60px_-20px_rgba(139,92,246,0.2)] backdrop-blur-2xl dark:border-violet-200/22 dark:from-slate-900/95 dark:via-violet-950/80 dark:to-fuchsia-950/85 dark:text-slate-100 dark:shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)] ${useAnchoredPosition ? "" : panelPositionClasses[anchorCorner]}`}
          style={{ maxHeight: "min(80vh, 600px)", ...(useAnchoredPosition ? anchoredStyle : {}) }}
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent dark:via-violet-200/80" />
          <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-violet-300/15 blur-3xl dark:bg-violet-300/10" />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-3xl dark:bg-fuchsia-400/8" />

          {/* Header */}
          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-violet-300/30 px-4 py-3 dark:border-violet-200/12">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 dark:bg-violet-500/20">
                <Bot className="h-4 w-4 text-violet-600 dark:text-violet-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-violet-800 dark:text-violet-50">
                  {l.title}
                </h3>
                <p className="text-[10px] text-violet-600/70 dark:text-violet-200/70">{l.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
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
                  <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-black/5 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 ring-1 ring-black/8 dark:bg-white/8 dark:text-slate-200 dark:ring-white/10">
                    {l.welcome}
                  </div>
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
                  <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 dark:bg-violet-500/20">
                    <Bot className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-violet-500/15 text-violet-800 ring-1 ring-violet-300/25 dark:bg-violet-500/25 dark:text-violet-50 dark:ring-violet-300/20"
                      : "rounded-bl-md bg-black/5 text-slate-700 ring-1 ring-black/8 dark:bg-white/8 dark:text-slate-200 dark:ring-white/10"
                  }`}
                >
                  {msg.content ? (
                    <span
                      className={
                        msg.role === "assistant" && isLoading && i === messages.length - 1
                          ? "chat-text-shimmer"
                          : undefined
                      }
                    >
                      {msg.content}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="ml-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10 dark:bg-violet-500/10">
                    <User className="h-3 w-3 text-violet-400/70 dark:text-violet-200/60" />
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
                <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 dark:bg-violet-500/20">
                  <Bot className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-black/5 px-3.5 py-2.5 ring-1 ring-black/8 dark:bg-white/8 dark:ring-white/10">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-400/60 dark:text-violet-300/60" />
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
          <div className="relative z-10 shrink-0 border-t border-violet-300/25 p-3 dark:border-violet-200/12">
            <div className="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-1.5 ring-1 ring-black/8 focus-within:ring-violet-400/40 dark:bg-white/8 dark:ring-white/10 dark:focus-within:ring-violet-300/30">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={l.placeholder}
                rows={1}
                className="min-w-0 flex-1 resize-none bg-transparent text-xs leading-4 text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading || cooldown}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-500 transition-all hover:bg-violet-500/25 disabled:opacity-30 disabled:hover:bg-violet-500/15 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30 dark:disabled:hover:bg-violet-500/20"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-2 text-center text-[9px] leading-tight text-violet-400/50 dark:text-violet-200/40">
              {l.disclaimer}
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 shrink-0 border-t border-violet-300/20 px-4 py-1.5 text-center dark:border-violet-200/8">
            <span className="text-[9px] text-violet-400/50 dark:text-violet-200/40">{l.poweredBy}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

