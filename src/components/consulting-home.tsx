"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, ClipboardList, Database, Headphones, Layers3, Megaphone, Plus, Settings2, MessageCircle } from "lucide-react";
import DiagnosticContact, { CookieSettings } from "./diagnostic-contact";
import HeroFuturistic from "./ui/hero-futuristic";
import { ThemeSwitch, HomeTools } from "./home-controls";
import wordlogo from "../../images/wordlogo.png";
import styles from "./consulting-home.module.css";
import type { Language } from "@/lib/servicesConfig";
import { consultingHomeTranslations } from "@/lib/consultingHomeTranslations";

const areaIcons = [BriefcaseBusiness, ClipboardList, Settings2, Headphones, Megaphone, BarChart3, Database, Layers3];

export default function ConsultingHome() {
  const [language, setLanguage] = useState<Language>("es");
  const copy = consultingHomeTranslations[language];
  const whatsappMessage = { es: "Hola, quiero analizar los procesos de mi empresa.", en: "Hello, I'd like to analyse my company's processes.", ca: "Hola, vull analitzar els processos de la meva empresa.", it: "Ciao, vorrei analizzare i processi della mia azienda." }[language];
  return (
    <div className={styles.page}>
      <a href="#contenido" className={styles.skipLink}>{copy.skip}</a>
      <header className={`${styles.container} ${styles.header}`}>
        <Link href="/" className={styles.brand} aria-label={copy.brandLabel}>
          <Image src={wordlogo} alt="UNAiFLY" className={styles.wordLogo} sizes="(max-width: 520px) 130px, 180px" priority />
        </Link>
        <nav className={styles.nav} aria-label={copy.navLabel}>
          <a href="#metodo">{copy.nav[0]}</a>
          <a href="#soluciones">{copy.nav[1]}</a>
          <a href="#casos">{copy.nav[2]}</a>
        </nav>
        <div className={styles.headerActions}><ThemeSwitch language={language} /><a href="#diagnostico" className={styles.headerCta}>{copy.headerCta}</a></div>
      </header>

      <main id="contenido">
        <HeroFuturistic consulting language={language} />

        <section className={styles.positioning} aria-labelledby="positioning-title">
          <div className={`${styles.container} ${styles.positioningGrid}`}>
            <h2 id="positioning-title">{copy.positioning.title}</h2>
            <div><p>{copy.positioning.paragraphs[0]}</p><p>{copy.positioning.paragraphs[1]}</p><p className={styles.positioningEnd}>{copy.positioning.paragraphs[2]}</p></div>
          </div>
        </section>

        <section id="metodo" className={`${styles.container} ${styles.section}`} aria-labelledby="method-title">
          <div className={styles.sectionHeading}><h2 id="method-title">{copy.method.title}</h2><p>{copy.method.intro}</p></div>
          <ol className={styles.steps}>{copy.method.steps.map(([title, description], index) => <li key={title}><div className={styles.stepTop}><span>{String(index + 1).padStart(2, "0")}</span>{index < copy.method.steps.length - 1 && <ArrowRight size={20} aria-hidden="true" />}</div><h3>{title}</h3><p>{description}</p></li>)}</ol>
        </section>

        <section id="soluciones" className={`${styles.container} ${styles.section} ${styles.problems}`} aria-labelledby="problems-title">
          <div><h2 id="problems-title">{copy.problems.title}</h2><p className={styles.sectionIntro}>{copy.problems.intro}</p><a className={styles.textLink} href="#diagnostico">{copy.problems.link} <ArrowRight size={17} aria-hidden="true" /></a></div>
          <div className={styles.problemList}>{copy.problems.items.map(([problem, solution], index) => <details key={problem} open={index === 0}><summary>{problem}<Plus size={20} aria-hidden="true" /></summary><p>{solution}</p></details>)}</div>
        </section>

        <section id="areas" className={styles.areasSection} aria-labelledby="areas-title">
          <div className={`${styles.container} ${styles.section}`}>
            <div className={styles.sectionHeading}><h2 id="areas-title">{copy.areas.title}</h2><p>{copy.areas.intro}</p></div>
            <div className={styles.areas}>{copy.areas.items.map(([name, text], index) => { const Icon = areaIcons[index]; return <article key={name}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{name}</h3><p>{text}</p></article>; })}</div>
          </div>
        </section>

        <section id="casos" className={`${styles.container} ${styles.section}`} aria-labelledby="cases-title">
          <div className={styles.sectionHeading}><h2 id="cases-title">{copy.cases.title}</h2><p>{copy.cases.intro}</p></div>
          <div className={styles.cases}>{copy.cases.items.map(item => <article key={item.title} className={styles.case}><p className={styles.caseArea}>{item.area}</p><h3>{item.title}</h3><dl><dt>{copy.cases.situation}</dt><dd>{item.situation}</dd><dt>{copy.cases.solution}</dt><dd>{item.solution}</dd><div className={styles.caseResult}><dt>{copy.cases.result}</dt><dd>{item.result}</dd></div></dl></article>)}</div>
        </section>

        <section id="tecnologia" className={`${styles.container} ${styles.section} ${styles.technology}`} aria-labelledby="technology-title">
          <div><h2 id="technology-title">{copy.technology.title}</h2><p className={styles.sectionIntro}>{copy.technology.intro}</p></div>
          <div className={styles.techList}>{copy.technology.items.map(([name, text]) => <article key={name}><h3>{name}</h3><p>{text}</p></article>)}</div>
        </section>

        <section id="diagnostico" className={styles.diagnostic} aria-labelledby="diagnostic-title">
          <div className={styles.container}><div className={styles.contactInvitation}><h2>{copy.invitation.title}</h2><p>{copy.invitation.text}</p><div className={styles.contactActions}><a href={`https://wa.me/34644583808?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className={styles.whatsappCta}><MessageCircle size={19} aria-hidden="true" />{copy.invitation.whatsapp}</a><a href="https://calendly.com/frencia92/30min" target="_blank" rel="noopener noreferrer" className={styles.meetingCta}>{copy.invitation.meeting} <ArrowRight size={17} aria-hidden="true" /></a></div></div></div>
          <div className={`${styles.container} ${styles.diagnosticGrid}`} >
            <div><h2 id="diagnostic-title">{copy.diagnostic.title}</h2><p className={styles.lead}>{copy.diagnostic.lead}</p><p>{copy.diagnostic.text}</p><a href="https://calendly.com/frencia92/30min" target="_blank" rel="noopener noreferrer" className={styles.textLink}>{copy.diagnostic.link} <ArrowRight size={17} aria-hidden="true" /></a></div>
            <DiagnosticContact language={language} />
          </div>
        </section>
      </main>

      <footer className={`${styles.container} ${styles.footer}`}>
        <div className={styles.footerTop}><div><Link href="/" className={styles.brand}><Image src={wordlogo} alt="UNAiFLY" className={styles.wordLogo} sizes="180px" /></Link><p>{copy.footer.description.split("\n").map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</p></div><div><p>{copy.footer.location}</p><a href="mailto:info@unaifly.com">info@unaifly.com</a><a href="https://wa.me/34644583808" target="_blank" rel="noopener noreferrer">+34 644 58 38 08</a></div></div>
        <nav className={styles.footerServices} aria-label={copy.footer.servicesLabel}><Link href="/digitalizacion-empresas-barcelona">{copy.footer.services[0]}</Link><Link href="/inteligencia-artificial-empresas-barcelona">{copy.footer.services[1]}</Link><Link href="/desarrollo-web-barcelona">{copy.footer.services[2]}</Link></nav>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} UNAiFLY</span><nav aria-label={copy.footer.legalLabel}><Link href="/aviso-legal">{copy.footer.legal[0]}</Link><Link href="/politica-de-privacidad">{copy.footer.legal[1]}</Link><Link href="/terminos-y-condiciones">{copy.footer.legal[2]}</Link><Link href="/politica-de-cookies">{copy.footer.legal[3]}</Link><CookieSettings language={language} /></nav></div>
      </footer>
      <HomeTools onLanguageChange={setLanguage} />
    </div>
  );
}
