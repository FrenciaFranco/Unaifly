"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, MessageCircle, Check,
  Bot, Layers, TrendingUp, LockOpen, Languages, CircleDollarSign,
  Sun, Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import inesImage from "../../../images/ines.png";
import { Button } from "@/components/ui/button";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { ChatBotPanel } from "@/components/ui/chatbot-bubble";
import { AIChatPanel } from "@/components/ui/ai-chat-panel";
import { presetPlans, serviceCategories as svcCategories } from "@/lib/servicesConfig";
import { calculateTotals } from "@/lib/pricing";
import { getStorageItem, setStorageItem } from "@/lib/storage";

// --- ANIMATION VARIANTS ---
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// --- TYPES ---
type Language = "en" | "es" | "ca" | "it";
type Currency = "EUR" | "USD" | "ARS" | "BTC";
type FloatingCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";
const BUBBLE_CORNER_STORAGE_KEY = "unaifly-floating-bubble-corner";
const BUBBLE_DRAG_THRESHOLD_PX = 12;

const cornerContainerClasses: Record<FloatingCorner, string> = {
  "top-left": "top-6 left-6",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
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

const languageOptions: Array<{ code: Language; label: string; name: string }> = [
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

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "es";
  const savedLanguage = getStorageItem("language") as Language | null;
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

function getCrossCurrencyRate(from: Currency, to: Currency, currencyRates: Record<Currency, number>) {
  const fromRate = currencyRates[from] ?? fallbackCurrencyRates[from];
  const toRate = currencyRates[to] ?? fallbackCurrencyRates[to];
  if (!Number.isFinite(fromRate) || !Number.isFinite(toRate) || fromRate <= 0 || toRate <= 0) {
    return null;
  }
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
    if (typeof fiatData.rates?.USD === "number" && Number.isFinite(fiatData.rates.USD)) {
      nextRates.USD = fiatData.rates.USD;
    }
    if (typeof fiatData.rates?.ARS === "number" && Number.isFinite(fiatData.rates.ARS)) {
      nextRates.ARS = fiatData.rates.ARS;
    }
  }

  if (btcResult.status === "fulfilled" && btcResult.value.ok) {
    const btcData = await btcResult.value.json() as { bitcoin?: { eur?: number } };
    const btcInEur = btcData.bitcoin?.eur;
    if (typeof btcInEur === "number" && Number.isFinite(btcInEur) && btcInEur > 0) {
      nextRates.BTC = 1 / btcInEur;
    }
  }

  return nextRates;
}

function getCurrencyHint(optionCurrency: Currency, selectedCurrency: Currency, currencyRates: Record<Currency, number>) {
  if (optionCurrency === selectedCurrency) return "Base";
  const crossRate = getCrossCurrencyRate(selectedCurrency, optionCurrency, currencyRates);
  if (!crossRate) return "-";
  return `1 ${selectedCurrency} ~ ${formatRateAmount(crossRate, optionCurrency)}`;
}

// --- ICON ARRAYS (index-matched to translation arrays) ---
const whyDiffIcons = [Bot, Layers, TrendingUp, LockOpen];
const whyDiffIconStyles = [
  { icon: "text-sky-400",     bg: "bg-sky-500/10",     accent: "from-sky-500/70 via-sky-400/30 to-transparent",     glow: "bg-sky-400" },
  { icon: "text-violet-400",  bg: "bg-violet-500/10",  accent: "from-violet-500/70 via-violet-400/30 to-transparent", glow: "bg-violet-400" },
  { icon: "text-emerald-400", bg: "bg-emerald-500/10", accent: "from-emerald-500/70 via-emerald-400/30 to-transparent", glow: "bg-emerald-400" },
  { icon: "text-amber-400",   bg: "bg-amber-500/10",   accent: "from-amber-500/70 via-amber-400/30 to-transparent",  glow: "bg-amber-400" },
];


// --- TRANSLATIONS ---
const t = {
  en: {
    backHome: "Back to Home",
    viewProfile: "View profile",
    teamTitle: "The team",
    teamDesc: "A small, specialized, and direct team. No account managers, no one who doesn't know your project.",
    teamRoles: ["Websites & automations", "Customer-first design", "Strategy & growth"],
    headerBadge: "Digital Services",
    headerTitle: "Websites & digital systems",
    headerAccent: "built to order, with AI",
    headerDesc: "We build websites, automations and integrations that help your business attract more clients and save time.",
    heroBullets: [
      "Real code — no Wix, WordPress or templates",
      "100% yours from day one, no vendor lock-in (lock-in) or hidden dependencies",
      "Scale without starting over: we build on what you already have",
      "Free quote · Response within 24 h",
    ],
    whyDiffBadge: "Why different?",
    whyDiffTitle: "Built with AI. Not templates.",
    whyDiffSubtitle: "We write real code using AI. Every website is unique, created from scratch for your business — not a WordPress theme or a page builder.",
    whyDiffCards: [
      { title: "AI, not templates", desc: "No WordPress themes or generic builders. Every site is custom code generated with AI, unique to your brand." },
      { title: "100% customizable", desc: "Every color, section, text and button adapts to your image. Nothing is fixed, everything can change whenever you want." },
      { title: "Grows with you", desc: "Start with what you need today (from €290) and add solutions as your business demands them." },
      { title: "No platform dependency (lock-in)", desc: "No platform tie-ins (lock-in). If one day you want to continue by yourself or with another agency, you can take everything we built. What is yours is truly yours." },
    ],
    builderCtaTitle: "Build your custom plan",
    builderCtaDesc: "Pick only what your business needs today, combine services as you grow, and see transparent pricing instantly.",
    builderCtaButton: "Build my plan",
    easyTitle: "We make it easy",
    easySubtitle: "Select one of our plans",
    includesPrevious: "Everything in {prev}, plus:",
    planConsult: "Get this plan",
    servCatBadge: "Services",
    servCatTitle: "Everything we can build together",
    servCatDesc: "Each service solves a real business bottleneck. Start with what matters now and scale step by step.",
    serviceFrontTeasers: [
      "Take your website to the next level.",
      "Manage bookings like a pro.",
      "Make your communication more efficient.",
      "Keep your leads organized and actionable.",
      "Attract better clients with smarter campaigns.",
      "Create content that looks and converts better.",
      "Keep improving every month without friction.",
      "Apply AI with a clear and practical plan.",
    ],
    serviceCategories: [
      { name: "Web & digital presence", items: [
        "Professional website / landing page for client acquisition",
        "Conversion-focused web: clear buttons (WhatsApp, call, book), forms, testimonials, FAQ, map, hours",
        "Get discovered in your area on Google Maps and local searches (local SEO)",
        "Faster website with better mobile experience based on key web metrics (Core Web Vitals)",
      ]},
      { name: "Bookings & appointments", items: [
        "Booking system adapted to your business (Booksy/Fresha or Calendar/Calendly), integrated into your website",
        "Complete flow: services, prices, hours, staff/agenda, pre-consultation forms, confirmations and rescheduling",
        "Fewer no-shows with AI-assisted reminders and optional deposits/payments",
        "Automatic booking confirmations by WhatsApp/email with clear client instructions",
      ]},
      { name: "WhatsApp & communication", items: [
        "Professional WhatsApp button with pre-filled message and click tracking",
        "AI assistant for FAQs and after-hours + simple menu (Bookings, Prices, Location)",
        "Automatic follow-up: reminder, booking link and review request",
        "Conversation flow design to qualify leads before your team steps in",
      ]},
      { name: "Client & lead management (CRM)", items: [
        "Lead integration → Sheets / Notion / simple client manager (CRM)",
        "Basic analytics + AI lead prioritization: measure clicks to WhatsApp, forms, bookings — simple monthly report",
        "Pipeline stages and task reminders so no lead is left unattended",
      ]},
      { name: "Marketing & advertising", items: [
        "Digital advertising with AI-assisted creatives: Meta/Instagram campaigns, Google Ads (local search), basic retargeting",
        "Social media management: content calendar, publishing, stories, message replies",
        "Basic email marketing: promotions, reminders, newsletter",
        "A/B testing of messages, creatives and audiences to improve return (ROI)",
      ]},
      { name: "Design & content", items: [
        "Graphic design: logo, basic branding, post/story templates, flyers, cards, menus",
        "Business photo/video: editing, simple reels, product/service photos",
        "AI-assisted copywriting: web texts, service descriptions, ads, WhatsApp messages, emails",
        "Editorial guidelines to keep visual and verbal consistency across channels",
      ]},
      { name: "Maintenance & growth", items: [
        "Monthly web maintenance: content updates, new sections, security/updates, support",
        "Continuous optimization with AI insights: conversion improvements, new service landing pages, campaign adjustments",
        "Monthly growth roadmap with priority actions based on real performance data",
      ]},
      { name: "AI advisory", items: [
        "Workflow audit to detect repetitive tasks and automation opportunities",
        "Practical recommendation of AI tools based on your sector and budget",
        "Phased implementation plan + team guidance so AI is truly adopted",
        "Prompt library and best-practice playbooks tailored to your daily operations",
      ]},
    ],
    priceCatBadge: "Price catalog",
    priceCatTitle: "Transparent pricing per service",
    priceCatDesc: "No surprises. You know what you pay before we start. All prices are starting points — free quote for your exact project.",
    priceCatalog: [
      { category: "Web & digital presence", tagline: "Website, landing page, local Google visibility (local SEO) & online store", items: [
        { name: "One-page website", from: "€290" },
        { name: "Conversion landing page", from: "€490" },
        { name: "Multi-page website (up to 5)", from: "€990" },
        { name: "Simple online store", from: "€1,400" },
      ]},
      { category: "Bookings & appointments", tagline: "Booking systems & automated reminders to cut no-shows", items: [
        { name: "Full Booksy / Fresha setup", from: "€200" },
        { name: "Calendly-style agenda + forms", from: "€150" },
        { name: "Automated reminders (SMS / WhatsApp / email)", from: "€150" },
        { name: "Deposits / payment for appointments", from: "€130" },
      ]},
      { category: "WhatsApp & communication", tagline: "Respond, filter enquiries & capture leads 24/7", items: [
        { name: "WhatsApp on your site (button + tracking)", from: "€120" },
        { name: "Basic automation (menus + after hours)", from: "€200" },
        { name: "WhatsApp Secretary (AI bot)", from: "€550" },
        { name: "Automated lead follow-up", from: "€150" },
      ]},
      { category: "Client & lead management (CRM)", tagline: "Organize leads and track what works every month", items: [
        { name: "Lead integration → CRM / Sheets / Notion", from: "€150" },
        { name: "Monthly report + lead tracking", from: "€79/mo" },
      ]},
      { category: "Marketing & advertising", tagline: "Ads, social media content & online reputation", items: [
        { name: "Meta / Google Ads campaign setup", from: "€350" },
        { name: "Social media content (12 posts/month)", from: "€250/mo" },
        { name: "Google reviews setup (automated)", from: "€150" },
        { name: "Monthly newsletter", from: "€99/mo" },
        { name: "Google Business Profile setup", from: "€150" },
      ]},
      { category: "Design & content", tagline: "Brand identity, copywriting & email marketing", items: [
        { name: "Logo + basic branding", from: "€300" },
        { name: "Website copywriting", from: "€250" },
        { name: "Email marketing setup", from: "€150" },
        { name: "Social media template kit", from: "€200" },
      ]},
      { category: "Maintenance & growth", tagline: "Keep your site fast, secure & always improving", items: [
        { name: "Basic monthly maintenance (~2 h)", from: "€69/mo" },
        { name: "Support + optimization (~4 h)", from: "€119/mo" },
        { name: "PRO plan (~6 h + quarterly review)", from: "€199/mo" },
      ]},
      { category: "AI & automation", tagline: "AI chatbots, workflow automations & smart integrations", items: [
        { name: "AI Chatbot (web + WhatsApp) — setup", from: "€590" },
        { name: "AI Chatbot — monthly tuning", from: "€69/mo" },
        { name: "Workflow automation (1 main flow)", from: "€250" },
        { name: "Digital business audit", from: "€200" },
      ]},
    ],
    sizeBadge: "Plans by size",
    sizeTitle: "We grow together with your business",
    sizeDesc: "Start where you are. We add solutions when your business needs them.",
    growTogether: "A €290 website today can become a full system with bookings, automated WhatsApp and advertising tomorrow — without throwing anything away. We build on top of what we've already made together.",
    sinceLabel: "from",
    mostPopular: "Most popular",
    sizes: [
      { label: "Starting out", examples: "Freelancer, new business, personal brand", price: "290 – 500€", badge: "To get started", services: ["One-page website for your business", "Professional WhatsApp button", "Logo + basic branding", "Basic monthly maintenance"], popular: false },
      { label: "Small business", examples: "Hair salon, bar, clinic, aesthetician, local shop", price: "500 – 1,000€", badge: "Most popular", services: ["Conversion landing page (CTAs, testimonials, FAQ)", "Full booking setup (Booksy / Fresha / Calendly)", "Google Business Profile optimized", "Automated appointment reminders", "WhatsApp button with tracking"], popular: true },
      { label: "Established business", examples: "Clinic, consultancy, academy, staffed restaurant", price: "1,000 – 2,000€", badge: "Full system", services: ["Multi-page website with local Google visibility (local SEO)", "WhatsApp automation (menus + auto-replies)", "Simple client manager (CRM) + monthly report", "Ad campaign setup (Meta / Google)", "Branding + social media templates"], popular: false },
      { label: "Scaling up", examples: "Growing team, multiple services, active advertising", price: "2,000€+", badge: "Maximum impact", services: ["Everything above", "WhatsApp Secretary (AI bot)", "Social media content (12 posts/month)", "Email marketing + workflow automations", "PRO plan with quarterly review"], popular: false },
    ],
    packageCtaLabels: ["I want to start!", "I want to grow!", "I want to digitalize!", "I want to scale!"],
    processBadge: "Process",
    processTitle: "How it works",
    processSteps: [
      { title: "Audit & Goals", desc: "Map current bottlenecks and define clear objectives." },
      { title: "Build & Integrate", desc: "Design assets and connect systems seamlessly." },
      { title: "Launch & Optimize", desc: "Go live, track performance, and refine conversions." },
    ],
    ctaTitle: "Ready to scale your business?",
    ctaDesc: "Tell us what your business needs. We'll do a quick diagnostic, propose a clear plan, and get started when you're ready. We meet via Google Meet.",
    ctaWhatsApp: "Let's talk on WhatsApp",
    ctaBook: "Schedule a meeting",
    ctaFooter: "Fast turnaround • Clear communication • Practical results",
    lastPlanNote: "Custom plan for your next stage",
    caseNoticeTitle: "Let's talk about your case",
    caseNoticeDesc: "You can call us anytime.",
    callNow: "Call now",
    contactSpain: "Spain · Franco",
    contactArg: "Argentina · Marco",
    faqBadge: "FAQ",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "What do you need from me to get started?", a: "I'll need your branding assets (logo, colors), any existing copy or photos, and access to your current domain/hosting if you have them. We'll cover all of this in our kickoff chat." },
      { q: "How is this different from a template website?", a: "We build your website around your business, not a generic template. That gives you faster load times, clearer messaging for clients, and stronger Google visibility (SEO) with full freedom to customize." },
      { q: "Can I start small and add more later?", a: "Absolutely. Many clients start with a simple €290 website and add automations, bookings, and ad campaigns over time. We build things so they can always be expanded." },
      { q: "What are your payment terms?", a: "Typically 50% upfront to secure your spot in my calendar, and 50% upon project completion and launch. For larger projects, we can discuss milestone-based payments." },
      { q: "Do you provide hosting and domain registration?", a: "Yes — I can handle everything for you end-to-end: domain registration (.com or any extension), secure hosting setup, SSL, email/domain connection and launch. You can stay hands-off while I deliver it ready to run." },
      { q: "Do you offer support after launch?", a: "Yes. After launch we can keep improving your website, fix details quickly, and add new features as your business grows. You choose whether you prefer one-off help or a monthly support plan." },
    ],
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contact",
    footerRights: "All rights reserved.",
    footerThemeLight: "Light mode",
    footerThemeDark: "Dark mode",
  },
  es: {
    backHome: "Volver al inicio",
    viewProfile: "Ver perfil",
    teamTitle: "El equipo",
    teamDesc: "Un equipo pequeño, especializado y directo. Sin intermediarios, sin cuentas asignadas que no te conocen.",
    teamRoles: ["Webs y automatizaciones", "Diseño centrado en el cliente", "Estrategia y crecimiento"],
    headerBadge: "Servicios Digitales",
    headerTitle: "Webs y sistemas digitales",
    headerAccent: "hechos a medida, con IA",
    headerDesc: "Diseñamos webs, automatizaciones e integraciones para que tu negocio consiga más clientes y ahorre tiempo.",
    heroBullets: [
      "Código a medida — rápido, seguro y único para tu negocio",
      "100% tuyo desde el primer día, sin ataduras de proveedor (lock-in) ni plataformas cerradas",
      "Escala sin empezar de cero: sumamos sobre lo que ya tienes",
      "Presupuesto gratuito · Respuesta en menos de 24 h",
    ],
    whyDiffBadge: "Por qué elegirnos",
    whyDiffTitle: "Código real. Sin plantillas. Sin ataduras.",
    whyDiffSubtitle: "Cada proyecto se construye desde cero con código propio. Nada genérico, nada prefabricado — diseñado exactamente para tu negocio y completamente tuyo desde el primer día.",
    whyDiffCards: [
      { title: "Construido para ti", desc: "Cada web o sistema se desarrolla desde cero según tus necesidades reales. El resultado: carga más rápido, te encuentran mejor en Google y puedes crecer sin rehacer todo." },
      { title: "Total flexibilidad", desc: "Colores, secciones, textos y funcionalidades se adaptan sin límites. Nada está fijo y todo puede cambiar cuando tu negocio lo pida." },
      { title: "Escala a tu ritmo", desc: "Empiezas con lo que necesitas hoy y vas sumando soluciones conforme crece tu negocio. Sin tirar nada de lo que ya construimos." },
      { title: "Todo es tuyo", desc: "La web, el dominio y el sistema son tuyos al 100%. Si un día quieres seguir con otro equipo, te llevas todo sin bloqueo de proveedor (lock-in)." },
    ],
    builderCtaTitle: "Arma tu plan a medida",
    builderCtaDesc: "Elige solo lo que necesitas hoy, combínalo cuando crezcas y ve el precio al instante. Sin sorpresas.",
    builderCtaButton: "Armar mi plan",
    easyTitle: "Te lo hacemos fácil",
    easySubtitle: "Selecciona uno de nuestros planes",
    includesPrevious: "Todo lo del plan {prev}, más:",
    planConsult: "Consultar",
    servCatBadge: "Servicios",
    servCatTitle: "Todo lo que podemos construir juntos",
    servCatDesc: "Cada servicio resuelve un bloqueo real de tu negocio. Empieza por lo importante y escala por etapas.",
    serviceFrontTeasers: [
      "Llevemos tu web a otro nivel.",
      "Maneja tus reservas como un profesional.",
      "Haz tu comunicacion mas eficiente.",
      "Organiza tus contactos interesados y no pierdas oportunidades.",
      "Atrae mejores clientes con publicidad más inteligente.",
      "Crea contenido que se vea y convierta mejor.",
      "Mejora mes a mes sin complicaciones.",
      "Aplica IA en tu negocio con un plan claro.",
    ],
    serviceCategories: [
      { name: "Web y presencia digital", items: [
        "Página web profesional pensada para captar clientes",
        "Web pensada para que te contacten: botones claros (WhatsApp, llamar, reservar), formularios, testimonios, preguntas frecuentes, mapa y horarios",
        "Te ayudamos a aparecer mejor en Google Maps y en búsquedas de tu zona (SEO local)",
        "Web rápida y cómoda en móvil para que más personas se queden y te escriban",
      ]},
      { name: "Reservas y citas", items: [
        "Sistema de reservas adaptado a tu negocio (Booksy/Fresha o Calendar/Calendly), integrado en la web",
        "Flujo completo: servicios, precios, horarios, staff/agenda, formularios previos, confirmaciones y reprogramación",
        "Menos clientes que no se presentan, con recordatorios automáticos y cobro de señal cuando aplica",
        "Confirmaciones automáticas por WhatsApp/email con instrucciones claras para el cliente",
      ]},
      { name: "WhatsApp y comunicación", items: [
        "Botón de WhatsApp con mensaje listo para enviar y seguimiento de cuántos te escriben",
        "Asistente automático para preguntas frecuentes y fuera de horario + menú simple (Reservas, Precios, Ubicación)",
        "Seguimiento automático: recordatorio, enlace para reservar y solicitud de reseña",
        "Diseño de la conversación automática para filtrar interesados antes de que entre tu equipo",
      ]},
      { name: "Gestión de contactos y oportunidades (CRM)", items: [
        "Centralizamos tus contactos en una lista clara y organizada (en hoja de cálculo, Notion o gestor de clientes)",
        "Vemos de dónde llegan tus consultas (WhatsApp, formularios, reservas) y cuáles responder primero",
        "Definimos pasos y recordatorios para que ningún contacto interesado se quede sin respuesta",
      ]},
      { name: "Marketing y publicidad", items: [
        "Anuncios en Instagram, Facebook y Google para atraer clientes de tu zona",
        "Gestión de redes sociales: calendario de contenidos, publicación, stories, respuesta a mensajes",
        "Envíos de email: promociones, recordatorios y boletín mensual (newsletter)",
        "Probamos mensajes e imágenes para mejorar resultados y retorno de inversión mes a mes",
      ]},
      { name: "Diseño y contenido", items: [
        "Diseño gráfico: logo, imagen de marca, plantillas para redes, flyers, tarjetas y menús",
        "Foto y vídeo para tu negocio: edición, vídeos cortos (reels), fotos de producto y servicio",
        "Te ayudamos con textos claros para web, anuncios, WhatsApp y email",
        "Guía editorial para mantener coherencia visual y verbal en todos tus canales",
      ]},
      { name: "Mantenimiento y crecimiento", items: [
        "Mantenimiento web mensual: cambios de contenido, nuevas secciones, seguridad/actualizaciones, soporte",
        "Mejoras continuas según resultados reales: nuevas páginas, ajustes y optimización",
        "Plan de crecimiento mensual con prioridades basadas en datos reales",
      ]},
      { name: "Asesoramiento IA", items: [
        "Auditoría de procesos para detectar tareas repetitivas y oportunidades de automatización",
        "Recomendación práctica de herramientas IA según tu sector y presupuesto",
        "Plan de implementación por fases + acompañamiento al equipo para que la IA se use de verdad",
        "Guías y plantillas listas para usar en el día a día de tu equipo",
      ]},
    ],
    priceCatBadge: "Catálogo de precios",
    priceCatTitle: "Precios transparentes por servicio",
    priceCatDesc: "Sin sorpresas. Sabes lo que pagas antes de empezar. Precios orientativos — presupuesto gratuito sin compromiso.",
    priceCatalog: [
      { category: "Web y presencia digital", tagline: "Páginas web, tienda online y que te encuentren en Google (SEO)", items: [
        { name: "Web de una página", from: "290€" },
        { name: "Página de ventas + Google (SEO)", from: "490€" },
        { name: "Web multipágina (hasta 5)", from: "990€" },
        { name: "Tienda online sencilla", from: "1.400€" },
      ]},
      { category: "Reservas y citas", tagline: "Sistemas de reservas y recordatorios para que tus clientes no falten", items: [
        { name: "Configuración completa de app de reservas (Booksy / Fresha)", from: "200€" },
        { name: "Agenda de citas online (tipo Calendly) + formularios", from: "150€" },
        { name: "Recordatorios automáticos (SMS / WhatsApp / email)", from: "150€" },
        { name: "Depósitos / cobro por citas", from: "130€" },
      ]},
      { category: "WhatsApp y comunicación", tagline: "Responde, filtra consultas y capta clientes potenciales 24/7", items: [
        { name: "Botón de WhatsApp en tu web (con seguimiento)", from: "120€" },
        { name: "Automatización básica (menús + fuera de horario)", from: "200€" },
        { name: "Asistente virtual en WhatsApp (bot con IA)", from: "550€" },
        { name: "Seguimiento automático de clientes", from: "150€" },
      ]},
      { category: "Gestión de contactos y oportunidades (CRM)", tagline: "Centraliza tus contactos, mide resultados y descubre de dónde vienen tus mejores clientes", items: [
        { name: "Todos tus contactos en un solo lugar (gestor de clientes)", from: "150€" },
        { name: "Informe mensual + seguimiento de contactos", from: "79€/mes" },
      ]},
      { category: "Marketing y publicidad", tagline: "Publicidad digital, gestión de redes sociales y reputación en Google", items: [
        { name: "Campañas de anuncios en Instagram/Facebook y Google", from: "350€" },
        { name: "Contenido para redes sociales (12 publicaciones/mes)", from: "250€/mes" },
        { name: "Reseñas Google automatizadas (setup)", from: "150€" },
        { name: "Boletín mensual por email (newsletter)", from: "99€/mes" },
        { name: "Tu ficha en Google Maps optimizada", from: "150€" },
      ]},
      { category: "Diseño y contenido", tagline: "Identidad visual profesional, textos que convierten y comunicación por email", items: [
        { name: "Logo + imagen de marca (branding)", from: "300€" },
        { name: "Textos profesionales para tu web (copywriting)", from: "250€" },
        { name: "Configuración de emails automáticos", from: "150€" },
        { name: "Plantillas editables para redes sociales", from: "200€" },
      ]},
      { category: "Mantenimiento y crecimiento", tagline: "Tu web siempre actualizada, segura y mejorando con datos reales cada mes", items: [
        { name: "Mantenimiento mensual (~2 h de mejoras)", from: "69€/mes" },
        { name: "Soporte + optimización (~4 h de mejoras)", from: "119€/mes" },
        { name: "Plan PRO (~6 h + revisión trimestral)", from: "199€/mes" },
      ]},
      { category: "IA y automatización", tagline: "Chatbots inteligentes, automatización de tareas repetitivas y ahorro de tiempo real", items: [
        { name: "Asistente virtual con IA para web + WhatsApp", from: "590€" },
        { name: "Asistente virtual con IA — ajuste mensual", from: "69€/mes" },
        { name: "Automatizar 1 tarea repetitiva de tu negocio", from: "250€" },
        { name: "Diagnóstico digital de tu negocio", from: "200€" },
      ]},
    ],
    sizeBadge: "Por tamaño",
    sizeTitle: "Crecemos juntos con tu negocio",
    sizeDesc: "Empezamos donde estás. Añadimos soluciones cuando tu negocio las necesita.",
    growTogether: "Una web de 290€ hoy puede convertirse en un sistema completo con reservas, WhatsApp automatizado y publicidad mañana — sin tirar nada. Construimos sobre lo que ya hemos hecho juntos.",
    sinceLabel: "desde",
    mostPopular: "Más solicitado",
    sizes: [
      { label: "Empezando", examples: "Autónomo, freelance, negocio nuevo, marca personal", price: "290 – 500€", badge: "Para arrancar", services: ["Web de una página para tu negocio", "Botón WhatsApp profesional", "Logo + branding básico", "Mantenimiento mensual básico"], popular: false },
      { label: "Pequeño negocio", examples: "Peluquería, bar, clínica, esteticista, tienda local", price: "500 – 1.000€", badge: "Más solicitado", services: ["Página de ventas (botones de acción, testimonios, preguntas frecuentes)", "Configuración de reservas completa (Booksy / Fresha / Calendly)", "Ficha Google Business optimizada", "Recordatorios automáticos para citas", "Botón WhatsApp con seguimiento"], popular: true },
      { label: "Negocio consolidado", examples: "Clínica, consultoría, academia, restaurante con equipo", price: "1.000 – 2.000€", badge: "Sistema completo", services: ["Web multipágina para aparecer mejor en Google en tu zona (SEO local)", "WhatsApp automático (menús + respuestas automáticas)", "Gestor de clientes simple (CRM) + informe mensual", "Campañas de anuncios (Instagram/Facebook y Google)", "Imagen de marca + plantillas para redes sociales"], popular: false },
      { label: "En expansión", examples: "Equipo creciente, varios servicios, publicidad activa", price: "2.000€+", badge: "Máximo impacto", services: ["Todo lo anterior", "Asistente virtual en WhatsApp (bot con IA)", "Contenido para redes (12 publicaciones/mes)", "Envíos de email + automatizaciones", "Plan PRO con revisión trimestral"], popular: false },
    ],
    packageCtaLabels: ["Quiero comenzar!", "Quiero crecer!", "Quiero digitalizarme!", "Quiero expandirme!"],
    processBadge: "Proceso",
    processTitle: "Cómo trabajamos",
    processSteps: [
      { title: "Diagnóstico", desc: "Entendemos tu negocio, tus objetivos y qué está frenando tu crecimiento hoy." },
      { title: "Diseño y construcción", desc: "Construimos cada pieza a medida — web, automatizaciones, integraciones — sin código genérico." },
      { title: "Lanzamiento y mejora", desc: "Publicamos, medimos resultados y seguimos optimizando junto a ti." },
    ],
    ctaTitle: "¿Listo para dar el siguiente paso?",
    ctaDesc: "Cuéntanos qué necesita tu negocio. Hacemos un diagnóstico rápido, te proponemos un plan claro y arrancamos cuando estés listo. Nos reunimos por Google Meet.",
    ctaWhatsApp: "Hablemos por WhatsApp",
    ctaBook: "Agenda una reunión",
    ctaFooter: "Respuesta en menos de 24 h · Presupuesto gratuito · Sin compromiso",
    lastPlanNote: "Plan a medida para tu siguiente etapa",
    caseNoticeTitle: "Hablemos de tu caso",
    caseNoticeDesc: "Puedes llamarnos en cualquier momento.",
    callNow: "Llamar ahora",
    contactSpain: "España · Franco",
    contactArg: "Argentina · Marco",
    faqBadge: "FAQ",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      { q: "¿En qué se diferencia esto de hacer una web con Wix o WordPress?", a: "Construimos tu web a medida para tu negocio. Eso se traduce en una web más rápida, más clara para tus clientes y preparada para que te encuentren en Google (SEO local) sin depender de plantillas cerradas." },
      { q: "¿Puedo empezar con algo pequeño y añadir más adelante?", a: "Sí, es la forma más habitual de trabajar con nosotros. Muchos clientes arrancan con una página de ventas (landing page) y van sumando reservas, automatizaciones o publicidad conforme lo pide su negocio." },
      { q: "¿Quién es el dueño del código y del dominio?", a: "Tú. Todo lo que construimos te lo entregamos: web, dominio y hosting. Puedes continuar por tu cuenta o con otro equipo cuando quieras." },
      { q: "¿Cuánto tiempo tarda en estar listo un proyecto?", a: "Depende de la complejidad. Una landing page suele estar lista en 7 a 10 días hábiles. Para proyectos más grandes definimos hitos y fechas desde el inicio." },
      { q: "¿Cómo son las condiciones de pago?", a: "50% al inicio para reservar espacio en agenda, y 50% al lanzar el proyecto. En proyectos grandes podemos acordar pagos por fases. El presupuesto siempre es previo, por escrito y sin sorpresas." },
      { q: "¿Ofrecen soporte después del lanzamiento?", a: "Sí. Tras lanzar la web podemos seguir mejorándola, corregir detalles rápido y añadir nuevas funciones a medida que tu negocio crece. Puedes elegir ayuda puntual o un plan mensual." },
    ],
    footerTerms: "Términos y Condiciones",
    footerPrivacy: "Política de Privacidad",
    footerContact: "Contacto",
    footerRights: "Todos los derechos reservados.",
    footerThemeLight: "Modo claro",
    footerThemeDark: "Modo oscuro",
  },
  ca: {
    backHome: "Tornar a l'inici",
    viewProfile: "Veure el perfil",
    teamTitle: "L'equip",
    teamDesc: "Un equip petit, especialitzat i directe. Sense intermediaris, sense comptes assignats que no et coneixen.",
    teamRoles: ["Webs i automatitzacions", "Disseny centrat en el client", "Estratègia i creixement"],
    headerBadge: "Serveis Digitals",
    headerTitle: "Webs i sistemes digitals",
    headerAccent: "fets a mida, amb IA",
    headerDesc: "Dissenyem webs, automatitzacions i integracions perquè el teu negoci aconsegueixi més clients i estalviï temps.",
    heroBullets: [
      "Codi real — res de Wix, WordPress ni plantilles",
      "100% teu des del primer dia, sense bloqueig de proveïdor (lock-in) ni dependències",
      "Escala sense començar de zero: construim sobre el que ja tens",
      "Pressupost gratuït · Resposta en menys de 24 h",
    ],
    whyDiffBadge: "Per què diferent?",
    whyDiffTitle: "Webs construïdes amb IA. Sense plantilles.",
    whyDiffSubtitle: "Escrivim codi real usant intel·ligència artificial. Cada web és única, creada des de zero per al teu negoci — no un tema de WordPress ni un constructor de pàgines.",
    whyDiffCards: [
      { title: "IA, no plantilles", desc: "Sense temes de WordPress ni constructors genèrics. Cada web és codi a mida generat amb IA, única per a la teva marca." },
      { title: "100% personalitzable", desc: "Cada color, secció, text i botó s'adapta a la teva imatge. Res és fix, tot es pot canviar quan vulguis." },
      { title: "Creix amb tu", desc: "Comences amb el que necessites avui (des de 290€) i afegeixes solucions a mesura que el teu negoci les demana." },
      { title: "Sense dependència de plataforma (lock-in)", desc: "No et deixem lligat a cap plataforma (lock-in). Si algun dia vols continuar pel teu compte o amb una altra agència, t'endús tot el que hem construït." },
    ],
    builderCtaTitle: "Munta el teu pla a mida",
    builderCtaDesc: "Tria només el que necessites avui, combina serveis quan creixis i obtén el preu a l'instant.",
    builderCtaButton: "Muntar el meu pla",
    easyTitle: "T'ho posem fàcil",
    easySubtitle: "Selecciona un dels nostres plans",
    includesPrevious: "Tot el del pla {prev}, més:",
    planConsult: "Consultar",
    servCatBadge: "Serveis",
    servCatTitle: "Tot el que podem construir junts",
    servCatDesc: "Cada servei resol un bloqueig real del teu negoci. Comença pel que és prioritari i escala per fases.",
    serviceFrontTeasers: [
      "Portem la teva web a un altre nivell.",
      "Gestiona les reserves com un professional.",
      "Fes la comunicacio mes eficient.",
      "Organitza els leads i no perdis oportunitats.",
      "Atrau millors clients amb campanyes mes intel.ligents.",
      "Crea contingut que llueixi i converteixi millor.",
      "Millora cada mes sense complicacions.",
      "Aplica IA al negoci amb un pla clar.",
    ],
    serviceCategories: [
      { name: "Web i presència digital", items: [
        "Pàgina web / landing professional de captació de clients",
        "Web de conversió: botons clars (WhatsApp, trucar, reservar), formularis, testimonis, FAQ, mapa, horaris",
        "T'ajudem a sortir millor a Google Maps i a cerques de la teva zona (SEO local)",
        "Web més ràpida i còmoda al mòbil amb mètriques web clau (Core Web Vitals)",
      ]},
      { name: "Reserves i cites", items: [
        "Sistema de reserves adaptat al teu negoci (Booksy/Fresha o Calendar/Calendly), integrat a la web",
        "Flux complet: serveis, preus, horaris, staff/agenda, formularis previs, confirmacions i reprogramació",
        "Menys no-shows amb recordatoris assistits per IA i dipòsits/pagaments quan cal",
        "Confirmacions automàtiques per WhatsApp/email amb instruccions clares per al client",
      ]},
      { name: "WhatsApp i comunicació", items: [
        "Botó de WhatsApp amb missatge preomplert i tracking de clics",
        "Assistent IA per a FAQs i fora d'horari + menú simple (Reserves, Preus, Ubicació)",
        "Seguiment automàtic: recordatori, enllaç per reservar i sol·licitud de ressenya",
        "Disseny del flux conversacional per filtrar leads abans que entri l'equip",
      ]},
      { name: "Gestió de contactes i oportunitats (CRM)", items: [
        "Integració leads → Sheets / Notion / gestor simple (CRM)",
        "Analítica bàsica + priorització IA de leads: mesurar clics a WhatsApp, formularis, reserves — informe mensual simple",
        "Etapes del procés comercial (pipeline) i recordatoris per no deixar leads sense resposta",
      ]},
      { name: "Màrqueting i publicitat", items: [
        "Publicitat digital amb creativitats assistides per IA: campanyes a Meta/Instagram, Google Ads (cerca local), retargeting bàsic",
        "Gestió de xarxes socials: calendari de continguts, publicació, stories, resposta a missatges",
        "Email màrqueting bàsic: promocions, recordatoris, newsletter",
        "Tests A/B d'angles, creativitats i audiències per millorar el retorn (ROI)",
      ]},
      { name: "Disseny i contingut", items: [
        "Disseny gràfic: logo, branding bàsic, plantilles posts/stories, flyers, targetes, menús",
        "Foto/vídeo per a negoci: edició, reels simples, fotos de producte/servei",
        "Copywriting assistit per IA: textos web, descripcions de serveis, anuncis, missatges WhatsApp, emails",
        "Guia editorial per mantenir coherència visual i verbal a tots els canals",
      ]},
      { name: "Manteniment i creixement", items: [
        "Manteniment web mensual: canvis de contingut, noves seccions, seguretat/actualitzacions, suport",
        "Optimització contínua amb insights d'IA: millores de conversió, nous landings per servei, ajust de campanyes",
        "Roadmap mensual de creixement amb prioritats basades en dades reals",
      ]},
      { name: "Assessorament IA", items: [
        "Auditoria de processos per detectar tasques repetitives i oportunitats d'automatització",
        "Recomanació pràctica d'eines d'IA segons el teu sector i pressupost",
        "Pla d'implementació per fases + acompanyament a l'equip perquè la IA s'adopti de debò",
        "Biblioteca de prompts i playbooks adaptats a l'operativa diària de l'empresa",
      ]},
    ],
    priceCatBadge: "Catàleg de preus",
    priceCatTitle: "Preus transparents per servei",
    priceCatDesc: "Sense sorpreses. Saps el que pagues abans de començar. Pressupost gratuït sense compromís.",
    priceCatalog: [
      { category: "Web i presència digital", tagline: "Web, landing page, visibilitat local a Google (SEO local) i botiga online", items: [
        { name: "Web d'una pàgina", from: "290€" },
        { name: "Landing de conversió", from: "490€" },
        { name: "Web multipàgina (fins a 5)", from: "990€" },
        { name: "Botiga online senzilla", from: "1.400€" },
      ]},
      { category: "Reserves i cites", tagline: "Sistemes de reserves i recordatoris per reduir no-shows", items: [
        { name: "Setup complet Booksy / Fresha", from: "200€" },
        { name: "Agenda tipus Calendly + formularis", from: "150€" },
        { name: "Recordatoris automàtics (SMS / WhatsApp / email)", from: "150€" },
        { name: "Dipòsits / cobrament per cites", from: "130€" },
      ]},
      { category: "WhatsApp i comunicació", tagline: "Respon, filtra consultes i capta leads 24/7", items: [
        { name: "WhatsApp a la teva web (botó + tracking)", from: "120€" },
        { name: "Automatització bàsica (menús + fora d'horari)", from: "200€" },
        { name: "Secretari WhatsApp (bot amb IA)", from: "550€" },
        { name: "Seguiment automàtic de leads", from: "150€" },
      ]},
      { category: "Gestió de contactes i oportunitats (CRM)", tagline: "Organitza leads i mesura què funciona cada mes", items: [
        { name: "Leads → CRM / Sheets / Notion", from: "150€" },
        { name: "Informe mensual + seguiment de leads", from: "79€/mes" },
      ]},
      { category: "Màrqueting i publicitat", tagline: "Anuncis, contingut per a xarxes i reputació online", items: [
        { name: "Setup campanyes Meta / Google Ads", from: "350€" },
        { name: "Contingut RRSS (12 posts/mes)", from: "250€/mes" },
        { name: "Ressenyes Google automatitzades (setup)", from: "150€" },
        { name: "Newsletter mensual", from: "99€/mes" },
        { name: "Fitxa Google Business optimitzada", from: "150€" },
      ]},
      { category: "Disseny i contingut", tagline: "Identitat de marca, copywriting i email màrqueting", items: [
        { name: "Logo + branding bàsic", from: "300€" },
        { name: "Copywriting web complet", from: "250€" },
        { name: "Email màrqueting setup", from: "150€" },
        { name: "Kit plantilles RRSS", from: "200€" },
      ]},
      { category: "Manteniment i creixement", tagline: "La teva web ràpida, segura i millorant cada mes", items: [
        { name: "Manteniment mensual (~2 h de millores)", from: "69€/mes" },
        { name: "Suport + optimització (~4 h de millores)", from: "119€/mes" },
        { name: "Pla PRO (~6 h + revisió trimestral)", from: "199€/mes" },
      ]},
      { category: "IA i automatització", tagline: "Chatbots amb IA, automatitzacions i connexions intel·ligents", items: [
        { name: "Chatbot IA (web + WhatsApp) — setup", from: "590€" },
        { name: "Chatbot IA — ajust mensual", from: "69€/mes" },
        { name: "Automatització de processos (1 flux principal)", from: "250€" },
        { name: "Auditoria digital del negoci", from: "200€" },
      ]},
    ],
    sizeBadge: "Per mida",
    sizeTitle: "Creixem junts amb el teu negoci",
    sizeDesc: "Comencem on ets. Afegim solucions quan el teu negoci les necessita.",
    growTogether: "Una web de 290€ avui pot convertir-se en un sistema complet amb reserves, WhatsApp automatitzat i publicitat demà — sense tirar res. Construïm sobre el que ja hem fet junts.",
    sinceLabel: "des de",
    mostPopular: "Més sol·licitat",
    sizes: [
      { label: "Començant", examples: "Autònom, freelance, negoci nou, marca personal", price: "290 – 500€", badge: "Per arrencar", services: ["Web d'una pàgina per al teu negoci", "Botó WhatsApp professional", "Logo + branding bàsic", "Manteniment mensual bàsic"], popular: false },
      { label: "Petit negoci", examples: "Perruqueria, bar, clínica, esteticista, botiga local", price: "500 – 1.000€", badge: "Més sol·licitat", services: ["Landing de conversió (CTAs, testimonis, FAQ)", "Setup reserves complet (Booksy / Fresha / Calendly)", "Fitxa Google Business optimitzada", "Recordatoris automàtics per a cites", "Botó WhatsApp amb tracking"], popular: true },
      { label: "Negoci consolidat", examples: "Clínica, consultoria, acadèmia, restaurant amb equip", price: "1.000 – 2.000€", badge: "Sistema complet", services: ["Web multipàgina per millorar la visibilitat local a Google (SEO local)", "Automatització WhatsApp (menús + respostes automàtiques)", "Gestor de contactes simple (CRM) + informe mensual", "Setup campanyes publicitàries (Meta / Google)", "Branding + plantilles xarxes socials"], popular: false },
      { label: "En expansió", examples: "Equip creixent, diversos serveis, publicitat activa", price: "2.000€+", badge: "Màxim impacte", services: ["Tot l'anterior", "Secretari WhatsApp (bot amb IA)", "Contingut RRSS (12 posts/mes)", "Email màrqueting + automatitzacions", "Pla PRO amb revisió trimestral"], popular: false },
    ],
    packageCtaLabels: ["Vull començar!", "Vull créixer!", "Vull digitalitzar-me!", "Vull expandir-me!"],
    processBadge: "Procés",
    processTitle: "Com funciona",
    processSteps: [
      { title: "Auditoria i objectius", desc: "Identifiquem els colls d'ampolla i definim objectius clars." },
      { title: "Construcció i integració", desc: "Dissenyem actius i connectem sistemes sense friccions." },
      { title: "Llançament i optimització", desc: "Sortim en viu, mesurem el rendiment i refinem les conversions." },
    ],
    ctaTitle: "Llest per escalar el teu negoci?",
    ctaDesc: "Explica'ns què necessita el teu negoci. Fem un diagnòstic ràpid, et proposem un pla clar i arranquem quan estiguis a punt. Ens reunim per Google Meet.",
    ctaWhatsApp: "Parlem per WhatsApp",
    ctaBook: "Agenda una reunió",
    ctaFooter: "Entregues ràpides • Comunicació clara • Resultats pràctics",
    lastPlanNote: "Pla a mida per a la teva etapa següent",
    caseNoticeTitle: "Parlem del teu cas",
    caseNoticeDesc: "Ens pots trucar en qualsevol moment.",
    callNow: "Trucar ara",
    contactSpain: "Espanya · Franco",
    contactArg: "Argentina · Marco",
    faqBadge: "FAQ",
    faqTitle: "Preguntes freqüents",
    faqs: [
      { q: "Què necessites de mi per començar?", a: "Necessitaré els teus actius de marca (logo, colors), textos o fotos existents, i accés al teu domini/hosting actual si en tens. Ho repassem tot a la nostra trucada inicial." },
      { q: "Com és diferent d'una web amb plantilla?", a: "Construïm la teva web a mida del teu negoci. Això vol dir una web més ràpida, més clara per als clients i preparada per trobar-te millor a Google (SEO local), amb llibertat total per créixer." },
      { q: "Puc començar petit i afegir més endavant?", a: "Completament. Molts clients comencen amb una web senzilla de 290€ i van afegint automatitzacions, reserves i campanyes de publicitat amb el temps. Construïm les coses per poder-les expandir sempre." },
      { q: "Quines són les teves condicions de pagament?", a: "Normalment 50% per avançat per reservar el teu lloc a la meva agenda, i 50% en completar i llançar el projecte. Per a projectes grans podem parlar de pagaments per fites." },
      { q: "Proporciones hosting i registre de domini?", a: "Sí: m'encarrego de tot de punta a punta. Registro el teu domini (.com o l'extensió que vulguis), configuro un hosting segur, SSL, connexió de correu/domini i ho deixo tot publicat i funcionant." },
      { q: "Oferiu suport després del llançament?", a: "Sí. Després de publicar la web la podem continuar millorant, corregir detalls ràpid i afegir noves funcionalitats quan el teu negoci creixi. Pots triar ajuda puntual o un pla mensual." },
    ],
    footerTerms: "Termes i Condicions",
    footerPrivacy: "Política de Privacitat",
    footerContact: "Contacte",
    footerRights: "Tots els drets reservats.",
    footerThemeLight: "Mode clar",
    footerThemeDark: "Mode fosc",
  },
  it: {
    backHome: "Torna alla home",
    viewProfile: "Vedi il profilo",
    teamTitle: "Il team",
    teamDesc: "Un team piccolo, specializzato e diretto. Nessun intermediario, nessun account manager che non conosce il tuo progetto.",
    teamRoles: ["Siti web e automazioni", "Design centrato sul cliente", "Strategia e crescita"],
    headerBadge: "Servizi Digitali",
    headerTitle: "Siti e sistemi digitali",
    headerAccent: "su misura, con IA",
    headerDesc: "Progettiamo siti, automazioni e integrazioni per aiutare il tuo business a ottenere più clienti e risparmiare tempo.",
    heroBullets: [
      "Codice vero — niente Wix, WordPress né template",
      "100% tuo dal primo giorno, senza blocchi del fornitore (lock-in) né dipendenze",
      "Scala senza ripartire da zero: costruiamo su ciò che hai già",
      "Preventivo gratuito · Risposta entro 24 h",
    ],
    whyDiffBadge: "Perché diverso?",
    whyDiffTitle: "Siti costruiti con IA. Non template.",
    whyDiffSubtitle: "Scriviamo codice vero usando l'intelligenza artificiale. Ogni sito è unico, creato da zero per il tuo business — non un tema WordPress né un page builder.",
    whyDiffCards: [
      { title: "IA, non template", desc: "Nessun tema WordPress né costruttore generico. Ogni sito è codice personalizzato generato con IA, unico per il tuo brand." },
      { title: "100% personalizzabile", desc: "Ogni colore, sezione, testo e pulsante si adatta alla tua immagine. Niente è fisso, tutto può cambiare quando vuoi." },
      { title: "Cresce con te", desc: "Inizi con ciò che ti serve oggi (da 290€) e aggiungi soluzioni man mano che il tuo business le richiede." },
      { title: "Nessun vincolo di piattaforma (lock-in)", desc: "Nessun vincolo di piattaforma (lock-in). Se un giorno vuoi continuare da solo o con un'altra agenzia, puoi portare via tutto ciò che abbiamo costruito." },
    ],
    builderCtaTitle: "Costruisci il tuo piano su misura",
    builderCtaDesc: "Scegli solo ciò che ti serve oggi, combina i servizi mentre cresci e ottieni il prezzo all'istante.",
    builderCtaButton: "Costruisci il mio piano",
    easyTitle: "Te lo rendiamo facile",
    easySubtitle: "Seleziona uno dei nostri piani",
    includesPrevious: "Tutto del piano {prev}, più:",
    planConsult: "Richiedi",
    servCatBadge: "Servizi",
    servCatTitle: "Tutto quello che possiamo costruire insieme",
    servCatDesc: "Ogni servizio risolve un blocco reale del tuo business. Parti dalle priorità e scala per fasi.",
    serviceFrontTeasers: [
      "Portiamo il tuo sito a un altro livello.",
      "Gestisci le prenotazioni come un professionista.",
      "Rendi la comunicazione piu efficiente.",
      "Organizza i lead e non perdere opportunita.",
      "Attira clienti migliori con campagne piu intelligenti.",
      "Crea contenuti che colpiscono e convertono meglio.",
      "Migliora ogni mese senza complicazioni.",
      "Applica l'IA al business con un piano chiaro.",
    ],
    serviceCategories: [
      { name: "Web e presenza digitale", items: [
        "Sito web / landing professionale per acquisizione clienti",
        "Web di conversione: bottoni chiari (WhatsApp, chiamare, prenotare), moduli, testimonianze, FAQ, mappa, orari",
        "Ti aiutiamo a farti trovare meglio su Google Maps e nelle ricerche della tua zona (SEO locale)",
        "Sito più veloce e comodo su mobile con metriche web chiave (Core Web Vitals)",
      ]},
      { name: "Prenotazioni e appuntamenti", items: [
        "Sistema di prenotazione adatto al tuo business (Booksy/Fresha o Calendar/Calendly), integrato nel sito",
        "Flusso completo: servizi, prezzi, orari, staff/agenda, moduli preliminari, conferme e riprogrammazione",
        "Meno no-show con promemoria assistiti da IA e depositi/pagamenti quando necessario",
        "Conferme automatiche via WhatsApp/email con istruzioni chiare per il cliente",
      ]},
      { name: "WhatsApp e comunicazione", items: [
        "Pulsante WhatsApp con messaggio precompilato e tracking dei clic",
        "Assistente IA per FAQ e fuori orario + menu semplice (Prenotazioni, Prezzi, Posizione)",
        "Follow-up automatico: promemoria, link prenotazione e richiesta recensione",
        "Design del flusso conversazionale per qualificare i lead prima del team",
      ]},
      { name: "Gestione contatti e opportunità (CRM)", items: [
        "Integrazione lead → Sheets / Notion / gestore semplice (CRM)",
        "Analytics base + prioritizzazione IA dei lead: misurare clic a WhatsApp, moduli, prenotazioni — report mensile semplice",
        "Fasi del processo commerciale (pipeline) e promemoria per non lasciare lead senza risposta",
      ]},
      { name: "Marketing e pubblicità", items: [
        "Pubblicità digitale con creatività assistite da IA: campagne Meta/Instagram, Google Ads (ricerca locale), retargeting base",
        "Gestione social media: calendario contenuti, pubblicazione, stories, risposta messaggi",
        "Email marketing base: promozioni, promemoria, newsletter",
        "Test A/B su messaggi, creatività e audience per migliorare il ritorno (ROI)",
      ]},
      { name: "Design e contenuto", items: [
        "Grafica: logo, branding base, template post/stories, volantini, biglietti, menù",
        "Foto/video per business: editing, reel semplici, foto prodotti/servizi",
        "Copywriting assistito da IA: testi web, descrizioni servizi, annunci, messaggi WhatsApp, email",
        "Linee guida editoriali per mantenere coerenza visiva e verbale su tutti i canali",
      ]},
      { name: "Manutenzione e crescita", items: [
        "Manutenzione web mensile: modifiche contenuto, nuove sezioni, sicurezza/aggiornamenti, supporto",
        "Ottimizzazione continua con insight IA: miglioramenti conversione, nuove landing, aggiustamento campagne",
        "Roadmap mensile di crescita con priorità basate su dati reali",
      ]},
      { name: "Consulenza IA", items: [
        "Audit dei processi per individuare attività ripetitive e opportunità di automazione",
        "Raccomandazione pratica di strumenti IA in base a settore e budget",
        "Piano di implementazione a fasi + affiancamento al team per un'adozione reale",
        "Libreria di prompt e playbook su misura per l'operatività quotidiana",
      ]},
    ],
    priceCatBadge: "Listino prezzi",
    priceCatTitle: "Prezzi trasparenti per servizio",
    priceCatDesc: "Nessuna sorpresa. Sai cosa paghi prima di iniziare. Preventivo gratuito senza impegno.",
    priceCatalog: [
      { category: "Web e presenza digitale", tagline: "Sito, landing page, visibilità locale su Google (SEO locale) e negozio online", items: [
        { name: "Sito di una pagina", from: "290€" },
        { name: "Landing di conversione", from: "490€" },
        { name: "Sito multipagina (fino a 5)", from: "990€" },
        { name: "Negozio online semplice", from: "1.400€" },
      ]},
      { category: "Prenotazioni e appuntamenti", tagline: "Sistemi di prenotazione e promemoria per ridurre i no-show", items: [
        { name: "Setup completo Booksy / Fresha", from: "200€" },
        { name: "Agenda tipo Calendly + moduli", from: "150€" },
        { name: "Promemoria automatici (SMS / WhatsApp / email)", from: "150€" },
        { name: "Depositi / pagamento per appuntamenti", from: "130€" },
      ]},
      { category: "WhatsApp e comunicazione", tagline: "Rispondi, filtra richieste e acquisisci lead 24/7", items: [
        { name: "WhatsApp sul tuo sito (pulsante + tracking)", from: "120€" },
        { name: "Automazione base (menu + fuori orario)", from: "200€" },
        { name: "Segretario WhatsApp (bot con IA)", from: "550€" },
        { name: "Follow-up automatico lead", from: "150€" },
      ]},
      { category: "Gestione contatti e opportunità (CRM)", tagline: "Organizza i lead e misura cosa funziona ogni mese", items: [
        { name: "Lead → CRM / Sheets / Notion", from: "150€" },
        { name: "Report mensile + tracciamento lead", from: "79€/mese" },
      ]},
      { category: "Marketing e pubblicità", tagline: "Annunci, contenuti social e reputazione online", items: [
        { name: "Setup campagne Meta / Google Ads", from: "350€" },
        { name: "Contenuti social (12 post/mese)", from: "250€/mese" },
        { name: "Recensioni Google automatizzate (setup)", from: "150€" },
        { name: "Newsletter mensile", from: "99€/mese" },
        { name: "Scheda Google Business ottimizzata", from: "150€" },
      ]},
      { category: "Design e contenuto", tagline: "Identità di brand, copywriting ed email marketing", items: [
        { name: "Logo + branding base", from: "300€" },
        { name: "Copywriting web completo", from: "250€" },
        { name: "Email marketing setup", from: "150€" },
        { name: "Kit template social", from: "200€" },
      ]},
      { category: "Manutenzione e crescita", tagline: "Il tuo sito veloce, sicuro e in miglioramento ogni mese", items: [
        { name: "Manutenzione mensile (~2 h di migliorie)", from: "69€/mese" },
        { name: "Supporto + ottimizzazione (~4 h di migliorie)", from: "119€/mese" },
        { name: "Piano PRO (~6 h + revisione trimestrale)", from: "199€/mese" },
      ]},
      { category: "IA e automazione", tagline: "Chatbot con IA, automazioni e integrazioni intelligenti", items: [
        { name: "Chatbot IA (web + WhatsApp) — setup", from: "590€" },
        { name: "Chatbot IA — tuning mensile", from: "69€/mese" },
        { name: "Automazione di processi (1 flusso principale)", from: "250€" },
        { name: "Audit digitale del business", from: "200€" },
      ]},
    ],
    sizeBadge: "Per dimensione",
    sizeTitle: "Cresciamo insieme con il tuo business",
    sizeDesc: "Partiamo da dove sei. Aggiungiamo soluzioni quando il tuo business ne ha bisogno.",
    growTogether: "Un sito da 290€ oggi può diventare un sistema completo con prenotazioni, WhatsApp automatizzato e pubblicità domani — senza buttare via niente. Costruiamo sopra quello che abbiamo già fatto insieme.",
    sinceLabel: "da",
    mostPopular: "Più richiesto",
    sizes: [
      { label: "Iniziando", examples: "Freelancer, libero professionista, nuovo business, personal brand", price: "290 – 500€", badge: "Per partire", services: ["Sito di una pagina per il tuo business", "Pulsante WhatsApp professionale", "Logo + branding base", "Manutenzione mensile base"], popular: false },
      { label: "Piccola impresa", examples: "Parrucchiere, bar, clinica, estetista, negozio locale", price: "500 – 1.000€", badge: "Più richiesto", services: ["Landing di conversione (CTA, testimonianze, FAQ)", "Setup prenotazioni completo (Booksy / Fresha / Calendly)", "Scheda Google Business ottimizzata", "Promemoria automatici per appuntamenti", "Pulsante WhatsApp con tracking"], popular: true },
      { label: "Business consolidato", examples: "Clinica, consulenza, accademia, ristorante con staff", price: "1.000 – 2.000€", badge: "Sistema completo", services: ["Sito multipagina per migliorare la visibilità locale su Google (SEO locale)", "Automazione WhatsApp (menu + risposte automatiche)", "Gestore contatti semplice (CRM) + report mensile", "Setup campagne pubblicitarie (Meta / Google)", "Branding + template social media"], popular: false },
      { label: "In espansione", examples: "Team in crescita, più servizi, pubblicità attiva", price: "2.000€+", badge: "Massimo impatto", services: ["Tutto il precedente", "Segretario WhatsApp (bot con IA)", "Contenuti social (12 post/mese)", "Email marketing + automazioni", "Piano PRO con revisione trimestrale"], popular: false },
    ],
    packageCtaLabels: ["Voglio iniziare!", "Voglio crescere!", "Voglio digitalizzarmi!", "Voglio espandermi!"],
    processBadge: "Processo",
    processTitle: "Come funziona",
    processSteps: [
      { title: "Audit e obiettivi", desc: "Mappiamo i colli di bottiglia e definiamo obiettivi chiari." },
      { title: "Costruzione e integrazione", desc: "Progettiamo asset e colleghiamo i sistemi senza attriti." },
      { title: "Lancio e ottimizzazione", desc: "Andiamo live, monitoriamo le performance e raffiniamo le conversioni." },
    ],
    ctaTitle: "Pronto a scalare il tuo business?",
    ctaDesc: "Raccontaci di cosa ha bisogno il tuo business. Facciamo una diagnosi rapida, ti proponiamo un piano chiaro e partiamo quando sei pronto. Ci incontriamo su Google Meet.",
    ctaWhatsApp: "Parliamo su WhatsApp",
    ctaBook: "Fissa un incontro",
    ctaFooter: "Tempi rapidi • Comunicazione chiara • Risultati pratici",
    lastPlanNote: "Piano su misura per la tua prossima fase",
    caseNoticeTitle: "Parliamo del tuo caso",
    caseNoticeDesc: "Puoi chiamarci in qualsiasi momento.",
    callNow: "Chiama ora",
    contactSpain: "Spagna · Franco",
    contactArg: "Argentina · Marco",
    faqBadge: "FAQ",
    faqTitle: "Domande frequenti",
    faqs: [
      { q: "Di cosa hai bisogno da me per iniziare?", a: "Avrò bisogno dei tuoi asset di brand (logo, colori), testi o foto esistenti, e accesso al tuo dominio/hosting attuale se li hai. Copriamo tutto nella nostra chiamata iniziale." },
      { q: "Come è diverso da un sito con template?", a: "Costruiamo il tuo sito su misura per il tuo business. Questo significa caricamenti più veloci, messaggi più chiari per i clienti e migliore visibilità su Google (SEO), con libertà totale di personalizzazione." },
      { q: "Posso iniziare in piccolo e aggiungere dopo?", a: "Assolutamente. Molti clienti iniziano con un sito semplice da 290€ e aggiungono automazioni, prenotazioni e campagne pubblicitarie nel tempo. Costruiamo le cose in modo che possano sempre essere espanse." },
      { q: "Quali sono le tue condizioni di pagamento?", a: "Di solito 50% in anticipo per prenotare il tuo posto in agenda, e 50% al completamento e lancio del progetto. Per progetti più grandi possiamo discutere pagamenti per milestone." },
      { q: "Fornisci hosting e registrazione dominio?", a: "Sì: posso gestire tutto end-to-end. Registro il tuo dominio (.com o qualsiasi estensione), configuro hosting sicuro, SSL, collegamento email/dominio e metto online il sito pronto all'uso, senza stress tecnico per te." },
      { q: "Offri supporto dopo il lancio?", a: "Sì. Dopo il lancio possiamo continuare a migliorare il sito, sistemare rapidamente i dettagli e aggiungere nuove funzionalità man mano che il tuo business cresce. Puoi scegliere supporto occasionale o un piano mensile." },
    ],
    footerTerms: "Termini e Condizioni",
    footerPrivacy: "Privacy Policy",
    footerContact: "Contatto",
    footerRights: "Tutti i diritti riservati.",
    footerThemeLight: "Modalità chiara",
    footerThemeDark: "Modalità scura",
  },
};

function BlurText({ text, className, as: Tag = "span", delay = 0 }: { text: string; className?: string; as?: "h1" | "h2" | "h3" | "span"; delay?: number }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: delay + i * 0.06, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em", paddingBottom: "0.08em" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}

// --- MAIN COMPONENT ---
export default function DigitalTransformation() {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [currency, setCurrency] = useState<Currency>(getInitialCurrency);
  const [currencyRates, setCurrencyRates] = useState<Record<Currency, number>>(fallbackCurrencyRates);
  const [langBubbleOpen, setLangBubbleOpen] = useState(false);
  const [currencyBubbleOpen, setCurrencyBubbleOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
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
  const { setTheme, resolvedTheme } = useTheme();
  const mounted = resolvedTheme !== undefined;
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
      } catch {
        // Keep fallback rates silently.
      }
    };

    void refreshRates();
    const intervalId = window.setInterval(() => {
      void refreshRates();
    }, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const lang = t[language];
  const footerCopy = {
    es: {
      nav: "Navegacion",
      sectors: "Soluciones por sector",
      resources: "Recursos",
      contact: "Contacto",
      brandLine: "Disenamos webs y sistemas digitales para que tu negocio capte mas clientes en Barcelona.",
      response: "Respuesta media: menos de 24 h",
      sitemap: "Sitemap",
      robots: "Robots",
      terms: "Terminos y Condiciones",
      privacy: "Politica de Privacidad",
      legal: "Aviso Legal",
      cookiePolicy: "Politica de Cookies",
      ctaWhatsApp: "Hablar por WhatsApp",
      ctaCall: "Reservar llamada",
    },
    en: {
      nav: "Navigation",
      sectors: "Sector solutions",
      resources: "Resources",
      contact: "Contact",
      brandLine: "We design websites and digital systems to help your business win more clients in Barcelona.",
      response: "Average response: under 24 h",
      sitemap: "Sitemap",
      robots: "Robots",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
      legal: "Legal Notice",
      cookiePolicy: "Cookie Policy",
      ctaWhatsApp: "Chat on WhatsApp",
      ctaCall: "Book a call",
    },
    ca: {
      nav: "Navegacio",
      sectors: "Solucions per sector",
      resources: "Recursos",
      contact: "Contacte",
      brandLine: "Dissenyem webs i sistemes digitals per ajudar el teu negoci a captar mes clients a Barcelona.",
      response: "Resposta mitjana: menys de 24 h",
      sitemap: "Sitemap",
      robots: "Robots",
      terms: "Termes i Condicions",
      privacy: "Politica de Privacitat",
      legal: "Aviso Legal",
      cookiePolicy: "Politica de Cookies",
      ctaWhatsApp: "Parlar per WhatsApp",
      ctaCall: "Reservar trucada",
    },
    it: {
      nav: "Navigazione",
      sectors: "Soluzioni per settore",
      resources: "Risorse",
      contact: "Contatto",
      brandLine: "Progettiamo siti e sistemi digitali per aiutare il tuo business a ottenere piu clienti a Barcellona.",
      response: "Tempo medio di risposta: meno di 24 h",
      sitemap: "Sitemap",
      robots: "Robots",
      terms: "Termini e Condizioni",
      privacy: "Privacy Policy",
      legal: "Avviso Legale",
      cookiePolicy: "Politica sui Cookie",
      ctaWhatsApp: "Parla su WhatsApp",
      ctaCall: "Prenota call",
    },
  }[language];

  const footerMainLinks = {
    es: [
      { href: "/", label: "Inicio" },
      { href: "/desarrollo-web-barcelona", label: "Desarrollo web" },
      { href: "/digitalizacion-empresas-barcelona", label: "Digitalizacion" },
      { href: "/inteligencia-artificial-empresas-barcelona", label: "IA para empresas" },
      { href: "/services-builder", label: "Planes y precios" },
    ],
    en: [
      { href: "/", label: "Home" },
      { href: "/desarrollo-web-barcelona", label: "Web development" },
      { href: "/digitalizacion-empresas-barcelona", label: "Digitalization" },
      { href: "/inteligencia-artificial-empresas-barcelona", label: "AI for business" },
      { href: "/services-builder", label: "Plans & pricing" },
    ],
    ca: [
      { href: "/", label: "Inici" },
      { href: "/desarrollo-web-barcelona", label: "Desenvolupament web" },
      { href: "/digitalizacion-empresas-barcelona", label: "Digitalitzacio" },
      { href: "/inteligencia-artificial-empresas-barcelona", label: "IA per a negocis" },
      { href: "/services-builder", label: "Plans i preus" },
    ],
    it: [
      { href: "/", label: "Home" },
      { href: "/desarrollo-web-barcelona", label: "Sviluppo web" },
      { href: "/digitalizacion-empresas-barcelona", label: "Digitalizzazione" },
      { href: "/inteligencia-artificial-empresas-barcelona", label: "IA per business" },
      { href: "/services-builder", label: "Piani e prezzi" },
    ],
  }[language];

  const footerSectorLinks = [
    { href: "/desarrollo-web-restaurantes-barcelona", label: "Restaurantes" },
    { href: "/desarrollo-web-cafes-barcelona", label: "Cafes" },
    { href: "/desarrollo-web-clinicas-barcelona", label: "Clinicas" },
    { href: "/desarrollo-web-bares-barcelona", label: "Bares" },
    { href: "/desarrollo-web-esteticas-barcelona", label: "Esteticas" },
    { href: "/desarrollo-web-barberias-barcelona", label: "Barberias" },
  ];

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

    if (!dragMovedRef.current && Math.hypot(event.clientX - start.x, event.clientY - start.y) > BUBBLE_DRAG_THRESHOLD_PX) {
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
  }, [getCornerFromPoint]);

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

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <AmbientBackground />

      <main className="relative z-10 flex-1 py-8 px-3 sm:px-4 lg:px-6">

        {/* ── HEADER ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative h-32 w-[420px] sm:h-40 sm:w-[520px]"
              >
                <Image
                  src="/logoname.png"
                  alt="UNAiFLY"
                  fill
                  sizes="(max-width: 640px) 420px, 520px"
                  className="object-contain"
                  priority
                />
              </motion.div>
              <h1 className="text-foreground text-3xl font-bold tracking-tight leading-[1.2] sm:text-4xl md:text-5xl">
                <BlurText as="span" text={lang.headerTitle} delay={0.2} className="block" />
                <motion.span
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
                >
                  {lang.headerAccent}
                </motion.span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto max-w-[600px] text-muted-foreground md:text-lg/relaxed text-pretty"
              >
                {lang.headerDesc}
              </motion.p>
              <motion.ul
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}
                viewport={{ once: true }}
                className="mt-1 space-y-2 text-left inline-block"
              >
                {lang.heroBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-[3px] h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </section>

        {/* ── WHY DIFFERENT ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-10">
              <BlurText as="h2" text={lang.whyDiffTitle} delay={0.2} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl" />
              <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto max-w-[600px] text-muted-foreground md:text-lg/relaxed text-pretty"
              >
                {lang.whyDiffSubtitle}
              </motion.p>
            </div>
            <motion.div
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {lang.whyDiffCards.map((card, idx) => {
                const Icon = whyDiffIcons[idx];
                const iconStyle = whyDiffIconStyles[idx] ?? whyDiffIconStyles[0];
                return (
                  <motion.div key={idx} variants={itemFadeIn} className="h-full">
                    <div className="group relative w-full h-full min-h-[200px] overflow-hidden rounded-[22px] p-6 flex flex-col bg-white/[0.03] border border-white/[0.07] shadow-[0_2px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.04)] hover:border-white/[0.12] hover:bg-white/[0.05] hover:shadow-[0_6px_30px_rgba(0,0,0,0.35)] transition-all duration-300 cursor-default">
                      {/* Colored top accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${iconStyle.accent}`} />
                      {/* Soft corner atmosphere */}
                      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-[0.12] ${iconStyle.glow}`} />
                      <div className={`relative z-10 w-11 h-11 rounded-2xl ${iconStyle.bg} border border-white/[0.08] flex items-center justify-center mb-4 shadow-sm`}>
                        <Icon className={`w-5 h-5 ${iconStyle.icon}`} />
                      </div>
                      <h3 className="relative z-10 text-[15px] font-bold mb-2 text-foreground">{card.title}</h3>
                      <p className="relative z-10 text-muted-foreground text-sm leading-relaxed">{card.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* ── BUILD YOUR PLAN CTA ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-3xl"
          >
            {/* Layered backgrounds for depth */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.02]" />

            {/* Centered radial spotlight from above */}
            <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full blur-3xl bg-white/[0.09] pointer-events-none" />

            {/* Outer border — more visible than default */}
            <div className="absolute inset-0 rounded-3xl border border-white/[0.13] pointer-events-none" />
            {/* Inner highlight line at the very top */}
            <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/[0.35] to-transparent pointer-events-none" />

            {/* Subtle bottom-left + top-right corner ambient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.03] blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-5 text-center px-4 sm:px-6 lg:px-8 py-14 md:py-16">
              <BlurText as="h2" text={lang.builderCtaTitle} delay={0.2} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl md:text-5xl" />
              <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="mx-auto max-w-[540px] text-muted-foreground md:text-lg/relaxed text-pretty"
              >
                {lang.builderCtaDesc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                className="pt-2"
              >
                <Button
                  size="lg"
                  className="rounded-2xl text-base font-bold px-6 sm:px-9 max-w-full whitespace-normal text-center bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white border-0 shadow-[0_4px_32px_rgba(139,92,246,0.45)] hover:shadow-[0_6px_44px_rgba(139,92,246,0.60)] hover:brightness-110 transition-all duration-300"
                  asChild
                >
                  <Link href="/services-builder">
                    <ArrowRight className="mr-2 h-5 w-5" />
                    {lang.builderCtaButton}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── PRESET PLANS — "Te lo hacemos fácil" ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-3xl"
          >
            {/* Glass card background — same as "Arma tu plan" */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-white/[0.02]" />
            <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[280px] rounded-full blur-3xl bg-white/[0.09] pointer-events-none" />
            <div className="absolute inset-0 rounded-3xl border border-white/[0.13] pointer-events-none" />
            <div className="absolute top-0 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-white/[0.35] to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.03] blur-3xl rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.02] blur-3xl rounded-full -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 px-4 sm:px-6 lg:px-10 py-12 md:py-16">
              {/* Header */}
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10 md:mb-14">
                <BlurText as="h2" text={lang.easyTitle} delay={0.2} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl md:text-5xl" />
                <motion.p
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[540px] text-muted-foreground md:text-lg/relaxed text-pretty"
                >
                  {lang.easySubtitle}
                </motion.p>
              </div>

              {/* Plan cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {presetPlans.map((preset, idx) => {
                  const presetTotals = calculateTotals(new Set(preset.itemIds), svcCategories);
                  const rate = getCrossCurrencyRate("EUR", currency, currencyRates) ?? 1;
                  const convertedOneTime = presetTotals.oneTime * rate;
                  const convertedMonthly = presetTotals.monthly * rate;
                  const colorMap: Record<string, {
                    border: string; text: string; glow: string; gradientBg: string;
                    checkBg: string; checkText: string; topLine: string; hoverBorder: string;
                    btnBg: string; btnHover: string;
                  }> = {
                    green: {
                      border: "border-emerald-500/20", text: "text-emerald-400", glow: "hover:shadow-[0_8px_40px_-12px_rgba(16,185,129,0.3)]",
                      gradientBg: "from-emerald-500/10 via-emerald-500/[0.03] to-transparent",
                      checkBg: "bg-emerald-500/15", checkText: "text-emerald-400", topLine: "via-emerald-400/60",
                      hoverBorder: "hover:border-emerald-500/40",
                      btnBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25", btnHover: "hover:bg-emerald-500/25",
                    },
                    blue: {
                      border: "border-sky-500/20", text: "text-sky-400", glow: "hover:shadow-[0_8px_40px_-12px_rgba(14,165,233,0.3)]",
                      gradientBg: "from-sky-500/10 via-sky-500/[0.03] to-transparent",
                      checkBg: "bg-sky-500/15", checkText: "text-sky-400", topLine: "via-sky-400/60",
                      hoverBorder: "hover:border-sky-500/40",
                      btnBg: "bg-sky-500/15 text-sky-300 border-sky-500/25", btnHover: "hover:bg-sky-500/25",
                    },
                    purple: {
                      border: "border-violet-500/20", text: "text-violet-400", glow: "hover:shadow-[0_8px_40px_-12px_rgba(139,92,246,0.3)]",
                      gradientBg: "from-violet-500/10 via-violet-500/[0.03] to-transparent",
                      checkBg: "bg-violet-500/15", checkText: "text-violet-400", topLine: "via-violet-400/60",
                      hoverBorder: "hover:border-violet-500/40",
                      btnBg: "bg-violet-500/15 text-violet-300 border-violet-500/25", btnHover: "hover:bg-violet-500/25",
                    },
                    gold: {
                      border: "border-amber-500/20", text: "text-amber-400", glow: "hover:shadow-[0_8px_40px_-12px_rgba(245,158,11,0.3)]",
                      gradientBg: "from-amber-500/10 via-amber-500/[0.03] to-transparent",
                      checkBg: "bg-amber-500/15", checkText: "text-amber-400", topLine: "via-amber-400/60",
                      hoverBorder: "hover:border-amber-500/40",
                      btnBg: "bg-amber-500/15 text-amber-300 border-amber-500/25", btnHover: "hover:bg-amber-500/25",
                    },
                  };
                  const colors = colorMap[preset.colorKey] ?? colorMap.green;

                  // Only show items NEW to this plan (not in the previous plan)
                  const prevItemIds = idx > 0 ? new Set(presetPlans[idx - 1].itemIds) : new Set<string>();
                  const newItems: string[] = [];
                  for (const cat of svcCategories) {
                    for (const item of cat.items) {
                      if (preset.itemIds.includes(item.id) && !prevItemIds.has(item.id)) {
                        newItems.push(item.name[language]);
                      }
                    }
                  }

                  const prevPlanName = idx > 0 ? presetPlans[idx - 1].name[language] : "";
                  const waMsg = `Hola Franco! Me interesa el plan "${preset.name[language]}" (${formatRateAmount(convertedOneTime, currency)}${convertedMonthly > 0 ? ` + ${formatRateAmount(convertedMonthly, currency)}/mes` : ""}). ¿Me cuentas más?`;
                  const waUrl = `https://wa.me/34644583808?text=${encodeURIComponent(waMsg)}`;

                  return (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.12 }}
                      className="flex"
                    >
                      <div
                        className={`group relative flex flex-col w-full rounded-2xl border ${colors.border} ${colors.hoverBorder} bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] ${colors.glow} overflow-hidden`}
                      >
                        {/* Top colored line */}
                        <div className={`absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent ${colors.topLine} to-transparent opacity-50`} />
                        {/* Background gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradientBg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`} />

                        <div className="relative z-10 flex flex-col h-full p-5 sm:p-6">
                          {/* Name + target */}
                          <h3 className={`text-lg font-bold ${colors.text} mb-1`}>
                            {preset.name[language]}
                          </h3>
                          <p className="text-[13px] text-muted-foreground leading-snug mb-4">
                            {preset.description[language]}
                          </p>

                          {/* Price */}
                          <div className="mb-5">
                            <span className="text-2xl font-bold text-foreground tabular-nums">
                              {formatRateAmount(convertedOneTime, currency)}
                            </span>
                            {convertedMonthly > 0 && (
                              <span className="ml-2 text-sm text-purple-400/80 tabular-nums font-medium">
                                +{formatRateAmount(convertedMonthly, currency)}/mes
                              </span>
                            )}
                          </div>

                          {/* Separator */}
                          <div className="border-t border-white/[0.08] mb-4" />

                          {/* "Includes previous" or item list */}
                          <div className="flex-1 space-y-2.5">
                            {idx > 0 && (
                              <p className="text-[13px] text-muted-foreground/80 italic mb-1">
                                {lang.includesPrevious.replace("{prev}", prevPlanName)}
                              </p>
                            )}
                            {newItems.map((name, i) => (
                              <div key={i} className="flex items-start gap-2.5 text-[13px] text-muted-foreground leading-snug">
                                <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full ${colors.checkBg} flex items-center justify-center`}>
                                  <Check className={`w-2.5 h-2.5 ${colors.checkText}`} />
                                </span>
                                <span>{name}</span>
                              </div>
                            ))}
                          </div>

                          {/* CTA → WhatsApp */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`mt-5 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${colors.btnBg} ${colors.btnHover}`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            {lang.planConsult}
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <BlurText as="h2" text={lang.processTitle} delay={0.2} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl" />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-0.5 bg-muted">
                <motion.div
                  className="h-full bg-primary/50 origin-left"
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              {lang.processSteps.map((step, idx) => (
                <motion.div
                  key={idx} variants={itemFadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="flex flex-col items-center text-center mb-10 md:mb-0 px-4"
                >
                  <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xl font-bold text-primary mb-4 relative z-10 shadow-sm">
                    {idx + 1}
                  </div>
                  <h4 className="text-lg font-bold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground max-w-[200px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── TEAM ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="mb-8 text-center">
              <BlurText as="h2" text={lang.teamTitle} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl" />
              <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="mx-auto mt-3 max-w-[540px] text-muted-foreground md:text-base/relaxed text-pretty"
              >
                {lang.teamDesc}
              </motion.p>
            </div>
            <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Link href="/franco" className="glass-card group block rounded-3xl p-6 text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-white/20">
                  <Image src="/foto.jpeg" alt="Franco" fill sizes="128px" className="object-cover object-top" />
                </div>
                <p className="mt-4 text-2xl font-semibold">Franco</p>
                <p className="mt-1 text-sm text-muted-foreground">{lang.teamRoles[0]}</p>
                <div className="mt-2 inline-flex items-center text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                  {lang.viewProfile}
                </div>
              </Link>
              <div className="glass-card block rounded-3xl p-6 text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-white/20">
                  <Image src={inesImage} alt="Ines" fill sizes="128px" className="object-cover object-top" />
                </div>
                <p className="mt-4 text-2xl font-semibold">Ines</p>
                <p className="mt-1 text-sm text-muted-foreground">{lang.teamRoles[1]}</p>
              </div>
              <div className="glass-card block rounded-3xl p-6 text-center">
                <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border border-white/20">
                  <Image src="/marco.png" alt="Marco" fill sizes="128px" className="object-cover object-top" />
                </div>
                <p className="mt-4 text-2xl font-semibold">Marco</p>
                <p className="mt-1 text-sm text-muted-foreground">{lang.teamRoles[2]}</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── CTA ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-primary/30 rounded-3xl bg-gradient-to-br from-primary/10 to-muted/30 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <BlurText as="h2" text={lang.ctaTitle} delay={0.2} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl mb-4 sm:mb-6" />
              <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty"
              >
                {lang.ctaDesc}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              >
                <Button size="lg" className="rounded-3xl bg-green-600 hover:bg-green-700 text-white" asChild>
                  <a href="https://wa.me/34644583808" target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />{lang.ctaWhatsApp}
                  </a>
                </Button>
                <Button size="lg" className="rounded-3xl bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 text-white border-0 shadow-[0_4px_32px_rgba(139,92,246,0.45)] hover:shadow-[0_6px_44px_rgba(139,92,246,0.60)] hover:brightness-110 transition-all duration-300" asChild>
                  <a href="https://calendly.com/frencia92/30min" target="_blank" rel="noreferrer">
                    {lang.ctaBook}<ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
              <p className="mt-4 sm:mt-6 text-sm text-muted-foreground font-medium">{lang.ctaFooter}</p>
            </div>
          </motion.div>
        </section>

        {/* ── FAQ ── */}
        <section className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-10"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <BlurText as="h2" text={lang.faqTitle} delay={0.2} className="text-foreground text-3xl font-bold tracking-tighter leading-[1.15] sm:text-4xl" />
            </div>
            <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2">
              {lang.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 text-left">
                  <h3 className="text-base font-semibold text-foreground">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-[#040611]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-400/8 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-3xl border border-white/12 bg-gradient-to-br from-white/[0.06] via-white/[0.025] to-transparent p-6 shadow-[0_24px_80px_-28px_rgba(56,189,248,0.35)] backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex flex-col gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200/80">UNAiFLY</p>
                <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">Webs y sistemas digitales con enfoque en conversion</h3>
                <p className="mt-3 text-sm text-slate-300/85 sm:text-base">{footerCopy.brandLine}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://wa.me/34644583808"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-cyan-200/35 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-100/60 hover:bg-cyan-300/20"
                >
                  {footerCopy.ctaWhatsApp}
                </a>
                <a
                  href="https://calendly.com/frencia92"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/35 hover:bg-white/10"
                >
                  {footerCopy.ctaCall}
                </a>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{footerCopy.nav}</p>
                <nav className="space-y-2 text-sm text-slate-300">
                  {footerMainLinks.map((item) => (
                    <Link key={item.href} href={item.href} className="block transition hover:text-white">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{footerCopy.sectors}</p>
                <nav className="space-y-2 text-sm text-slate-300">
                  {footerSectorLinks.map((item) => (
                    <Link key={item.href} href={item.href} className="block transition hover:text-white">
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{footerCopy.resources}</p>
                <nav className="space-y-2 text-sm text-slate-300">
                  <Link href="/sitemap.xml" className="block transition hover:text-white">{footerCopy.sitemap}</Link>
                  <Link href="/robots.txt" className="block transition hover:text-white">{footerCopy.robots}</Link>
                  <Link href="/terminos-y-condiciones" className="block transition hover:text-white">{footerCopy.terms}</Link>
                  <Link href="/politica-de-privacidad" className="block transition hover:text-white">{footerCopy.privacy}</Link>
                  <Link href="/aviso-legal" className="block transition hover:text-white">{footerCopy.legal}</Link>
                  <Link href="/politica-de-cookies" className="block transition hover:text-white">{footerCopy.cookiePolicy}</Link>
                </nav>
              </div>

              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{footerCopy.contact}</p>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>Barcelona, Espana</p>
                  <a href="https://wa.me/34644583808" target="_blank" rel="noreferrer" className="block transition hover:text-white">
                    +34 644 58 38 08
                  </a>
                  <a href="mailto:frencia92@gmail.com" className="block break-all transition hover:text-white">
                    frencia92@gmail.com
                  </a>
                  <p className="pt-1 text-xs text-slate-400">{footerCopy.response}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {mounted && (
                <>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined" && window.showCookieSettings) {
                        window.showCookieSettings();
                      }
                    }}
                    className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  >
                    Configurar cookies
                  </button>

                  <button
                    onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                    className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                  >
                    {resolvedTheme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4" />
                        {lang.footerThemeLight}
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4" />
                        {lang.footerThemeDark}
                      </>
                    )}
                  </button>
                </>
              )}
              {!mounted && (
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {resolvedTheme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4" />
                      {lang.footerThemeLight}
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      {lang.footerThemeDark}
                    </>
                  )}
                </button>
              )}
              <p className="text-xs text-slate-400">© {new Date().getFullYear()} UNAiFLY. {lang.footerRights}</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CURRENCY + LANGUAGE BUBBLES ── */}
      <motion.div
        ref={bubblesContainerRef}
        layout
        transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.9 }}
        className={`fixed z-50 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center gap-2 rounded-full p-1 select-none sm:flex-nowrap ${cornerContainerClasses[bubbleCorner]} ${isDraggingBubbles ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handleBubblesPointerDown}
        onPointerMove={handleBubblesPointerMove}
        onPointerUp={stopBubbleDragging}
        onPointerCancel={stopBubbleDragging}
      >
        {/* Drag grip handle */}
        <div
          className="flex h-12 w-4 shrink-0 cursor-grab items-center justify-center opacity-35 transition-opacity hover:opacity-65 active:cursor-grabbing"
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
        <div className="relative h-14 w-14 shrink-0 sm:h-12 sm:w-12">
          <AnimatePresence>
            {currencyBubbleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.9 }}
                data-floating-panel="true"
                className={`${popoverClassesByCorner[bubbleCorner]} w-[220px] max-w-[calc(100vw-2rem)] sm:w-[300px] overflow-hidden rounded-2xl border border-amber-200/22 bg-gradient-to-br from-slate-900/90 via-amber-950/76 to-yellow-950/80 p-2 text-slate-100 shadow-[0_16px_44px_-18px_rgba(251,191,36,0.38)] backdrop-blur-2xl`}
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
            className="absolute inset-0 touch-manipulation flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/34 bg-gradient-to-br from-amber-400/18 via-yellow-400/12 to-orange-500/14 text-amber-50 shadow-[0_10px_24px_-12px_rgba(251,191,36,0.55)] backdrop-blur-xl transition-all duration-300 hover:border-amber-100/55 hover:from-amber-300/26 hover:to-yellow-400/24 sm:h-12 sm:w-12"
            aria-label="Select currency"
            aria-expanded={currencyBubbleOpen}
            aria-controls="currency-popover"
          >
            <CircleDollarSign className="h-6 w-6 text-primary sm:h-5 sm:w-5" />
          </motion.button>
        </div>

        <div className="relative h-14 w-14 shrink-0 sm:h-12 sm:w-12">
          <AnimatePresence>
            {langBubbleOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 360, damping: 26, mass: 0.9 }}
                data-floating-panel="true"
                className={`${popoverClassesByCorner[bubbleCorner]} w-[190px] max-w-[calc(100vw-2rem)] sm:w-[220px] overflow-hidden rounded-2xl border border-blue-200/22 bg-gradient-to-br from-slate-900/90 via-blue-950/78 to-cyan-950/80 p-2 text-slate-100 shadow-[0_16px_44px_-18px_rgba(59,130,246,0.38)] backdrop-blur-2xl`}
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
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setLangBubbleOpen(!langBubbleOpen);
              setCurrencyBubbleOpen(false);
              setChatbotOpen(false);
              setAiChatOpen(false);
            }}
            className="absolute inset-0 touch-manipulation flex h-14 w-14 items-center justify-center rounded-full border border-blue-200/34 bg-gradient-to-br from-blue-400/18 via-cyan-400/12 to-sky-500/14 text-blue-50 shadow-[0_10px_24px_-12px_rgba(59,130,246,0.55)] backdrop-blur-xl transition-all duration-300 hover:border-blue-100/55 hover:from-blue-300/26 hover:to-cyan-400/24 sm:h-12 sm:w-12"
            aria-label="Select language"
            aria-expanded={langBubbleOpen}
            aria-controls="language-popover"
          >
            <Languages className="h-6 w-6 text-primary sm:h-5 sm:w-5" />
          </motion.button>
        </div>

        <div className="relative h-14 w-14 shrink-0 sm:h-12 sm:w-12">
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
            className="absolute inset-0 touch-manipulation flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200/34 bg-gradient-to-br from-emerald-400/16 via-teal-400/10 to-cyan-500/14 text-emerald-50 shadow-[0_10px_24px_-12px_rgba(16,185,129,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-100/55 hover:from-emerald-300/24 hover:to-teal-400/22 sm:h-12 sm:w-12"
            aria-label="FAQ Chat"
            aria-expanded={chatbotOpen}
          >
            <MessageCircle className="h-6 w-6 text-primary sm:h-5 sm:w-5" />
          </motion.button>
        </div>

        <div className="relative h-14 w-14 shrink-0 sm:h-12 sm:w-12">
          <motion.button
            ref={aiButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => {
              setAiChatOpen(!aiChatOpen); setChatbotOpen(false); setLangBubbleOpen(false); setCurrencyBubbleOpen(false);
            }}
            className="absolute inset-0 touch-manipulation flex h-14 w-14 items-center justify-center rounded-full border border-violet-200/34 bg-gradient-to-br from-violet-400/16 via-purple-400/10 to-fuchsia-500/14 text-violet-50 shadow-[0_10px_24px_-12px_rgba(139,92,246,0.5)] backdrop-blur-xl transition-all duration-300 hover:border-violet-100/55 hover:from-violet-300/24 hover:to-fuchsia-400/22 sm:h-12 sm:w-12"
            aria-label="AI Chat"
            aria-expanded={aiChatOpen}
          >
            <Bot className="h-6 w-6 text-primary sm:h-5 sm:w-5" />
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
