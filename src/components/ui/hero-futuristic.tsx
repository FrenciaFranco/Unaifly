"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarCheck2, Check, MessageSquareText, ReceiptText } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import styles from "./hero-futuristic.module.css";
import robotImage from "../../../images/robot.png";
import type { Language } from "@/lib/servicesConfig";

export function HeroFuturistic({ consulting = false, language = "es" }: { consulting?: boolean; language?: Language }) {
  const text = {
    es: { eyebrow: "Consultoría tecnológica, automatización e IA", first: "Tu empresa,", second: "funcionando mejor.", lead: "Mejoramos tus procesos con automatización, IA y sistemas inteligentes.", task1a: "Tu agenda se organiza", task1b: "Reserva confirmada", task2a: "Tus clientes reciben respuesta", task2b: "Incluso fuera de horario", task3a: "El trabajo repetitivo, resuelto", task3b: "Factura enviada", description1: "Primero entendemos cómo trabaja tu empresa.", description2: "Después conectamos procesos, personas y herramientas para ahorrar tiempo y mejorar la operación.", cta: "Analizar mi empresa", discover: "Descubre lo que podemos hacer", foot1: "Menos tareas. Más posibilidades.", foot2: "Hecho para tu empresa, a tu medida." },
    en: { eyebrow: "Technology consulting, automation and AI", first: "Your business,", second: "working better.", lead: "We improve your processes with automation, AI and intelligent systems.", task1a: "Your schedule organises itself", task1b: "Booking confirmed", task2a: "Your customers get an answer", task2b: "Even outside business hours", task3a: "Repetitive work, handled", task3b: "Invoice sent", description1: "First we understand how your business works.", description2: "Then we connect processes, people and tools to save time and improve operations.", cta: "Analyse my business", discover: "Discover what we can do", foot1: "Fewer tasks. More possibilities.", foot2: "Built for your business, your way." },
    ca: { eyebrow: "Consultoria tecnològica, automatització i IA", first: "La teva empresa,", second: "funcionant millor.", lead: "Millorem els teus processos amb automatització, IA i sistemes intel·ligents.", task1a: "La teva agenda s'organitza", task1b: "Reserva confirmada", task2a: "Els teus clients reben resposta", task2b: "Fins i tot fora d'horari", task3a: "La feina repetitiva, resolta", task3b: "Factura enviada", description1: "Primer entenem com treballa la teva empresa.", description2: "Després connectem processos, persones i eines per estalviar temps i millorar l'operació.", cta: "Analitzar la meva empresa", discover: "Descobreix què podem fer", foot1: "Menys tasques. Més possibilitats.", foot2: "Fet per a la teva empresa, a la teva mida." },
    it: { eyebrow: "Consulenza tecnologica, automazione e IA", first: "La tua azienda,", second: "funziona meglio.", lead: "Miglioriamo i tuoi processi con automazione, IA e sistemi intelligenti.", task1a: "La tua agenda si organizza", task1b: "Prenotazione confermata", task2a: "I tuoi clienti ricevono risposta", task2b: "Anche fuori orario", task3a: "Il lavoro ripetitivo, risolto", task3b: "Fattura inviata", description1: "Prima capiamo come lavora la tua azienda.", description2: "Poi colleghiamo processi, persone e strumenti per risparmiare tempo e migliorare l'operatività.", cta: "Analizza la mia azienda", discover: "Scopri cosa possiamo fare", foot1: "Meno attività. Più possibilità.", foot2: "Fatto per la tua azienda, su misura." },
  }[language];
  const scene = useRef<HTMLDivElement>(null);
  function moveRobot(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    scene.current?.style.setProperty("--robot-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`);
    scene.current?.style.setProperty("--robot-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 6}px`);
  }
  function resetRobot() {
    scene.current?.style.setProperty("--robot-x", "0px");
    scene.current?.style.setProperty("--robot-y", "0px");
  }
  return (
    <section className={`${styles.hero} ${consulting ? styles.consulting : ""}`} aria-labelledby="welcome-title" onPointerMove={moveRobot} onPointerLeave={resetRobot}>
      {!consulting && <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="UNAiFLY, inicio">
          <Image src="/orb.png" alt="UNAiFLY" width={72} height={72} className={styles.brandOrb} priority />
        </Link>
        <nav aria-label="Navegación de bienvenida" className={styles.nav}>
          <a href="#soluciones">Qué podemos automatizar</a>
          <a href="https://wa.me/34644583808" target="_blank" rel="noopener noreferrer" className={styles.navCta}>Hablemos de tu negocio <ArrowUpRight size={16} /></a>
        </nav>
      </header>}
      <div className={styles.intro}>
        <p className={styles.eyebrow}><span /> {consulting ? text.eyebrow : "Inteligencia artificial. Tiempo para ti."}</p>
        <h1 id="welcome-title" className={styles.title}><span>{consulting ? text.first : "Tu negocio,"}</span><span>{consulting ? text.second : "en automático."}</span></h1>
        {consulting && <p className={styles.consultingLead}>{text.lead}</p>}
      </div>
      <div className={styles.scene} ref={scene} aria-hidden="true">
        <div className={styles.halo} />
        <div className={styles.robot}>
          <Image src={robotImage} alt="" priority sizes="(max-width: 600px) 460px, (max-width: 1100px) 580px, 640px" className={styles.robotImage} />
        </div>
      </div>
      <div className={`${styles.task} ${styles.reservation}`}>
        <CalendarCheck2 className={styles.taskIcon} size={20} />
        <div><span>{text.task1a}</span><strong>{text.task1b} <Check size={13} /></strong></div>
      </div>
      <div className={`${styles.task} ${styles.message}`}>
        <MessageSquareText className={styles.taskIcon} size={20} />
        <div><span>{text.task2a}</span><strong>{text.task2b} <Check size={13} /></strong></div>
      </div>
      <div className={`${styles.task} ${styles.invoice}`}>
        <ReceiptText className={styles.taskIcon} size={20} />
        <div><span>{text.task3a}</span><strong>{text.task3b} <Check size={13} /></strong></div>
      </div>
      <div className={styles.bottom}>
        {consulting && <p className={styles.consultingDescription}>{text.description1}<br />{text.description2}</p>}
        <Link href={consulting ? "#diagnostico" : "/services-builder"} className={styles.cta}>{consulting ? text.cta : "Quiero automatizar mi negocio"} <ArrowUpRight size={18} /></Link>
        <a href="#soluciones" className={styles.discover}>{text.discover} <ArrowDown size={15} /></a>
      </div>
      <div className={styles.footnote}><span>{text.foot1}</span><span>{text.foot2}</span></div>
    </section>
  );
}
export default HeroFuturistic;
