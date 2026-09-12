"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Bot, Check, CircleDollarSign, GripVertical, Languages, MessageCircle, X } from "lucide-react";
import { MotionConfig } from "framer-motion";
import { AIChatPanel } from "./ui/ai-chat-panel";
import { ChatBotPanel } from "./ui/chatbot-bubble";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { Language } from "@/lib/servicesConfig";
import { consultingFaq } from "@/lib/consultingFaq";
import styles from "./home-floating-tools.module.css";

const languages: [Language, string][] = [["es", "Castellano"], ["en", "English"], ["ca", "Català"], ["it", "Italiano"]];
const currencies = [["EUR", "Euro"], ["USD", "US Dollar"], ["ARS", "Peso argentino"], ["BTC", "Bitcoin"]];
type Panel = "currency" | "language" | "faq" | "ai" | null;

export default function FloatingTools() {
  const [panel, setPanel] = useState<Panel>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = getStorageItem("language");
    return languages.find(([code]) => code === saved)?.[0] ?? "es";
  });
  const [currency, setCurrency] = useState(() => currencies.find(([code]) => code === getStorageItem("currency"))?.[0] ?? "EUR");
  const [left, setLeft] = useState(() => getStorageItem("bubble-corner") === "bottom-left");
  const dock = useRef<HTMLDivElement>(null);
  const faqButton = useRef<HTMLButtonElement>(null);
  const aiButton = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const dragStart = useRef<number | null>(null);
  const suppressClick = useRef(false);
  const popover = useRef<HTMLDivElement>(null);
  const corner = left ? "bottom-left" : "bottom-right";

  function close() { setPanel(null); lastTrigger.current?.focus(); }
  function toggle(next: Panel, trigger: HTMLButtonElement) {
    lastTrigger.current = trigger;
    setPanel(current => current === next ? null : next);
  }

  useEffect(() => {
    function outside(event: globalThis.PointerEvent) {
      const target = event.target as Element;
      if (!dock.current?.contains(target) && !target.closest('[data-chat-panel="true"]')) setPanel(null);
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") { setPanel(null); lastTrigger.current?.focus(); }
    }
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  useEffect(() => {
    if (panel === "currency" || panel === "language") popover.current?.querySelector<HTMLButtonElement>('button[aria-pressed="true"]')?.focus();
  }, [panel]);

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    if (dragStart.current === null) return;
    if (Math.abs(event.clientX - dragStart.current) > 20) {
      suppressClick.current = true;
      const nextLeft = event.clientX < window.innerWidth / 2;
      setLeft(nextLeft);
      setStorageItem("bubble-corner", nextLeft ? "bottom-left" : "bottom-right");
    }
    dragStart.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <MotionConfig reducedMotion="user">
    <div ref={dock} className={`${styles.dock} ${left ? styles.left : styles.right}`} aria-label="Herramientas UNAiFLY">
      {(panel === "currency" || panel === "language") && <div ref={popover} id="tools-preferences" role="dialog" aria-label={panel === "currency" ? "Moneda del planificador" : "Idioma de los asistentes"} className={`${styles.popover} ${panel === "currency" ? styles.gold : styles.blue}`}>
        <div className={styles.popoverHeader}><h2>{panel === "currency" ? "Moneda del planificador" : "Idioma de los asistentes"}</h2><button type="button" onClick={close} aria-label="Cerrar ajustes"><X size={17} /></button></div>
        {panel === "currency" ? <><p>Elige la moneda para consultar importes en el planificador de servicios.</p>{currencies.map(([code, name]) => <button key={code} type="button" className={styles.option} aria-pressed={currency === code} onClick={() => { setCurrency(code); setStorageItem("currency", code); }}><strong>{code}</strong><span>{name}</span>{currency === code && <Check size={16} />}</button>)}<a href={`/services-builder?currency=${currency}&language=${language}`} className={styles.plannerLink}>Abrir planificador en {currency}</a></> : <><p>Selecciona el idioma de las preguntas frecuentes, el asistente de IA y el planificador. La portada está en castellano.</p>{languages.map(([code, name]) => <button key={code} type="button" className={styles.option} aria-pressed={language === code} onClick={() => { setLanguage(code); setStorageItem("language", code); }}><strong>{code.toUpperCase()}</strong><span>{name}</span>{language === code && <Check size={16} />}</button>)}</>}
      </div>}
      <button type="button" className={styles.grip} aria-label="Mover herramientas al otro lado" title="Arrastra o pulsa para cambiar de lado" onClick={() => { if (suppressClick.current) { suppressClick.current = false; return; } setLeft(!left); setStorageItem("bubble-corner", left ? "bottom-right" : "bottom-left"); }} onPointerDown={event => { suppressClick.current = false; dragStart.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerUp={finishDrag} onPointerCancel={() => { dragStart.current = null; }}><GripVertical size={17} /></button>
      <button type="button" className={`${styles.bubble} ${styles.gold}`} aria-label="Seleccionar moneda" aria-expanded={panel === "currency"} aria-controls={panel === "currency" ? "tools-preferences" : undefined} title="Moneda" onClick={event => toggle("currency", event.currentTarget)}><CircleDollarSign size={21} /></button>
      <button type="button" className={`${styles.bubble} ${styles.blue}`} aria-label="Seleccionar idioma" aria-expanded={panel === "language"} aria-controls={panel === "language" ? "tools-preferences" : undefined} title="Idioma" onClick={event => toggle("language", event.currentTarget)}><Languages size={21} /></button>
      <button type="button" ref={faqButton} className={`${styles.bubble} ${styles.green}`} aria-label="Preguntas frecuentes" aria-expanded={panel === "faq"} title="Preguntas frecuentes" onClick={event => toggle("faq", event.currentTarget)}><MessageCircle size={21} /></button>
      <button type="button" ref={aiButton} className={`${styles.bubble} ${styles.purple}`} aria-label="Asistente de IA" aria-expanded={panel === "ai"} title="Asistente de IA" onClick={event => toggle("ai", event.currentTarget)}><Bot size={21} /></button>
    </div>
    <ChatBotPanel messages={consultingFaq} language={language} isOpen={panel === "faq"} onClose={close} anchorCorner={corner} triggerRef={faqButton} useTriggerAnchor />
    <AIChatPanel language={language} isOpen={panel === "ai"} onClose={close} anchorCorner={corner} triggerRef={aiButton} useTriggerAnchor />
  </MotionConfig>;
}
