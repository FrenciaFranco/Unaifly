"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const COOKIE_KEY = "unaifly_cookie_consent";

type Consent = "accepted" | "rejected" | null;

// Global type declarations
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    showCookieSettings?: () => void;
  }
}

/**
 * Read persisted consent from localStorage.
 * Only call on the client (inside useEffect) to avoid hydration mismatches.
 */
function getStoredConsent(): Consent {
  try {
    const stored = localStorage.getItem(COOKIE_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : null;
  } catch {
    return null;
  }
}

function setStoredConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(COOKIE_KEY, value);
  } catch {
    // Ignore storage errors and still apply in-memory consent.
  }
}

function notifyConsentUpdate() {
  window.dispatchEvent(new Event("unaifly-cookie-consent-updated"));
}

/**
 * Update Google Consent Mode v2 via the global gtag function
 * defined in layout.tsx's inline script.
 */
function updateConsentMode(consent: Exclude<Consent, null>) {
  if (typeof window.gtag !== "function") {
    console.warn("[GA] gtag not available yet for consent update");
    return;
  }

  const analyticsValue = consent === "accepted" ? "granted" : "denied";

  window.gtag("consent", "update", {
    analytics_storage: analyticsValue,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  });

  console.log("[GA] consent update →", analyticsValue);
}

function removeGACookies() {
  const domain = window.location.hostname;
  const cookiesToDelete = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim());

  cookiesToDelete.forEach((name) => {
    if (name.startsWith("_ga")) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${domain}`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
    }
  });
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // Client-only: read persisted preference after hydration
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) setConsent(stored);
    setMounted(true);
  }, []);

  // Apply consent side-effects whenever consent changes
  useEffect(() => {
    if (consent === "accepted") {
      updateConsentMode("accepted");
      // Send first page_view only after consent is granted
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname,
        });
        console.log("[GA] page_view sent after consent accepted");
      }
    } else if (consent === "rejected") {
      updateConsentMode("rejected");
      removeGACookies();
    }
  }, [consent]);

  // Expose function to reopen banner from footer or elsewhere
  useEffect(() => {
    window.showCookieSettings = () => {
      setShowBanner(true);
    };
  }, []);

  const accept = useCallback(() => {
    setStoredConsent("accepted");
    setConsent("accepted");
    notifyConsentUpdate();
    setShowBanner(false);
  }, []);

  const reject = useCallback(() => {
    setStoredConsent("rejected");
    setConsent("rejected");
    notifyConsentUpdate();
    setShowBanner(false);
  }, []);

  // Don't render until hydrated
  if (!mounted) return null;

  const shouldShowBanner = !consent || showBanner;
  if (!shouldShowBanner) return null;

  return (
    <div className="pointer-events-auto fixed bottom-3 left-3 right-auto z-[2147483647] w-[52vw] max-w-[220px] sm:left-4 sm:w-[380px]">
      <div className="rounded-xl border border-black/10 bg-white/95 p-3 shadow-[0_14px_40px_-18px_rgba(56,189,248,0.25)] backdrop-blur-xl dark:border-white/15 dark:bg-[#0b1020]/92 dark:shadow-[0_14px_40px_-18px_rgba(56,189,248,0.45)]">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Utilizamos cookies para mejorar tu experiencia (análisis de uso,
          preferencias). Consulta nuestra{" "}
          <Link
            href="/politica-de-cookies"
            className="underline hover:text-slate-900 dark:hover:text-white"
          >
            Política de Cookies
          </Link>
          .
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={reject}
            aria-label="Rechazar todas las cookies"
            className="rounded-md border border-black/15 bg-black/5 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-black/10 dark:border-white/20 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={accept}
            aria-label="Aceptar todas las cookies"
            className="rounded-md bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-400 dark:bg-cyan-500 dark:hover:bg-cyan-400"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
