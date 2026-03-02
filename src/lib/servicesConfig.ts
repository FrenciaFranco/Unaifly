// --- TYPES ---
export type Language = "en" | "es" | "ca" | "it";
export type BillingType = "one_time" | "monthly";
export type ServiceTag = "popular" | "recommended" | "new";

export interface ServiceItem {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  billingType: BillingType;
  price: number;
  tags?: ServiceTag[];
}

export interface ServiceCategory {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  items: ServiceItem[];
  colorKey: string;
}

// --- CATEGORIES & ITEMS ---
export const serviceCategories: ServiceCategory[] = [
  {
    id: "web",
    colorKey: "sky",
    name: {
      en: "Web & Digital Presence",
      es: "Web y presencia digital",
      ca: "Web i presència digital",
      it: "Web e presenza digitale",
    },
    description: {
      en: "Website, sales page & online store",
      es: "Páginas web, tienda online y que te encuentren en Google (SEO)",
      ca: "Web, pàgina de vendes i botiga online",
      it: "Sito, pagina di vendita e negozio online",
    },
    items: [
      {
        id: "web-basic",
        billingType: "one_time",
        price: 290,
        tags: ["recommended"],
        name: {
          en: "One-page website",
          es: "Web de una página",
          ca: "Web d'una pàgina",
          it: "Sito di una pagina",
        },
        description: {
          en: "Simple site to present your business and get contacted",
          es: "Tu negocio visible en Google con dominio propio, diseño profesional y formulario de contacto",
          ca: "Web senzilla per presentar el teu negoci i que et contactin",
          it: "Sito semplice per presentare il tuo business e farti contattare",
        },
      },
      {
        id: "web-landing",
        billingType: "one_time",
        price: 490,
        tags: ["popular"],
        name: {
          en: "Sales page",
          es: "Página de ventas para que te encuentren en Google (SEO)",
          ca: "Pàgina de vendes",
          it: "Pagina di vendita",
        },
        description: {
          en: "Page designed to sell: with testimonials, common questions, form and clear contact buttons",
          es: "Página diseñada para que te encuentren en Google (SEO) y te contacten: testimonios, preguntas frecuentes, formulario y seguimiento de resultados",
          ca: "Pàgina pensada per vendre: amb testimonis, preguntes freqüents, formulari i botons clars perquè et contactin",
          it: "Pagina pensata per vendere: con testimonianze, domande frequenti, modulo e pulsanti di contatto chiari",
        },
      },
      {
        id: "web-multi",
        billingType: "one_time",
        price: 990,
        name: {
          en: "Multi-page website (up to 5)",
          es: "Web multipágina (hasta 5)",
          ca: "Web multipàgina (fins a 5)",
          it: "Sito multipagina (fino a 5)",
        },
        description: {
          en: "Full website with custom sections, ready to show up on Google and designed to look great on mobile",
          es: "Sitio completo con hasta 5 páginas, preparado para que te encuentren en Google en tu zona (SEO local) y adaptado a móvil",
          ca: "Web completa amb seccions a mida, preparada per aparèixer a Google i adaptada al mòbil",
          it: "Sito completo con sezioni su misura, pronto per apparire su Google e progettato per essere perfetto su mobile",
        },
      },
      {
        id: "web-ecommerce",
        billingType: "one_time",
        price: 1400,
        name: {
          en: "Simple online store",
          es: "Tienda online sencilla",
          ca: "Botiga online senzilla",
          it: "Negozio online semplice",
        },
        description: {
          en: "Shopify / WooCommerce store with small catalog, standard payments & shipping",
          es: "Tu tienda online lista para vender: catálogo de productos, cobro con tarjeta o Bizum y ficha de producto profesional",
          ca: "Botiga Shopify / WooCommerce amb catàleg petit, pagaments i enviaments estàndard",
          it: "Negozio Shopify / WooCommerce con catalogo piccolo, pagamenti e spedizioni standard",
        },
      },
    ],
  },
  {
    id: "bookings",
    colorKey: "emerald",
    name: {
      en: "Bookings & Appointments",
      es: "Reservas y citas",
      ca: "Reserves i cites",
      it: "Prenotazioni e appuntamenti",
    },
    description: {
      en: "Booking systems & reminders so you never lose a client",
      es: "Reservas online y recordatorios automáticos para llenar tu agenda",
      ca: "Sistemes de reserves i recordatoris perquè no faltin clients",
      it: "Sistemi di prenotazione e promemoria per non perdere clienti",
    },
    items: [
      {
        id: "booking-setup",
        billingType: "one_time",
        price: 200,
        tags: ["popular"],
        name: {
          en: "Full Booksy / Fresha setup",
          es: "Configuración completa de app de reservas (Booksy / Fresha)",
          ca: "Configuració completa Booksy / Fresha",
          it: "Configurazione completa Booksy / Fresha",
        },
        description: {
          en: "Booking system adapted to your business, integrated into your site",
          es: "Sistema de reservas adaptado a tu negocio, integrado en tu web",
          ca: "Sistema de reserves adaptat al teu negoci, integrat a la teva web",
          it: "Sistema di prenotazione adattato al tuo business, integrato nel sito",
        },
      },
      {
        id: "booking-calendly",
        billingType: "one_time",
        price: 150,
        name: {
          en: "Calendly-style agenda + forms",
          es: "Agenda de citas online (tipo Calendly) + formularios",
          ca: "Agenda tipus Calendly + formularis",
          it: "Agenda tipo Calendly + moduli",
        },
        description: {
          en: "Services, prices, hours, staff & pre-consultation forms",
          es: "Servicios, precios, horarios, personal y formularios previos a la cita",
          ca: "Serveis, preus, horaris, staff i formularis previs",
          it: "Servizi, prezzi, orari, staff e moduli preliminari",
        },
      },
      {
        id: "booking-reminders",
        billingType: "one_time",
        price: 150,
        name: {
          en: "Automated reminders (SMS / WhatsApp / email)",
          es: "Recordatorios automáticos (SMS / WhatsApp / email)",
          ca: "Recordatoris automàtics (SMS / WhatsApp / email)",
          it: "Promemoria automatici (SMS / WhatsApp / email)",
        },
        description: {
          en: "Automated reminders to reduce no-shows and keep your calendar full",
          es: "Recordatorios automáticos para reducir ausencias y llenar tu agenda",
          ca: "Recordatoris automàtics per reduir absències i omplir la teva agenda",
          it: "Promemoria automatici per ridurre le assenze e riempire la tua agenda",
        },
      },
      {
        id: "booking-deposits",
        billingType: "one_time",
        price: 130,
        name: {
          en: "Deposits / payment for appointments",
          es: "Depósitos / cobro por citas",
          ca: "Dipòsits / cobrament per cites",
          it: "Depositi / pagamento per appuntamenti",
        },
        description: {
          en: "Secure deposit collection so clients confirm with their wallet",
          es: "Cobro de señal para que el cliente confirme con su bolsillo",
          ca: "Cobrament de senyal perquè el client confirmi amb la butxaca",
          it: "Raccolta caparra per far confermare il cliente con il portafoglio",
        },
      },
    ],
  },
  {
    id: "whatsapp",
    colorKey: "green",
    name: {
      en: "WhatsApp & Communication",
      es: "WhatsApp y comunicación",
      ca: "WhatsApp i comunicació",
      it: "WhatsApp e comunicazione",
    },
    description: {
      en: "Respond, filter enquiries & capture potential clients 24/7",
      es: "Atiende, filtra y capta clientes potenciales por WhatsApp las 24 horas",
      ca: "Respon, filtra consultes i capta clients potencials 24/7",
      it: "Rispondi, filtra richieste e acquisisci potenziali clienti 24/7",
    },
    items: [
      {
        id: "wa-button",
        billingType: "one_time",
        price: 120,
        tags: ["recommended"],
        name: {
          en: "WhatsApp on your site (button + result tracking)",
          es: "Botón de WhatsApp en tu web (con seguimiento de resultados)",
          ca: "WhatsApp a la teva web (botó + seguiment de resultats)",
          it: "WhatsApp sul tuo sito (pulsante + monitoraggio risultati)",
        },
        description: {
          en: "Professional button with ready-to-send message and tracking of how many people write to you",
          es: "Botón visible en toda tu web con mensaje listo para enviar y datos de cuántos clientes te escriben",
          ca: "Botó professional amb missatge llest i seguiment de quants t'escriuen",
          it: "Pulsante professionale con messaggio pronto e monitoraggio di quanti ti scrivono",
        },
      },
      {
        id: "wa-basic-auto",
        billingType: "one_time",
        price: 200,
        name: {
          en: "Basic automation (menus + after hours)",
          es: "Respuestas automáticas (menús + fuera de horario)",
          ca: "Automatització bàsica (menús + fora d'horari)",
          it: "Automazione base (menu + fuori orario)",
        },
        description: {
          en: "Auto-replies for common questions, after-hours & simple menu (Book, Prices, Location)",
          es: "Respuestas automáticas a preguntas frecuentes, fuera de horario y menú simple (Reservar, Precios, Ubicación)",
          ca: "Respostes automàtiques a preguntes freqüents, fora d'horari i menú simple (Reservar, Preus, Ubicació)",
          it: "Risposte automatiche a domande frequenti, fuori orario e menu semplice (Prenota, Prezzi, Posizione)",
        },
      },
      {
        id: "wa-secretary",
        billingType: "one_time",
        price: 550,
        tags: ["popular"],
        name: {
          en: "WhatsApp Secretary (AI bot)",
          es: "Asistente virtual en WhatsApp (bot con IA)",
          ca: "Secretari WhatsApp (bot amb IA)",
          it: "Segretario WhatsApp (bot con IA)",
        },
        description: {
          en: "Answers common questions, filters enquiries & hands off to a person when needed",
          es: "Responde preguntas frecuentes, filtra consultas y pasa a una persona cuando hace falta",
          ca: "Respon preguntes freqüents, filtra consultes i passa a una persona quan cal",
          it: "Risponde alle domande frequenti, filtra le richieste e passa a una persona quando serve",
        },
      },
      {
        id: "wa-followup",
        billingType: "one_time",
        price: 150,
        name: {
          en: "Automated client follow-up",
          es: "Seguimiento automático de clientes",
          ca: "Seguiment automàtic de clients",
          it: "Follow-up automatico clienti",
        },
        description: {
          en: "Automatic reminder, booking link & review request after the visit",
          es: "Recordatorio automático, enlace de reserva y solicitud de reseña tras la visita",
          ca: "Recordatori automàtic, enllaç de reserva i sol·licitud de ressenya després de la visita",
          it: "Promemoria automatico, link prenotazione e richiesta recensione dopo la visita",
        },
      },
    ],
  },
  {
    id: "crm",
    colorKey: "amber",
    name: {
      en: "Contact & Client Management",
      es: "Gestión de contactos y clientes (CRM)",
      ca: "Gestió de contactes i clients",
      it: "Gestione contatti e clienti",
    },
    description: {
      en: "Organize your contacts & track what works every month",
      es: "Centraliza tus contactos, mide resultados y descubre de dónde vienen tus mejores clientes",
      ca: "Organitza els teus contactes i mesura què funciona cada mes",
      it: "Organizza i tuoi contatti e misura cosa funziona ogni mese",
    },
    items: [
      {
        id: "crm-integration",
        billingType: "one_time",
        price: 150,
        name: {
          en: "Contacts → Organized manager (Sheets / Notion)",
          es: "Todos tus contactos en un solo lugar (Sheets / Notion)",
          ca: "Contactes → Gestor organitzat (Sheets / Notion)",
          it: "Contatti → Gestore organizzato (Sheets / Notion)",
        },
        description: {
          en: "All your interested contacts from every channel in one organized place",
          es: "Todos tus contactos interesados de cada canal en un solo sitio organizado",
          ca: "Tots els teus contactes interessats de cada canal en un sol lloc organitzat",
          it: "Tutti i tuoi contatti interessati da ogni canale in un unico posto organizzato",
        },
      },
      {
        id: "crm-report",
        billingType: "monthly",
        price: 79,
        name: {
          en: "Monthly report + client tracking",
          es: "Informe mensual + seguimiento de contactos interesados",
          ca: "Informe mensual + seguiment de clients",
          it: "Report mensile + monitoraggio clienti",
        },
        description: {
          en: "Simple monthly report: where your clients come from, what works and what to improve",
          es: "Informe mensual simple: de dónde vienen tus clientes, qué funciona y qué mejorar",
          ca: "Informe mensual simple: d'on venen els teus clients, què funciona i què millorar",
          it: "Report mensile semplice: da dove arrivano i tuoi clienti, cosa funziona e cosa migliorare",
        },
      },
    ],
  },
  {
    id: "marketing",
    colorKey: "rose",
    name: {
      en: "Marketing & Advertising",
      es: "Marketing y publicidad",
      ca: "Màrqueting i publicitat",
      it: "Marketing e pubblicità",
    },
    description: {
      en: "Ads, social media content & online reputation",
      es: "Publicidad digital, gestión de redes sociales y reputación en Google",
      ca: "Anuncis, contingut per a xarxes i reputació online",
      it: "Annunci, contenuti social e reputazione online",
    },
    items: [
      {
        id: "mkt-ads",
        billingType: "one_time",
        price: 350,
        name: {
          en: "Meta / Google Ads campaign setup",
          es: "Campañas de anuncios en Instagram/Facebook y Google (Meta Ads / Google Ads)",
          ca: "Configuració campanyes Meta / Google Ads",
          it: "Configurazione campagne Meta / Google Ads",
        },
        description: {
          en: "First campaign ready to launch: designs, target audience & ad tracking",
          es: "Primera campaña lista para lanzar: diseños de anuncio, elegimos a quién le llega y medimos resultados",
          ca: "Primera campanya llesta per llançar: dissenys, públic objectiu, seguiment d'anuncis",
          it: "Prima campagna pronta al lancio: design, pubblico obiettivo, tracciamento annunci",
        },
      },
      {
        id: "mkt-social",
        billingType: "monthly",
        price: 250,
        tags: ["popular"],
        name: {
          en: "Social media content (12 posts/month)",
          es: "Contenido para redes sociales (12 publicaciones/mes)",
          ca: "Contingut per a xarxes socials (12 posts/mes)",
          it: "Contenuti per social (12 post/mese)",
        },
        description: {
          en: "12 designed posts per month with text, hashtags & publishing calendar",
          es: "12 publicaciones diseñadas al mes con textos y calendario de publicación",
          ca: "12 posts dissenyats al mes amb textos, hashtags i calendari de publicació",
          it: "12 post progettati al mese con testi, hashtag e calendario di pubblicazione",
        },
      },
      {
        id: "mkt-reputation",
        billingType: "one_time",
        price: 150,
        name: {
          en: "Google reviews setup (automated)",
          es: "Reseñas Google automatizadas (configuración)",
          ca: "Ressenyes Google automatitzades (configuració)",
          it: "Recensioni Google automatizzate (configurazione)",
        },
        description: {
          en: "Automated review request system after each visit or purchase",
          es: "Sistema automático de solicitud de reseñas tras cada visita o compra",
          ca: "Sistema automàtic de sol·licitud de ressenyes després de cada visita o compra",
          it: "Sistema automatico di richiesta recensioni dopo ogni visita o acquisto",
        },
      },
      {
        id: "mkt-newsletter",
        billingType: "monthly",
        price: 99,
        name: {
          en: "Monthly newsletter",
          es: "Boletín mensual por email (newsletter)",
          ca: "Newsletter mensual",
          it: "Newsletter mensile",
        },
        description: {
          en: "1 designed email per month with promotions, news & reminders",
          es: "1 email diseñado al mes con promociones, novedades y recordatorios",
          ca: "1 email dissenyat al mes amb promocions, novetats i recordatoris",
          it: "1 email progettata al mese con promozioni, novità e promemoria",
        },
      },
      {
        id: "mkt-gbp",
        billingType: "one_time",
        price: 150,
        tags: ["new"],
        name: {
          en: "Google Business Profile setup",
          es: "Tu ficha en Google Maps optimizada (Google Business)",
          ca: "Fitxa Google Business optimitzada",
          it: "Scheda Google Business ottimizzata",
        },
        description: {
          en: "Optimized profile: photos, hours, services, categories & first posts",
          es: "Perfil completo y optimizado: fotos, horarios, servicios, categorías y primeras publicaciones",
          ca: "Perfil optimitzat: fotos, horaris, serveis, categories i primeres publicacions",
          it: "Profilo ottimizzato: foto, orari, servizi, categorie e primi post",
        },
      },
    ],
  },
  {
    id: "design",
    colorKey: "violet",
    name: {
      en: "Design & Content",
      es: "Diseño y contenido",
      ca: "Disseny i contingut",
      it: "Design e contenuto",
    },
    description: {
      en: "Brand identity, professional texts & email",
      es: "Identidad visual profesional, textos que convierten y comunicación por email",
      ca: "Imatge de marca, textos per a la teva web i email",
      it: "Identità di marca, testi per il tuo sito ed email",
    },
    items: [
      {
        id: "design-branding",
        billingType: "one_time",
        price: 300,
        name: {
          en: "Logo + basic brand identity",
          es: "Logo + imagen de marca (branding)",
          ca: "Logo + imatge de marca bàsica",
          it: "Logo + identità di marca base",
        },
        description: {
          en: "Logo, color palette, typography & brand guidelines",
          es: "Logo, colores, tipografía y guía para mantener tu imagen coherente",
          ca: "Logo, paleta de colors, tipografia i guia de marca",
          it: "Logo, palette colori, tipografia e linee guida brand",
        },
      },
      {
        id: "design-copywriting",
        billingType: "one_time",
        price: 250,
        name: {
          en: "Professional website texts",
          es: "Textos profesionales para tu web (copywriting)",
          ca: "Textos professionals per a la teva web",
          it: "Testi professionali per il tuo sito",
        },
        description: {
          en: "All your website texts: headlines, services, about you — written to get visitors to contact you",
          es: "Todos los textos de tu web: titulares, servicios, sobre ti — escritos para que te contacten",
          ca: "Tots els textos de la teva web: titulars, serveis, sobre tu — escrits perquè et contactin",
          it: "Tutti i testi del tuo sito: titoli, servizi, chi sei — scritti per far sì che i visitatori ti contattino",
        },
      },
      {
        id: "design-email",
        billingType: "one_time",
        price: 150,
        name: {
          en: "Automated email setup",
          es: "Emails automáticos de bienvenida y recordatorios",
          ca: "Configuració d'emails automàtics",
          it: "Configurazione email automatiche",
        },
        description: {
          en: "Email templates, automated welcome messages & reminders",
          es: "Plantillas de email, envíos automáticos de bienvenida y recordatorios",
          ca: "Plantilles d'email, enviaments automàtics de benvinguda i recordatoris",
          it: "Template email, invii automatici di benvenuto e promemoria",
        },
      },
      {
        id: "design-social-kit",
        billingType: "one_time",
        price: 200,
        tags: ["new"],
        name: {
          en: "Social media template kit",
          es: "Plantillas editables para redes sociales (Canva)",
          ca: "Kit de plantilles per a xarxes socials",
          it: "Kit template per social",
        },
        description: {
          en: "Branded Canva templates for posts, stories & highlights",
          es: "Plantillas con tu marca para publicaciones, stories y destacados — tú solo cambias texto y foto",
          ca: "Plantilles Canva amb la teva marca per a posts, stories i destacats",
          it: "Template Canva brandizzati per post, stories e highlight",
        },
      },
    ],
  },
  {
    id: "maintenance",
    colorKey: "orange",
    name: {
      en: "Maintenance & Growth",
      es: "Mantenimiento y crecimiento",
      ca: "Manteniment i creixement",
      it: "Manutenzione e crescita",
    },
    description: {
      en: "Keep your site fast, secure & always improving",
      es: "Tu web siempre actualizada, segura y mejorando con datos reales cada mes",
      ca: "La teva web ràpida, segura i millorant cada mes",
      it: "Il tuo sito veloce, sicuro e in miglioramento ogni mese",
    },
    items: [
      {
        id: "maint-basic",
        billingType: "monthly",
        price: 69,
        tags: ["recommended"],
        name: {
          en: "Basic monthly maintenance (~2 h)",
          es: "Mantenimiento mensual (~2 h de mejoras)",
          ca: "Manteniment mensual (~2 h de millores)",
          it: "Manutenzione mensile (~2 h di migliorie)",
        },
        description: {
          en: "Small content changes, security updates & support via WhatsApp",
          es: "Pequeños cambios de contenido, actualizaciones de seguridad y soporte por WhatsApp",
          ca: "Petits canvis de contingut, actualitzacions de seguretat i suport per WhatsApp",
          it: "Piccole modifiche contenuto, aggiornamenti sicurezza e supporto via WhatsApp",
        },
      },
      {
        id: "maint-support",
        billingType: "monthly",
        price: 119,
        tags: ["popular"],
        name: {
          en: "Support + improvements (~4 h)",
          es: "Soporte + mejoras (~4 h)",
          ca: "Suport + millores (~4 h)",
          it: "Supporto + miglioramenti (~4 h)",
        },
        description: {
          en: "Improvements to get more clients, new sections, campaign tweaks & priority support",
          es: "Mejoras para conseguir más clientes, nuevas secciones, ajuste de campañas y soporte prioritario",
          ca: "Millores per aconseguir més clients, noves seccions, ajust de campanyes i suport prioritari",
          it: "Miglioramenti per ottenere più clienti, nuove sezioni, aggiustamenti campagne e supporto prioritario",
        },
      },
      {
        id: "maint-pro",
        billingType: "monthly",
        price: 199,
        name: {
          en: "PRO plan (~6 h + quarterly review)",
          es: "Plan PRO (~6 h + revisión trimestral)",
          ca: "Pla PRO (~6 h + revisió trimestral)",
          it: "Piano PRO (~6 h + revisione trimestrale)",
        },
        description: {
          en: "Dedicated improvement hours, quarterly growth review & priority improvement plan",
          es: "Horas dedicadas de mejora, revisión trimestral de crecimiento y plan de mejoras prioritario",
          ca: "Hores dedicades de millora, revisió trimestral de creixement i pla de millores prioritari",
          it: "Ore dedicate di miglioramento, revisione trimestrale crescita e piano di miglioramento prioritario",
        },
      },
    ],
  },
  {
    id: "ai",
    colorKey: "cyan",
    name: {
      en: "AI & Automation",
      es: "Inteligencia artificial (IA) y automatización",
      ca: "IA i automatització",
      it: "IA e automazione",
    },
    description: {
      en: "AI chatbots, workflow automations & smart integrations",
      es: "Asistentes virtuales (chatbots), automatización de tareas repetitivas y ahorro de tiempo real",
      ca: "Chatbots amb IA, automatitzacions i connexions intel·ligents",
      it: "Chatbot con IA, automazioni e integrazioni intelligenti",
    },
    items: [
      {
        id: "ai-chatbot-setup",
        billingType: "one_time",
        price: 590,
        tags: ["popular"],
        name: {
          en: "AI Chatbot (web + WhatsApp) — setup",
          es: "Asistente virtual con IA (chatbot) para web + WhatsApp",
          ca: "Chatbot IA (web + WhatsApp) — configuració",
          it: "Chatbot IA (web + WhatsApp) — configurazione",
        },
        description: {
          en: "Answers common questions, collects visitor info & hands off to a person. Web + WhatsApp",
          es: "Responde preguntas frecuentes, recoge datos del visitante y pasa a una persona. Web + WhatsApp",
          ca: "Respon preguntes freqüents, recull dades del visitant i passa a una persona. Web + WhatsApp",
          it: "Risponde alle domande frequenti, raccoglie i dati del visitatore e passa a una persona. Web + WhatsApp",
        },
      },
      {
        id: "ai-chatbot-monthly",
        billingType: "monthly",
        price: 69,
        name: {
          en: "AI Chatbot — monthly tuning",
          es: "Asistente virtual con IA — ajuste mensual",
          ca: "Chatbot IA — ajust mensual",
          it: "Chatbot IA — tuning mensile",
        },
        description: {
          en: "Monthly review: update answers, train new common questions & check performance",
          es: "Revisión mensual: actualizamos respuestas, añadimos nuevas preguntas frecuentes y verificamos que funcione bien",
          ca: "Revisió mensual: actualitzar respostes, entrenar noves preguntes freqüents i verificar rendiment",
          it: "Revisione mensile: aggiornare risposte, addestrare nuove domande frequenti e verifica rendimento",
        },
      },
      {
        id: "ai-automations",
        billingType: "one_time",
        price: 250,
        name: {
          en: "Workflow automation (1 main flow)",
          es: "Automatizar 1 tarea repetitiva de tu negocio",
          ca: "Automatització de processos (1 flux principal)",
          it: "Automazione di processi (1 flusso principale)",
        },
        description: {
          en: "We identify 1 repetitive task and automate it end-to-end (n8n / Make / Zapier)",
          es: "Identificamos 1 tarea que haces a mano y la dejamos funcionando sola con herramientas de automatización",
          ca: "Identifiquem 1 tasca repetitiva i la deixem automatitzada de punta a punta (n8n / Make / Zapier)",
          it: "Identifichiamo 1 attività ripetitiva e la automatizziamo end-to-end (n8n / Make / Zapier)",
        },
      },
      {
        id: "ai-audit",
        billingType: "one_time",
        price: 200,
        name: {
          en: "Digital business audit",
          es: "Diagnóstico digital de tu negocio",
          ca: "Auditoria digital del negoci",
          it: "Audit digitale del business",
        },
        description: {
          en: "We review your processes and recommend where AI and automation save you time",
          es: "Analizamos cómo trabajas hoy y te decimos dónde la tecnología te puede ahorrar tiempo y dinero",
          ca: "Revisem els teus processos i et diem on la IA i l'automatització t'estalvien temps",
          it: "Analizziamo i tuoi processi e ti consigliamo dove IA e automazione ti fanno risparmiare tempo",
        },
      },
    ],
  },
];

// --- RECOMMENDED STARTER PACK (legacy, kept for compat) ---
export const RECOMMENDED_STARTER_IDS: string[] = [
  "web-basic",
  "wa-button",
  "design-branding",
  "maint-basic",
];

// --- PRESET PLANS (additive tiers) ---
export interface PresetPlan {
  id: string;
  name: Record<Language, string>;
  description: Record<Language, string>;
  itemIds: string[];
  colorKey: "green" | "blue" | "purple" | "gold";
}

export const presetPlans: PresetPlan[] = [
  {
    id: "esencial",
    colorKey: "green",
    name: {
      en: "Essential",
      es: "Esencial",
      ca: "Essencial",
      it: "Essenziale",
    },
    description: {
      en: "Freelancer, new business, personal brand",
      es: "Autónomo, negocio nuevo, marca personal",
      ca: "Autònom, negoci nou, marca personal",
      it: "Freelancer, nuovo business, brand personale",
    },
    itemIds: [
      "web-basic",
      "wa-button",
      "design-branding",
      "maint-basic",
    ],
  },
  {
    id: "crecimiento",
    colorKey: "blue",
    name: {
      en: "Growth",
      es: "Crecimiento",
      ca: "Creixement",
      it: "Crescita",
    },
    description: {
      en: "Salon, clinic, local shop, small team",
      es: "Peluquería, clínica, tienda local, equipo pequeño",
      ca: "Perruqueria, clínica, botiga local, equip petit",
      it: "Salone, clinica, negozio locale, piccolo team",
    },
    itemIds: [
      "web-landing",
      "wa-button",
      "design-branding",
      "design-copywriting",
      "maint-basic",
      "booking-setup",
      "booking-reminders",
      "mkt-gbp",
    ],
  },
  {
    id: "profesional",
    colorKey: "purple",
    name: {
      en: "Professional",
      es: "Profesional",
      ca: "Professional",
      it: "Professionale",
    },
    description: {
      en: "Established business, consultancy, academy",
      es: "Negocio consolidado, consultoría, academia",
      ca: "Negoci consolidat, consultoria, acadèmia",
      it: "Business consolidato, consulenza, accademia",
    },
    itemIds: [
      "web-multi",
      "wa-basic-auto",
      "design-branding",
      "design-copywriting",
      "booking-setup",
      "booking-reminders",
      "booking-deposits",
      "crm-integration",
      "crm-report",
      "maint-support",
      "mkt-ads",
      "mkt-gbp",
    ],
  },
  {
    id: "integral",
    colorKey: "gold",
    name: {
      en: "Complete",
      es: "Integral",
      ca: "Integral",
      it: "Integrale",
    },
    description: {
      en: "Growing team, multiple services, active advertising",
      es: "Equipo creciente, varios servicios, publicidad activa",
      ca: "Equip creixent, diversos serveis, publicitat activa",
      it: "Team in crescita, servizi multipli, pubblicità attiva",
    },
    itemIds: [
      "web-multi",
      "wa-secretary",
      "wa-followup",
      "design-branding",
      "design-copywriting",
      "design-email",
      "design-social-kit",
      "booking-setup",
      "booking-reminders",
      "booking-deposits",
      "crm-integration",
      "crm-report",
      "maint-pro",
      "mkt-ads",
      "mkt-social",
      "mkt-reputation",
      "mkt-gbp",
      "ai-chatbot-setup",
      "ai-chatbot-monthly",
      "ai-automations",
    ],
  },
];

// --- COLOR STYLE MAP ---
export const categoryColorStyles: Record<
  string,
  { icon: string; bg: string; bgSoft: string; title: string; border: string }
> = {
  sky: { icon: "text-sky-400", bg: "bg-sky-500/15", bgSoft: "bg-sky-500/10", title: "text-sky-300", border: "border-sky-500/20" },
  emerald: { icon: "text-emerald-400", bg: "bg-emerald-500/15", bgSoft: "bg-emerald-500/10", title: "text-emerald-300", border: "border-emerald-500/20" },
  green: { icon: "text-green-400", bg: "bg-green-500/15", bgSoft: "bg-green-500/10", title: "text-green-300", border: "border-green-500/20" },
  amber: { icon: "text-amber-400", bg: "bg-amber-500/15", bgSoft: "bg-amber-500/10", title: "text-amber-300", border: "border-amber-500/20" },
  rose: { icon: "text-rose-400", bg: "bg-rose-500/15", bgSoft: "bg-rose-500/10", title: "text-rose-300", border: "border-rose-500/20" },
  violet: { icon: "text-violet-400", bg: "bg-violet-500/15", bgSoft: "bg-violet-500/10", title: "text-violet-300", border: "border-violet-500/20" },
  orange: { icon: "text-orange-400", bg: "bg-orange-500/15", bgSoft: "bg-orange-500/10", title: "text-orange-300", border: "border-orange-500/20" },
  cyan: { icon: "text-cyan-400", bg: "bg-cyan-500/15", bgSoft: "bg-cyan-500/10", title: "text-cyan-300", border: "border-cyan-500/20" },
};

// --- ICON KEY MAP (used to look up lucide icons in the component) ---
export const categoryIconKeys: Record<string, string> = {
  web: "Globe",
  bookings: "Calendar",
  whatsapp: "MessageCircle",
  crm: "Zap",
  marketing: "Megaphone",
  design: "Paintbrush",
  maintenance: "Wrench",
  ai: "Bot",
};
