"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Bot, CircleDollarSign, Languages, MessageCircle } from "lucide-react";
import { AIChatPanel } from "./ui/ai-chat-panel";
import { ChatBotPanel } from "./ui/chatbot-bubble";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { Language } from "@/lib/servicesConfig";
import { consultingFaq } from "@/lib/consultingFaq";
import styles from "./home-floating-tools.module.css";

type Currency = "EUR" | "USD" | "ARS" | "BTC";
type Panel = "currency" | "language" | "faq" | "ai" | null;
type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
const languages: Array<{ code: Language; label: string; name: string }> = [{ code: "es", label: "ES", name: "Castellano" }, { code: "en", label: "EN", name: "English" }, { code: "ca", label: "CA", name: "Català" }, { code: "it", label: "IT", name: "Italiano" }];
const currencies: Array<{ code: Currency; name: string }> = [{ code: "EUR", name: "Euro" }, { code: "USD", name: "US Dollar" }, { code: "ARS", name: "Peso Argentino" }, { code: "BTC", name: "Bitcoin" }];
const fallbackRates: Record<Currency, number> = { EUR: 1, USD: 1.08, ARS: 1170, BTC: 0.000011 };
const corners: Corner[] = ["top-left", "top-right", "bottom-left", "bottom-right"];

function hint(code: Currency, selected: Currency, rates: Record<Currency, number>) {
  const name = currencies.find(item => item.code === code)?.name;
  if (code === selected) return `${name} · Base`;
  const value = rates[code] / rates[selected];
  return code === "BTC" ? `${name} · 1 ${selected} ≈ BTC ${value.toLocaleString("es-ES", { minimumFractionDigits: 6, maximumFractionDigits: 8 })}` : `${name} · 1 ${selected} ≈ ${value.toLocaleString("es-ES", { maximumFractionDigits: 2 })} ${code}`;
}

export default function FloatingTools({ onLanguageChange }: { onLanguageChange?: (language: Language) => void }) {
  const [panel, setPanel] = useState<Panel>(null);
  const [language, setLanguage] = useState<Language>(() => languages.find(item => item.code === getStorageItem("language"))?.code ?? "es");
  const [currency, setCurrency] = useState<Currency>(() => currencies.find(item => item.code === getStorageItem("currency"))?.code ?? "EUR");
  const [rates, setRates] = useState(fallbackRates);
  const [corner, setCorner] = useState<Corner>(() => { const saved = getStorageItem("bubble-corner") as Corner | null; return saved && corners.includes(saved) ? saved : "bottom-right"; });
  const [dragging, setDragging] = useState(false);
  const dock = useRef<HTMLDivElement>(null), faqButton = useRef<HTMLButtonElement>(null), aiButton = useRef<HTMLButtonElement>(null);
  const pointerId = useRef<number | null>(null), start = useRef<{x:number;y:number}|null>(null), last = useRef<{x:number;y:number;time:number}|null>(null);
  const velocity = useRef({ x: 0, y: 0 }), moved = useRef(false), cornerRef = useRef(corner);
  const t = {
    es: ["Herramientas UNAiFLY", "Idioma de la página", "Traducir toda la página", "Moneda", "Arrastrar herramientas", "Preguntas frecuentes", "Asistente de IA"],
    en: ["UNAiFLY tools", "Page language", "Translate the entire page", "Currency", "Drag tools", "Frequently asked questions", "AI assistant"],
    ca: ["Eines UNAiFLY", "Idioma de la pàgina", "Traduir tota la pàgina", "Moneda", "Arrossegar les eines", "Preguntes freqüents", "Assistent d'IA"],
    it: ["Strumenti UNAiFLY", "Lingua della pagina", "Traduci l'intera pagina", "Valuta", "Trascina gli strumenti", "Domande frequenti", "Assistente IA"],
  }[language];

  useEffect(() => { document.documentElement.lang = language; setStorageItem("language", language); onLanguageChange?.(language); }, [language, onLanguageChange]);
  useEffect(() => { cornerRef.current = corner; setStorageItem("bubble-corner", corner); }, [corner]);
  useEffect(() => { setStorageItem("currency", currency); }, [currency]);
  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,ARS", { signal: controller.signal }).then(r => r.ok ? r.json() : null), fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur", { signal: controller.signal }).then(r => r.ok ? r.json() : null)]).then(([fiat, btc]) => setRates(old => ({ ...old, ...(fiat.status === "fulfilled" && fiat.value?.rates ? fiat.value.rates : {}), ...(btc.status === "fulfilled" && btc.value?.bitcoin?.eur ? { BTC: 1 / btc.value.bitcoin.eur } : {}) }))).catch(() => undefined);
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const outside = (event: globalThis.PointerEvent) => { const target = event.target as Element; if (!dock.current?.contains(target) && !target.closest('[data-chat-panel="true"]')) setPanel(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setPanel(null); };
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  const cornerFromPoint = useCallback((x: number, y: number): Corner => {
    const vertical = y < window.innerHeight / 2 ? "top" : "bottom";
    const horizontal = window.innerWidth < 640 ? (cornerRef.current.includes("left") ? "left" : "right") : (x < window.innerWidth / 2 ? "left" : "right");
    return `${vertical}-${horizontal}` as Corner;
  }, []);
  function down(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button,[data-floating-panel='true']") || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerId.current = event.pointerId; start.current = { x: event.clientX, y: event.clientY }; last.current = { x: event.clientX, y: event.clientY, time: performance.now() }; velocity.current = { x: 0, y: 0 }; moved.current = false;
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== event.pointerId || !start.current) return;
    const now = performance.now(), previous = last.current;
    if (previous && now > previous.time) velocity.current = { x: (event.clientX - previous.x) / (now - previous.time), y: (event.clientY - previous.y) / (now - previous.time) };
    last.current = { x: event.clientX, y: event.clientY, time: now };
    if (!moved.current && Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > 4) { moved.current = true; setDragging(true); setPanel(null); event.currentTarget.setPointerCapture(event.pointerId); }
    if (moved.current) setCorner(cornerFromPoint(event.clientX, event.clientY));
  }
  function up(event: PointerEvent<HTMLDivElement>) {
    if (pointerId.current !== event.pointerId) return;
    if (moved.current) setCorner(cornerFromPoint(event.clientX + velocity.current.x * 180, event.clientY + velocity.current.y * 180));
    pointerId.current = null; start.current = null; last.current = null; velocity.current = { x: 0, y: 0 }; moved.current = false; setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  const toggle = (next: Exclude<Panel, null>) => setPanel(current => current === next ? null : next);

  return <MotionConfig reducedMotion="user">
    <motion.div ref={dock} layout transition={{ type: "spring", stiffness: 360, damping: 28, mass: .9 }} className={`${styles.dock} ${styles[corner]} ${dragging ? styles.dragging : ""}`} aria-label={t[0]} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <div className={styles.grip} aria-hidden="true" title={t[4]}><svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor"><circle cx="1.5" cy="1.5" r="1.5"/><circle cx="6.5" cy="1.5" r="1.5"/><circle cx="1.5" cy="7" r="1.5"/><circle cx="6.5" cy="7" r="1.5"/><circle cx="1.5" cy="12.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/></svg></div>
      <div className={styles.bubbleWrap}><AnimatePresence>{panel === "currency" && <motion.div data-floating-panel="true" initial={{opacity:0,y:10,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.98}} className={`${styles.popover} ${styles.currencyPanel}`}><h2>{t[3]}</h2>{currencies.map(item => <button key={item.code} type="button" aria-pressed={currency === item.code} onClick={() => { setCurrency(item.code); setPanel(null); }}><strong>{item.code}</strong><span>{hint(item.code, currency, rates)}</span></button>)}</motion.div>}</AnimatePresence><motion.button whileHover={{scale:1.1}} whileTap={{scale:.9}} type="button" className={`${styles.bubble} ${styles.currencyBubble}`} aria-label={t[3]} aria-expanded={panel === "currency"} onPointerDown={e=>e.stopPropagation()} onClick={()=>toggle("currency")}><CircleDollarSign size={21}/></motion.button></div>
      <div className={styles.bubbleWrap}><AnimatePresence>{panel === "language" && <motion.div data-floating-panel="true" initial={{opacity:0,y:10,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.98}} className={`${styles.popover} ${styles.languagePanel}`}><h2>{t[1]}</h2>{languages.map(item => <button key={item.code} type="button" aria-pressed={language === item.code} onClick={() => { setLanguage(item.code); setPanel(null); }}><strong>{item.label}</strong><span>{item.name}</span></button>)}</motion.div>}</AnimatePresence><motion.button whileHover={{scale:1.1}} whileTap={{scale:.9}} type="button" className={`${styles.bubble} ${styles.languageBubble}`} aria-label={t[2]} aria-expanded={panel === "language"} onPointerDown={e=>e.stopPropagation()} onClick={()=>toggle("language")}><Languages size={21}/></motion.button></div>
      <motion.button ref={faqButton} whileHover={{scale:1.1}} whileTap={{scale:.9}} type="button" className={`${styles.bubble} ${styles.faqBubble}`} aria-label={t[5]} aria-expanded={panel === "faq"} onPointerDown={e=>e.stopPropagation()} onClick={()=>toggle("faq")}><MessageCircle size={21}/></motion.button>
      <motion.button ref={aiButton} whileHover={{scale:1.1}} whileTap={{scale:.9}} type="button" className={`${styles.bubble} ${styles.aiBubble}`} aria-label={t[6]} aria-expanded={panel === "ai"} onPointerDown={e=>e.stopPropagation()} onClick={()=>toggle("ai")}><Bot size={21}/></motion.button>
    </motion.div>
    <ChatBotPanel messages={consultingFaq} language={language} isOpen={panel === "faq"} onClose={()=>setPanel(null)} anchorCorner={corner} bubbleColumn="left" triggerRef={faqButton} useTriggerAnchor />
    <AIChatPanel language={language} isOpen={panel === "ai"} onClose={()=>setPanel(null)} anchorCorner={corner} bubbleColumn="right" triggerRef={aiButton} useTriggerAnchor />
  </MotionConfig>;
}
