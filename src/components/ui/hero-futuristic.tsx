"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, CalendarCheck2, Check, MessageSquareText, ReceiptText } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import styles from "./hero-futuristic.module.css";
import robotImage from "../../../images/robot.png";

export function HeroFuturistic({ consulting = false }: { consulting?: boolean }) {
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
        <p className={styles.eyebrow}><span /> {consulting ? "Consultoría tecnológica, automatización e IA" : "Inteligencia artificial. Tiempo para ti."}</p>
        <h1 id="welcome-title" className={styles.title}><span>{consulting ? "Tu empresa," : "Tu negocio,"}</span><span>{consulting ? "funcionando mejor." : "en automático."}</span></h1>
        {consulting && <p className={styles.consultingLead}>Mejoramos tus procesos con automatización, IA y sistemas inteligentes.</p>}
      </div>
      <div className={styles.scene} ref={scene} aria-hidden="true">
        <div className={styles.halo} />
        <div className={styles.robot}>
          <Image src={robotImage} alt="" priority sizes="(max-width: 600px) 460px, (max-width: 1100px) 580px, 640px" className={styles.robotImage} />
        </div>
      </div>
      <div className={`${styles.task} ${styles.reservation}`}>
        <CalendarCheck2 className={styles.taskIcon} size={20} />
        <div><span>Tu agenda se organiza</span><strong>Reserva confirmada <Check size={13} /></strong></div>
      </div>
      <div className={`${styles.task} ${styles.message}`}>
        <MessageSquareText className={styles.taskIcon} size={20} />
        <div><span>Tus clientes reciben respuesta</span><strong>Incluso fuera de horario <Check size={13} /></strong></div>
      </div>
      <div className={`${styles.task} ${styles.invoice}`}>
        <ReceiptText className={styles.taskIcon} size={20} />
        <div><span>El trabajo repetitivo, resuelto</span><strong>Factura enviada <Check size={13} /></strong></div>
      </div>
      <div className={styles.bottom}>
        {consulting && <p className={styles.consultingDescription}>Primero entendemos cómo trabaja tu empresa.<br />Después conectamos procesos, personas y herramientas para ahorrar tiempo y mejorar la operación.</p>}
        <Link href={consulting ? "#diagnostico" : "/services-builder"} className={styles.cta}>{consulting ? "Analizar mi empresa" : "Quiero automatizar mi negocio"} <ArrowUpRight size={18} /></Link>
        <a href="#soluciones" className={styles.discover}>Descubre lo que podemos hacer <ArrowDown size={15} /></a>
      </div>
      <div className={styles.footnote}><span>Menos tareas. Más posibilidades.</span><span>Hecho para tu empresa, a tu medida.</span></div>
    </section>
  );
}
export default HeroFuturistic;
