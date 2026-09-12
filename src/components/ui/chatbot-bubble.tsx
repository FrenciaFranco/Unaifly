"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, ArrowLeft } from "lucide-react";
import type { Language } from "@/lib/servicesConfig";
import {
  chatbotLabels,
  chatbotMessages,
  WHATSAPP_CHAT_URL,
  type ChatMessage,
} from "@/lib/chatbotData";

interface ChatBotPanelProps {
  messages?: ChatMessage[];
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  anchorCorner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  bubbleColumn?: "left" | "right";
  triggerRef?: React.RefObject<HTMLElement | null>;
  useTriggerAnchor?: boolean;
}

/**
 * The chat panel (window) only — no trigger button.
 * The parent is responsible for rendering a trigger and controlling isOpen.
 */
export function ChatBotPanel({
  messages = chatbotMessages,
  language,
  isOpen,
  onClose,
  anchorCorner = "bottom-right",
  bubbleColumn = "left",
  triggerRef,
  useTriggerAnchor = false,
}: ChatBotPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [anchoredStyle, setAnchoredStyle] = useState<React.CSSProperties>({});

  const labels = chatbotLabels[language];
  const filteredMessages = searchQuery
    ? messages.filter(message => `${message.question[language]} ${message.answer[language]} ${message.keywords.join(" ")}`.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()))
    : messages;
  const handleClose = useCallback(() => {
    setSelectedMessage(null);
    setSearchQuery("");
    onClose();
  }, [onClose]);

  useEffect(() => {
    // Focus only on desktop to avoid popping keyboard on mobile
    if (isOpen && inputRef.current && window.innerWidth >= 640) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedMessage && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [selectedMessage]);

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
  }, [isOpen, triggerRef, anchorCorner]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const panel = panelRef.current;
      const anchor = triggerRef?.current;
      if (panel?.contains(target) || anchor?.contains(target)) return;
      handleClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, triggerRef, handleClose]);

  const handleSelectQuestion = (msg: ChatMessage) => {
    setSelectedMessage(msg);
    setSearchQuery("");
  };

  const handleBack = () => {
    setSelectedMessage(null);
    setSearchQuery("");
  };

  const whatsappUrl = `${WHATSAPP_CHAT_URL}${encodeURIComponent(
    labels.title + " " + labels.subtitle
  )}`;
  const panelPositionClasses: Record<
    NonNullable<ChatBotPanelProps["anchorCorner"]>,
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
          className={`fixed z-[80] w-[calc(100vw-2rem)] max-w-[380px] overflow-visible rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-white/95 via-emerald-50/80 to-teal-50/85 text-slate-800 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)] backdrop-blur-2xl dark:border-emerald-200/22 dark:from-slate-900/95 dark:via-emerald-950/80 dark:to-teal-950/85 dark:text-slate-100 dark:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.4)] ${useAnchoredPosition ? "" : panelPositionClasses[anchorCorner]}`}
          style={useAnchoredPosition ? anchoredStyle : undefined}
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent dark:via-emerald-200/80" />
          <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl dark:bg-emerald-300/10" />
          <div className="pointer-events-none absolute -bottom-16 left-0 h-32 w-32 rounded-full bg-teal-400/10 blur-3xl dark:bg-teal-400/8" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-emerald-300/30 px-4 py-3 dark:border-emerald-200/12">
            <div className="flex items-center gap-3">
              {selectedMessage ? (
                <button
                  onClick={handleBack}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 dark:bg-emerald-500/20">
                  <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-50">{labels.title}</h3>
                <p className="text-[10px] text-emerald-600/70 dark:text-emerald-200/70">{labels.subtitle}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              aria-label={labels.close}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div ref={scrollRef} className="relative z-10 max-h-[42vh] min-h-[180px] overflow-y-auto overscroll-contain">
            <AnimatePresence mode="wait">
              {selectedMessage ? (
                /* Answer view */
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {/* Question bubble */}
                  <div className="mb-3 flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-emerald-500/15 px-3.5 py-2.5 text-xs leading-relaxed text-emerald-800 ring-1 ring-emerald-300/25 dark:bg-emerald-500/25 dark:text-emerald-50 dark:ring-emerald-300/20">
                      {selectedMessage.question[language]}
                    </div>
                  </div>
                  {/* Answer bubble */}
                  <div className="mb-3 flex justify-start">
                    <div className="max-w-[92%] rounded-2xl rounded-bl-md bg-black/5 px-3.5 py-2.5 text-xs leading-relaxed text-slate-700 ring-1 ring-black/8 dark:bg-white/8 dark:text-slate-200 dark:ring-white/10">
                      <FormattedAnswer text={selectedMessage.answer[language]} />
                    </div>
                  </div>
                  {/* Back + WhatsApp CTA */}
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={handleBack}
                      className="w-full rounded-xl px-3 py-2 text-xs text-emerald-600/80 transition-colors hover:bg-black/5 hover:text-emerald-700 dark:text-emerald-200/80 dark:hover:bg-white/5 dark:hover:text-emerald-100"
                    >
                      {labels.backToQuestions}
                    </button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500/15 px-3 py-2.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-300/30 transition-all hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-300/30 dark:hover:bg-emerald-500/30"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      {labels.contactCta}
                    </a>
                  </div>
                </motion.div>
              ) : (
                /* Questions list view */
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-3"
                >
                  <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600/70 dark:text-emerald-100/70">
                    {labels.suggestedQuestions}
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map((msg) => (
                        <button
                          key={msg.id}
                          onClick={() => handleSelectQuestion(msg)}
                          className="w-full rounded-xl px-3 py-2.5 text-left text-xs text-slate-700 transition-all duration-200 hover:bg-black/5 hover:text-slate-900 active:scale-[0.98] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          {msg.question[language]}
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-6 text-center">
                        <p className="text-xs text-slate-500/70 dark:text-slate-300/70">{labels.noResults}</p>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl bg-emerald-500/15 px-4 py-2.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-300/30 transition-all hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-100 dark:ring-emerald-300/30 dark:hover:bg-emerald-500/30"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          {labels.contactCta}
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search input (only in question list view) */}
          {!selectedMessage && (
            <div className="relative z-10 border-t border-emerald-300/25 p-3 dark:border-emerald-200/12">
              <div className="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 ring-1 ring-black/8 focus-within:ring-emerald-400/40 dark:bg-white/8 dark:ring-white/10 dark:focus-within:ring-emerald-300/30">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={labels.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-400"
                />
                <Send className="h-3.5 w-3.5 text-emerald-400/60 dark:text-emerald-300/50" />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="relative z-10 border-t border-emerald-300/20 px-4 py-1.5 text-center dark:border-emerald-200/8">
            <span className="text-[9px] text-emerald-500/50 dark:text-emerald-200/40">{labels.poweredBy}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Renders markdown-like text with bold (**text**) and line breaks.
 */
const BOLD_REGEX = /(\*\*[^*]+\*\*)/;

const FormattedAnswer = React.memo(function FormattedAnswer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line === "" ? (
            <div className="h-2" />
          ) : (
            <span>
              {line.split(BOLD_REGEX).map((part, j) =>
                part.startsWith("**") && part.endsWith("**") ? (
                  <strong key={j} className="font-semibold text-emerald-700 dark:text-emerald-100">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <React.Fragment key={j}>{part}</React.Fragment>
                )
              )}
            </span>
          )}
          {i < lines.length - 1 && line !== "" && <br />}
        </React.Fragment>
      ))}
    </>
  );
});
