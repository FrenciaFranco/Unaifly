"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useTheme } from "next-themes"
import {
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  ChevronRight,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Linkedin,
  Github,
  Sparkles,
  Zap,
  Calculator,
  Code,
  LineChart,
  Bot,
  Phone,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AmbientBackground } from "@/components/ui/ambient-background"
import { ProjectCard } from "@/components/ui/project-card"
import { ChatBotPanel } from "@/components/ui/chatbot-bubble"
import { AIChatPanel } from "@/components/ui/ai-chat-panel"
import { getStorageItem, setStorageItem } from "@/lib/storage"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemFadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

type Language = "en" | "es" | "ca" | "it"

const translations: Record<
  Language,
  {
    nav: { about: string; skills: string; projects: string; experience: string; services: string; contact: string }
    header: { getInTouch: string; toggleMenu: string; closeMenu: string; languagePicker: string }
    theme: { lightMode: string; darkMode: string }
    hero: { badge: string; titleStart: string; titleAccent: string; titleEnd: string; description: string; seeProjects: string; learnMore: string }
    experience: { badge: string; title: string; description: string }
    skills: { title: string; description: string }
    projects: { title: string; description: string }
    servicesSection: {
      badge: string
      title: string
      description: string
      cardTitle: string
      cardDescription: string
      cta: string
      tags: string[]
    }
    about: { badge: string; title: string; paragraphOne: string; paragraphTwo: string; profileButton: string; certificationsTitle: string }
    testimonials: { badge: string; title: string; quote: string }
    contact: {
      badge: string
      title: string
      description: string
      location: string
      email: string
      sendEmail: string
      openChat: string
      formTitle: string
      formDescription: string
      firstName: string
      firstNamePlaceholder: string
      lastName: string
      lastNamePlaceholder: string
      emailPlaceholder: string
      message: string
      messagePlaceholder: string
      openDraft: string
    }
    footer: { tagline: string; basedIn: string }
  }
> = {
  en: {
    nav: { about: "About", skills: "Skills", projects: "Projects", experience: "Experience", services: "Services", contact: "Contact" },
    header: { getInTouch: "WhatsApp", toggleMenu: "Toggle menu", closeMenu: "Close menu", languagePicker: "Select language" },
    theme: { lightMode: "Light mode", darkMode: "Dark mode" },
    hero: {
      badge: "Accountant - AI Enthusiast - Builder",
      titleStart: "Numbers by day,",
      titleAccent: "AI experiments",
      titleEnd: "by night",
      description:
        "I'm Franco Frencia - a professional accountant at Bayer who enjoys applying AI as a hobby, building websites, apps, and exploring every use case I encounter along the way.",
      seeProjects: "See My Projects",
      learnMore: "Learn More About Me",
    },
    experience: {
      badge: "Career",
      title: "Professional Experience",
      description: "From Argentina to Spain - a journey in finance, accounting, and technology",
    },
    skills: {
      title: "What I Do",
      description: "Combining financial expertise with a passion for technology and AI",
    },
    projects: {
      title: "Side Projects and Experiments",
      description: "Things I build and explore in my free time - from AI tools to web apps",
    },
    servicesSection: {
      badge: "Freelance",
      title: "My Services",
      description: "Helping small businesses go from offline and messy to online, automated, and scalable",
      cardTitle: "Digital Transformation",
      cardDescription: "Websites, WhatsApp automation, booking integrations, client management (CRM), local Google visibility (local SEO), and more - everything you need to turn visitors into clients.",
      cta: "View packages & pricing",
      tags: ["Websites", "WhatsApp", "Booking", "Clients (CRM)", "Google (SEO)", "Visuals"],
    },
    about: {
      badge: "About Me",
      title: "My Story",
      paragraphOne:
        "I'm a Public Accountant (CPA) from Universidad Nacional del Nordeste in Argentina. After years of building my career in accounting across Argentina and Spain, I joined Bayer in Barcelona where I specialize in Financial Closing and Reporting at a global level.",
      paragraphTwo:
        "Outside of work, I'm deeply curious about artificial intelligence and technology. I spend my free time building websites, developing apps, and exploring how AI can be applied to solve real-world problems - from automating repetitive tasks to creating entirely new tools.",
      profileButton: "View Full Profile",
      certificationsTitle: "Education and Certifications",
    },
    testimonials: {
      badge: "Recommendation",
      title: "What Others Say",
      quote:
        "I have had the opportunity to work with Franco during the last year and a half. I would highlight his commitment, teamwork, and learning ability. His professional growth in the time we have worked together has been very positive. Without a doubt, a great professional.",
    },
    contact: {
      badge: "Contact",
      title: "Let's Connect",
      description: "Interested in collaborating, have a question about AI, or just want to say hi? I'd love to hear from you.",
      location: "Location",
      email: "Email",
      sendEmail: "Send me an email",
      openChat: "Open chat",
      formTitle: "Send Me an Email",
      formDescription: "Complete this form and your email app will open with the message ready for `frencia92@gmail.com`.",
      firstName: "First name",
      firstNamePlaceholder: "Your first name",
      lastName: "Last name",
      lastNamePlaceholder: "Your last name",
      emailPlaceholder: "Your email",
      message: "Message",
      messagePlaceholder: "Your message",
      openDraft: "Open Email Draft",
    },
    footer: {
      tagline: "Accountant by profession, AI enthusiast by passion. Building things, one experiment at a time.",
      basedIn: "Based in Barcelona, Spain",
    },
  },
  es: {
    nav: { about: "Sobre mi", skills: "Habilidades", projects: "Proyectos", experience: "Experiencia", services: "Servicios", contact: "Contacto" },
    header: { getInTouch: "WhatsApp", toggleMenu: "Abrir menu", closeMenu: "Cerrar menu", languagePicker: "Seleccionar idioma" },
    theme: { lightMode: "Modo claro", darkMode: "Modo oscuro" },
    hero: {
      badge: "Contador - Entusiasta de IA - Creador",
      titleStart: "Numeros de dia,",
      titleAccent: "experimentos con IA",
      titleEnd: "de noche",
      description:
        "Soy Franco Frencia, contador profesional en Bayer. En mi tiempo libre aplico IA en proyectos, creo sitios y apps, y exploro nuevos casos de uso.",
      seeProjects: "Ver mis proyectos",
      learnMore: "Conocer mas sobre mi",
    },
    experience: {
      badge: "Carrera",
      title: "Experiencia profesional",
      description: "De Argentina a Espana: un recorrido en finanzas, contabilidad y tecnologia",
    },
    skills: {
      title: "Lo que hago",
      description: "Combino experiencia financiera con pasion por la tecnologia y la IA",
    },
    projects: {
      title: "Proyectos y experimentos",
      description: "Cosas que construyo y exploro en mi tiempo libre, desde IA hasta apps web",
    },
    servicesSection: {
      badge: "Freelance",
      title: "Mis servicios",
      description: "Ayudo a pequenos negocios a pasar de lo offline y desordenado a lo online, automatizado y escalable",
      cardTitle: "Transformacion Digital",
      cardDescription: "Sitios web, automatizacion de WhatsApp, integraciones de reservas, gestion de clientes (CRM) y visibilidad en Google local (SEO local): todo lo que necesitas para convertir visitas en clientes.",
      cta: "Ver paquetes y precios",
      tags: ["Websites", "WhatsApp", "Reservas", "Clientes (CRM)", "Google (SEO)", "Visuales"],
    },
    about: {
      badge: "Sobre mi",
      title: "Mi historia",
      paragraphOne:
        "Soy Contador Publico de la Universidad Nacional del Nordeste en Argentina. Tras varios anos desarrollando mi carrera en Argentina y Espana, me uni a Bayer en Barcelona, donde me especializo en cierre y reporting financiero global.",
      paragraphTwo:
        "Fuera del trabajo, me apasiona la inteligencia artificial y la tecnologia. Dedico mi tiempo libre a crear sitios web, desarrollar apps y explorar como la IA puede resolver problemas reales.",
      profileButton: "Ver perfil completo",
      certificationsTitle: "Educacion y certificaciones",
    },
    testimonials: {
      badge: "Recomendacion",
      title: "Lo que dicen otros",
      quote:
        "He tenido la oportunidad de trabajar con Franco durante el ultimo ano y medio. Destaco su compromiso, trabajo en equipo y capacidad de aprendizaje. Su evolucion profesional ha sido muy positiva. Sin duda, un gran profesional.",
    },
    contact: {
      badge: "Contacto",
      title: "Conectemos",
      description: "Si quieres colaborar, tienes una pregunta sobre IA o simplemente saludar, me encantara leerte.",
      location: "Ubicacion",
      email: "Correo",
      sendEmail: "Enviame un correo",
      openChat: "Abrir chat",
      formTitle: "Enviarme un correo",
      formDescription: "Completa este formulario y se abrira tu app de correo con el mensaje listo para `frencia92@gmail.com`.",
      firstName: "Nombre",
      firstNamePlaceholder: "Tu nombre",
      lastName: "Apellido",
      lastNamePlaceholder: "Tu apellido",
      emailPlaceholder: "Tu correo",
      message: "Mensaje",
      messagePlaceholder: "Tu mensaje",
      openDraft: "Abrir borrador",
    },
    footer: {
      tagline: "Contador de profesion, entusiasta de IA por pasion. Construyendo cosas, experimento a experimento.",
      basedIn: "Vivo en Barcelona, Espana",
    },
  },
  ca: {
    nav: { about: "Sobre mi", skills: "Habilitats", projects: "Projectes", experience: "Experiencia", services: "Serveis", contact: "Contacte" },
    header: { getInTouch: "WhatsApp", toggleMenu: "Obre menu", closeMenu: "Tanca menu", languagePicker: "Selecciona idioma" },
    theme: { lightMode: "Mode clar", darkMode: "Mode fosc" },
    hero: {
      badge: "Comptable - Entusiasta d'IA - Creador",
      titleStart: "Numeros de dia,",
      titleAccent: "experiments amb IA",
      titleEnd: "de nit",
      description:
        "Soc Franco Frencia, comptable professional a Bayer. En el meu temps lliure aplico IA en projectes, creo webs i apps, i exploro nous casos d'us.",
      seeProjects: "Veure projectes",
      learnMore: "Coneixer mes sobre mi",
    },
    experience: {
      badge: "Carrera",
      title: "Experiencia professional",
      description: "D'Argentina a Espanya: un recorregut en finances, comptabilitat i tecnologia",
    },
    skills: {
      title: "Que faig",
      description: "Combino experiencia financera amb passio per la tecnologia i la IA",
    },
    projects: {
      title: "Projectes i experiments",
      description: "Coses que construeixo i exploro en el meu temps lliure, de la IA a les apps web",
    },
    servicesSection: {
      badge: "Freelance",
      title: "Els meus serveis",
      description: "Ajudo petits negocis a passar del caos offline a un sistema online, automatitzat i escalable",
      cardTitle: "Transformacio Digital",
      cardDescription: "Webs, automatitzacio de WhatsApp, integracions de reserves, gestio de contactes (CRM), visibilitat local a Google (SEO local) i mes: tot el que necessites per convertir visites en clients.",
      cta: "Veure paquets i preus",
      tags: ["Webs", "WhatsApp", "Reserves", "Contactes (CRM)", "Google (SEO)", "Visuals"],
    },
    about: {
      badge: "Sobre mi",
      title: "La meva historia",
      paragraphOne:
        "Soc Comptable Public per la Universidad Nacional del Nordeste a Argentina. Despres d'anys de carrera a Argentina i Espanya, em vaig unir a Bayer a Barcelona, on m'especialitzo en tancament i reporting financer global.",
      paragraphTwo:
        "Fora de la feina, tinc molta curiositat per la inteligencia artificial i la tecnologia. Dedico el meu temps lliure a crear webs, desenvolupar apps i explorar com la IA pot resoldre problemes reals.",
      profileButton: "Veure perfil complet",
      certificationsTitle: "Educacio i certificacions",
    },
    testimonials: {
      badge: "Recomanacio",
      title: "Que diuen els altres",
      quote:
        "He tingut l'oportunitat de treballar amb Franco durant l'ultim any i mig. Destaco el seu compromis, el treball en equip i la capacitat d'aprenentatge. La seva evolucio professional ha estat molt positiva. Sens dubte, un gran professional.",
    },
    contact: {
      badge: "Contacte",
      title: "Connectem",
      description: "Si vols col-laborar, tens una pregunta sobre IA o simplement saludar, m'encantara llegir-te.",
      location: "Ubicacio",
      email: "Correu",
      sendEmail: "Envia'm un correu",
      openChat: "Obrir xat",
      formTitle: "Envia'm un correu",
      formDescription: "Completa aquest formulari i s'obrira la teva app de correu amb el missatge llest per a `frencia92@gmail.com`.",
      firstName: "Nom",
      firstNamePlaceholder: "El teu nom",
      lastName: "Cognom",
      lastNamePlaceholder: "El teu cognom",
      emailPlaceholder: "El teu correu",
      message: "Missatge",
      messagePlaceholder: "El teu missatge",
      openDraft: "Obrir esborrany",
    },
    footer: {
      tagline: "Comptable de professio, entusiasta de la IA per passio. Construint coses, experiment a experiment.",
      basedIn: "Visc a Barcelona, Espanya",
    },
  },
  it: {
    nav: { about: "Chi sono", skills: "Competenze", projects: "Progetti", experience: "Esperienza", services: "Servizi", contact: "Contatto" },
    header: { getInTouch: "WhatsApp", toggleMenu: "Apri menu", closeMenu: "Chiudi menu", languagePicker: "Seleziona lingua" },
    theme: { lightMode: "Modalita chiara", darkMode: "Modalita scura" },
    hero: {
      badge: "Contabile - Appassionato di IA - Creatore",
      titleStart: "Numeri di giorno,",
      titleAccent: "esperimenti con IA",
      titleEnd: "di notte",
      description:
        "Sono Franco Frencia, contabile professionista in Bayer. Nel tempo libero applico l'IA in progetti, creo siti e app, ed esploro nuovi casi d'uso.",
      seeProjects: "Vedi i miei progetti",
      learnMore: "Scopri di piu su di me",
    },
    experience: {
      badge: "Carriera",
      title: "Esperienza professionale",
      description: "Dall'Argentina alla Spagna: un percorso in finanza, contabilita e tecnologia",
    },
    skills: {
      title: "Cosa faccio",
      description: "Unisco esperienza finanziaria e passione per tecnologia e IA",
    },
    projects: {
      title: "Progetti ed esperimenti",
      description: "Cose che costruisco ed esploro nel tempo libero, dagli strumenti IA alle web app",
    },
    servicesSection: {
      badge: "Freelance",
      title: "I miei servizi",
      description: "Aiuto le piccole imprese a passare da offline e disordine a online, automatizzato e scalabile",
      cardTitle: "Trasformazione Digitale",
      cardDescription: "Siti web, automazione WhatsApp, integrazioni prenotazioni, gestione contatti (CRM), visibilita locale su Google (SEO locale) e altro: tutto cio che serve per trasformare visitatori in clienti.",
      cta: "Vedi pacchetti e prezzi",
      tags: ["Siti Web", "WhatsApp", "Prenotazioni", "Contatti (CRM)", "Google (SEO)", "Visual"],
    },
    about: {
      badge: "Chi sono",
      title: "La mia storia",
      paragraphOne:
        "Sono un Commercialista (CPA) dell'Universidad Nacional del Nordeste in Argentina. Dopo anni di carriera tra Argentina e Spagna, sono entrato in Bayer a Barcellona, dove mi specializzo in chiusura e reporting finanziario globale.",
      paragraphTwo:
        "Fuori dal lavoro, sono molto curioso di intelligenza artificiale e tecnologia. Nel tempo libero creo siti web, sviluppo app ed esploro come l'IA possa risolvere problemi reali.",
      profileButton: "Vedi profilo completo",
      certificationsTitle: "Formazione e certificazioni",
    },
    testimonials: {
      badge: "Raccomandazione",
      title: "Cosa dicono gli altri",
      quote:
        "Ho avuto l'opportunita di lavorare con Franco nell'ultimo anno e mezzo. Evidenzio il suo impegno, il lavoro di squadra e la capacita di apprendere. La sua crescita professionale e stata molto positiva. Senza dubbio, un grande professionista.",
    },
    contact: {
      badge: "Contatto",
      title: "Restiamo in contatto",
      description: "Vuoi collaborare, hai una domanda sull'IA o vuoi solo salutare? Mi farebbe piacere sentirti.",
      location: "Posizione",
      email: "Email",
      sendEmail: "Mandami una email",
      openChat: "Apri chat",
      formTitle: "Mandami una email",
      formDescription: "Compila questo modulo e si aprira la tua app email con il messaggio pronto per `frencia92@gmail.com`.",
      firstName: "Nome",
      firstNamePlaceholder: "Il tuo nome",
      lastName: "Cognome",
      lastNamePlaceholder: "Il tuo cognome",
      emailPlaceholder: "La tua email",
      message: "Messaggio",
      messagePlaceholder: "Il tuo messaggio",
      openDraft: "Apri bozza email",
    },
    footer: {
      tagline: "Contabile di professione, appassionato di IA per passione. Costruisco cose, un esperimento alla volta.",
      basedIn: "Con base a Barcellona, Spagna",
    },
  },
}

const languageOptions: Array<{ code: Language; label: string; name: string }> = [
  { code: "es", label: "ES", name: "Castellano" },
  { code: "en", label: "EN", name: "English" },
  { code: "ca", label: "CA", name: "Català" },
  { code: "it", label: "IT", name: "Italiano" },
]

const localizedContent: Record<
  Language,
  {
    experiences: Array<{ company: string; role: string; period: string; location: string }>
    skills: Array<{ title: string; description: string }>
    projects: Array<{ title: string; description: string; linkText: string }>
    certifications: Array<{ title: string; detail: string; period: string }>
    testimonialRole: string
    locationText: string
    footerRights: string
    psmButton: string
    aboutImageAlt: string
  }
> = {
  en: {
    experiences: [
      { company: "Bayer", role: "FA Closing & Reporting - Global Expert", period: "2022 - Present", location: "Barcelona, Spain" },
      { company: "GMG Asociados", role: "Accountant", period: "2020 - 2021", location: "Madrid, Spain" },
      { company: "Registro Automotor", role: "Deputy Manager", period: "2017 - 2019", location: "Argentina" },
      { company: "ATP", role: "Administrative", period: "2015 - 2017", location: "Argentina" },
    ],
    skills: [
      {
        title: "Financial Closing & Reporting",
        description: "Expert in month-end and year-end closing processes, financial reporting, and compliance at a global scale with Bayer.",
      },
      {
        title: "AI & Automation",
        description: "Exploring AI use cases as a hobby - from building chatbots and automating workflows to experimenting with LLMs and generative AI.",
      },
      {
        title: "Web & App Development",
        description: "Building websites and applications as side projects, learning modern frameworks like Next.js, React, and more.",
      },
      {
        title: "Data & Analytics",
        description: "Proficient in Power BI, Excel, and data analysis - turning raw numbers into actionable business insights.",
      },
      {
        title: "Scrum & Agile",
        description: "Certified Professional Scrum Master (PSM I). Experienced in agile methodologies and team collaboration.",
      },
      {
        title: "ERP Systems",
        description: "Hands-on experience with ERP systems including ContaSol and APLIFISA for accounting and financial management.",
      },
    ],
    projects: [
      {
        title: "UNAiFLY.com",
        description: "Landing and product experience focused on AI tools and practical workflows.",
        linkText: "Visit Site",
      },
      {
        title: "El Oculto",
        description: "Creative web project deployed on Vercel with an immersive visual direction.",
        linkText: "Open Project",
      },
      {
        title: "Telegram Bots",
        description: "Automation bots for alerts, utilities and conversational experiences.",
        linkText: "View Bots",
      },
    ],
    certifications: [
      { title: "Public Accountant (CPA)", detail: "Universidad Nacional del Nordeste", period: "2011 - 2018" },
      { title: "PSM I", detail: "Scrum.org - Professional Scrum Master", period: "Dec 2023" },
      { title: "Power BI with Excel", detail: "LinkedIn Learning", period: "Oct 2022" },
      { title: "47 Certifications", detail: "LinkedIn Learning & Others", period: "Ongoing" },
    ],
    testimonialRole: "Executive Director - Franco's Mentor",
    locationText: "Barcelona, Catalonia, Spain",
    footerRights: "All rights reserved.",
    psmButton: "PSM I Certification",
    aboutImageAlt: "Working on laptop",
  },
  es: {
    experiences: [
      { company: "Bayer", role: "Cierre y Reporting Financiero - Especialista Global", period: "2022 - Presente", location: "Barcelona, Espana" },
      { company: "GMG Asociados", role: "Contador", period: "2020 - 2021", location: "Madrid, Espana" },
      { company: "Registro Automotor", role: "Subgerente", period: "2017 - 2019", location: "Argentina" },
      { company: "ATP", role: "Administrativo", period: "2015 - 2017", location: "Argentina" },
    ],
    skills: [
      {
        title: "Cierre y Reporting Financiero",
        description: "Experto en cierres mensuales y anuales, reporting financiero y cumplimiento a escala global en Bayer.",
      },
      {
        title: "IA y Automatizacion",
        description: "Exploro casos de uso de IA como hobby: desde chatbots y automatizacion de flujos hasta experimentos con LLMs e IA generativa.",
      },
      {
        title: "Desarrollo Web y Apps",
        description: "Construyo sitios web y aplicaciones como proyectos personales, aprendiendo frameworks modernos como Next.js y React.",
      },
      {
        title: "Datos y Analitica",
        description: "Experiencia en Power BI, Excel y analisis de datos para convertir numeros en insights accionables.",
      },
      {
        title: "Scrum y Agilidad",
        description: "Scrum Master Profesional certificado (PSM I), con experiencia en metodologias agiles y colaboracion en equipo.",
      },
      {
        title: "Sistemas ERP",
        description: "Experiencia practica con sistemas ERP como ContaSol y APLIFISA para gestion contable y financiera.",
      },
    ],
    projects: [
      {
        title: "UNAiFLY.com",
        description: "Landing y experiencia de producto centrada en herramientas de IA y flujos practicos.",
        linkText: "Visitar sitio",
      },
      {
        title: "El Oculto",
        description: "Proyecto web creativo desplegado en Vercel con una direccion visual inmersiva.",
        linkText: "Abrir proyecto",
      },
      {
        title: "Bots de Telegram",
        description: "Bots de automatizacion para alertas, utilidades y experiencias conversacionales.",
        linkText: "Ver bots",
      },
    ],
    certifications: [
      { title: "Contador Publico (CPA)", detail: "Universidad Nacional del Nordeste", period: "2011 - 2018" },
      { title: "PSM I", detail: "Scrum.org - Professional Scrum Master", period: "Dic 2023" },
      { title: "Power BI con Excel", detail: "LinkedIn Learning", period: "Oct 2022" },
      { title: "47 Certificaciones", detail: "LinkedIn Learning y otras", period: "En curso" },
    ],
    testimonialRole: "Director Ejecutivo - Mentor de Franco",
    locationText: "Barcelona, Cataluna, Espana",
    footerRights: "Todos los derechos reservados.",
    psmButton: "Certificacion PSM I",
    aboutImageAlt: "Trabajando en portatil",
  },
  ca: {
    experiences: [
      { company: "Bayer", role: "Tancament i Reporting Financer - Especialista Global", period: "2022 - Present", location: "Barcelona, Espanya" },
      { company: "GMG Asociados", role: "Comptable", period: "2020 - 2021", location: "Madrid, Espanya" },
      { company: "Registro Automotor", role: "Subgerent", period: "2017 - 2019", location: "Argentina" },
      { company: "ATP", role: "Administratiu", period: "2015 - 2017", location: "Argentina" },
    ],
    skills: [
      {
        title: "Tancament i Reporting Financer",
        description: "Expert en tancaments mensuals i anuals, reporting financer i compliment a escala global a Bayer.",
      },
      {
        title: "IA i Automatitzacio",
        description: "Exploro casos d'us d'IA com a hobby: des de chatbots i automatitzacio de fluxos fins a experiments amb LLMs i IA generativa.",
      },
      {
        title: "Desenvolupament Web i Apps",
        description: "Construeixo webs i aplicacions com a projectes personals, aprenent frameworks moderns com Next.js i React.",
      },
      {
        title: "Dades i Analitica",
        description: "Experiencia en Power BI, Excel i analisi de dades per convertir numeros en insights accionables.",
      },
      {
        title: "Scrum i Agile",
        description: "Professional Scrum Master certificat (PSM I), amb experiencia en metodologies agils i colaboracio en equip.",
      },
      {
        title: "Sistemes ERP",
        description: "Experiencia practica amb sistemes ERP com ContaSol i APLIFISA per a la gestio comptable i financera.",
      },
    ],
    projects: [
      {
        title: "UNAiFLY.com",
        description: "Landing i experiencia de producte centrada en eines d'IA i fluxos practics.",
        linkText: "Visitar lloc",
      },
      {
        title: "El Oculto",
        description: "Projecte web creatiu desplegat a Vercel amb una direccio visual immersiva.",
        linkText: "Obrir projecte",
      },
      {
        title: "Bots de Telegram",
        description: "Bots d'automatitzacio per a alertes, utilitats i experiencies conversacionals.",
        linkText: "Veure bots",
      },
    ],
    certifications: [
      { title: "Comptable Public (CPA)", detail: "Universidad Nacional del Nordeste", period: "2011 - 2018" },
      { title: "PSM I", detail: "Scrum.org - Professional Scrum Master", period: "Des 2023" },
      { title: "Power BI amb Excel", detail: "LinkedIn Learning", period: "Oct 2022" },
      { title: "47 Certificacions", detail: "LinkedIn Learning i altres", period: "En curs" },
    ],
    testimonialRole: "Director Executiu - Mentor de Franco",
    locationText: "Barcelona, Catalunya, Espanya",
    footerRights: "Tots els drets reservats.",
    psmButton: "Certificacio PSM I",
    aboutImageAlt: "Treballant amb portatil",
  },
  it: {
    experiences: [
      { company: "Bayer", role: "Chiusura e Reporting Finanziario - Esperto Globale", period: "2022 - Presente", location: "Barcellona, Spagna" },
      { company: "GMG Asociados", role: "Contabile", period: "2020 - 2021", location: "Madrid, Spagna" },
      { company: "Registro Automotor", role: "Vice Responsabile", period: "2017 - 2019", location: "Argentina" },
      { company: "ATP", role: "Amministrativo", period: "2015 - 2017", location: "Argentina" },
    ],
    skills: [
      {
        title: "Chiusura e Reporting Finanziario",
        description: "Esperto in chiusure mensili e annuali, reporting finanziario e compliance su scala globale in Bayer.",
      },
      {
        title: "IA e Automazione",
        description: "Esploro casi d'uso IA come hobby: da chatbot e automazione di workflow fino a esperimenti con LLM e IA generativa.",
      },
      {
        title: "Sviluppo Web e App",
        description: "Costruisco siti e applicazioni come progetti personali, imparando framework moderni come Next.js e React.",
      },
      {
        title: "Dati e Analytics",
        description: "Competenze in Power BI, Excel e analisi dati per trasformare numeri grezzi in insight utili al business.",
      },
      {
        title: "Scrum e Agile",
        description: "Professional Scrum Master certificato (PSM I), con esperienza in metodologie agili e collaborazione di team.",
      },
      {
        title: "Sistemi ERP",
        description: "Esperienza pratica con sistemi ERP come ContaSol e APLIFISA per la gestione contabile e finanziaria.",
      },
    ],
    projects: [
      {
        title: "UNAiFLY.com",
        description: "Landing ed esperienza prodotto focalizzate su strumenti IA e workflow pratici.",
        linkText: "Visita sito",
      },
      {
        title: "El Oculto",
        description: "Progetto web creativo distribuito su Vercel con una direzione visiva immersiva.",
        linkText: "Apri progetto",
      },
      {
        title: "Bot Telegram",
        description: "Bot di automazione per alert, utility ed esperienze conversazionali.",
        linkText: "Vedi bot",
      },
    ],
    certifications: [
      { title: "Commercialista (CPA)", detail: "Universidad Nacional del Nordeste", period: "2011 - 2018" },
      { title: "PSM I", detail: "Scrum.org - Professional Scrum Master", period: "Dic 2023" },
      { title: "Power BI con Excel", detail: "LinkedIn Learning", period: "Ott 2022" },
      { title: "47 Certificazioni", detail: "LinkedIn Learning e altre", period: "In corso" },
    ],
    testimonialRole: "Direttore Esecutivo - Mentor di Franco",
    locationText: "Barcellona, Catalogna, Spagna",
    footerRights: "Tutti i diritti riservati.",
    psmButton: "Certificazione PSM I",
    aboutImageAlt: "Lavorando al portatile",
  },
}

function FFMonogram() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary to-primary/80 shadow-sm">
      <span className="font-mono text-sm font-semibold tracking-[-0.08em] text-primary-foreground">FF</span>
    </div>
  )
}

function BlurText({ text, className, as: Tag = "span", delay = 0 }: { text: string; className?: string; as?: "h1" | "h2" | "h3" | "span"; delay?: number }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  const words = text.split(" ")

  return (
    <Tag ref={ref as React.RefObject<HTMLHeadingElement>} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={isInView ? { filter: "blur(0px)", opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}

export function DesignAgency() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme !== "light"
  const [language, setLanguage] = useState<Language>("es")
  const languageReadyRef = useRef(false)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const savedLanguage = getStorageItem("language") as Language | null
    if (savedLanguage && savedLanguage in translations) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguage(savedLanguage)
    }
    languageReadyRef.current = true
  }, [])

  useEffect(() => {
    if (!languageReadyRef.current) return
    document.documentElement.lang = language
    setStorageItem("language", language)
  }, [language])

  const t = translations[language]
  const localized = localizedContent[language]
  const navItems = [
    { id: "about", label: t.nav.about },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "experience", label: t.nav.experience },
    { id: "services", label: t.nav.services },
    { id: "contact", label: t.nav.contact },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const [langBubbleOpen, setLangBubbleOpen] = useState(false)
  const [chatbotOpen, setChatbotOpen] = useState(false)
  const [aiChatOpen, setAiChatOpen] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(false)
  const faqButtonRef = useRef<HTMLButtonElement>(null)
  const aiButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <AmbientBackground />
      <style>{`
        @keyframes float-dot {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.25; }
          50% { transform: translateY(-14px) translateX(8px); opacity: 0.7; }
        }
        @keyframes shimmer-bg {
          0%, 100% { opacity: 0.03; transform: translateX(0); }
          50% { opacity: 0.06; transform: translateX(30px); }
        }
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.12);
          position: relative;
          overflow: hidden;
          transition:
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
            border-color 280ms ease,
            box-shadow 280ms ease,
            background-color 280ms ease;
        }
        .glass-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 10px 28px rgba(0,0,0,0.14);
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[22%] h-2 w-2 rounded-full bg-primary/30 [animation:float-dot_5s_ease-in-out_infinite]" />
        <div className="absolute right-[15%] top-[34%] h-2 w-2 rounded-full bg-primary/20 [animation:float-dot_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] left-[18%] h-2 w-2 rounded-full bg-primary/25 [animation:float-dot_7s_ease-in-out_infinite]" />
      </div>
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isScrolled ? "shadow-md" : ""}`}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex"
              >
                <FFMonogram />
              </motion.div>
              <span className="font-bold text-xl">Franco Frencia</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link key={item.id} href={`#${item.id}`} className="text-sm font-medium transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-3xl"
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button size="sm" className="rounded-3xl bg-green-600 hover:bg-green-700 text-white" asChild>
              <Link href="https://wa.me/34644583808" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" />
                {t.header.getInTouch}
              </Link>
            </Button>
          </div>
          <button className="flex md:hidden" onClick={toggleMenu}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">{t.header.toggleMenu}</span>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center space-x-3">
                <FFMonogram />
                <span className="font-bold text-xl">Franco Frencia</span>
              </Link>
            </div>
            <button onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">{t.header.closeMenu}</span>
            </button>
          </div>
          <motion.nav
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto grid w-full max-w-[1280px] gap-3 px-4 pb-8 pt-6 sm:px-6 lg:px-8"
          >
            {navItems.map((item, index) => (
              <motion.div key={index} variants={itemFadeIn}>
                <Link
                  href={`#${item.id}`}
                  className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                  onClick={toggleMenu}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
            <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
              <Button
                variant="outline"
                className="w-full rounded-3xl"
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              >
                {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {isDarkMode ? t.theme.lightMode : t.theme.darkMode}
              </Button>
              <Button className="w-full rounded-3xl bg-green-600 hover:bg-green-700 text-white" asChild>
                <Link href="https://wa.me/34644583808" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" />
                  {t.header.getInTouch}
                </Link>
              </Button>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="w-full overflow-hidden px-3 py-8 sm:px-4 md:py-12 lg:px-6 lg:py-14">
          <div className="relative mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:gap-10 xl:grid-cols-[1fr_380px]">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative z-10 flex flex-col justify-center space-y-4 py-6 px-4"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center rounded-3xl bg-muted px-3 py-1 text-sm"
                  >
                    <Calculator className="mr-1 h-3 w-3" />
                    {t.hero.badge}
                  </motion.div>
                  <BlurText
                    as="h1"
                    text={`${t.hero.titleStart} ${t.hero.titleAccent} ${t.hero.titleEnd}`}
                    delay={0.2}
                    className="text-foreground text-4xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-5xl xl:text-6xl"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="max-w-[600px] text-muted-foreground md:text-xl"
                  >
                    {t.hero.description}
                  </motion.p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <Button size="lg" className="rounded-3xl group" asChild>
                    <Link href="#projects">
                      {t.hero.seeProjects}
                      <motion.span
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </motion.span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-3xl" asChild>
                    <Link href="#about">{t.hero.learnMore}</Link>
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10 flex items-center justify-center lg:justify-end"
              >
                <div className="relative w-full max-w-[320px] aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 bg-muted/20 shadow-lg">
                  <Image
                    src="/foto.jpeg"
                    alt="Franco Frencia"
                    fill
                    className="object-cover object-top"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Experience Highlights */}
        <section id="experience" className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  {t.experience.badge}
                </motion.div>
                <BlurText
                  as="h2"
                  text={t.experience.title}
                  delay={0.2}
                  className="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  {t.experience.description}
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid grid-cols-1 items-center gap-4 py-8 md:grid-cols-2 lg:grid-cols-4"
            >
              {localized.experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  variants={itemFadeIn}
                  className="flex flex-col items-center justify-center text-center"
                >
                  <div className="glass-card w-full rounded-3xl p-6">
                    <h3 className="font-bold text-lg">{exp.company}</h3>
                    <p className="text-sm text-primary mt-1">{exp.role}</p>
                    <p className="text-xs text-muted-foreground mt-2">{exp.period}</p>
                    <p className="text-xs text-muted-foreground">{exp.location}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  {t.nav.skills}
                </motion.div>
                <BlurText
                  as="h2"
                  text={t.skills.title}
                  delay={0.2}
                  className="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  {t.skills.description}
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto grid max-w-5xl items-center gap-4 py-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {[
                <Calculator key="calc" className="h-10 w-10 text-primary" />,
                <Bot key="bot" className="h-10 w-10 text-primary" />,
                <Code key="code" className="h-10 w-10 text-primary" />,
                <LineChart key="line" className="h-10 w-10 text-primary" />,
                <Zap key="zap" className="h-10 w-10 text-primary" />,
                <Sparkles key="spark" className="h-10 w-10 text-primary" />,
              ].map((icon, index) => {
                const service = localized.skills[index]
                return (
                <motion.div
                  key={index}
                  variants={itemFadeIn}
                  whileHover={{ y: -2, transition: { duration: 0.25, ease: "easeOut" } }}
                  className="glass-card group rounded-3xl p-6 shadow-sm"
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                  <div className="relative space-y-3">
                    <div className="mb-4">{icon}</div>
                    <h3 className="text-xl font-bold">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* Projects */}
        <section id="projects" className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  {t.nav.projects}
                </motion.div>
                <BlurText
                  as="h2"
                  text={t.projects.title}
                  delay={0.2}
                  className="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  {t.projects.description}
                </motion.p>
              </div>
            </div>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto max-w-7xl py-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={itemFadeIn}>
                  <ProjectCard
                    title={localized.projects[0].title}
                    description={localized.projects[0].description}
                    imgSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop"
                    link="https://unaifly.com"
                    linkText={localized.projects[0].linkText}
                  />
                </motion.div>
                <motion.div variants={itemFadeIn}>
                  <ProjectCard
                    title={localized.projects[1].title}
                    description={localized.projects[1].description}
                    imgSrc="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&h=800&fit=crop"
                    link="https://eloculto.vercel.app/"
                    linkText={localized.projects[1].linkText}
                  />
                </motion.div>
                <motion.div variants={itemFadeIn}>
                  <ProjectCard
                    title={localized.projects[2].title}
                    description={localized.projects[2].description}
                    imgSrc="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=800&fit=crop"
                    link="https://t.me/"
                    linkText={localized.projects[2].linkText}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4 p-6 md:p-8"
              >
                <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">{t.about.badge}</div>
                <BlurText
                  as="h2"
                  text={t.about.title}
                  className="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <p className="text-muted-foreground md:text-xl/relaxed">
                  {t.about.paragraphOne}
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  {t.about.paragraphTwo}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="outline" size="lg" className="rounded-3xl" asChild>
                    <Link href="https://www.linkedin.com/in/frencia/" target="_blank" rel="noopener noreferrer">
                      {t.about.profileButton}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-3xl" asChild>
                    <Link href="https://www.scrum.org/user/603767" target="_blank" rel="noopener noreferrer">
                      {localized.psmButton}
                    </Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center"
              >
                <div className="relative h-[300px] w-full md:h-[380px] lg:h-[430px] overflow-hidden rounded-3xl">
                  <Image
                    src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=800&fit=crop"
                    alt={localized.aboutImageAlt}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
            <div className="mt-10 px-6 pb-6">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold tracking-tighter sm:text-3xl"
              >
                {t.about.certificationsTitle}
              </motion.h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4"
              >
                {localized.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    variants={itemFadeIn}
                    whileHover={{ y: -2, transition: { duration: 0.25, ease: "easeOut" } }}
                    className="glass-card group rounded-3xl p-6"
                  >
                    <h4 className="font-bold">{cert.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{cert.detail}</p>
                    <p className="text-xs text-muted-foreground mt-2">{cert.period}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>
        {/* Services Section */}
        <section id="services" className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                >
                  {t.servicesSection.badge}
                </motion.div>
                <BlurText
                  as="h2"
                  text={t.servicesSection.title}
                  delay={0.2}
                  className="text-foreground text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                />
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                >
                  {t.servicesSection.description}
                </motion.p>
              </div>
            </div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mx-auto flex justify-center py-8"
            >
              <motion.div
                variants={itemFadeIn}
                whileHover={{ y: -2, transition: { duration: 0.25, ease: "easeOut" } }}
                className="glass-card group max-w-md w-full rounded-3xl p-8 shadow-sm"
              >
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300" />
                <div className="relative space-y-4 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">{t.servicesSection.cardTitle}</h3>
                  <p className="text-muted-foreground">
                    {t.servicesSection.cardDescription}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {t.servicesSection.tags.map((tag) => (
                      <span key={tag} className="rounded-3xl bg-muted px-3 py-1 text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button size="lg" className="rounded-3xl group/btn mt-4" asChild>
                    <Link href="/">
                      {t.servicesSection.cta}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="w-full px-3 py-8 sm:px-4 md:py-10 lg:px-6 lg:py-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto w-full max-w-[1280px] border border-muted rounded-3xl bg-background/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 p-6 md:p-8"
            >
              <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">{t.contact.badge}</div>
              <BlurText
                as="h2"
                text={t.contact.title}
                className="text-foreground text-3xl font-bold tracking-tighter md:text-4xl/tight"
              />
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {t.contact.description}
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <motion.div whileHover={{ y: -2 }} className="glass-card rounded-3xl p-5">
                  <div className="mb-4 inline-flex rounded-2xl bg-muted p-3">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">{t.contact.location}</h3>
                  <p className="mt-2 text-muted-foreground">{localized.locationText}</p>
                </motion.div>

                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=frencia92@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group rounded-3xl p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-muted p-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">{t.contact.email}</h3>
                  <p className="mt-2 text-muted-foreground">frencia92@gmail.com</p>
                  <div className="mt-4 flex items-center text-muted-foreground transition-colors group-hover:text-foreground">
                    <span className="text-sm font-medium">Connect</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://t.me/franncccooo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group rounded-3xl p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-muted p-3">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">Telegram</h3>
                  <p className="mt-2 text-muted-foreground">{t.contact.openChat}</p>
                  <div className="mt-4 flex items-center text-muted-foreground transition-colors group-hover:text-foreground">
                    <span className="text-sm font-medium">Connect</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://wa.me/34644583808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group rounded-3xl p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-muted p-3">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">WhatsApp</h3>
                  <p className="mt-2 text-muted-foreground">{t.contact.openChat}</p>
                  <div className="mt-4 flex items-center text-muted-foreground transition-colors group-hover:text-foreground">
                    <span className="text-sm font-medium">Connect</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://www.linkedin.com/in/frencia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group rounded-3xl p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-muted p-3">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">LinkedIn</h3>
                  <p className="mt-2 text-muted-foreground">Professional Network</p>
                  <div className="mt-4 flex items-center text-muted-foreground transition-colors group-hover:text-foreground">
                    <span className="text-sm font-medium">Connect</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.a>

                <motion.a
                  whileHover={{ y: -2 }}
                  href="https://github.com/frenciafranco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group rounded-3xl p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-muted p-3">
                    <Github className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold">GitHub</h3>
                  <p className="mt-2 text-muted-foreground">Code Repository</p>
                  <div className="mt-4 flex items-center text-muted-foreground transition-colors group-hover:text-foreground">
                    <span className="text-sm font-medium">Connect</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex"
              >
                <FFMonogram />
              </motion.div>
              <span className="font-bold text-xl">Franco Frencia</span>
            </Link>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {t.footer.tagline}
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "https://www.linkedin.com/in/frencia/" },
                { icon: <Github className="h-5 w-5" />, label: "GitHub", href: "https://github.com/frenciafranco" },
              ].map((social, index) => (
                <motion.div key={index} whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                    {social.icon}
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="border-t">
          <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-6 sm:px-6 md:h-16 md:flex-row md:py-0 lg:px-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Franco Frencia. {localized.footerRights}
            </p>
            <p className="text-xs text-muted-foreground">{t.footer.basedIn} 🇪🇸</p>
          </div>
        </div>
      </footer>

      {/* Floating Bubbles Toolbar */}
      <div className="fixed bottom-6 right-4 z-50 flex max-w-[calc(100vw-1.5rem)] items-center gap-2 overflow-x-auto rounded-full sm:right-6">
        <AnimatePresence>
          {!langBubbleOpen && !chatbotOpen && !aiChatOpen && !hintDismissed && (
            <motion.div
              key="tour-hint"
              initial={{ opacity: 0, y: 8, scale: 0.93 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.93 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              className="pointer-events-auto absolute bottom-full right-0 mb-2 max-w-[240px] overflow-hidden rounded-2xl border border-indigo-400/25 bg-gradient-to-br from-slate-900/92 via-indigo-950/80 to-slate-900/92 px-3 py-2.5 shadow-[0_8px_28px_-6px_rgba(99,102,241,0.42)] backdrop-blur-2xl"
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
                  onClick={() => setHintDismissed(true)}
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
        {/* Language */}
        <div className="relative h-12 w-12 shrink-0">
          <AnimatePresence>
            {langBubbleOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-full right-0 mb-2 flex flex-col gap-1 rounded-2xl border bg-background/90 backdrop-blur-md p-2 shadow-lg"
              >
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs transition-colors ${language === option.code ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground"}`}
                    onClick={() => {
                      setLanguage(option.code)
                      setLangBubbleOpen(false)
                    }}
                  >
                    <span className="font-mono font-bold w-6">{option.label}</span>
                    <span className="text-[11px] opacity-75">{option.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setLangBubbleOpen(!langBubbleOpen); setChatbotOpen(false) }}
            className="flex h-12 w-12 items-center justify-center rounded-full border bg-background/90 backdrop-blur-md shadow-lg transition-colors hover:bg-muted"
            aria-label={t.header.languagePicker}
          >
            <Globe className="h-5 w-5 text-primary" />
          </motion.button>
        </div>

        {/* FAQ Chatbot */}
        <div className="relative h-12 w-12 shrink-0">
          <motion.button
            ref={faqButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setChatbotOpen(!chatbotOpen); setLangBubbleOpen(false) }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-200/34 bg-gradient-to-br from-emerald-400/16 via-teal-400/10 to-cyan-500/14 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-emerald-100/55"
            aria-label="FAQ Chat"
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
            onClick={() => { setAiChatOpen(!aiChatOpen); setChatbotOpen(false); setLangBubbleOpen(false) }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-200/34 bg-gradient-to-br from-violet-400/16 via-purple-400/10 to-fuchsia-500/14 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-violet-100/55"
            aria-label="AI Chat"
            aria-expanded={aiChatOpen}
          >
            <Bot className="h-5 w-5 text-primary" />
          </motion.button>
        </div>
      </div>

      {/* Chatbot Panel */}
      <ChatBotPanel language={language} isOpen={chatbotOpen} onClose={() => setChatbotOpen(false)} triggerRef={faqButtonRef} useTriggerAnchor />

      {/* AI Chat Panel */}
      <AIChatPanel language={language} isOpen={aiChatOpen} onClose={() => setAiChatOpen(false)} triggerRef={aiButtonRef} useTriggerAnchor />
    </div>
  )
}


