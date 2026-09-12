"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import styles from "./consulting-home.module.css";
import type { Language } from "@/lib/servicesConfig";

const formCopy = {
  es: { title: "Empecemos por tu empresa", company: "Nombre de la empresa", companyPlaceholder: "Tu empresa", area: "¿En qué área quieres mejorar?", unknown: "Necesito ayuda para identificarlo", areas: ["Ventas", "Administración", "Operaciones", "Atención al cliente", "Marketing", "Reporting", "Gestión de datos", "Sistemas internos", "Varias áreas"], process: "¿Qué os está quitando tiempo?", processPlaceholder: "Por ejemplo: recibimos pedidos por email y los copiamos a mano en varias herramientas.", help: "Se abrirá WhatsApp con tu mensaje preparado. Podrás revisarlo antes de enviarlo. Consulta nuestra", privacy: "política de privacidad", submit: "Solicitar análisis", status: "Tu mensaje está preparado; todavía tienes que enviarlo en WhatsApp.", reopen: "Abrir WhatsApp de nuevo", cookies: "Configurar cookies", message: "Hola, UNAiFLY. Quiero solicitar un análisis de los procesos de mi empresa.", companyLine: "Empresa", areaLine: "Área", processLine: "Qué queremos mejorar" },
  en: { title: "Let's start with your business", company: "Company name", companyPlaceholder: "Your company", area: "Which area would you like to improve?", unknown: "I need help identifying it", areas: ["Sales", "Administration", "Operations", "Customer service", "Marketing", "Reporting", "Data management", "Internal systems", "Several areas"], process: "What is taking up your time?", processPlaceholder: "For example: we receive orders by email and copy them manually into several tools.", help: "WhatsApp will open with your message ready. You can review it before sending. See our", privacy: "privacy policy", submit: "Request an analysis", status: "Your message is ready; you still need to send it in WhatsApp.", reopen: "Open WhatsApp again", cookies: "Cookie settings", message: "Hello, UNAiFLY. I'd like to request an analysis of my company's processes.", companyLine: "Company", areaLine: "Area", processLine: "What we want to improve" },
  ca: { title: "Comencem per la teva empresa", company: "Nom de l'empresa", companyPlaceholder: "La teva empresa", area: "En quina àrea vols millorar?", unknown: "Necessito ajuda per identificar-la", areas: ["Vendes", "Administració", "Operacions", "Atenció al client", "Màrqueting", "Reporting", "Gestió de dades", "Sistemes interns", "Diverses àrees"], process: "Què us està traient temps?", processPlaceholder: "Per exemple: rebem comandes per correu i les copiem a mà en diverses eines.", help: "S'obrirà WhatsApp amb el missatge preparat. Podràs revisar-lo abans d'enviar-lo. Consulta la nostra", privacy: "política de privacitat", submit: "Sol·licitar anàlisi", status: "El missatge està preparat; encara l'has d'enviar per WhatsApp.", reopen: "Tornar a obrir WhatsApp", cookies: "Configurar cookies", message: "Hola, UNAiFLY. Vull sol·licitar una anàlisi dels processos de la meva empresa.", companyLine: "Empresa", areaLine: "Àrea", processLine: "Què volem millorar" },
  it: { title: "Partiamo dalla tua azienda", company: "Nome dell'azienda", companyPlaceholder: "La tua azienda", area: "In quale area vuoi migliorare?", unknown: "Ho bisogno di aiuto per identificarla", areas: ["Vendite", "Amministrazione", "Operazioni", "Assistenza clienti", "Marketing", "Reporting", "Gestione dei dati", "Sistemi interni", "Più aree"], process: "Cosa vi porta via tempo?", processPlaceholder: "Ad esempio: riceviamo ordini via email e li copiamo manualmente in vari strumenti.", help: "WhatsApp si aprirà con il messaggio pronto. Potrai rileggerlo prima di inviarlo. Consulta la nostra", privacy: "informativa sulla privacy", submit: "Richiedi un'analisi", status: "Il messaggio è pronto; devi ancora inviarlo su WhatsApp.", reopen: "Riapri WhatsApp", cookies: "Impostazioni cookie", message: "Ciao, UNAiFLY. Vorrei richiedere un'analisi dei processi della mia azienda.", companyLine: "Azienda", areaLine: "Area", processLine: "Cosa vogliamo migliorare" },
} satisfies Record<Language, Record<string, string | string[]>>;

export default function DiagnosticContact({ language = "es" }: { language?: Language }) {
  const [draftUrl, setDraftUrl] = useState("");
  const t = formCopy[language];

  function requestAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const company = String(data.get("company") ?? "").trim();
    const process = String(data.get("process") ?? "").trim();
    const message = `${t.message}\n\n${t.companyLine}: ${company}\n${t.areaLine}: ${data.get("area")}\n${t.processLine}: ${process}`;
    const url = `https://wa.me/34644583808?text=${encodeURIComponent(message)}`;
    setDraftUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className={styles.contactForm} onSubmit={requestAnalysis} onChange={() => setDraftUrl("")}>
      <h3>{t.title}</h3>
      <label htmlFor="company">{t.company}</label>
      <input id="company" name="company" autoComplete="organization" required maxLength={120} placeholder={t.companyPlaceholder} pattern=".*\S.*" />
      <label htmlFor="area">{t.area}</label>
      <select id="area" name="area" defaultValue={t.unknown} key={language}>
        <option>{t.unknown}</option>
        {t.areas.map(area => <option key={area}>{area}</option>)}
      </select>
      <label htmlFor="process">{t.process}</label>
      <textarea id="process" name="process" rows={3} required minLength={10} maxLength={1500} placeholder={t.processPlaceholder} aria-describedby="contact-help" />
      <p id="contact-help" className={styles.formHelp}>{t.help} <Link href="/politica-de-privacidad">{t.privacy}</Link>.</p>
      <button type="submit" className={styles.primary}>{t.submit}</button>
      {draftUrl && <p className={styles.formStatus} role="status">{t.status} <a href={draftUrl} target="_blank" rel="noopener noreferrer">{t.reopen}</a>.</p>}
    </form>
  );
}

export function CookieSettings({ language = "es" }: { language?: Language }) {
  return <button type="button" onClick={() => window.showCookieSettings?.()}>{formCopy[language].cookies}</button>;
}
