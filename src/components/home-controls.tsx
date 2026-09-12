"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import dynamic from "next/dynamic";
import styles from "./consulting-home.module.css";

const subscribe = () => () => {};
const FloatingTools = dynamic(() => import("./home-floating-tools"), { ssr: false });

export function ThemeSwitch({ language = "es" }: { language?: import("@/lib/servicesConfig").Language }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const light = mounted && resolvedTheme === "light";
  const labels = { es: ["Modo claro", "Cambiar a modo oscuro", "Cambiar a modo claro"], en: ["Light mode", "Switch to dark mode", "Switch to light mode"], ca: ["Mode clar", "Canvia al mode fosc", "Canvia al mode clar"], it: ["Modalità chiara", "Passa alla modalità scura", "Passa alla modalità chiara"] }[language];
  return <button type="button" role="switch" aria-label={labels[0]} aria-checked={light} disabled={!mounted} onClick={() => setTheme(light ? "dark" : "light")} className={styles.themeSwitch} title={light ? labels[1] : labels[2]}><Sun size={16} aria-hidden="true" /><Moon size={16} aria-hidden="true" /><span className={styles.switchThumb} /></button>;
}

export function HomeTools({ onLanguageChange }: { onLanguageChange?: (language: import("@/lib/servicesConfig").Language) => void }) { return <FloatingTools onLanguageChange={onLanguageChange} />; }
