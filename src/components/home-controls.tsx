"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import dynamic from "next/dynamic";
import styles from "./consulting-home.module.css";

const subscribe = () => () => {};
const FloatingTools = dynamic(() => import("./home-floating-tools"), { ssr: false });

export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const light = mounted && resolvedTheme === "light";
  return <button type="button" role="switch" aria-label="Modo claro" aria-checked={light} disabled={!mounted} onClick={() => setTheme(light ? "dark" : "light")} className={styles.themeSwitch} title={light ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}><Sun size={16} aria-hidden="true" /><Moon size={16} aria-hidden="true" /><span className={styles.switchThumb} /></button>;
}

export function HomeTools() { return <FloatingTools />; }
