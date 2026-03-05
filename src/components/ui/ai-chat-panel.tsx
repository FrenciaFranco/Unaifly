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

function sanitizeAssistantText(text: string): string {
  return text.replace(/\*\*/g, "");
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
    subtitle: "Agente de IA para tu web",
    placeholder: "Escribe tu pregunta sobre UNAiFLY...",
    close: "Cerrar",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "Así podría verse un agente de IA en tu web. Este chat es un ejemplo: puede responder sobre nuestros servicios y ayudarte a elegir una solución. Para un presupuesto exacto, contáctanos por WhatsApp o reserva una llamada.",
    welcome:
      "¡Hola! Soy el asistente virtual de UNAiFLY. Puedo ayudarte con información sobre nuestros servicios de transformación digital, precios orientativos, proceso de trabajo y cómo contactarnos. Para presupuestos exactos, escríbenos por WhatsApp. ¿En qué puedo ayudarte?",
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
    subtitle: "AI Agent for your Website",
    placeholder: "Ask about UNAiFLY...",
    close: "Close",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "This is how an AI agent could look on your website. This chat is an example: it can answer questions about our services and help you choose the right solution. For exact pricing, contact us on WhatsApp or book a call.",
    welcome:
      "Hi! I'm UNAiFLY's virtual assistant. I can help with info about our digital transformation services, indicative pricing, our process, and how to contact us. For exact quotes, message us on WhatsApp. How can I help?",
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
    subtitle: "Agent d'IA per al teu web",
    placeholder: "Escriu la teva pregunta sobre UNAiFLY...",
    close: "Tancar",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "Així podria veure's un agent d'IA al teu web. Aquest xat és un exemple: pot respondre sobre els nostres serveis i ajudar-te a triar una solució. Per a un pressupost exacte, contacta'ns per WhatsApp o reserva una trucada.",
    welcome:
      "Hola! Soc l'assistent virtual d'UNAiFLY. Puc ajudar-te amb informació sobre els nostres serveis, preus orientatius, procés i com contactar-nos. Per a pressupostos exactes, escriu-nos per WhatsApp. En què puc ajudar-te?",
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
    subtitle: "Agente IA per il tuo sito",
    placeholder: "Scrivi la tua domanda su UNAiFLY...",
    close: "Chiudi",
    poweredBy: "UNAiFLY AI",
    disclaimer:
      "Così potrebbe apparire un agente IA sul tuo sito. Questa chat è un esempio: può rispondere sui nostri servizi e aiutarti a scegliere la soluzione giusta. Per un preventivo esatto, contattaci su WhatsApp o prenota una chiamata.",
    welcome:
      "Ciao! Sono l'assistente virtuale di UNAiFLY. Posso aiutarti con informazioni sui nostri servizi, prezzi indicativi, processo e come contattarci. Per preventivi esatti, scrivici su WhatsApp. Come posso aiutarti?",
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
  messagesRef.current = messages;
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
              { role: "assistant", content: sanitizeAssistantText(data.message) },
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
                const sanitizedContent = sanitizeAssistantText(assistantContent);
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: sanitizedContent,
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
    [isLoading, cooldown, language, l]
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
          className={`fixed z-[80] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-visible rounded-2xl border border-violet-200/22 bg-gradient-to-br from-slate-900/95 via-violet-950/80 to-fuchsia-950/85 text-slate-100 shadow-[0_20px_60px_-20px_rgba(139,92,246,0.4)] backdrop-blur-2xl ${useAnchoredPosition ? "" : panelPositionClasses[anchorCorner]}`}
          style={{ maxHeight: "min(80vh, 600px)", ...(useAnchoredPosition ? anchoredStyle : {}) }}
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-violet-200/80 to-transparent" />
          <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-violet-300/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-fuchsia-400/8 blur-3xl" />

          {/* Header */}
          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-violet-200/12 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                <Bot className="h-4 w-4 text-violet-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-violet-50">
                  {l.title}
                </h3>
                <p className="text-[10px] text-violet-200/70">{l.subtitle}</p>
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
                  <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                    <Bot className="h-3 w-3 text-violet-300" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-violet-500/25 text-violet-50 ring-1 ring-violet-300/20"
                      : "rounded-bl-md bg-white/8 text-slate-200 ring-1 ring-white/10"
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
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </span>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="ml-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/10">
                    <User className="h-3 w-3 text-violet-200/60" />
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
                <div className="mr-2 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20">
                  <Bot className="h-3 w-3 text-violet-300" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-white/8 px-3.5 py-2.5 ring-1 ring-white/10">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-300/60" />
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
          <div className="relative z-10 shrink-0 border-t border-violet-200/12 p-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-1.5 ring-1 ring-white/10 focus-within:ring-violet-300/30">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={l.placeholder}
                rows={1}
                className="min-w-0 flex-1 resize-none bg-transparent text-xs leading-4 text-slate-100 placeholder:text-slate-400 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading || cooldown}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-500/20 text-violet-300 transition-all hover:bg-violet-500/30 disabled:opacity-30 disabled:hover:bg-violet-500/20"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>

            {/* Disclaimer */}
            <p className="mt-2 text-center text-[9px] leading-tight text-violet-200/40">
              {l.disclaimer}
            </p>
          </div>

          {/* Footer */}
          <div className="relative z-10 shrink-0 border-t border-violet-200/8 px-4 py-1.5 text-center">
            <span className="text-[9px] text-violet-200/40">{l.poweredBy}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

