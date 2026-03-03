import type { Language } from "@/lib/servicesConfig";

export interface ChatMessage {
  id: string;
  question: Record<Language, string>;
  answer: Record<Language, string>;
  keywords: string[];
  category: "services" | "pricing" | "process" | "company" | "support";
}

export const chatbotLabels: Record<
  Language,
  {
    title: string;
    subtitle: string;
    placeholder: string;
    suggestedQuestions: string;
    noResults: string;
    contactCta: string;
    close: string;
    poweredBy: string;
    backToQuestions: string;
  }
> = {
  es: {
    title: "¡Hola! 👋",
    subtitle: "¿En qué puedo ayudarte?",
    placeholder: "Escribe tu pregunta...",
    suggestedQuestions: "Preguntas frecuentes",
    noResults: "No encontré una respuesta exacta, pero puedo ayudarte por WhatsApp 💬",
    contactCta: "Hablar por WhatsApp",
    close: "Cerrar",
    poweredBy: "UNAiFLY",
    backToQuestions: "← Ver todas las preguntas",
  },
  en: {
    title: "Hey there! 👋",
    subtitle: "How can I help you?",
    placeholder: "Type your question...",
    suggestedQuestions: "Frequently asked questions",
    noResults: "I couldn't find an exact answer, but I can help you on WhatsApp 💬",
    contactCta: "Chat on WhatsApp",
    close: "Close",
    poweredBy: "UNAiFLY",
    backToQuestions: "← See all questions",
  },
  ca: {
    title: "Hola! 👋",
    subtitle: "En què et puc ajudar?",
    placeholder: "Escriu la teva pregunta...",
    suggestedQuestions: "Preguntes freqüents",
    noResults: "No he trobat una resposta exacta, però puc ajudar-te per WhatsApp 💬",
    contactCta: "Parlar per WhatsApp",
    close: "Tancar",
    poweredBy: "UNAiFLY",
    backToQuestions: "← Veure totes les preguntes",
  },
  it: {
    title: "Ciao! 👋",
    subtitle: "Come posso aiutarti?",
    placeholder: "Scrivi la tua domanda...",
    suggestedQuestions: "Domande frequenti",
    noResults: "Non ho trovato una risposta esatta, ma posso aiutarti su WhatsApp 💬",
    contactCta: "Chatta su WhatsApp",
    close: "Chiudi",
    poweredBy: "UNAiFLY",
    backToQuestions: "← Vedi tutte le domande",
  },
};

export const WHATSAPP_CHAT_URL = "https://wa.me/34644583808?text=";

export const chatbotMessages: ChatMessage[] = [
  {
    id: "services-overview",
    category: "services",
    keywords: ["services", "servicios", "serveis", "servizi", "offer", "what", "qué", "ofrecen", "hacen", "do"],
    question: {
      es: "¿Qué servicios ofrecen?",
      en: "What services do you offer?",
      ca: "Quins serveis oferiu?",
      it: "Quali servizi offrite?",
    },
    answer: {
      es: "¡Ofrecemos todo lo que un negocio necesita para crecer online! 🚀\n\n🌐 **Webs y tiendas online** — desde páginas sencillas hasta e-commerce\n📅 **Reservas y citas** — sistemas integrados con recordatorios automáticos\n💬 **WhatsApp inteligente** — botones, respuestas automáticas y bots con IA\n📊 **CRM y seguimiento** — organiza tus contactos y mide resultados\n📢 **Marketing digital** — Google Ads, Meta Ads, redes sociales\n🎨 **Diseño y branding** — logo, textos profesionales, kit para redes\n🤖 **IA y automatización** — chatbots, automatización de tareas\n🔧 **Mantenimiento** — tu web siempre actualizada y segura\n\n¿Te interesa algo en particular? ¡Cuéntame más sobre tu negocio!",
      en: "We offer everything a business needs to grow online! 🚀\n\n🌐 **Websites & online stores** — from simple pages to e-commerce\n📅 **Bookings & appointments** — integrated systems with auto-reminders\n💬 **Smart WhatsApp** — buttons, auto-replies, and AI bots\n📊 **CRM & tracking** — organize contacts and measure results\n📢 **Digital marketing** — Google Ads, Meta Ads, social media\n🎨 **Design & branding** — logo, professional copy, social media kit\n🤖 **AI & automation** — chatbots, workflow automation\n🔧 **Maintenance** — keep your site fast and secure\n\nInterested in something specific? Tell me about your business!",
      ca: "Oferim tot el que un negoci necessita per créixer online! 🚀\n\n🌐 **Webs i botigues online** — des de pàgines senzilles fins a e-commerce\n📅 **Reserves i cites** — sistemes integrats amb recordatoris automàtics\n💬 **WhatsApp intel·ligent** — botons, respostes automàtiques i bots amb IA\n📊 **CRM i seguiment** — organitza els teus contactes i mesura resultats\n📢 **Màrqueting digital** — Google Ads, Meta Ads, xarxes socials\n🎨 **Disseny i branding** — logo, textos professionals, kit per a xarxes\n🤖 **IA i automatització** — chatbots, automatització de tasques\n🔧 **Manteniment** — la teva web sempre actualitzada i segura\n\nT'interessa alguna cosa en particular? Explica'm més sobre el teu negoci!",
      it: "Offriamo tutto ciò che un business ha bisogno per crescere online! 🚀\n\n🌐 **Siti web e negozi online** — da pagine semplici all'e-commerce\n📅 **Prenotazioni e appuntamenti** — sistemi integrati con promemoria automatici\n💬 **WhatsApp intelligente** — pulsanti, risposte automatiche e bot con IA\n📊 **CRM e monitoraggio** — organizza i contatti e misura i risultati\n📢 **Marketing digitale** — Google Ads, Meta Ads, social media\n🎨 **Design e branding** — logo, testi professionali, kit per social\n🤖 **IA e automazione** — chatbot, automazione dei processi\n🔧 **Manutenzione** — il tuo sito sempre aggiornato e sicuro\n\nTi interessa qualcosa in particolare? Raccontami del tuo business!",
    },
  },
  {
    id: "website-cost",
    category: "pricing",
    keywords: ["website", "web", "cost", "price", "precio", "preu", "prezzo", "cuánto", "quanto", "how much", "página", "pàgina", "pagina", "site", "sito"],
    question: {
      es: "¿Cuánto cuesta una página web?",
      en: "How much does a website cost?",
      ca: "Quant costa una pàgina web?",
      it: "Quanto costa un sito web?",
    },
    answer: {
      es: "¡Tenemos opciones para todos los presupuestos! 💰\n\n• **Web de una página** — €290 → Perfecta para empezar: dominio propio, diseño profesional y formulario de contacto\n• **Página de ventas (SEO)** — €490 → Diseñada para que te encuentren en Google y te contacten. ¡Nuestra más popular!\n• **Web multipágina** — €990 → Hasta 5 secciones, SEO local, adaptada a móvil\n• **Tienda online** — €1.400 → Shopify/WooCommerce con catálogo, pagos y envíos\n\nTodas incluyen diseño responsive, optimización para móvil y soporte. Lo mejor es que puedes empezar con lo básico e ir creciendo. ¿Quieres que te ayude a elegir la mejor opción?",
      en: "We have options for every budget! 💰\n\n• **One-page site** — €290 → Perfect to start: own domain, professional design, contact form\n• **Sales page (SEO)** — €490 → Designed to rank on Google and get you clients. Our most popular!\n• **Multi-page site** — €990 → Up to 5 sections, local SEO, mobile-ready\n• **Online store** — €1,400 → Shopify/WooCommerce with catalog, payments & shipping\n\nAll include responsive design, mobile optimization, and support. The best part? You can start small and grow. Want help choosing the best option?",
      ca: "Tenim opcions per a tots els pressupostos! 💰\n\n• **Web d'una pàgina** — €290 → Perfecta per començar: domini propi, disseny professional i formulari\n• **Pàgina de vendes (SEO)** — €490 → Dissenyada perquè et trobin a Google. La nostra més popular!\n• **Web multipàgina** — €990 → Fins a 5 seccions, SEO local, adaptada a mòbil\n• **Botiga online** — €1.400 → Shopify/WooCommerce amb catàleg, pagaments i enviaments\n\nTotes inclouen disseny responsive i suport. Pots començar amb el bàsic i anar creixent. Vols que t'ajudi a triar?",
      it: "Abbiamo opzioni per ogni budget! 💰\n\n• **Sito una pagina** — €290 → Perfetto per iniziare: dominio proprio, design professionale, modulo contatto\n• **Pagina di vendita (SEO)** — €490 → Progettata per farti trovare su Google. La più popolare!\n• **Sito multipagina** — €990 → Fino a 5 sezioni, SEO locale, mobile-ready\n• **Negozio online** — €1.400 → Shopify/WooCommerce con catalogo, pagamenti e spedizioni\n\nTutti includono design responsive e supporto. Puoi iniziare in piccolo e crescere. Vuoi aiuto per scegliere?",
    },
  },
  {
    id: "online-store",
    category: "services",
    keywords: ["store", "tienda", "botiga", "negozio", "ecommerce", "e-commerce", "shopify", "woocommerce", "vender", "sell", "online", "shop"],
    question: {
      es: "¿Hacen tiendas online?",
      en: "Do you build online stores?",
      ca: "Feu botigues online?",
      it: "Create negozi online?",
    },
    answer: {
      es: "¡Por supuesto! 🛒 Creamos tiendas online profesionales con Shopify o WooCommerce por €1.400.\n\nIncluye:\n✅ Catálogo de productos con fichas profesionales\n✅ Pagos con tarjeta, Bizum y más\n✅ Gestión de envíos\n✅ Diseño adaptado a tu marca\n✅ Panel fácil para que gestiones tus productos\n\nEs la solución ideal si tienes productos físicos que quieres vender las 24 horas, incluso mientras duermes. 😴💰\n\n¿Tienes productos listos para vender? ¡Hablemos!",
      en: "Absolutely! 🛒 We create professional online stores with Shopify or WooCommerce for €1,400.\n\nIncludes:\n✅ Product catalog with professional listings\n✅ Card payments and more\n✅ Shipping management\n✅ Design matching your brand\n✅ Easy panel to manage your products\n\nPerfect if you have physical products to sell 24/7, even while you sleep. 😴💰\n\nGot products ready to sell? Let's talk!",
      ca: "És clar! 🛒 Creem botigues online professionals amb Shopify o WooCommerce per €1.400.\n\nInclou:\n✅ Catàleg de productes amb fitxes professionals\n✅ Pagaments amb targeta i més\n✅ Gestió d'enviaments\n✅ Disseny adaptat a la teva marca\n✅ Panell fàcil per gestionar els teus productes\n\nIdeal si tens productes físics per vendre les 24 hores. 😴💰\n\nTens productes llestos per vendre? Parlem!",
      it: "Certamente! 🛒 Creiamo negozi online professionali con Shopify o WooCommerce a €1.400.\n\nInclude:\n✅ Catalogo prodotti con schede professionali\n✅ Pagamenti con carta e altro\n✅ Gestione spedizioni\n✅ Design in linea con il tuo brand\n✅ Pannello facile per gestire i tuoi prodotti\n\nPerfetto se hai prodotti fisici da vendere 24/7. 😴💰\n\nHai prodotti pronti da vendere? Parliamone!",
    },
  },
  {
    id: "bookings",
    category: "services",
    keywords: ["booking", "reserva", "reserv", "prenotazion", "cita", "appointment", "appuntament", "calendar", "agenda", "booksy", "fresha", "calendly"],
    question: {
      es: "¿Cómo funciona el sistema de reservas?",
      en: "How does the booking system work?",
      ca: "Com funciona el sistema de reserves?",
      it: "Come funziona il sistema di prenotazioni?",
    },
    answer: {
      es: "¡Las reservas online son un game-changer! 📅\n\nOfrecemos varias soluciones:\n\n📱 **Booksy / Fresha** (€200) — Configuramos tu app de reservas completa, integrada en tu web\n📆 **Agenda tipo Calendly** (€150) — Tus clientes eligen día, hora y servicio online\n🔔 **Recordatorios automáticos** (€150) — SMS, WhatsApp o email para que no falte nadie\n💳 **Cobro de señal** (€130) — El cliente paga una señal al reservar, ¡adiós a los plantones!\n\nResultado: Tu agenda siempre llena, menos llamadas, cero plantones. Tus clientes reservan cuando quieren, incluso a las 3 de la mañana. 🌙\n\n¿Cuántas citas pierdes al mes por no tener reservas online?",
      en: "Online bookings are a game-changer! 📅\n\nWe offer several solutions:\n\n📱 **Booksy / Fresha** (€200) — Full booking app setup, integrated into your site\n📆 **Calendly-style agenda** (€150) — Clients pick day, time & service online\n🔔 **Auto-reminders** (€150) — SMS, WhatsApp or email so no one forgets\n💳 **Deposit collection** (€130) — Clients pay upfront, goodbye no-shows!\n\nResult: Full calendar, fewer calls, zero no-shows. Your clients book whenever they want, even at 3 AM. 🌙\n\nHow many appointments are you losing each month without online booking?",
      ca: "Les reserves online són un game-changer! 📅\n\nOferim diverses solucions:\n\n📱 **Booksy / Fresha** (€200) — Configurem la teva app de reserves completa\n📆 **Agenda tipus Calendly** (€150) — Els teus clients trien dia, hora i servei online\n🔔 **Recordatoris automàtics** (€150) — SMS, WhatsApp o email perquè no falti ningú\n💳 **Cobrament de senyal** (€130) — El client paga al reservar, adéu als plantades!\n\nResultat: Agenda plena, menys trucades, zero plantades. 🌙\n\nQuantes cites perds al mes sense reserves online?",
      it: "Le prenotazioni online sono un game-changer! 📅\n\nOffriamo diverse soluzioni:\n\n📱 **Booksy / Fresha** (€200) — Setup completo dell'app di prenotazione\n📆 **Agenda tipo Calendly** (€150) — I clienti scelgono giorno, ora e servizio online\n🔔 **Promemoria automatici** (€150) — SMS, WhatsApp o email per non dimenticare\n💳 **Raccolta caparra** (€130) — Il cliente paga subito, addio no-show!\n\nRisultato: Agenda piena, meno chiamate, zero no-show. 🌙\n\nQuanti appuntamenti perdi ogni mese senza prenotazioni online?",
    },
  },
  {
    id: "whatsapp",
    category: "services",
    keywords: ["whatsapp", "wa", "message", "mensaje", "missatge", "messaggio", "automation", "automatización", "bot", "secretary", "secretari", "comunicación"],
    question: {
      es: "¿Qué es la automatización de WhatsApp?",
      en: "What is WhatsApp automation?",
      ca: "Què és l'automatització de WhatsApp?",
      it: "Cos'è l'automazione WhatsApp?",
    },
    answer: {
      es: "¡Es como tener un empleado 24/7 que nunca duerme! 💬🤖\n\nNiveles de automatización:\n\n1️⃣ **Botón de WhatsApp** (€120) — Un botón en tu web con mensaje prellenado + datos de cuántos te escriben\n2️⃣ **Respuestas automáticas** (€200) — Menú tipo \"Pulsa 1 para reservar, 2 para precios...\" + respuestas fuera de horario\n3️⃣ **Asistente virtual con IA** (€550) — ¡El top! Un bot inteligente que responde preguntas, filtra consultas y pasa a una persona cuando hace falta\n4️⃣ **Seguimiento automático** (€150) — Después de la visita: recordatorio, enlace de reserva y solicitud de reseña\n\nImagina: un cliente te escribe a las 11 de la noche y recibe respuesta instantánea con tus precios y un link para reservar. ¡Sin que hagas nada! 🎯",
      en: "It's like having a 24/7 employee who never sleeps! 💬🤖\n\nAutomation levels:\n\n1️⃣ **WhatsApp button** (€120) — A button on your site with pre-filled message + tracking\n2️⃣ **Auto-replies** (€200) — Menu like \"Press 1 to book, 2 for prices...\" + after-hours replies\n3️⃣ **AI Virtual Assistant** (€550) — The top tier! Smart bot that answers FAQs, filters inquiries & hands off to a human\n4️⃣ **Auto follow-up** (€150) — After the visit: reminder, booking link & review request\n\nImagine: a client messages you at 11 PM and instantly gets your prices and a booking link. Without you lifting a finger! 🎯",
      ca: "És com tenir un empleat 24/7 que mai dorm! 💬🤖\n\nNivells d'automatització:\n\n1️⃣ **Botó de WhatsApp** (€120) — Un botó a la teva web amb missatge preomplert + seguiment\n2️⃣ **Respostes automàtiques** (€200) — Menú tipus \"Prem 1 per reservar, 2 per preus...\" + fora d'horari\n3️⃣ **Assistent virtual amb IA** (€550) — El top! Bot intel·ligent que respon preguntes i filtra consultes\n4️⃣ **Seguiment automàtic** (€150) — Després de la visita: recordatori, enllaç de reserva i ressenya\n\nImagina: un client t'escriu a les 11 de la nit i rep resposta instantània. Sense que facis res! 🎯",
      it: "È come avere un dipendente 24/7 che non dorme mai! 💬🤖\n\nLivelli di automazione:\n\n1️⃣ **Pulsante WhatsApp** (€120) — Un pulsante sul sito con messaggio precompilato + tracciamento\n2️⃣ **Risposte automatiche** (€200) — Menu tipo \"Premi 1 per prenotare, 2 per prezzi...\" + fuori orario\n3️⃣ **Assistente virtuale IA** (€550) — Il top! Bot intelligente che risponde alle FAQ e filtra le richieste\n4️⃣ **Follow-up automatico** (€150) — Dopo la visita: promemoria, link prenotazione e recensione\n\nImmagina: un cliente ti scrive alle 23 e riceve risposta istantanea. Senza muovere un dito! 🎯",
    },
  },
  {
    id: "social-media",
    category: "services",
    keywords: ["social", "media", "redes", "xarxes", "instagram", "facebook", "post", "content", "contenido", "contingut", "contenuto", "marketing"],
    question: {
      es: "¿Gestionan redes sociales?",
      en: "Do you manage social media?",
      ca: "Gestioneu xarxes socials?",
      it: "Gestite i social media?",
    },
    answer: {
      es: "¡Sí! Te quitamos ese peso de encima 📱✨\n\n📸 **12 publicaciones/mes** (€250/mes) — Diseños profesionales con textos, hashtags y calendario de publicación\n🎨 **Kit de plantillas** (€200, pago único) — Plantillas Canva con tu marca para que publiques tú mismo cuando quieras\n📧 **Newsletter mensual** (€99/mes) — Un email profesional al mes con promociones y novedades\n📢 **Campañas de anuncios** (€350) — Google Ads o Meta Ads listos para atraer clientes\n\nLa clave está en ser constante y profesional. Nosotros nos encargamos del contenido para que tú te centres en lo que mejor sabes hacer: atender a tus clientes. 💪",
      en: "Yes! We take that weight off your shoulders 📱✨\n\n📸 **12 posts/month** (€250/mo) — Professional designs with copy, hashtags & publishing calendar\n🎨 **Template kit** (€200, one-time) — Branded Canva templates so you can post anytime\n📧 **Monthly newsletter** (€99/mo) — One professional email per month with promos & news\n📢 **Ad campaigns** (€350) — Google Ads or Meta Ads ready to attract clients\n\nThe key is being consistent and professional. We handle the content so you can focus on what you do best: serving your clients. 💪",
      ca: "Sí! Et trèiem aquest pes de sobre 📱✨\n\n📸 **12 publicacions/mes** (€250/mes) — Dissenys professionals amb textos i calendari\n🎨 **Kit de plantilles** (€200, pagament únic) — Plantilles Canva amb la teva marca\n📧 **Newsletter mensual** (€99/mes) — Un email professional al mes\n📢 **Campanyes d'anuncis** (€350) — Google Ads o Meta Ads llestos per atraure clients\n\nNosaltres ens encarreguem del contingut perquè tu et centris en atendre els teus clients. 💪",
      it: "Sì! Ti togliamo quel peso dalle spalle 📱✨\n\n📸 **12 post/mese** (€250/mese) — Design professionali con testi e calendario\n🎨 **Kit template** (€200, una tantum) — Template Canva brandizzati per pubblicare quando vuoi\n📧 **Newsletter mensile** (€99/mese) — Un'email professionale al mese con promo e novità\n📢 **Campagne pubblicitarie** (€350) — Google Ads o Meta Ads pronti ad attirare clienti\n\nNoi ci occupiamo dei contenuti, tu ti concentri sui tuoi clienti. 💪",
    },
  },
  {
    id: "ai-chatbot",
    category: "services",
    keywords: ["ai", "ia", "chatbot", "bot", "artificial", "intelligence", "inteligencia", "intel·ligència", "intelligenza", "automation", "automatización"],
    question: {
      es: "¿Qué es el servicio de chatbot con IA?",
      en: "What is the AI chatbot service?",
      ca: "Què és el servei de chatbot amb IA?",
      it: "Cos'è il servizio chatbot con IA?",
    },
    answer: {
      es: "¡Es tu asistente virtual que trabaja 24/7! 🤖💡\n\n**Configuración** (€590, pago único):\n✅ Chatbot inteligente en tu web + WhatsApp\n✅ Responde preguntas frecuentes automáticamente\n✅ Recoge datos del visitante (nombre, email, qué necesita)\n✅ Pasa a una persona cuando la consulta lo requiere\n\n**Ajuste mensual** (€69/mes):\n✅ Actualizamos respuestas según nuevas preguntas\n✅ Entrenamos el bot con las dudas reales de tus clientes\n✅ Verificamos que funcione perfecto\n\nEs como tener un recepcionista que nunca descansa, no se enferma y atiende a 100 personas a la vez. ¿Cuántos clientes pierdes por no responder a tiempo? 🎯",
      en: "It's your virtual assistant that works 24/7! 🤖💡\n\n**Setup** (€590, one-time):\n✅ Smart chatbot on your website + WhatsApp\n✅ Answers FAQs automatically\n✅ Collects visitor data (name, email, needs)\n✅ Hands off to a human when needed\n\n**Monthly tuning** (€69/mo):\n✅ Updated answers based on new questions\n✅ Bot trained on real customer queries\n✅ Performance verification\n\nIt's like having a receptionist who never rests, never calls in sick, and handles 100 people at once. How many clients are you losing by not responding in time? 🎯",
      ca: "És el teu assistent virtual que treballa 24/7! 🤖💡\n\n**Configuració** (€590, pagament únic):\n✅ Chatbot intel·ligent a la teva web + WhatsApp\n✅ Respon preguntes freqüents automàticament\n✅ Recull dades del visitant\n✅ Passa a una persona quan cal\n\n**Ajust mensual** (€69/mes):\n✅ Actualitzem respostes segons noves preguntes\n✅ Entrenem el bot amb dubtes reals\n✅ Verifiquem que funcioni perfecte\n\nÉs com tenir un recepcionista que mai descansa i atén 100 persones a la vegada. 🎯",
      it: "È il tuo assistente virtuale che lavora 24/7! 🤖💡\n\n**Configurazione** (€590, una tantum):\n✅ Chatbot intelligente sul tuo sito + WhatsApp\n✅ Risponde alle FAQ automaticamente\n✅ Raccoglie dati del visitatore\n✅ Passa a una persona quando serve\n\n**Tuning mensile** (€69/mese):\n✅ Risposte aggiornate in base alle nuove domande\n✅ Bot addestrato sulle domande reali dei clienti\n✅ Verifica delle performance\n\nÈ come avere un receptionist che non riposa mai e gestisce 100 persone contemporaneamente. 🎯",
    },
  },
  {
    id: "timeline",
    category: "process",
    keywords: ["time", "tiempo", "temps", "tempo", "long", "cuánto", "quanto", "tarda", "deadline", "plazo", "deliver", "entrega"],
    question: {
      es: "¿Cuánto tiempo tarda un proyecto?",
      en: "How long does a project take?",
      ca: "Quant temps triga un projecte?",
      it: "Quanto tempo ci vuole per un progetto?",
    },
    answer: {
      es: "¡Depende del proyecto, pero somos rápidos! ⚡\n\n• **Web de una página** → 5-7 días\n• **Página de ventas (SEO)** → 7-10 días\n• **Web multipágina** → 2-3 semanas\n• **Tienda online** → 2-4 semanas\n• **Sistema de reservas** → 3-5 días\n• **WhatsApp automation** → 2-5 días\n• **Chatbot con IA** → 1-2 semanas\n\nNos adaptamos a tu urgencia. Lo importante es empezar: cada día sin presencia online es un día que tus competidores te sacan ventaja. 📈\n\n¿Tienes una fecha límite? ¡Cuéntame y lo organizamos!",
      en: "It depends on the project, but we're fast! ⚡\n\n• **One-page site** → 5-7 days\n• **Sales page (SEO)** → 7-10 days\n• **Multi-page site** → 2-3 weeks\n• **Online store** → 2-4 weeks\n• **Booking system** → 3-5 days\n• **WhatsApp automation** → 2-5 days\n• **AI Chatbot** → 1-2 weeks\n\nWe adapt to your urgency. The important thing is to start: every day without an online presence is a day your competitors get ahead. 📈\n\nGot a deadline? Tell me and we'll make it work!",
      ca: "Depèn del projecte, però som ràpids! ⚡\n\n• **Web d'una pàgina** → 5-7 dies\n• **Pàgina de vendes** → 7-10 dies\n• **Web multipàgina** → 2-3 setmanes\n• **Botiga online** → 2-4 setmanes\n• **Sistema de reserves** → 3-5 dies\n• **WhatsApp automation** → 2-5 dies\n• **Chatbot amb IA** → 1-2 setmanes\n\nCada dia sense presència online és un dia que la competència et guanya. 📈\n\nTens una data límit? Explica'm!",
      it: "Dipende dal progetto, ma siamo veloci! ⚡\n\n• **Sito una pagina** → 5-7 giorni\n• **Pagina di vendita** → 7-10 giorni\n• **Sito multipagina** → 2-3 settimane\n• **Negozio online** → 2-4 settimane\n• **Sistema prenotazioni** → 3-5 giorni\n• **WhatsApp automation** → 2-5 giorni\n• **Chatbot IA** → 1-2 settimane\n\nOgni giorno senza presenza online è un giorno in cui i concorrenti ti superano. 📈\n\nHai una scadenza? Parliamone!",
    },
  },
  {
    id: "get-started",
    category: "process",
    keywords: ["start", "empezar", "començar", "iniziare", "process", "proceso", "procés", "processo", "how", "cómo", "com", "come", "step", "paso"],
    question: {
      es: "¿Cómo empiezo?",
      en: "How do I get started?",
      ca: "Com començo?",
      it: "Come inizio?",
    },
    answer: {
      es: "¡Empezar es súper fácil! Solo 3 pasos: 🚀\n\n**1️⃣ Nos escribes** → Por WhatsApp o el formulario web. Sin compromiso.\n**2️⃣ Charlamos 15 min** → Entendemos tu negocio, qué necesitas y te proponemos la mejor solución. Gratis.\n**3️⃣ ¡Empezamos!** → En pocos días ya tienes resultados visibles.\n\nNo necesitas saber de tecnología. Nosotros nos encargamos de TODO: diseño, textos, configuración, dominio... Tú solo nos cuentas qué hace tu negocio y nosotros lo hacemos brillar online. ✨\n\n¿Listo para dar el salto? ¡Escríbenos por WhatsApp!",
      en: "Getting started is super easy! Just 3 steps: 🚀\n\n**1️⃣ Message us** → Via WhatsApp or our web form. No commitment.\n**2️⃣ 15-min chat** → We understand your business, your needs, and propose the best solution. Free.\n**3️⃣ We start!** → In a few days you'll see visible results.\n\nYou don't need to know anything about tech. We handle EVERYTHING: design, copy, setup, domain... You just tell us what your business does and we make it shine online. ✨\n\nReady to take the leap? Message us on WhatsApp!",
      ca: "Començar és súper fàcil! Només 3 passos: 🚀\n\n**1️⃣ Ens escrius** → Per WhatsApp o el formulari web. Sense compromís.\n**2️⃣ Xerrem 15 min** → Entenem el teu negoci i et proposem la millor solució. Gratis.\n**3️⃣ Comencem!** → En pocs dies ja tens resultats visibles.\n\nNo cal que sàpigues de tecnologia. Nosaltres ens encarreguem de TOT. ✨\n\nA punt per fer el salt? Escriu-nos per WhatsApp!",
      it: "Iniziare è facilissimo! Solo 3 passaggi: 🚀\n\n**1️⃣ Scrivici** → Via WhatsApp o il modulo web. Senza impegno.\n**2️⃣ Chiacchierata 15 min** → Capiamo il tuo business e ti proponiamo la soluzione migliore. Gratis.\n**3️⃣ Si parte!** → In pochi giorni vedrai risultati visibili.\n\nNon devi sapere nulla di tecnologia. Ci occupiamo di TUTTO. ✨\n\nPronto a fare il salto? Scrivici su WhatsApp!",
    },
  },
  {
    id: "maintenance",
    category: "services",
    keywords: ["maintenance", "mantenimiento", "manteniment", "manutenzione", "update", "actualización", "soporte", "support", "suport", "supporto"],
    question: {
      es: "¿Ofrecen mantenimiento web?",
      en: "Do you offer website maintenance?",
      ca: "Oferiu manteniment web?",
      it: "Offrite manutenzione del sito?",
    },
    answer: {
      es: "¡Sí! Tu web no es \"crear y olvidar\" — necesita cariño cada mes 🛠️💚\n\n🔧 **Básico** (€69/mes) — ~2h de mejoras, actualizaciones de seguridad, soporte por WhatsApp\n⚡ **Soporte** (€119/mes) — ~4h de mejoras, nuevas secciones, ajuste de campañas, soporte prioritario. ¡Nuestro más popular!\n🚀 **PRO** (€199/mes) — ~6h dedicadas + revisión trimestral de crecimiento + plan de mejoras\n\nCon mantenimiento tu web está siempre rápida, segura y actualizada. Además, cada mes la mejoramos con datos reales para que consigas más clientes. 📊\n\nUna web sin mantenimiento es como un coche sin revisiones: al final falla cuando más lo necesitas.",
      en: "Yes! Your website isn't \"build and forget\" — it needs love every month 🛠️💚\n\n🔧 **Basic** (€69/mo) — ~2h of improvements, security updates, WhatsApp support\n⚡ **Support** (€119/mo) — ~4h of improvements, new sections, campaign tweaks, priority support. Most popular!\n🚀 **PRO** (€199/mo) — ~6h dedicated + quarterly growth review + improvement plan\n\nWith maintenance, your site stays fast, secure, and up-to-date. Plus, we improve it monthly with real data to get you more clients. 📊\n\nA website without maintenance is like a car without service: it breaks when you need it most.",
      ca: "Sí! La teva web no és \"crear i oblidar\" — necessita cura cada mes 🛠️💚\n\n🔧 **Bàsic** (€69/mes) — ~2h de millores, actualitzacions de seguretat, suport per WhatsApp\n⚡ **Suport** (€119/mes) — ~4h de millores, noves seccions, suport prioritari. El més popular!\n🚀 **PRO** (€199/mes) — ~6h dedicades + revisió trimestral de creixement\n\nAmb manteniment la teva web està sempre ràpida, segura i actualitzada. 📊",
      it: "Sì! Il tuo sito non è \"crea e dimentica\" — ha bisogno di cure ogni mese 🛠️💚\n\n🔧 **Base** (€69/mese) — ~2h di migliorie, aggiornamenti sicurezza, supporto WhatsApp\n⚡ **Supporto** (€119/mese) — ~4h di migliorie, nuove sezioni, supporto prioritario. Il più popolare!\n🚀 **PRO** (€199/mese) — ~6h dedicate + revisione trimestrale crescita\n\nCon la manutenzione il tuo sito è sempre veloce, sicuro e aggiornato. 📊",
    },
  },
  {
    id: "plan-essential",
    category: "pricing",
    keywords: ["essential", "esencial", "essencial", "essenziale", "plan", "pack", "starter", "basic", "básico"],
    question: {
      es: "¿Qué incluye el plan Esencial?",
      en: "What's included in the Essential plan?",
      ca: "Què inclou el pla Essencial?",
      it: "Cosa include il piano Essenziale?",
    },
    answer: {
      es: "El plan **Esencial** es perfecto para empezar desde cero 🌱\n\nIdeal para: autónomos, negocios nuevos, marca personal\n\nIncluye:\n✅ Web de una página (€290)\n✅ Botón de WhatsApp con seguimiento (€120)\n✅ Logo + imagen de marca (€300)\n✅ Mantenimiento básico mensual (€69/mes)\n\n💰 **Inversión inicial: ~€710 + €69/mes**\n\nEs todo lo que necesitas para tener presencia online profesional desde el día 1. Tu negocio visible en Google, con diseño profesional y un canal directo para que te contacten.\n\n¿Quieres empezar? ¡Es el primer paso hacia el crecimiento digital!",
      en: "The **Essential** plan is perfect to start from scratch 🌱\n\nIdeal for: freelancers, new businesses, personal brands\n\nIncludes:\n✅ One-page website (€290)\n✅ WhatsApp button with tracking (€120)\n✅ Logo + brand identity (€300)\n✅ Basic monthly maintenance (€69/mo)\n\n💰 **Initial investment: ~€710 + €69/mo**\n\nEverything you need for a professional online presence from day 1. Your business visible on Google with professional design.\n\nWant to start? It's the first step toward digital growth!",
      ca: "El pla **Essencial** és perfecte per començar des de zero 🌱\n\nIdeal per a: autònoms, negocis nous, marca personal\n\nInclou:\n✅ Web d'una pàgina (€290)\n✅ Botó de WhatsApp amb seguiment (€120)\n✅ Logo + imatge de marca (€300)\n✅ Manteniment bàsic mensual (€69/mes)\n\n💰 **Inversió inicial: ~€710 + €69/mes**\n\nTot el que necessites per tenir presència online professional des del dia 1.\n\nVols començar? És el primer pas!",
      it: "Il piano **Essenziale** è perfetto per partire da zero 🌱\n\nIdeale per: freelancer, nuovi business, brand personali\n\nInclude:\n✅ Sito una pagina (€290)\n✅ Pulsante WhatsApp con tracciamento (€120)\n✅ Logo + identità di marca (€300)\n✅ Manutenzione base mensile (€69/mese)\n\n💰 **Investimento iniziale: ~€710 + €69/mese**\n\nTutto ciò che serve per una presenza online professionale dal giorno 1.\n\nVuoi iniziare? È il primo passo!",
    },
  },
  {
    id: "plan-growth",
    category: "pricing",
    keywords: ["growth", "crecimiento", "creixement", "crescita", "plan", "salon", "peluquería", "perruqueria", "salone", "clinic", "clínica"],
    question: {
      es: "¿Qué incluye el plan Crecimiento?",
      en: "What's included in the Growth plan?",
      ca: "Què inclou el pla Creixement?",
      it: "Cosa include il piano Crescita?",
    },
    answer: {
      es: "El plan **Crecimiento** es nuestro favorito para negocios locales 📈\n\nIdeal para: peluquerías, clínicas, tiendas, equipos pequeños\n\nIncluye:\n✅ Página de ventas optimizada para Google (€490)\n✅ Botón de WhatsApp (€120)\n✅ Logo + branding (€300)\n✅ Textos profesionales para web (€250)\n✅ Mantenimiento básico (€69/mes)\n✅ Sistema de reservas Booksy/Fresha (€200)\n✅ Recordatorios automáticos (€150)\n✅ Ficha Google Business optimizada (€150)\n\n💰 **Inversión inicial: ~€1.660 + €69/mes**\n\n¡Es el combo perfecto para llenar tu agenda y aparecer en Google! La mayoría de nuestros clientes eligen este plan. 🏆",
      en: "The **Growth** plan is our favorite for local businesses 📈\n\nIdeal for: salons, clinics, shops, small teams\n\nIncludes:\n✅ SEO-optimized sales page (€490)\n✅ WhatsApp button (€120)\n✅ Logo + branding (€300)\n✅ Professional website copy (€250)\n✅ Basic maintenance (€69/mo)\n✅ Booksy/Fresha booking setup (€200)\n✅ Auto-reminders (€150)\n✅ Google Business Profile (€150)\n\n💰 **Initial investment: ~€1,660 + €69/mo**\n\nThe perfect combo to fill your calendar and rank on Google! Most of our clients choose this plan. 🏆",
      ca: "El pla **Creixement** és el nostre favorit per a negocis locals 📈\n\nIdeal per a: perruqueries, clíniques, botigues, equips petits\n\nInclou:\n✅ Pàgina de vendes optimitzada per Google (€490)\n✅ Botó de WhatsApp (€120)\n✅ Logo + branding (€300)\n✅ Textos professionals (€250)\n✅ Manteniment bàsic (€69/mes)\n✅ Reserves Booksy/Fresha (€200)\n✅ Recordatoris automàtics (€150)\n✅ Fitxa Google Business (€150)\n\n💰 **Inversió inicial: ~€1.660 + €69/mes**\n\nEl combo perfecte per omplir l'agenda i aparèixer a Google! 🏆",
      it: "Il piano **Crescita** è il nostro preferito per business locali 📈\n\nIdeale per: saloni, cliniche, negozi, piccoli team\n\nInclude:\n✅ Pagina vendita ottimizzata SEO (€490)\n✅ Pulsante WhatsApp (€120)\n✅ Logo + branding (€300)\n✅ Testi professionali (€250)\n✅ Manutenzione base (€69/mese)\n✅ Prenotazioni Booksy/Fresha (€200)\n✅ Promemoria automatici (€150)\n✅ Scheda Google Business (€150)\n\n💰 **Investimento iniziale: ~€1.660 + €69/mese**\n\nIl combo perfetto per riempire l'agenda e apparire su Google! 🏆",
    },
  },
  {
    id: "small-business",
    category: "company",
    keywords: ["small", "pequeño", "petit", "piccol", "business", "negocio", "negoci", "local", "restaurant", "restaurante", "bar", "cafe", "peluquería", "barber"],
    question: {
      es: "¿Trabajan con negocios pequeños?",
      en: "Do you work with small businesses?",
      ca: "Treballeu amb negocis petits?",
      it: "Lavorate con piccole attività?",
    },
    answer: {
      es: "¡Somos ESPECIALISTAS en negocios pequeños y locales! 🏪❤️\n\nTrabajamos con:\n• 💇 Peluquerías y barberías\n• 🏥 Clínicas y centros de estética\n• 🍽️ Restaurantes, bares y cafeterías\n• 🛍️ Tiendas locales\n• 💼 Autónomos y profesionales\n\nEntendemos que no tienes tiempo ni ganas de complicarte con tecnología. Por eso lo hacemos TODO nosotros: desde elegir el mejor dominio hasta escribir los textos de tu web.\n\nNuestros precios están pensados para negocios reales, no para multinacionales. Y lo mejor: puedes empezar desde €290 y crecer poco a poco. 🌱\n\n¿Cuál es tu negocio? ¡Cuéntame y te digo por dónde empezar!",
      en: "We SPECIALIZE in small and local businesses! 🏪❤️\n\nWe work with:\n• 💇 Hair salons and barber shops\n• 🏥 Clinics and beauty centers\n• 🍽️ Restaurants, bars, and cafes\n• 🛍️ Local shops\n• 💼 Freelancers and professionals\n\nWe know you don't have time to deal with tech. That's why we do EVERYTHING: from choosing your domain to writing your website copy.\n\nOur prices are designed for real businesses, not corporations. And the best part: you can start from €290 and grow step by step. 🌱\n\nWhat's your business? Tell me and I'll suggest where to start!",
      ca: "Som ESPECIALISTES en negocis petits i locals! 🏪❤️\n\nTreballem amb:\n• 💇 Perruqueries i barberies\n• 🏥 Clíniques i centres d'estètica\n• 🍽️ Restaurants, bars i cafeteries\n• 🛍️ Botigues locals\n• 💼 Autònoms i professionals\n\nHo fem TOT nosaltres. Pots començar des de €290 i créixer poc a poc. 🌱\n\nQuin és el teu negoci? Explica'm!",
      it: "Siamo SPECIALISTI in piccole attività locali! 🏪❤️\n\nLavoriamo con:\n• 💇 Parrucchieri e barbieri\n• 🏥 Cliniche e centri estetici\n• 🍽️ Ristoranti, bar e caffetterie\n• 🛍️ Negozi locali\n• 💼 Freelancer e professionisti\n\nFacciamo TUTTO noi. Puoi iniziare da €290 e crescere passo dopo passo. 🌱\n\nQual è la tua attività? Raccontami!",
    },
  },
  {
    id: "customize",
    category: "pricing",
    keywords: ["custom", "personalizar", "personalitzar", "personalizzare", "mix", "combinar", "elegir", "choose", "tailor", "a medida"],
    question: {
      es: "¿Puedo personalizar mi plan?",
      en: "Can I customize my plan?",
      ca: "Puc personalitzar el meu pla?",
      it: "Posso personalizzare il mio piano?",
    },
    answer: {
      es: "¡Por supuesto! 🎯 Nuestros planes son solo un punto de partida.\n\nTienes dos opciones:\n\n1️⃣ **Elegir un plan prediseñado** (Esencial, Crecimiento, Profesional o Integral) y ajustarlo\n2️⃣ **Armar tu propio plan** servicio por servicio con nuestro constructor de presupuestos en la web\n\n👉 Visita nuestra página de **Servicios** para armar tu plan a medida y ver el precio en tiempo real.\n\nLo importante es que solo pagues por lo que realmente necesitas. Sin sorpresas, sin contratos largos. Además, siempre puedes agregar más servicios después conforme tu negocio crezca. 📈\n\n¿Quieres que te ayude a armar el plan perfecto?",
      en: "Absolutely! 🎯 Our plans are just a starting point.\n\nYou have two options:\n\n1️⃣ **Pick a preset plan** (Essential, Growth, Professional, or Complete) and adjust it\n2️⃣ **Build your own plan** service by service with our online budget builder\n\n👉 Visit our **Services** page to build your custom plan and see pricing in real time.\n\nThe key is you only pay for what you actually need. No surprises, no long contracts. Plus, you can always add more services later as your business grows. 📈\n\nWant help building the perfect plan?",
      ca: "És clar! 🎯 Els nostres plans són només un punt de partida.\n\nTens dues opcions:\n\n1️⃣ **Triar un pla predissenyat** i ajustar-lo\n2️⃣ **Muntar el teu propi pla** servei per servei amb el nostre constructor de pressupostos\n\n👉 Visita la nostra pàgina de **Serveis** per muntar el teu pla a mida.\n\nNomés pagues pel que realment necessites. 📈\n\nVols que t'ajudi a muntar el pla perfecte?",
      it: "Certamente! 🎯 I nostri piani sono solo un punto di partenza.\n\nHai due opzioni:\n\n1️⃣ **Scegli un piano predefinito** e adattalo\n2️⃣ **Costruisci il tuo piano** servizio per servizio con il nostro budget builder\n\n👉 Visita la nostra pagina **Servizi** per costruire il tuo piano su misura.\n\nPaghi solo per ciò che ti serve davvero. 📈\n\nVuoi aiuto per costruire il piano perfetto?",
    },
  },
  {
    id: "digital-audit",
    category: "services",
    keywords: ["audit", "diagnóstico", "diagnòstic", "audit", "análisis", "anàlisi", "analisi", "review", "revisión"],
    question: {
      es: "¿Qué es el diagnóstico digital?",
      en: "What is a digital audit?",
      ca: "Què és l'auditoria digital?",
      it: "Cos'è l'audit digitale?",
    },
    answer: {
      es: "Es como un \"chequeo médico\" para tu negocio digital 🔍\n\nPor €200 analizamos:\n✅ Tu presencia online actual (web, redes, Google)\n✅ Tus procesos internos (¿qué haces a mano que se puede automatizar?)\n✅ Oportunidades de ahorro de tiempo con IA y automatización\n✅ Qué hacen tus competidores que tú no estás haciendo\n\nAl final recibes un **informe claro** con recomendaciones priorizadas: qué hacer primero, cuánto cuesta y qué impacto tendrá en tu negocio.\n\nEs la mejor inversión antes de tomar cualquier decisión digital. Como ir al médico antes de empezar a entrenar. 💪\n\n¿Quieres saber dónde está perdiendo tiempo y dinero tu negocio?",
      en: "It's like a \"health check\" for your digital business 🔍\n\nFor €200 we analyze:\n✅ Your current online presence (website, social, Google)\n✅ Your internal processes (what can be automated?)\n✅ Time-saving opportunities with AI and automation\n✅ What your competitors are doing that you're not\n\nYou get a **clear report** with prioritized recommendations: what to do first, cost, and expected impact.\n\nIt's the best investment before making any digital decision. Like seeing a doctor before starting a training program. 💪\n\nWant to know where your business is losing time and money?",
      ca: "És com un \"xec mèdic\" pel teu negoci digital 🔍\n\nPer €200 analitzem:\n✅ La teva presència online actual\n✅ Els teus processos interns\n✅ Oportunitats d'estalvi amb IA\n✅ Què fa la competència que tu no fas\n\nReps un **informe clar** amb recomanacions prioritzades.\n\nÉs la millor inversió abans de prendre qualsevol decisió digital. 💪",
      it: "È come un \"check-up\" per il tuo business digitale 🔍\n\nPer €200 analizziamo:\n✅ La tua presenza online attuale\n✅ I tuoi processi interni\n✅ Opportunità di risparmio con IA\n✅ Cosa fanno i concorrenti che tu non fai\n\nRicevi un **report chiaro** con raccomandazioni prioritizzate.\n\nÈ il miglior investimento prima di qualsiasi decisione digitale. 💪",
    },
  },
  {
    id: "contact",
    category: "support",
    keywords: ["contact", "contacto", "contacte", "contatto", "whatsapp", "phone", "teléfono", "telèfon", "telefono", "email", "hablar", "speak", "call", "llamar"],
    question: {
      es: "¿Cómo puedo contactaros?",
      en: "How can I contact you?",
      ca: "Com puc contactar-vos?",
      it: "Come posso contattarvi?",
    },
    answer: {
      es: "¡Estamos a un mensaje de distancia! 📱\n\n💬 **WhatsApp** (el más rápido): +34 644 583 808\n📧 **Email**: Desde el formulario en nuestra web\n🌐 **Web**: Navega nuestros servicios y arma tu presupuesto\n\n⏰ Respondemos en menos de 2 horas en horario laboral (lunes a viernes).\n\nLa primera consulta es **100% gratis y sin compromiso**. Te escuchamos, entendemos tu negocio y te proponemos la mejor solución. Si te gusta, avanzamos. Si no, tan amigos. 🤝\n\n¿Te animas a escribirnos?",
      en: "We're just a message away! 📱\n\n💬 **WhatsApp** (fastest): +34 644 583 808\n📧 **Email**: Through the form on our website\n🌐 **Web**: Browse our services and build your quote\n\n⏰ We respond within 2 hours during business hours (Mon-Fri).\n\nFirst consultation is **100% free, no strings attached**. We listen, understand your business, and propose the best solution. If you like it, we move forward. If not, no hard feelings. 🤝\n\nReady to reach out?",
      ca: "Estem a un missatge de distància! 📱\n\n💬 **WhatsApp** (el més ràpid): +34 644 583 808\n📧 **Email**: Des del formulari a la nostra web\n🌐 **Web**: Navega els nostres serveis i munta el teu pressupost\n\nLa primera consulta és **100% gratis i sense compromís**. 🤝\n\nT'animes a escriure'ns?",
      it: "Siamo a un messaggio di distanza! 📱\n\n💬 **WhatsApp** (il più veloce): +34 644 583 808\n📧 **Email**: Dal modulo sul nostro sito\n🌐 **Web**: Naviga i nostri servizi e costruisci il tuo preventivo\n\nLa prima consulenza è **100% gratuita e senza impegno**. 🤝\n\nPronto a scriverci?",
    },
  },
  {
    id: "discounts",
    category: "pricing",
    keywords: ["discount", "descuento", "descompte", "sconto", "bundle", "oferta", "promotion", "deal", "cheaper", "barato", "barat", "economico"],
    question: {
      es: "¿Hay descuentos por contratar varios servicios?",
      en: "Are there discounts for bundling services?",
      ca: "Hi ha descomptes per contractar diversos serveis?",
      it: "Ci sono sconti per più servizi?",
    },
    answer: {
      es: "¡Sí! Cuanto más creces, más ahorras 💰\n\nNuestros **planes prediseñados** ya incluyen un ahorro significativo frente a contratar cada servicio por separado. Además:\n\n🎯 **Presupuesto personalizado**: Al combinar varios servicios, te hacemos una propuesta especial\n🤝 **Proyectos integrales**: Si contratas web + branding + marketing, hay mejor precio que por separado\n📅 **Clientes recurrentes**: Los planes de mantenimiento incluyen horas de mejora cada mes\n\nLa mejor forma de saberlo es escribirnos con lo que necesitas y te preparamos un presupuesto a medida. ¡Sin compromiso!\n\n¿Quieres que te prepare una propuesta?",
      en: "Yes! The more you grow, the more you save 💰\n\nOur **preset plans** already include significant savings vs. hiring each service separately. Plus:\n\n🎯 **Custom quotes**: When combining services, we offer a special price\n🤝 **Full projects**: Web + branding + marketing together = better price\n📅 **Recurring clients**: Maintenance plans include improvement hours each month\n\nThe best way is to message us with your needs and we'll prepare a custom quote. No commitment!\n\nWant me to prepare a proposal?",
      ca: "Sí! Com més creus, més estalvies 💰\n\nEls nostres **plans predissenyats** ja inclouen un estalvi significatiu. A més:\n\n🎯 **Pressupost personalitzat**: Combinant serveis, et fem una proposta especial\n🤝 **Projectes integrals**: Web + branding + màrqueting = millor preu\n\nEscriu-nos amb el que necessites i et preparem un pressupost a mida. Sense compromís!\n\nVols que et prepari una proposta?",
      it: "Sì! Più cresci, più risparmi 💰\n\nI nostri **piani predefiniti** includono già un risparmio significativo. Inoltre:\n\n🎯 **Preventivi personalizzati**: Combinando servizi, offriamo un prezzo speciale\n🤝 **Progetti integrali**: Web + branding + marketing = prezzo migliore\n\nScrivici con le tue esigenze e prepariamo un preventivo su misura. Senza impegno!\n\nVuoi che prepari una proposta?",
    },
  },
  {
    id: "branding",
    category: "services",
    keywords: ["brand", "branding", "logo", "design", "diseño", "disseny", "marca", "identity", "identidad", "identitat", "identità", "color", "typography"],
    question: {
      es: "¿Hacen logos y branding?",
      en: "Do you create logos and branding?",
      ca: "Feu logos i branding?",
      it: "Create loghi e branding?",
    },
    answer: {
      es: "¡Sí! Tu imagen es lo primero que ven tus clientes 🎨\n\n🎯 **Logo + Branding** (€300) → Logo profesional, paleta de colores, tipografía y guía de marca\n✍️ **Textos para web** (€250) → Copywriting profesional que convierte visitantes en clientes\n📱 **Kit de plantillas para redes** (€200) → Plantillas Canva con tu marca, solo cambias texto y foto\n📧 **Emails automáticos** (€150) → Plantillas de email de bienvenida y recordatorios\n\nUna imagen profesional y coherente genera confianza. Y la confianza genera ventas. Es así de simple. ✨\n\n¿Tu negocio ya tiene logo o necesitas uno desde cero?",
      en: "Yes! Your image is the first thing clients see 🎨\n\n🎯 **Logo + Branding** (€300) → Professional logo, color palette, typography & brand guide\n✍️ **Website copy** (€250) → Professional copywriting that converts visitors into clients\n📱 **Social media template kit** (€200) → Branded Canva templates, just swap text and photos\n📧 **Automated emails** (€150) → Welcome and reminder email templates\n\nA professional, consistent image builds trust. And trust drives sales. It's that simple. ✨\n\nDoes your business already have a logo or do you need one from scratch?",
      ca: "Sí! La teva imatge és el primer que veuen els teus clients 🎨\n\n🎯 **Logo + Branding** (€300) → Logo professional, colors, tipografia i guia de marca\n✍️ **Textos per a web** (€250) → Copywriting professional\n📱 **Kit de plantilles** (€200) → Plantilles Canva amb la teva marca\n📧 **Emails automàtics** (€150) → Plantilles d'email de benvinguda\n\nUna imatge professional genera confiança i vendes. ✨",
      it: "Sì! La tua immagine è la prima cosa che vedono i clienti 🎨\n\n🎯 **Logo + Branding** (€300) → Logo professionale, colori, tipografia e guida brand\n✍️ **Testi per sito** (€250) → Copywriting professionale\n📱 **Kit template social** (€200) → Template Canva brandizzati\n📧 **Email automatiche** (€150) → Template email di benvenuto\n\nUn'immagine professionale genera fiducia e vendite. ✨",
    },
  },
  {
    id: "google-business",
    category: "services",
    keywords: ["google", "maps", "business", "profile", "ficha", "fitxa", "scheda", "local", "seo", "encontrar", "find", "trobar", "trovare"],
    question: {
      es: "¿Me ayudan a aparecer en Google?",
      en: "Can you help me appear on Google?",
      ca: "M'ajudeu a aparèixer a Google?",
      it: "Mi aiutate ad apparire su Google?",
    },
    answer: {
      es: "¡Claro! Aparecer en Google es CLAVE para negocios locales 🗺️\n\nOfrecemos:\n\n📍 **Google Business Profile** (€150) — Tu ficha en Google Maps optimizada: fotos, horarios, servicios, categorías y primeras publicaciones. Cuando alguien busque tu tipo de negocio cerca, ¡ahí estás!\n\n🔍 **Páginas web con SEO** (desde €490) — Tu web diseñada para que Google la muestre cuando alguien busca tus servicios en tu zona\n\n⭐ **Reseñas Google automatizadas** (€150) — Sistema automático que pide reseñas a tus clientes después de cada visita. Más reseñas = más confianza = más clientes\n\nEl 90% de las personas buscan en Google antes de elegir un negocio local. Si no estás, no existes. 🎯\n\n¿Ya tienes ficha de Google? ¡La revisamos gratis!",
      en: "Of course! Appearing on Google is KEY for local businesses 🗺️\n\nWe offer:\n\n📍 **Google Business Profile** (€150) — Optimized Google Maps listing: photos, hours, services, categories. When someone searches for your business type nearby, there you are!\n\n🔍 **SEO-optimized websites** (from €490) — Your site designed to rank when people search for your services\n\n⭐ **Automated Google reviews** (€150) — Auto-request reviews after each visit. More reviews = more trust = more clients\n\n90% of people search Google before choosing a local business. If you're not there, you don't exist. 🎯\n\nAlready have a Google listing? We'll review it for free!",
      ca: "Clar! Aparèixer a Google és CLAU per a negocis locals 🗺️\n\n📍 **Google Business Profile** (€150) — Fitxa optimitzada a Google Maps\n🔍 **Webs amb SEO** (des de €490) — Dissenyada per aparèixer a Google\n⭐ **Ressenyes automatitzades** (€150) — Més ressenyes = més clients\n\nEl 90% de la gent busca a Google abans d'escollir. Si no hi ets, no existeixes. 🎯",
      it: "Certo! Apparire su Google è FONDAMENTALE per business locali 🗺️\n\n📍 **Google Business Profile** (€150) — Scheda Google Maps ottimizzata\n🔍 **Siti con SEO** (da €490) — Progettati per apparire su Google\n⭐ **Recensioni automatizzate** (€150) — Più recensioni = più clienti\n\nIl 90% delle persone cerca su Google prima di scegliere. Se non ci sei, non esisti. 🎯",
    },
  },
];

/**
 * Simple keyword matching search. Returns messages sorted by relevance.
 */
export function searchMessages(query: string, lang: Language): ChatMessage[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return chatbotMessages;

  const words = normalizedQuery.split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return chatbotMessages;

  const scored = chatbotMessages.map((msg) => {
    let score = 0;
    const questionText = msg.question[lang].toLowerCase();
    const answerText = msg.answer[lang].toLowerCase();

    for (const word of words) {
      // Keyword match (highest priority)
      if (msg.keywords.some((kw) => kw.includes(word) || word.includes(kw))) {
        score += 3;
      }
      // Question match
      if (questionText.includes(word)) {
        score += 2;
      }
      // Answer match
      if (answerText.includes(word)) {
        score += 1;
      }
    }

    return { msg, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.msg);
}
