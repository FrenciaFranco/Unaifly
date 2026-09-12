"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./consulting-home.module.css";

export default function DiagnosticContact() {
  const [draftUrl, setDraftUrl] = useState("");

  function requestAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company") ?? "").trim();
    const process = String(data.get("process") ?? "").trim();
    const message = `Hola, UNAiFLY. Quiero solicitar un análisis de los procesos de mi empresa.\n\nEmpresa: ${company}\nÁrea: ${data.get("area")}\nQué queremos mejorar: ${process}`;
    const url = `https://wa.me/34644583808?text=${encodeURIComponent(message)}`;
    setDraftUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className={styles.contactForm} onSubmit={requestAnalysis} onChange={() => setDraftUrl("")}>
      <h3>Empecemos por tu empresa</h3>
      <label htmlFor="company">Nombre de la empresa</label>
      <input id="company" name="company" autoComplete="organization" required maxLength={120} placeholder="Tu empresa" pattern=".*\S.*" />
      <label htmlFor="area">¿En qué área quieres mejorar?</label>
      <select id="area" name="area" defaultValue="Necesito ayuda para identificarlo">
        <option>Necesito ayuda para identificarlo</option>
        {["Ventas", "Administración", "Operaciones", "Atención al cliente", "Marketing", "Reporting", "Gestión de datos", "Sistemas internos", "Varias áreas"].map(area => <option key={area}>{area}</option>)}
      </select>
      <label htmlFor="process">¿Qué os está quitando tiempo?</label>
      <textarea id="process" name="process" rows={3} required minLength={10} maxLength={1500} placeholder="Por ejemplo: recibimos pedidos por email y los copiamos a mano en varias herramientas." aria-describedby="contact-help" />
      <p id="contact-help" className={styles.formHelp}>Se abrirá WhatsApp con tu mensaje preparado. Podrás revisarlo antes de enviarlo. Consulta nuestra <Link href="/politica-de-privacidad">política de privacidad</Link>.</p>
      <button type="submit" className={styles.primary}>Solicitar análisis</button>
      {draftUrl && <p className={styles.formStatus} role="status">Tu mensaje está preparado; todavía tienes que enviarlo en WhatsApp. <a href={draftUrl} target="_blank" rel="noopener noreferrer">Abrir WhatsApp de nuevo</a>.</p>}
    </form>
  );
}

export function CookieSettings() {
  return <button type="button" onClick={() => window.showCookieSettings?.()}>Configurar cookies</button>;
}
