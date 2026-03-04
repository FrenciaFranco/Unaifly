"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Globe, Calendar, MessageCircle, Zap, Megaphone,
  Paintbrush, Wrench, Bot, ArrowLeft, X, Sparkles,
  Check, ChevronDown, ChevronUp, Languages, Send, CircleDollarSign,
  Pencil, Trash2, Info, Home,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { ChatBotPanel } from "@/components/ui/chatbot-bubble";
import { AIChatPanel } from "@/components/ui/ai-chat-panel";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import {
  serviceCategories,
  categoryColorStyles,
  presetPlans,
  type Language,
  type ServiceItem,
  type ServiceCategory,
  type PresetPlan,
} from "@/lib/servicesConfig";
import { calculateTotals, getSelectedByCategory } from "@/lib/pricing";
import { serviceInfoData, serviceInfoLabels } from "@/lib/serviceInfoData";

// --- ICON MAP ---
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  web: Globe,
  bookings: Calendar,
  whatsapp: MessageCircle,
  crm: Zap,
  marketing: Megaphone,
  design: Paintbrush,
  maintenance: Wrench,
  ai: Bot,
};

// --- ANIMATIONS ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// --- LANGUAGE ---
type LangKey = Language;
type Currency = "EUR" | "USD" | "ARS" | "BTC";
type FloatingCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
const BUBBLE_CORNER_STORAGE_KEY = "unaifly-floating-bubble-corner";

const cornerContainerClasses: Record<FloatingCorner, string> = {
  "top-left": "top-4 left-4 lg:top-6 lg:left-6",
  "top-right": "top-4 right-4 lg:top-6 lg:right-6",
  "bottom-left": "bottom-24 left-4 lg:bottom-6 lg:left-6",
  "bottom-right": "bottom-24 right-4 lg:bottom-6 lg:right-6",
};

const popoverClassesByCorner: Record<FloatingCorner, string> = {
  "top-left": "absolute top-full left-0 mt-2",
  "top-right": "absolute top-full right-0 mt-2",
  "bottom-left": "absolute bottom-full left-0 mb-2",
  "bottom-right": "absolute bottom-full right-0 mb-2",
};

const hintClassesByCorner: Record<FloatingCorner, string> = {
  "top-left": "top-full left-0 mt-2",
  "top-right": "top-full right-0 mt-2 text-right",
  "bottom-left": "bottom-full left-0 mb-2",
  "bottom-right": "bottom-full right-0 mb-2 text-right",
};

const languageOptions: Array<{ code: LangKey; label: string; name: string }> = [
  { code: "es", label: "ES", name: "Castellano" },
  { code: "en", label: "EN", name: "English" },
  { code: "ca", label: "CA", name: "Català" },
  { code: "it", label: "IT", name: "Italiano" },
];

const currencyOptions: Array<{ code: Currency; label: string; name: string }> = [
  { code: "EUR", label: "EUR", name: "Euro" },
  { code: "USD", label: "USD", name: "US Dollar" },
  { code: "ARS", label: "ARS", name: "Peso Argentino" },
  { code: "BTC", label: "BTC", name: "Bitcoin" },
];

const fallbackCurrencyRates: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  ARS: 1170,
  BTC: 0.000011,
};

function getInitialLanguage(): LangKey {
  if (typeof window === "undefined") return "es";
  const savedLanguage = getStorageItem("language") as LangKey | null;
  if (savedLanguage && savedLanguage in t) {
    return savedLanguage;
  }
  return "es";
}

function getInitialCurrency(): Currency {
  if (typeof window === "undefined") return "EUR";
  const savedCurrency = getStorageItem("currency") as Currency | null;
  if (savedCurrency && currencyOptions.some((option) => option.code === savedCurrency)) {
    return savedCurrency;
  }
  return "EUR";
}

function getInitialBubbleCorner(): FloatingCorner {
  if (typeof window === "undefined") return "bottom-right";
  const savedCorner = getStorageItem(BUBBLE_CORNER_STORAGE_KEY);
  if (savedCorner === "top-left" || savedCorner === "top-right" || savedCorner === "bottom-left" || savedCorner === "bottom-right") {
    return savedCorner as FloatingCorner;
  }
  return "bottom-right";
}

const WHATSAPP_NUMBER = "34644583808";

const t: Record<LangKey, Record<string, string>> = {
  en: {
    back: "Back",
    home: "Home",
    title: "Build your plan",
    subtitle: "Choose exactly what your business needs — see pricing instantly and request your custom quote in seconds.",
    oneTime: "One-time",
    monthly: "Monthly",
    summary: "Your plan",
    oneTimeTotal: "One-time total",
    monthlyTotal: "Monthly total",
    noSelection: "Select services or choose a preset plan",
    requestPlan: "Request this plan",
    popular: "Popular",
    recommended: "Recommended",
    perMonth: "/mo",
    selectedCount: "selected",
    expandAll: "Expand all",
    collapseAll: "Collapse all",
    edit: "Edit",
    done: "Done",
    clearSelection: "Clear selection",
    remove: "Remove",
    custom: "Custom",
    preset: "Plan",
    presetHeading: "Premade plans",
    summaryHeading: "Choose a preset plan or build your own",
  },
  es: {
    back: "Volver",
    home: "Inicio",
    title: "Arma tu plan",
    subtitle: "Elige exactamente lo que necesita tu negocio — ve el precio al instante y solicita tu presupuesto personalizado en segundos.",
    oneTime: "Único",
    monthly: "Mensual",
    summary: "Tu plan",
    oneTimeTotal: "Total único",
    monthlyTotal: "Total mensual",
    noSelection: "Selecciona servicios o elige un plan predefinido",
    requestPlan: "Solicitar este plan",
    popular: "Popular",
    recommended: "Recomendado",
    perMonth: "/mes",
    selectedCount: "seleccionados",
    expandAll: "Expandir todo",
    collapseAll: "Colapsar todo",
    edit: "Editar",
    done: "Listo",
    clearSelection: "Limpiar selección",
    remove: "Quitar",
    custom: "Personalizado",
    preset: "Plan",
    presetHeading: "Planes predefinidos",
    summaryHeading: "Elige un plan predefinido o arma el tuyo",
  },
  ca: {
    back: "Tornar",
    home: "Inici",
    title: "Munta el teu pla",
    subtitle: "Tria exactament el que necessita el teu negoci — veu el preu a l'instant i sol·licita el teu pressupost en segons.",
    oneTime: "Únic",
    monthly: "Mensual",
    summary: "El teu pla",
    oneTimeTotal: "Total únic",
    monthlyTotal: "Total mensual",
    noSelection: "Selecciona serveis o tria un pla predefinit",
    requestPlan: "Sol·licitar aquest pla",
    popular: "Popular",
    recommended: "Recomanat",
    perMonth: "/mes",
    selectedCount: "seleccionats",
    expandAll: "Expandir tot",
    collapseAll: "Reduir tot",
    edit: "Editar",
    done: "Fet",
    clearSelection: "Netejar selecció",
    remove: "Treure",
    custom: "Personalitzat",
    preset: "Pla",
    presetHeading: "Plans predefinits",
    summaryHeading: "Tria un pla predefinit o munta el teu",
  },
  it: {
    back: "Indietro",
    home: "Home",
    title: "Costruisci il tuo piano",
    subtitle: "Scegli esattamente ciò di cui ha bisogno il tuo business — vedi i prezzi istantaneamente e richiedi il tuo preventivo in pochi secondi.",
    oneTime: "Una tantum",
    monthly: "Mensile",
    summary: "Il tuo piano",
    oneTimeTotal: "Totale una tantum",
    monthlyTotal: "Totale mensile",
    noSelection: "Seleziona servizi o scegli un piano predefinito",
    requestPlan: "Richiedi questo piano",
    popular: "Popolare",
    recommended: "Consigliato",
    perMonth: "/mese",
    selectedCount: "selezionati",
    expandAll: "Espandi tutto",
    collapseAll: "Riduci tutto",
    edit: "Modifica",
    done: "Fatto",
    clearSelection: "Cancella selezione",
    remove: "Rimuovi",
    custom: "Personalizzato",
    preset: "Piano",
    presetHeading: "Piani predefiniti",
    summaryHeading: "Scegli un piano predefinito o costruisci il tuo",
  },
};

// --- HELPERS ---

function formatAmount(value: number, currency: Currency) {
  if (!Number.isFinite(value)) return "";
  if (currency === "BTC") {
    const roundedBtc = Math.ceil(value * 1_000_000) / 1_000_000;
    return `BTC ${roundedBtc.toLocaleString("es-ES", { minimumFractionDigits: 6, maximumFractionDigits: 6 })}`;
  }
  const roundedValue = Math.ceil(value);
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedValue);
}

function formatRateAmount(value: number, currency: Currency) {
  if (!Number.isFinite(value)) return "";
  if (currency === "BTC") {
    return `BTC ${value.toLocaleString("es-ES", { minimumFractionDigits: 6, maximumFractionDigits: 8 })}`;
  }

  const maxFractionDigits = Math.abs(value) < 0.01 ? 6 : 2;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

function convertEurValue(valueInEur: number, currency: Currency, currencyRates: Record<Currency, number>) {
  return valueInEur * (currencyRates[currency] ?? fallbackCurrencyRates[currency]);
}

function getCrossCurrencyRate(from: Currency, to: Currency, currencyRates: Record<Currency, number>) {
  const fromRate = currencyRates[from] ?? fallbackCurrencyRates[from];
  const toRate = currencyRates[to] ?? fallbackCurrencyRates[to];
  if (!Number.isFinite(fromRate) || !Number.isFinite(toRate) || fromRate <= 0 || toRate <= 0) return null;
  return toRate / fromRate;
}

async function fetchLiveCurrencyRates(signal: AbortSignal): Promise<Partial<Record<Currency, number>>> {
  const [fiatResult, btcResult] = await Promise.allSettled([
    fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,ARS", { signal }),
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur", { signal }),
  ]);
  const nextRates: Partial<Record<Currency, number>> = {};
  if (fiatResult.status === "fulfilled" && fiatResult.value.ok) {
    const fiatData = await fiatResult.value.json() as { rates?: { USD?: number; ARS?: number } };
    if (typeof fiatData.rates?.USD === "number" && Number.isFinite(fiatData.rates.USD)) nextRates.USD = fiatData.rates.USD;
    if (typeof fiatData.rates?.ARS === "number" && Number.isFinite(fiatData.rates.ARS)) nextRates.ARS = fiatData.rates.ARS;
  }
  if (btcResult.status === "fulfilled" && btcResult.value.ok) {
    const btcData = await btcResult.value.json() as { bitcoin?: { eur?: number } };
    const btcInEur = btcData.bitcoin?.eur;
    if (typeof btcInEur === "number" && Number.isFinite(btcInEur) && btcInEur > 0) nextRates.BTC = 1 / btcInEur;
  }
  return nextRates;
}

function getCurrencyHint(optionCurrency: Currency, selectedCurrency: Currency, currencyRates: Record<Currency, number>) {
  if (optionCurrency === selectedCurrency) return "Base";
  const crossRate = getCrossCurrencyRate(selectedCurrency, optionCurrency, currencyRates);
  if (!crossRate) return "-";
  return `1 ${selectedCurrency} ~ ${formatRateAmount(crossRate, optionCurrency)}`;
}

function detectActivePreset(selectedIds: Set<string>): string | null {
  for (const preset of presetPlans) {
    const presetSet = new Set(preset.itemIds);
    if (presetSet.size === selectedIds.size && [...presetSet].every((id) => selectedIds.has(id))) {
      return preset.id;
    }
  }
  return null;
}

const mutuallyExclusiveItemGroups: string[][] = [
  ["web-basic", "web-landing", "web-multi", "web-ecommerce"],
  ["wa-button", "wa-basic-auto", "wa-secretary"],
  ["maint-basic", "maint-support", "maint-pro"],
];

const mutuallyExclusiveByItem = mutuallyExclusiveItemGroups.reduce<Record<string, string[]>>((acc, group) => {
  for (const itemId of group) acc[itemId] = group;
  return acc;
}, {});

function applyMutualExclusion(selectedIds: Set<string>, incomingItemId: string) {
  const group = mutuallyExclusiveByItem[incomingItemId];
  if (!group) return;
  for (const itemId of group) {
    if (itemId !== incomingItemId) selectedIds.delete(itemId);
  }
}

// --- BILLING BADGE ---
function BillingBadge({ type, lang }: { type: "one_time" | "monthly"; lang: Record<string, string> }) {
  if (type === "monthly") {
    return (
      <span className="inline-flex items-center rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-semibold text-purple-300 ring-1 ring-purple-500/20">
        {lang.monthly}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold text-sky-300 ring-1 ring-sky-500/20">
      {lang.oneTime}
    </span>
  );
}

// --- TAG BADGE ---
function TagBadge({ tag, lang }: { tag: string; lang: Record<string, string> }) {
  if (tag === "popular") {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
        {lang.popular}
      </span>
    );
  }
  if (tag === "recommended") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
        {lang.recommended}
      </span>
    );
  }
  return null;
}

// --- CATEGORY CARD ---
function CategoryCard({
  category, language, lang, formatValue, selectedIds, onToggle, isExpanded, onToggleExpand,
}: {
  category: ServiceCategory;
  language: LangKey;
  lang: Record<string, string>;
  formatValue: (amount: number) => string;
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5% 0px" });
  const Icon = iconMap[category.id] ?? Globe;
  const colors = categoryColorStyles[category.colorKey] ?? categoryColorStyles.sky;
  const selectedCount = category.items.filter((item) => selectedIds.has(item.id)).length;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="glass-card rounded-3xl overflow-hidden">
        <button
          onClick={onToggleExpand}
          className="w-full flex items-center gap-3 p-5 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className={`w-10 h-10 rounded-2xl ${colors.bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${colors.icon}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold ${colors.title}`}>{category.name[language]}</h3>
              {selectedCount > 0 && (
                <span className={`inline-flex items-center rounded-full ${colors.bg} px-2 py-0.5 text-[10px] font-bold ${colors.icon}`}>
                  {selectedCount}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{category.description[language]}</p>
          </div>
          <div className="shrink-0 text-muted-foreground">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-1">
                {category.items.map((item) => (
                  <ServiceItemRow
                    key={item.id}
                    item={item}
                    language={language}
                    lang={lang}
                    formatValue={formatValue}
                    isSelected={selectedIds.has(item.id)}
                    onToggle={() => onToggle(item.id)}
                    colors={colors}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// --- INFO POPOVER PORTAL (renders inside body to escape overflow-hidden) ---
function InfoPopoverPortal({
  itemId, language, buttonRect, onMouseEnter, onMouseLeave, onClose,
}: {
  itemId: string;
  language: LangKey;
  buttonRect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose: () => void;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const info = serviceInfoData[itemId]?.[language];
  const labels = serviceInfoLabels[language];

  const popW = 320;
  const pad = 12;

  // Horizontal: center on button, clamp to viewport
  let left = buttonRect.left + buttonRect.width / 2 - popW / 2;
  left = Math.max(pad, Math.min(left, window.innerWidth - popW - pad));
  const arrowLeft = buttonRect.left + buttonRect.width / 2 - left;

  // Vertical: prefer above, fall back to below
  const openAbove = buttonRect.top > 280;
  const top = openAbove ? undefined : buttonRect.bottom + 8;
  const bottom = openAbove ? window.innerHeight - buttonRect.top + 8 : undefined;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  if (!info) return null;

  return createPortal(
    <div
      ref={popoverRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "fixed",
        top,
        bottom,
        left,
        width: popW,
        zIndex: 9999,
      }}
      className="rounded-2xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Arrow */}
      <div
        className="absolute w-3 h-3 rotate-45 bg-slate-950/95"
        style={{
          left: arrowLeft - 6,
          ...(openAbove
            ? { bottom: -6, borderRight: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" }
            : { top: -6, borderLeft: "1px solid rgba(255,255,255,0.15)", borderTop: "1px solid rgba(255,255,255,0.15)" }),
        }}
      />

      <div className="space-y-3.5 relative">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-1 h-3.5 rounded-full bg-cyan-400" />
            <p className="text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-cyan-300 to-sky-400 bg-clip-text text-transparent">{labels.does}</p>
          </div>
          <p className="text-xs text-slate-200/90 leading-relaxed pl-3">{info.does}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-1 h-3.5 rounded-full bg-emerald-400" />
            <p className="text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">{labels.result}</p>
          </div>
          <p className="text-xs text-slate-200/90 leading-relaxed pl-3">{info.result}</p>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-1 h-3.5 rounded-full bg-amber-400" />
            <p className="text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">{labels.value}</p>
          </div>
          <p className="text-xs text-slate-200/90 leading-relaxed pl-3">{info.value}</p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

// --- INFO POPOVER TRIGGER ---
function InfoPopover({ itemId, language }: { itemId: string; language: LangKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const info = serviceInfoData[itemId]?.[language];

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return;
    const handler = () => setIsOpen(false);
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, [isOpen]);

  if (!info) return null;

  const open = () => {
    if (buttonRef.current) {
      setRect(buttonRef.current.getBoundingClientRect());
      setIsOpen(true);
    }
  };

  const close = () => setIsOpen(false);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(open, 200);
  };
  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(close, 300);
  };

  return (
    <span
      className="inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (isOpen) close(); else open(); }}
        className="p-0.5 rounded-full text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors"
        aria-label="Info"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && rect && (
        <InfoPopoverPortal
          itemId={itemId}
          language={language}
          buttonRect={rect}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClose={close}
        />
      )}
    </span>
  );
}

// --- SERVICE ITEM ROW ---
function ServiceItemRow({
  item, language, lang, formatValue, isSelected, onToggle, colors,
}: {
  item: ServiceItem;
  language: LangKey;
  lang: Record<string, string>;
  formatValue: (amount: number) => string;
  isSelected: boolean;
  onToggle: () => void;
  colors: { icon: string; bg: string; border: string };
}) {
  return (
    <label
      className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? `bg-white/[0.06] ${colors.border} border`
          : "hover:bg-white/[0.03] border border-transparent"
      }`}
    >
      <div className="mt-0.5 shrink-0">
        <div
          className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected
              ? `${colors.bg} ${colors.border} border`
              : "border-white/20 bg-transparent"
          }`}
        >
          {isSelected && <Check className={`w-3 h-3 ${colors.icon}`} />}
        </div>
        <input type="checkbox" checked={isSelected} onChange={onToggle} className="sr-only" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-foreground">{item.name[language]}</span>
          <InfoPopover itemId={item.id} language={language} />
          {item.tags?.map((tag) => <TagBadge key={tag} tag={tag} lang={lang} />)}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{item.description[language]}</p>
      </div>
      <div className="shrink-0 text-right flex flex-col items-end gap-1">
        <span className="text-sm font-bold text-foreground tabular-nums">
          {formatValue(item.price)}
          {item.billingType === "monthly" && <span className="text-xs font-normal text-muted-foreground">{lang.perMonth}</span>}
        </span>
        <BillingBadge type={item.billingType} lang={lang} />
      </div>
    </label>
  );
}

// --- MOBILE SUMMARY DRAWER ---
function MobileSummaryDrawer({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-slate-950/62 backdrop-blur-sm lg:hidden" onClick={onClose} />
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-cyan-300/18 bg-gradient-to-b from-slate-900/98 via-slate-950/97 to-indigo-950/95 shadow-[0_-20px_55px_-24px_rgba(56,189,248,0.45)] lg:hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cyan-200/10 bg-gradient-to-r from-slate-900/95 via-cyan-950/45 to-indigo-950/70 px-5 py-3 backdrop-blur-sm">
              <span className="text-sm font-bold">Summary</span>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="rounded-2xl border border-cyan-200/10 bg-gradient-to-br from-white/[0.04] via-cyan-300/[0.03] to-indigo-300/[0.02] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- PRESET PLAN COLOR STYLES ---
const presetColorStyles: Record<string, {
  border: string; bg: string; ring: string; text: string;
  glow: string; gradient: string; hoverBorder: string; hoverBg: string;
  checkBg: string; priceTint: string;
}> = {
  green: {
    border: "border-emerald-500/30", bg: "bg-emerald-500/8", ring: "ring-emerald-400/25",
    text: "text-emerald-300", glow: "shadow-emerald-500/15", gradient: "from-emerald-500/20 to-emerald-600/5",
    hoverBorder: "hover:border-emerald-500/25", hoverBg: "hover:bg-emerald-500/[0.04]",
    checkBg: "bg-emerald-500/15", priceTint: "text-emerald-400",
  },
  blue: {
    border: "border-sky-500/30", bg: "bg-sky-500/8", ring: "ring-sky-400/25",
    text: "text-sky-300", glow: "shadow-sky-500/15", gradient: "from-sky-500/20 to-sky-600/5",
    hoverBorder: "hover:border-sky-500/25", hoverBg: "hover:bg-sky-500/[0.04]",
    checkBg: "bg-sky-500/15", priceTint: "text-sky-400",
  },
  purple: {
    border: "border-violet-500/30", bg: "bg-violet-500/8", ring: "ring-violet-400/25",
    text: "text-violet-300", glow: "shadow-violet-500/15", gradient: "from-violet-500/20 to-violet-600/5",
    hoverBorder: "hover:border-violet-500/25", hoverBg: "hover:bg-violet-500/[0.04]",
    checkBg: "bg-violet-500/15", priceTint: "text-violet-400",
  },
  gold: {
    border: "border-amber-500/30", bg: "bg-amber-500/8", ring: "ring-amber-400/25",
    text: "text-amber-300", glow: "shadow-amber-500/15", gradient: "from-amber-500/20 to-amber-600/5",
    hoverBorder: "hover:border-amber-500/25", hoverBg: "hover:bg-amber-500/[0.04]",
    checkBg: "bg-amber-500/15", priceTint: "text-amber-400",
  },
};

// --- PRESET PLAN SELECTOR ---
function PresetSelector({
  language, lang, formatValue, activePresetId, onSelectPreset, isOpen, onToggleOpen,
}: {
  language: LangKey;
  lang: Record<string, string>;
  formatValue: (amount: number) => string;
  activePresetId: string | null;
  onSelectPreset: (preset: PresetPlan) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  return (
    <div>
      {/* Collapsible header */}
      <button
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between py-2 group"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">{lang.presetHeading}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pb-2 px-0.5 pt-0.5">
              {presetPlans.map((preset) => {
                const isActive = activePresetId === preset.id;
                const colors = presetColorStyles[preset.colorKey] ?? presetColorStyles.green;
                const presetTotals = calculateTotals(new Set(preset.itemIds), serviceCategories);
                return (
                  <motion.button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    className={`relative w-full text-left p-3 rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? `${colors.border} ${colors.bg} ring-1 ${colors.ring} shadow-lg ${colors.glow}`
                        : `border-white/8 ${colors.hoverBorder} ${colors.hoverBg}`
                    }`}
                  >
                    {/* Subtle gradient overlay when active */}
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} pointer-events-none`} />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-2">
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              className={`w-4 h-4 rounded-full ${colors.checkBg} flex items-center justify-center`}
                            >
                              <Check className={`w-2.5 h-2.5 ${colors.text}`} />
                            </motion.div>
                          )}
                          <span className={`text-xs font-bold ${isActive ? colors.text : "text-foreground"}`}>
                            {preset.name[language]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] tabular-nums">
                          <span className={isActive ? colors.priceTint : "text-muted-foreground"}>
                            {formatValue(presetTotals.oneTime)}
                          </span>
                          {presetTotals.monthly > 0 && (
                            <span className={isActive ? "text-purple-300" : "text-purple-400/70"}>
                              +{formatValue(presetTotals.monthly)}{lang.perMonth}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-[11px] leading-tight ${isActive ? `${colors.text} opacity-80` : "text-muted-foreground"}`}>
                        {preset.description[language]}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function ServiceBuilder() {
  const [language, setLanguage] = useState<LangKey>(getInitialLanguage);
  const [currency, setCurrency] = useState<Currency>(getInitialCurrency);
  const [currencyRates, setCurrencyRates] = useState<Record<Currency, number>>(fallbackCurrencyRates);
  const [langBubbleOpen, setLangBubbleOpen] = useState(false);
  const [currencyBubbleOpen, setCurrencyBubbleOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(serviceCategories.map((c) => c.id))
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(true);
  const [bubbleCorner, setBubbleCorner] = useState<FloatingCorner>(getInitialBubbleCorner);
  const [isDraggingBubbles, setIsDraggingBubbles] = useState(false);
  const bubblesContainerRef = useRef<HTMLDivElement>(null);
  const faqButtonRef = useRef<HTMLButtonElement>(null);
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragMovedRef = useRef(false);
  const dragLastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const dragVelocityRef = useRef({ x: 0, y: 0 });
  const closeFloatingOverlays = useCallback(() => {
    setCurrencyBubbleOpen(false);
    setLangBubbleOpen(false);
    setChatbotOpen(false);
    setAiChatOpen(false);
  }, []);

  useEffect(() => {
    setStorageItem("language", language);
    setStorageItem("currency", currency);
  }, [language, currency]);

  useEffect(() => {
    setStorageItem(BUBBLE_CORNER_STORAGE_KEY, bubbleCorner);
  }, [bubbleCorner]);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (bubblesContainerRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-chat-panel='true']")) return;
      if (target instanceof Element && target.closest("[data-floating-panel='true']")) return;
      closeFloatingOverlays();
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeFloatingOverlays();
    };

    window.addEventListener("pointerdown", handleOutsidePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("pointerdown", handleOutsidePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeFloatingOverlays]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const refreshRates = async () => {
      try {
        const liveRates = await fetchLiveCurrencyRates(controller.signal);
        if (!isMounted || !Object.keys(liveRates).length) return;
        setCurrencyRates((prev) => ({ ...prev, ...liveRates }));
      } catch { /* keep fallback */ }
    };
    void refreshRates();
    const intervalId = window.setInterval(() => { void refreshRates(); }, 30 * 60 * 1000);
    return () => { isMounted = false; controller.abort(); window.clearInterval(intervalId); };
  }, []);

  const lang = t[language];
  const totals = calculateTotals(selectedIds, serviceCategories);
  const selectedByCategory = getSelectedByCategory(selectedIds, serviceCategories);
  const totalSelected = selectedIds.size;
  const activePresetId = detectActivePreset(selectedIds);

  const getCornerFromPoint = useCallback((x: number, y: number): FloatingCorner => {
    const horizontal = x < window.innerWidth / 2 ? "left" : "right";
    const vertical = y < window.innerHeight / 2 ? "top" : "bottom";
    return `${vertical}-${horizontal}` as FloatingCorner;
  }, []);

  const handleBubblesPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-floating-panel='true']")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const now = performance.now();
    dragPointerIdRef.current = event.pointerId;
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    dragMovedRef.current = false;
    dragLastPointRef.current = { x: event.clientX, y: event.clientY, time: now };
    dragVelocityRef.current = { x: 0, y: 0 };
    setIsDraggingBubbles(false);
  }, []);

  const handleBubblesPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) return;
    const start = dragStartRef.current;
    if (!start) return;
    const now = performance.now();
    const lastPoint = dragLastPointRef.current;
    if (lastPoint) {
      const deltaTime = now - lastPoint.time;
      if (deltaTime > 0) {
        dragVelocityRef.current = {
          x: (event.clientX - lastPoint.x) / deltaTime,
          y: (event.clientY - lastPoint.y) / deltaTime,
        };
      }
    }
    dragLastPointRef.current = { x: event.clientX, y: event.clientY, time: now };

    if (!dragMovedRef.current && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) {
      dragMovedRef.current = true;
      setIsDraggingBubbles(true);
      setCurrencyBubbleOpen(false);
      setLangBubbleOpen(false);
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (!dragMovedRef.current) return;
    setBubbleCorner(getCornerFromPoint(event.clientX, event.clientY));
  }, [getCornerFromPoint, isDraggingBubbles]);

  const stopBubbleDragging = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) return;
    const velocity = dragVelocityRef.current;
    if (dragMovedRef.current) {
      const momentumMs = 180;
      const projectedX = event.clientX + velocity.x * momentumMs;
      const projectedY = event.clientY + velocity.y * momentumMs;
      setBubbleCorner(getCornerFromPoint(projectedX, projectedY));
    }
    dragPointerIdRef.current = null;
    dragStartRef.current = null;
    dragLastPointRef.current = null;
    dragVelocityRef.current = { x: 0, y: 0 };
    setIsDraggingBubbles(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, [getCornerFromPoint]);

  const formatValue = useCallback((amount: number) => {
    return formatAmount(convertEurValue(amount, currency, currencyRates), currency);
  }, [currency, currencyRates]);

  const toggleItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        applyMutualExclusion(next, id);
        next.add(id);
      }
      return next;
    });
    setPresetsOpen(false);
  }, []);

  const removeItem = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
    setEditMode(false);
    setPresetsOpen(true);
  }, []);

  const selectPreset = useCallback((preset: PresetPlan) => {
    setSelectedIds(() => {
      const next = new Set<string>();
      for (const itemId of preset.itemIds) {
        applyMutualExclusion(next, itemId);
        next.add(itemId);
      }
      return next;
    });
    setEditMode(false);
    setPresetsOpen(false);
  }, []);

  const toggleCategoryExpand = useCallback((id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set(serviceCategories.map((c) => c.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  const getWhatsAppUrl = useCallback(() => {
    const lines: string[] = [];
    const presetLabel = activePresetId
      ? presetPlans.find((p) => p.id === activePresetId)?.name[language] ?? ""
      : lang.custom;
    for (const group of selectedByCategory) {
      const cat = serviceCategories.find((c) => c.id === group.categoryId);
      if (!cat) continue;
      lines.push(`\n*${cat.name[language]}*`);
      for (const item of group.items) {
        const suffix = item.billingType === "monthly" ? lang.perMonth : "";
        lines.push(`  - ${item.name[language]} (${formatValue(item.price)}${suffix})`);
      }
    }
    const msg = `Hola Franco! Me interesa el plan "${presetLabel}":\n${lines.join("\n")}\n\n${formatValue(totals.oneTime)} único + ${formatValue(totals.monthly)}${lang.perMonth}\n\n¿Lo vemos?`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }, [selectedByCategory, language, lang, totals, formatValue, activePresetId]);

  // --- SUMMARY CONTENT ---
  const renderSummaryContent = () => (
    <div className="space-y-4">
      {/* Preset Selector */}
      <PresetSelector
        language={language}
        lang={lang}
        formatValue={formatValue}
        activePresetId={activePresetId}
        onSelectPreset={selectPreset}
        isOpen={presetsOpen}
        onToggleOpen={() => setPresetsOpen((v) => !v)}
      />

      {/* Plan label */}
      {totalSelected > 0 && (
        <div className="flex items-center gap-2 pt-1">
          {activePresetId ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
              <Sparkles className="w-3 h-3" />
              {lang.preset} {presetPlans.find((p) => p.id === activePresetId)?.name[language]}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {lang.custom}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">
            {totalSelected} {lang.selectedCount}
          </span>
        </div>
      )}

      {/* Selected Items */}
      {totalSelected === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">{lang.noSelection}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {selectedByCategory.map((group) => {
            const cat = serviceCategories.find((c) => c.id === group.categoryId);
            if (!cat) return null;
            const colors = categoryColorStyles[cat.colorKey] ?? categoryColorStyles.sky;
            const Icon = iconMap[cat.id] ?? Globe;
            return (
              <div key={group.categoryId}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
                  <span className={`text-xs font-bold ${colors.title}`}>{cat.name[language]}</span>
                </div>
                <ul className="space-y-1 ml-5">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-xs group">
                      <span className="text-muted-foreground truncate mr-2">{item.name[language]}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-foreground font-medium tabular-nums">
                          {formatValue(item.price)}
                          {item.billingType === "monthly" && <span className="text-muted-foreground">{lang.perMonth}</span>}
                        </span>
                        {editMode && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-0.5 rounded-md text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title={lang.remove}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Totals */}
      {totalSelected > 0 && (
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{lang.oneTimeTotal}</span>
            <span className="text-lg font-bold text-foreground tabular-nums">{formatValue(totals.oneTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{lang.monthlyTotal}</span>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent tabular-nums">
              {formatValue(totals.monthly)}{lang.perMonth}
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      {totalSelected > 0 && (
        <Button size="lg" className="w-full rounded-2xl bg-green-600 text-white hover:bg-green-700 text-sm font-bold" asChild>
          <a href={getWhatsAppUrl()} target="_blank" rel="noreferrer">
            <Send className="mr-2 h-4 w-4" />
            {lang.requestPlan}
          </a>
        </Button>
      )}

      {/* Edit / Clear actions (below CTA) */}
      {totalSelected > 0 && (
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode((v) => !v)}
            className={`flex-1 text-xs py-2 px-3 rounded-xl border transition-colors ${
              editMode
                ? "border-primary/30 text-primary bg-primary/5"
                : "border-white/10 text-muted-foreground hover:bg-white/5"
            }`}
          >
            <Pencil className="w-3 h-3 inline mr-1" />
            {editMode ? lang.done : lang.edit}
          </button>
          {editMode && (
            <button
              onClick={clearAll}
              className="flex-1 text-xs py-2 px-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3 h-3 inline mr-1" />
              {lang.clearSelection}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <AmbientBackground />
      <style>{`
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.12);
          position: relative;
          transition: border-color 280ms ease, box-shadow 280ms ease, background-color 280ms ease;
        }
        .glass-card:hover {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.06);
        }
      `}</style>

      <main className="relative z-10 flex-1 py-6 px-3 sm:px-4 lg:px-6">
        {/* --- TOP BAR --- */}
        <div className="mx-auto w-full max-w-[1280px] flex items-center mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <Home className="w-3.5 h-3.5 opacity-60" />
            {lang.home}
          </Link>
        </div>

        {/* --- HEADER --- */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mx-auto w-full max-w-[1280px] text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground mb-3">{lang.title}</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg">{lang.subtitle}</p>
        </motion.div>

        {/* --- MAIN LAYOUT --- */}
        <div className="mx-auto w-full max-w-[1280px] lg:flex lg:items-start lg:gap-6">
          {/* LEFT: Categories */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex h-6 items-center justify-between">
              <span className="text-xs text-muted-foreground">{totalSelected} {lang.selectedCount}</span>
              <div className="flex gap-2">
                <button onClick={expandAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{lang.expandAll}</button>
                <span className="text-muted-foreground/30">|</span>
                <button onClick={collapseAll} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{lang.collapseAll}</button>
              </div>
            </div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
              {serviceCategories.map((category) => (
                <motion.div key={category.id} variants={itemFadeIn}>
                  <CategoryCard
                    category={category}
                    language={language}
                    lang={lang}
                    formatValue={formatValue}
                    selectedIds={selectedIds}
                    onToggle={toggleItem}
                    isExpanded={expandedCategories.has(category.id)}
                    onToggleExpand={() => toggleCategoryExpand(category.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT: Sticky Summary (desktop) */}
          <div className="hidden lg:block w-[360px] shrink-0">
            <div className="sticky top-6">
              <div className="mb-4 px-1 text-center">
                <p className="text-xs text-muted-foreground leading-relaxed">{lang.summaryHeading}</p>
              </div>
              <div className="glass-card rounded-3xl p-5">
                {renderSummaryContent()}
              </div>
            </div>
          </div>
        </div>

        {/* --- MOBILE FLOATING BUTTON --- */}
        <div className="fixed bottom-4 left-4 right-4 z-30 lg:hidden">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="w-full glass-card rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-foreground">{lang.summary}</span>
              {totalSelected > 0 && (
                <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">{totalSelected}</span>
              )}
            </div>
            <div className="text-right">
              {totalSelected > 0 ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tabular-nums">{formatValue(totals.oneTime)}</span>
                  {totals.monthly > 0 && (
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent tabular-nums">
                      +{formatValue(totals.monthly)}{lang.perMonth}
                    </span>
                  )}
                </div>
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile Drawer */}
        <MobileSummaryDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)}>
          {renderSummaryContent()}
        </MobileSummaryDrawer>
      </main>

      {/* Floating currency + language bubbles */}
      <motion.div
        ref={bubblesContainerRef}
        layout
        transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.9 }}
        className={`fixed z-50 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-2 rounded-full select-none sm:flex-nowrap ${cornerContainerClasses[bubbleCorner]} ${isDraggingBubbles ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handleBubblesPointerDown}
        onPointerMove={handleBubblesPointerMove}
        onPointerUp={stopBubbleDragging}
        onPointerCancel={stopBubbleDragging}
      >
        {/* Drag grip handle */}
        <div
          className="flex h-10 w-4 shrink-0 cursor-grab items-center justify-center opacity-35 transition-opacity hover:opacity-65 active:cursor-grabbing"
          aria-hidden="true"
          title="Arrastrar"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" className="text-slate-300">
            <circle cx="1.5" cy="1.5" r="1.5"/><circle cx="6.5" cy="1.5" r="1.5"/>
            <circle cx="1.5" cy="7" r="1.5"/><circle cx="6.5" cy="7" r="1.5"/>
            <circle cx="1.5" cy="12.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/>
          </svg>
        </div>
        <AnimatePresence>
          {!currencyBubbleOpen && !langBubbleOpen && !chatbotOpen && !aiChatOpen && !hintDismissed && (
            <motion.div
              key="tour-hint"
              initial={{ opacity: 0, y: 8, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.93 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className={`pointer-events-auto absolute max-w-[240px] overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-slate-900/92 via-indigo-950/80 to-slate-900/92 px-3 py-2.5 shadow-[0_8px_28px_-6px_rgba(99,102,241,0.42)] backdrop-blur-2xl ${hintClassesByCorner[bubbleCorner]}`}
            >
              <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent" />
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 ring-1 ring-indigo-400/40">
                  <svg className="h-3 w-3 text-indigo-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="flex-1 text-[11px] leading-snug text-slate-200/90">
                  Estos ajustes y asistentes{" "}
                  <span className="font-semibold text-indigo-200">pueden verse en tu web</span>
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setHintDismissed(true); }}
                  className="ml-0.5 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/15 hover:text-slate-200"
                  aria-label="Cerrar"
                >
                  <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Top-left: Currency */}
        <div className="relative h-12 w-12 shrink-0">
          <AnimatePresence>
            {currencyBubbleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.9 }}
                data-floating-panel="true"
                className={`${popoverClassesByCorner[bubbleCorner]} w-[300px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-amber-200/22 bg-gradient-to-br from-slate-900/90 via-amber-950/76 to-yellow-950/80 p-2 text-slate-100 shadow-[0_16px_44px_-18px_rgba(251,191,36,0.38)] backdrop-blur-2xl`}
              >
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/80 to-transparent" />
                <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="relative z-10 px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-100/80">Currency</div>
                {currencyOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`relative z-10 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-300 ${currency === option.code ? "bg-gradient-to-r from-amber-400/25 to-yellow-300/10 text-amber-50 ring-1 ring-amber-200/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}
                    onClick={() => { setCurrency(option.code); setCurrencyBubbleOpen(false); }}
                  >
                    <span className={`font-mono font-extrabold w-9 shrink-0 ${currency === option.code ? "text-amber-100" : "text-slate-100"}`}>{option.label}</span>
                    <span className="min-w-0 flex-1 truncate text-[12px] opacity-90">{option.name} · {getCurrencyHint(option.code, currency, currencyRates)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setCurrencyBubbleOpen(!currencyBubbleOpen);
              setLangBubbleOpen(false);
              setChatbotOpen(false);
              setAiChatOpen(false);
            }}
            className="absolute inset-0 flex items-center justify-center rounded-full border border-amber-200/34 bg-gradient-to-br from-amber-400/18 via-yellow-400/12 to-orange-500/14 text-amber-50 shadow-[0_10px_24px_-12px_rgba(251,191,36,0.55)] backdrop-blur-xl transition-all duration-300 hover:border-amber-100/55 hover:from-amber-300/26 hover:to-yellow-400/24"
            aria-label="Select currency"
          >
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </motion.button>
        </div>

        {/* Top-right: Language */}
        <div className="relative h-12 w-12 shrink-0">
          <AnimatePresence>
            {langBubbleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.9 }}
                data-floating-panel="true"
                className={`${popoverClassesByCorner[bubbleCorner]} w-[220px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-blue-200/22 bg-gradient-to-br from-slate-900/90 via-blue-950/78 to-cyan-950/80 p-2 text-slate-100 shadow-[0_16px_44px_-18px_rgba(59,130,246,0.38)] backdrop-blur-2xl`}
              >
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/80 to-transparent" />
                <div className="pointer-events-none absolute -top-24 left-0 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl" />
                <div className="relative z-10 px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">Language</div>
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`relative z-10 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs transition-all duration-300 ${language === option.code ? "bg-gradient-to-r from-blue-400/25 to-cyan-300/10 text-blue-50 ring-1 ring-blue-200/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" : "text-slate-200 hover:bg-white/10 hover:text-white"}`}
                    onClick={() => { setLanguage(option.code); setLangBubbleOpen(false); }}
                  >
                    <span className={`font-mono font-extrabold w-6 shrink-0 ${language === option.code ? "text-blue-100" : "text-slate-100"}`}>{option.label}</span>
                    <span className="text-[12px] opacity-90">{option.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (dragMovedRef.current) {
                dragMovedRef.current = false;
                return;
              }
              setLangBubbleOpen(!langBubbleOpen);
              setCurrencyBubbleOpen(false);
              setChatbotOpen(false);
              setAiChatOpen(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute inset-0 flex items-center justify-center rounded-full border border-blue-200/34 bg-gradient-to-br from-blue-400/18 via-cyan-400/12 to-sky-500/14 text-blue-50 shadow-[0_10px_24px_-12px_rgba(59,130,246,0.55)] backdrop-blur-xl transition-all duration-300 hover:border-blue-100/55 hover:from-blue-300/26 hover:to-cyan-400/24"
            aria-label="Select language"
          >
            <Languages className="h-5 w-5 text-primary" />
          </motion.button>
        </div>

        {/* Bottom-left: FAQ Chatbot */}
        <div className="relative h-12 w-12 shrink-0">
          <motion.button
            ref={faqButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setChatbotOpen(!chatbotOpen);
              setCurrencyBubbleOpen(false);
              setLangBubbleOpen(false);
              setAiChatOpen(false);
            }}
            className="absolute inset-0 flex items-center justify-center rounded-full border border-emerald-200/34 bg-gradient-to-br from-emerald-400/16 via-teal-400/10 to-cyan-500/14 text-emerald-50 shadow-[0_10px_24px_-12px_rgba(16,185,129,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-100/55 hover:from-emerald-300/24 hover:to-teal-400/22"
            aria-label="FAQ Chatbot"
            aria-expanded={chatbotOpen}
          >
            <MessageCircle className="h-5 w-5 text-primary" />
          </motion.button>
        </div>

        {/* AI Chat */}
        <div className="relative h-12 w-12 shrink-0">
          <motion.button
            ref={aiButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setAiChatOpen(!aiChatOpen); setChatbotOpen(false); setLangBubbleOpen(false); setCurrencyBubbleOpen(false);
            }}
            className="absolute inset-0 flex items-center justify-center rounded-full border border-violet-200/34 bg-gradient-to-br from-violet-400/16 via-purple-400/10 to-fuchsia-500/14 text-violet-50 shadow-[0_10px_24px_-12px_rgba(139,92,246,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-violet-100/55 hover:from-violet-300/24 hover:to-fuchsia-400/22"
            aria-label="AI Chat"
            aria-expanded={aiChatOpen}
          >
            <Bot className="h-5 w-5 text-primary" />
          </motion.button>
        </div>
      </motion.div>

      {/* Chatbot Panel */}
      <ChatBotPanel
        language={language}
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        anchorCorner={bubbleCorner}
        bubbleColumn="left"
        triggerRef={faqButtonRef}
        useTriggerAnchor
      />

      {/* AI Chat Panel */}
      <AIChatPanel
        language={language}
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        anchorCorner={bubbleCorner}
        bubbleColumn="right"
        triggerRef={aiButtonRef}
        useTriggerAnchor
      />
    </div>
  );
}
