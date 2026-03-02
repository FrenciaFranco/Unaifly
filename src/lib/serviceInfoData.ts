import type { Language } from "./servicesConfig";

export interface ServiceInfoDetail {
  does: string;   // Qué hacemos específicamente
  result: string;  // Qué puede esperar como resultado
  value: string;   // Cómo aporta valor a su negocio
}

export const serviceInfoLabels: Record<Language, { does: string; result: string; value: string }> = {
  en: { does: "What we do", result: "Expected result", value: "Value for your business" },
  es: { does: "Qué hacemos", result: "Resultado esperado", value: "Valor para tu negocio" },
  ca: { does: "Què fem", result: "Resultat esperat", value: "Valor per al teu negoci" },
  it: { does: "Cosa facciamo", result: "Risultato atteso", value: "Valore per il tuo business" },
};

export const serviceInfoData: Record<string, Record<Language, ServiceInfoDetail>> = {
  // ── Web & Digital Presence ──────────────────────────────────────
  "web-basic": {
    es: {
      does: "Diseñamos una web profesional con tu información, servicios, contacto y ubicación. Optimizada para móvil, rápida y preparada para que te encuentren en Google.",
      result: "Una web profesional con tu dominio propio, lista para compartir, recibir contactos y posicionarte en buscadores.",
      value: "Tus clientes te encuentran en Google, ven que eres profesional y pueden contactarte en un clic.",
    },
    en: {
      does: "We design a single-page website with your info, services, contact and location. Built for mobile and optimized for speed.",
      result: "A professional website on your domain, ready to share and receive enquiries.",
      value: "Clients find you, see you're legit, and can contact you in one click.",
    },
    ca: {
      does: "Dissenyem una web d'una pàgina amb la teva informació, serveis, contacte i ubicació. Pensada per al mòbil i optimitzada per carregar ràpid.",
      result: "Una web professional online amb el teu domini, llesta per compartir i rebre contactes.",
      value: "Els teus clients et troben, veuen que ets professional i et poden contactar en un clic.",
    },
    it: {
      does: "Progettiamo un sito di una pagina con le tue info, servizi, contatti e posizione. Pensata per il mobile e ottimizzato per velocità.",
      result: "Un sito professionale sul tuo dominio, pronto per condividere e ricevere contatti.",
      value: "I clienti ti trovano, vedono che sei un professionista e ti contattano con un clic.",
    },
  },

  "web-landing": {
    es: {
      does: "Diseñamos una página de ventas optimizada para que te encuentren en Google (SEO) y para que quien la visite te contacte: titular llamativo, beneficios claros, testimonios reales, preguntas frecuentes, formulario y botones de acción. Incluye seguimiento de resultados para saber qué funciona.",
      result: "Una página que aparece en Google, convierte visitas en contactos reales y te muestra con datos claros qué funciona y qué mejorar.",
      value: "Más visibilidad en buscadores, más consultas desde tu web y datos claros para tomar decisiones.",
    },
    en: {
      does: "We build a page designed to sell: eye-catching headline, clear benefits, testimonials, common questions, form and contact buttons. Includes result tracking and setup to show up on Google.",
      result: "A page designed to get visitors to contact you, with data to know what works.",
      value: "More enquiries and bookings from your website, with data to know what works.",
    },
    ca: {
      does: "Creem una pàgina pensada per vendre: titular cridaner, beneficis clars, testimonis, preguntes freqüents, formulari i botons de contacte. Inclou seguiment de resultats i configuració per aparèixer a Google.",
      result: "Una pàgina pensada perquè els visitants et contactin, amb dades per saber què funciona.",
      value: "Més consultes i reserves des de la teva web, amb dades per saber què funciona.",
    },
    it: {
      does: "Creiamo una pagina pensata per vendere: titolo accattivante, benefici chiari, testimonianze, domande frequenti, modulo e pulsanti di contatto. Include monitoraggio risultati e configurazione per farsi trovare su Google.",
      result: "Una pagina pensata per far sì che i visitatori ti contattino, con dati per sapere cosa funziona.",
      value: "Più richieste e prenotazioni dal tuo sito, con dati per sapere cosa funziona.",
    },
  },

  "web-multi": {
    es: {
      does: "Desarrollamos hasta 5 páginas (Inicio, Servicios, Sobre nosotros, Blog/Galería, Contacto) preparadas para que te encuentren en búsquedas de tu zona en Google (SEO local).",
      result: "Un sitio web completo que aparece en búsquedas locales de Google y presenta todos tus servicios de forma profesional.",
      value: "Apareces en Google cuando alguien busca negocios como el tuyo en tu zona, atraes más visitas y proyectas imagen de negocio serio.",
    },
    en: {
      does: "We build up to 5 pages (Home, Services, About, Blog/Gallery, Contact) set up to show up in local Google searches for your area.",
      result: "A complete website that shows up in local searches and showcases all your services.",
      value: "You show up better on Google for your area, more visits from search engines and a solid business image.",
    },
    ca: {
      does: "Desenvolupem fins a 5 pàgines (Inici, Serveis, Sobre nosaltres, Blog/Galeria, Contacte) preparades per aparèixer en cerques de la teva zona a Google.",
      result: "Un lloc web complet que apareix en cerques locals i presenta tots els teus serveis.",
      value: "Apareixes millor a Google per a la teva zona, més visites des de cercadors i imatge de negoci seriós.",
    },
    it: {
      does: "Sviluppiamo fino a 5 pagine (Home, Servizi, Chi siamo, Blog/Galleria, Contatti) preparate per comparire nelle ricerche della tua zona su Google.",
      result: "Un sito completo che compare nelle ricerche locali e presenta tutti i tuoi servizi.",
      value: "Compari meglio su Google nella tua zona, più visite dai motori di ricerca e immagine da business serio.",
    },
  },

  "web-ecommerce": {
    es: {
      does: "Montamos tu tienda online con hasta ~30 productos, cobro con tarjeta o Bizum, envíos estándar y ficha de producto profesional.",
      result: "Una tienda online funcionando con productos, carrito, proceso de compra y confirmación de pedido.",
      value: "Vendes online 24/7 sin depender de un local físico ni de marketplaces con comisiones altas.",
    },
    en: {
      does: "We set up your store on Shopify or WooCommerce with a small catalog (~30 products), card/local payments, standard shipping and optimized product pages.",
      result: "A working online store with products, cart, checkout and order confirmation.",
      value: "You sell online 24/7 without depending on a physical shop or marketplaces with high fees.",
    },
    ca: {
      does: "Muntem la teva botiga a Shopify o WooCommerce amb catàleg petit (~30 productes), pagaments amb targeta/Bizum, enviaments estàndard i pàgina de producte optimitzada.",
      result: "Una botiga online funcionant amb productes, cistella, checkout i confirmació de comanda.",
      value: "Vens online 24/7 sense dependre d'un local físic ni de marketplaces amb comissions altes.",
    },
    it: {
      does: "Configuriamo il tuo negozio su Shopify o WooCommerce con catalogo piccolo (~30 prodotti), pagamenti con carta, spedizioni standard e pagina prodotto ottimizzata.",
      result: "Un negozio online funzionante con prodotti, carrello, checkout e conferma ordine.",
      value: "Vendi online 24/7 senza dipendere da un negozio fisico o marketplace con commissioni alte.",
    },
  },

  // ── Bookings & Appointments ─────────────────────────────────────
  "booking-setup": {
    es: {
      does: "Configuramos tu app de reservas (Booksy o Fresha) completa: servicios, precios, horarios, personal, y la integramos en tu web.",
      result: "Tus clientes pueden reservar online desde tu web o redes sociales en cualquier momento.",
      value: "Menos llamadas para agendar, menos errores de horario y una agenda siempre actualizada.",
    },
    en: {
      does: "We fully set up Booksy or Fresha: services, prices, schedules, staff, and integrate it into your website.",
      result: "Your clients can book online from your site or social media anytime.",
      value: "Fewer calls to schedule, fewer time conflicts and an always up-to-date calendar.",
    },
    ca: {
      does: "Configurem Booksy o Fresha complet: serveis, preus, horaris, staff, i ho integrem a la teva web.",
      result: "Els teus clients poden reservar online des de la teva web o xarxes socials en qualsevol moment.",
      value: "Menys trucades per agendar, menys errors d'horari i una agenda sempre actualitzada.",
    },
    it: {
      does: "Configuriamo Booksy o Fresha completo: servizi, prezzi, orari, staff, e lo integriamo nel tuo sito.",
      result: "I tuoi clienti possono prenotare online dal tuo sito o social in qualsiasi momento.",
      value: "Meno chiamate per fissare appuntamenti, meno errori di orario e un'agenda sempre aggiornata.",
    },
  },

  "booking-calendly": {
    es: {
      does: "Configuramos una agenda de citas online (tipo Calendly) con tus servicios, disponibilidad, formularios previos a la cita y confirmaciones automáticas.",
      result: "Un enlace de reserva profesional que puedes compartir por WhatsApp, email o web.",
      value: "El cliente reserva solo, sin intercambiar mensajes. Tú solo ves tu agenda confirmada.",
    },
    en: {
      does: "We set up a Calendly-style online agenda with your services, availability, pre-appointment forms and automatic confirmations.",
      result: "A professional booking link you can share via WhatsApp, email or your website.",
      value: "Clients book by themselves with no back-and-forth. You just see your confirmed schedule.",
    },
    ca: {
      does: "Configurem una agenda online tipus Calendly amb els teus serveis, disponibilitat, formularis previs a la cita i confirmacions automàtiques.",
      result: "Un enllaç de reserva professional que pots compartir per WhatsApp, email o web.",
      value: "El client reserva sol, sense intercanviar missatges. Tu només veus la teva agenda confirmada.",
    },
    it: {
      does: "Configuriamo un'agenda online tipo Calendly con i tuoi servizi, disponibilità, moduli pre-appuntamento e conferme automatiche.",
      result: "Un link di prenotazione professionale da condividere via WhatsApp, email o sito.",
      value: "Il cliente prenota da solo senza scambi di messaggi. Tu vedi solo l'agenda confermata.",
    },
  },

  "booking-reminders": {
    es: {
      does: "Configuramos recordatorios automáticos por SMS, WhatsApp o email antes de cada cita (24h y 1h antes, personalizable).",
      result: "Tus clientes reciben avisos automáticos y pueden confirmar o reprogramar fácilmente.",
      value: "Menos clientes que no se presentan, menos huecos en tu agenda y más facturación real.",
    },
    en: {
      does: "We set up automatic reminders via SMS, WhatsApp or email before each appointment (24h and 1h before, customizable).",
      result: "Your clients receive automatic alerts and can easily confirm or reschedule.",
      value: "Fewer no-shows, fewer gaps in your schedule and more real revenue.",
    },
    ca: {
      does: "Configurem recordatoris automàtics per SMS, WhatsApp o email abans de cada cita (24h i 1h abans, personalitzable).",
      result: "Els teus clients reben avisos automàtics i poden confirmar o reprogramar fàcilment.",
      value: "Menys absències (no-shows), menys buits a la teva agenda i més facturació real.",
    },
    it: {
      does: "Configuriamo promemoria automatici via SMS, WhatsApp o email prima di ogni appuntamento (24h e 1h prima, personalizzabile).",
      result: "I tuoi clienti ricevono avvisi automatici e possono confermare o riprogrammare facilmente.",
      value: "Meno assenze (no-show), meno buchi in agenda e più fatturato reale.",
    },
  },

  "booking-deposits": {
    es: {
      does: "Configuramos cobro de señal o pago completo al reservar, con sistema de pago seguro (Stripe o PayPal).",
      result: "El cliente paga al reservar. Si no viene, ya tienes la señal.",
      value: "Eliminas las reservas que no se presentan. Quien paga, viene.",
    },
    en: {
      does: "We set up deposit or full payment at booking time, with a secure payment gateway (Stripe/PayPal).",
      result: "The client pays when booking. If they don't show, you already have the deposit.",
      value: "You eliminate no-shows. People who pay, show up.",
    },
    ca: {
      does: "Configurem cobrament de senyal o pagament complet en reservar, amb passarel·la segura (Stripe/PayPal).",
      result: "El client paga en reservar. Si no ve, ja tens la senyal.",
      value: "Elimines les reserves que no es presenten. Qui paga, ve.",
    },
    it: {
      does: "Configuriamo il pagamento di caparra o completo al momento della prenotazione, con gateway sicuro (Stripe/PayPal).",
      result: "Il cliente paga alla prenotazione. Se non si presenta, hai già la caparra.",
      value: "Elimini i no-show. Chi paga, si presenta.",
    },
  },

  // ── WhatsApp & Communication ────────────────────────────────────
  "wa-button": {
    es: {
      does: "Instalamos un botón de WhatsApp flotante en tu web con mensaje listo para enviar y seguimiento de cuántos clientes te escriben.",
      result: "Un botón visible en toda tu web que abre WhatsApp con un mensaje listo para enviar.",
      value: "Más conversaciones directas con clientes potenciales. Sabes cuántos hacen clic.",
    },
    en: {
      does: "We install a floating WhatsApp button on your site with a ready-to-send message and tracking of how many clients write to you.",
      result: "A visible button across your site that opens WhatsApp with a ready-to-send message.",
      value: "More direct conversations with potential clients. You know how many click.",
    },
    ca: {
      does: "Instal·lem un botó de WhatsApp flotant a la teva web amb missatge llest per enviar i seguiment de quants clients t'escriuen.",
      result: "Un botó visible a tota la teva web que obre WhatsApp amb un missatge llest per enviar.",
      value: "Més converses directes amb clients potencials. Saps quants fan clic.",
    },
    it: {
      does: "Installiamo un pulsante WhatsApp flottante sul tuo sito con messaggio pronto da inviare e monitoraggio di quanti clienti ti scrivono.",
      result: "Un pulsante visibile su tutto il sito che apre WhatsApp con un messaggio pronto da inviare.",
      value: "Più conversazioni dirette con potenziali clienti. Sai quanti cliccano.",
    },
  },

  "wa-basic-auto": {
    es: {
      does: "Configuramos respuestas automáticas para fuera de horario, un menú de opciones (Reservar, Precios, Ubicación) y respuestas a las preguntas más frecuentes.",
      result: "Tu WhatsApp responde solo cuando no estás, con información útil y opciones claras.",
      value: "No pierdes clientes potenciales fuera de horario. El cliente recibe respuesta inmediata y tú contestas solo lo importante.",
    },
    en: {
      does: "We set up auto-replies for after hours, a menu (Book, Prices, Location) and answers to your most common questions.",
      result: "Your WhatsApp replies on its own when you're away, with useful info and clear options.",
      value: "You don't lose potential clients after hours. Clients get instant answers and you only handle what matters.",
    },
    ca: {
      does: "Configurem respostes automàtiques per a fora d'horari, un menú d'opcions (Reservar, Preus, Ubicació) i respostes a les preguntes més freqüents.",
      result: "El teu WhatsApp respon sol quan no hi ets, amb informació útil i opcions clares.",
      value: "No perds clients potencials fora d'horari. El client rep resposta immediata i tu contestes només el que importa.",
    },
    it: {
      does: "Configuriamo risposte automatiche per fuori orario, un menu (Prenota, Prezzi, Posizione) e risposte alle domande più frequenti.",
      result: "Il tuo WhatsApp risponde da solo quando non ci sei, con info utili e opzioni chiare.",
      value: "Non perdi potenziali clienti fuori orario. Il cliente riceve risposta immediata e tu gestisci solo ciò che conta.",
    },
  },

  "wa-secretary": {
    es: {
      does: "Instalamos un asistente virtual con inteligencia artificial (IA) en tu WhatsApp que responde preguntas frecuentes, filtra consultas, guarda datos del posible cliente y pasa a una persona cuando hace falta.",
      result: "Un asistente virtual 24/7 que atiende, recoge información y te pasa solo los clientes realmente interesados.",
      value: "Atiendes más consultas sin contratar personal. Tu equipo se enfoca en cerrar ventas, no en responder lo mismo 50 veces.",
    },
    en: {
      does: "We implement an AI conversational bot that answers common questions, filters enquiries, captures potential client data and hands off to a human when needed.",
      result: "A 24/7 virtual assistant that handles enquiries, collects info and passes you only the truly interested contacts.",
      value: "You handle more enquiries without hiring. Your team focuses on closing sales, not answering the same thing 50 times.",
    },
    ca: {
      does: "Implementem un bot conversacional amb IA que respon preguntes freqüents, filtra consultes, captura dades del client potencial i deriva a una persona quan cal.",
      result: "Un assistent virtual 24/7 que atén, recull informació i et passa només els clients realment interessats.",
      value: "Atens més consultes sense contractar personal. El teu equip es centra a tancar vendes, no a respondre el mateix 50 vegades.",
    },
    it: {
      does: "Implementiamo un bot conversazionale con IA che risponde alle domande frequenti, filtra le richieste, cattura i dati del potenziale cliente e passa a un umano quando serve.",
      result: "Un assistente virtuale 24/7 che gestisce, raccoglie informazioni e ti passa solo i contatti realmente interessati.",
      value: "Gestisci più richieste senza assumere. Il tuo team si concentra sulla chiusura vendite, non sul rispondere la stessa cosa 50 volte.",
    },
  },

  "wa-followup": {
    es: {
      does: "Configuramos mensajes automáticos post-visita: agradecimiento, enlace para reservar de nuevo y solicitud de reseña en Google.",
      result: "Cada cliente recibe seguimiento automático después de su visita sin que tú hagas nada.",
      value: "Más reseñas en Google, más reservas recurrentes y clientes que se sienten cuidados.",
    },
    en: {
      does: "We set up automatic post-visit messages: thank you, re-booking link and Google review request.",
      result: "Every client gets automatic follow-up after their visit without you lifting a finger.",
      value: "More Google reviews, more repeat bookings and clients who feel valued.",
    },
    ca: {
      does: "Configurem missatges automàtics post-visita: agraïment, enllaç per reservar de nou i sol·licitud de ressenya a Google.",
      result: "Cada client rep seguiment automàtic després de la visita sense que tu facis res.",
      value: "Més ressenyes a Google, més reserves recurrents i clients que se senten cuidats.",
    },
    it: {
      does: "Configuriamo messaggi automatici post-visita: ringraziamento, link per prenotare di nuovo e richiesta recensione su Google.",
      result: "Ogni cliente riceve un follow-up automatico dopo la visita senza che tu faccia nulla.",
      value: "Più recensioni su Google, più prenotazioni ricorrenti e clienti che si sentono valorizzati.",
    },
  },

  // ── CRM & Lead Management ──────────────────────────────────────
  "crm-integration": {
    es: {
      does: "Conectamos todos tus formularios, WhatsApp y reservas a una lista de contactos organizada (en Sheets, Notion o un gestor de clientes) para que cada persona interesada quede registrada automáticamente.",
      result: "Un panel donde ves todos tus contactos organizados por fecha, origen y estado.",
      value: "No se te escapa ningún contacto. Sabes de dónde vienen y en qué estado están.",
    },
    en: {
      does: "We connect all your forms, WhatsApp and bookings to an organized contact manager (Sheets, Notion or HubSpot) so every contact is logged automatically.",
      result: "A single view where you see all your contacts organized by date, source and status.",
      value: "No contact slips through. You know where they come from and where they stand.",
    },
    ca: {
      does: "Connectem tots els teus formularis, WhatsApp i reserves a un gestor de contactes organitzat (Sheets, Notion o HubSpot) perquè cada contacte quedi registrat automàticament.",
      result: "Un panell on veus tots els teus contactes organitzats per data, origen i estat.",
      value: "No se t'escapa cap contacte. Saps d'on venen i en quin estat estan.",
    },
    it: {
      does: "Colleghiamo tutti i tuoi moduli, WhatsApp e prenotazioni a un gestore contatti organizzato (Sheets, Notion o HubSpot) perché ogni contatto venga registrato automaticamente.",
      result: "Un pannello dove vedi tutti i contatti organizzati per data, origine e stato.",
      value: "Nessun contatto ti sfugge. Sai da dove arrivano e a che punto sono.",
    },
  },

  "crm-report": {
    es: {
      does: "Cada mes revisamos tus números (visitas, formularios, reservas, contactos) y te enviamos un informe visual con las 3 acciones prioritarias para mejorar.",
      result: "Un informe mensual claro con números reales y recomendaciones concretas.",
      value: "Tomas decisiones basadas en datos, no en intuición. Sabes qué invertir y qué ajustar.",
    },
    en: {
      does: "Every month we review your numbers (visits, forms, bookings, contacts) and send a visual report with the top 3 priority actions to improve.",
      result: "A clear monthly report with real numbers and concrete recommendations.",
      value: "You make decisions based on data, not gut feeling. You know what to invest and what to tweak.",
    },
    ca: {
      does: "Cada mes revisem els teus números (visites, formularis, reserves, contactes) i t'enviem un informe visual amb les 3 accions prioritàries per millorar.",
      result: "Un informe mensual clar amb números reals i recomanacions concretes.",
      value: "Prens decisions basades en dades, no en intuïció. Saps què invertir i què ajustar.",
    },
    it: {
      does: "Ogni mese analizziamo i tuoi numeri (visite, moduli, prenotazioni, contatti) e ti inviamo un report visuale con le 3 azioni prioritarie per migliorare.",
      result: "Un report mensile chiaro con numeri reali e raccomandazioni concrete.",
      value: "Prendi decisioni basate sui dati, non sull'intuizione. Sai dove investire e cosa aggiustare.",
    },
  },

  // ── Marketing & Advertising ────────────────────────────────────
  "mkt-ads": {
    es: {
      does: "Creamos tu primera campaña de anuncios en Instagram/Facebook o Google: diseños, textos, elegimos a quién le llega, y medimos los resultados.",
      result: "Una campaña activa lista para atraer visitantes y clientes potenciales desde el día 1.",
      value: "Empiezas a atraer clientes nuevos de forma constante, con datos para saber si la inversión vale la pena.",
    },
    en: {
      does: "We create your first campaign on Meta (Instagram/Facebook) or Google Ads: creatives, texts, target audience, ad tracking and result measurement.",
      result: "A live campaign ready to attract visitors and potential clients from day 1.",
      value: "You start attracting new clients predictably, with data to measure your return.",
    },
    ca: {
      does: "Creem la teva primera campanya a Meta (Instagram/Facebook) o Google Ads: creativitats, textos, públic objectiu, seguiment d'anuncis i mesurament de resultats.",
      result: "Una campanya activa llesta per atraure visitants i clients potencials des del dia 1.",
      value: "Comences a atraure clients nous de forma previsible, amb dades per mesurar el retorn.",
    },
    it: {
      does: "Creiamo la tua prima campagna su Meta (Instagram/Facebook) o Google Ads: creatività, testi, pubblico obiettivo, tracciamento annunci e misurazione risultati.",
      result: "Una campagna attiva pronta ad attrarre visitatori e potenziali clienti dal giorno 1.",
      value: "Inizi ad attrarre nuovi clienti in modo prevedibile, con dati per misurare il ritorno.",
    },
  },

  "mkt-social": {
    es: {
      does: "Diseñamos 12 publicaciones al mes con tu marca (para el feed y stories de Instagram), escribimos los textos y entregamos un calendario de publicación.",
      result: "Contenido profesional listo para publicar cada mes, con coherencia visual y mensaje claro.",
      value: "Presencia activa en redes sin pensar qué publicar. Tu marca se ve profesional y constante.",
    },
    en: {
      does: "We design 12 monthly posts with your brand (feed + stories), write the texts, set hashtags and deliver a publishing calendar.",
      result: "Professional content ready to post every month, visually consistent with a clear message.",
      value: "Active social media presence without thinking what to post. Your brand looks professional and consistent.",
    },
    ca: {
      does: "Dissenyem 12 posts al mes amb la teva marca (feed + stories), escrivim els textos, definim hashtags i entreguem un calendari de publicació.",
      result: "Contingut professional llest per publicar cada mes, amb coherència visual i missatge clar.",
      value: "Presència activa a xarxes sense pensar què publicar. La teva marca es veu professional i constant.",
    },
    it: {
      does: "Progettiamo 12 post al mese con il tuo brand (feed + stories), scriviamo i testi, definiamo gli hashtag e consegniamo un calendario di pubblicazione.",
      result: "Contenuti professionali pronti da pubblicare ogni mese, visivamente coerenti e con messaggio chiaro.",
      value: "Presenza attiva sui social senza pensare cosa pubblicare. Il tuo brand appare professionale e costante.",
    },
  },

  "mkt-reputation": {
    es: {
      does: "Configuramos un sistema automático que envía solicitudes de reseña a tus clientes por WhatsApp o email después de cada visita o compra.",
      result: "Un sistema automático que consigue reseñas en Google sin que tengas que pedirlas tú.",
      value: "Más reseñas positivas = mejor posicionamiento en Google Maps y más confianza para nuevos clientes.",
    },
    en: {
      does: "We set up an automated system that sends review requests to your clients via WhatsApp or email after each visit or purchase.",
      result: "An automatic flow that generates Google reviews without you having to ask.",
      value: "More positive reviews = better ranking on Google Maps and more trust from new clients.",
    },
    ca: {
      does: "Configurem un sistema automàtic que envia sol·licituds de ressenya als teus clients per WhatsApp o email després de cada visita o compra.",
      result: "Un flux automàtic que genera ressenyes a Google sense que ho hagis de demanar tu.",
      value: "Més ressenyes positives = millor posicionament a Google Maps i més confiança per a nous clients.",
    },
    it: {
      does: "Configuriamo un sistema automatico che invia richieste di recensione ai clienti via WhatsApp o email dopo ogni visita o acquisto.",
      result: "Un flusso automatico che genera recensioni su Google senza che tu debba chiederlo.",
      value: "Più recensioni positive = miglior posizionamento su Google Maps e più fiducia dai nuovi clienti.",
    },
  },

  "mkt-newsletter": {
    es: {
      does: "Diseñamos y enviamos 1 boletín por email (newsletter) al mes con promociones, novedades o contenido útil. Incluye plantilla con tu marca y organización de contactos básica.",
      result: "Un email profesional mensual que llega a tu lista de contactos con contenido relevante.",
      value: "Tu marca presente en la mente de tus clientes. Recuperas contactos que dejaron de venir.",
    },
    en: {
      does: "We design and send 1 newsletter per month with promotions, news or valuable content. Includes a branded template and basic contact organization.",
      result: "A professional monthly email reaching your contact list with relevant content.",
      value: "Your brand stays top-of-mind for current clients. You reactivate dormant contacts.",
    },
    ca: {
      does: "Dissenyem i enviem 1 newsletter al mes amb promocions, novetats o contingut de valor. Inclou plantilla amb la teva marca i organització de contactes bàsica.",
      result: "Un email professional mensual que arriba a la teva llista de contactes amb contingut rellevant.",
      value: "La teva marca present a la ment dels clients actuals. Reactives contactes adormits.",
    },
    it: {
      does: "Progettiamo e inviamo 1 newsletter al mese con promozioni, novità o contenuti di valore. Include template brandizzato e organizzazione contatti base.",
      result: "Un'email professionale mensile che raggiunge la tua lista contatti con contenuti rilevanti.",
      value: "Il tuo brand resta nella mente dei clienti attuali. Riattivi contatti dormienti.",
    },
  },

  "mkt-gbp": {
    es: {
      does: "Optimizamos tu ficha en Google Maps (Google Business): fotos profesionales, horarios, servicios, categorías correctas, descripción pensada para que te encuentren y primeras publicaciones.",
      result: "Un perfil de Google Business completo y optimizado que aparece mejor en búsquedas locales.",
      value: "Más visibilidad en Google Maps y búsquedas tipo 'peluquería cerca de mí'. Gratis y permanente.",
    },
    en: {
      does: "We optimize your Google Business profile: professional photos, hours, services, correct categories, keyword-rich description and first posts.",
      result: "A complete, optimized Google Business profile that ranks better in local searches.",
      value: "More visibility on Google Maps and 'near me' searches. Free and permanent.",
    },
    ca: {
      does: "Optimitzem la teva fitxa de Google Business: fotos professionals, horaris, serveis, categories correctes, descripció amb paraules clau i primeres publicacions.",
      result: "Un perfil de Google Business complet i optimitzat que apareix millor en cerques locals.",
      value: "Més visibilitat a Google Maps i cerques tipus 'perruqueria a prop meu'. Gratuït i permanent.",
    },
    it: {
      does: "Ottimizziamo la tua scheda Google Business: foto professionali, orari, servizi, categorie corrette, descrizione con parole chiave e primi post.",
      result: "Un profilo Google Business completo e ottimizzato che si posiziona meglio nelle ricerche locali.",
      value: "Più visibilità su Google Maps e ricerche 'vicino a me'. Gratuito e permanente.",
    },
  },

  // ── Design & Content ───────────────────────────────────────────
  "design-branding": {
    es: {
      does: "Diseñamos tu logo, elegimos tus colores y tipografías, y creamos una guía para que todo lo que publiques tenga la misma imagen profesional.",
      result: "Un kit de imagen de marca (branding): logo en varios formatos, colores, tipografías y guía de uso.",
      value: "Tu negocio se ve profesional y reconocible. Todo lo que publiques tiene la misma imagen.",
    },
    en: {
      does: "We design your logo, define color palette, fonts and create basic brand guidelines to keep everything consistent.",
      result: "A visual identity kit: logo in multiple formats, colors, fonts and usage guide.",
      value: "Your business looks professional and recognizable. Everything you publish has the same look.",
    },
    ca: {
      does: "Dissenyem el teu logo, definim paleta de colors, tipografies i creem una guia de marca bàsica per mantenir coherència en tot.",
      result: "Un kit d'identitat visual: logo en diversos formats, colors, tipografies i guia d'ús.",
      value: "El teu negoci es veu professional i reconeixible. Tot el que publiquis té la mateixa imatge.",
    },
    it: {
      does: "Progettiamo il tuo logo, definiamo palette colori, font e creiamo linee guida base del brand per mantenere coerenza in tutto.",
      result: "Un kit di identità visiva: logo in più formati, colori, font e guida all'uso.",
      value: "Il tuo business appare professionale e riconoscibile. Tutto ciò che pubblichi ha lo stesso look.",
    },
  },

  "design-copywriting": {
    es: {
      does: "Escribimos todos los textos de tu web: titulares, descripciones de servicios, sección 'sobre nosotros' y textos de botones y formularios. Redactados para que quien visite tu web acabe contactándote.",
      result: "Textos profesionales listos para tu web, escritos para que el visitante actúe.",
      value: "Tu web comunica bien, genera confianza y mueve al visitante a contactar o comprar.",
    },
    en: {
      does: "We write all your website texts: headlines, service descriptions, about section, contact buttons and short texts (buttons, forms). Written to get visitors to contact you.",
      result: "Professional texts ready for your site, written to make visitors take action.",
      value: "Your site communicates clearly, builds trust and moves visitors to contact or buy.",
    },
    ca: {
      does: "Escrivim tots els textos de la teva web: titulars, descripcions de serveis, 'sobre nosaltres', botons de contacte i textos curts (botons, formularis). Pensats perquè el visitant et contacti.",
      result: "Textos professionals llestos per a la teva web, escrits perquè el visitant actuï.",
      value: "La teva web comunica bé, genera confiança i mou el visitant a contactar o comprar.",
    },
    it: {
      does: "Scriviamo tutti i testi del tuo sito: titoli, descrizioni servizi, chi siamo, pulsanti di contatto e testi brevi (pulsanti, moduli). Pensati per far sì che il visitatore ti contatti.",
      result: "Testi professionali pronti per il sito, scritti per far agire il visitatore.",
      value: "Il tuo sito comunica bene, genera fiducia e spinge il visitatore a contattarti o acquistare.",
    },
  },

  "design-email": {
    es: {
      does: "Configuramos tu herramienta de envío de emails (como Mailchimp o Brevo), diseñamos plantillas con tu marca y dejamos listos envíos automáticos de bienvenida y recordatorio.",
      result: "Un sistema de email listo para enviar promociones y mensajes automáticos con tu imagen de marca.",
      value: "Comunicas por email de forma profesional y automatizas los mensajes más repetitivos.",
    },
    en: {
      does: "We set up your email tool (Mailchimp/Brevo), design branded templates and create basic flows (welcome, reminder).",
      result: "An email system ready to send campaigns and automations with your brand look.",
      value: "You communicate via email professionally and automate the most repetitive messages.",
    },
    ca: {
      does: "Configurem la teva eina d'email (Mailchimp/Brevo), dissenyem plantilles amb la teva marca i creem fluxos bàsics (benvinguda, recordatori).",
      result: "Un sistema d'email llest per enviar campanyes i automatitzacions amb la teva imatge.",
      value: "Comuniques per email de forma professional i automatitzes els missatges més repetitius.",
    },
    it: {
      does: "Configuriamo il tuo strumento email (Mailchimp/Brevo), progettiamo template brandizzati e creiamo flussi base (benvenuto, promemoria).",
      result: "Un sistema email pronto per inviare campagne e automazioni con la tua immagine.",
      value: "Comunichi via email in modo professionale e automatizzi i messaggi più ripetitivi.",
    },
  },

  "design-social-kit": {
    es: {
      does: "Creamos plantillas editables en Canva con tu marca: publicaciones, stories, destacados y portadas. Tú solo cambias el texto y la foto.",
      result: "Un kit de +15 plantillas listas para usar en tus redes, todas con tu identidad visual.",
      value: "Publicas contenido bonito y coherente sin necesitar un diseñador cada vez.",
    },
    en: {
      does: "We create editable Canva templates with your brand: posts, stories, highlights and covers. You just change the text and photo.",
      result: "A kit of 15+ ready-to-use templates for your social media, all with your visual identity.",
      value: "You post beautiful, consistent content without needing a designer every time.",
    },
    ca: {
      does: "Creem plantilles editables a Canva amb la teva marca: posts, stories, destacats i portades. Tu només canvies el text i la foto.",
      result: "Un kit de +15 plantilles llestes per usar a les teves xarxes, totes amb la teva identitat visual.",
      value: "Publiques contingut bonic i coherent sense necessitar un dissenyador cada vegada.",
    },
    it: {
      does: "Creiamo template modificabili su Canva con il tuo brand: post, stories, highlight e copertine. Tu cambi solo testo e foto.",
      result: "Un kit di 15+ template pronti all'uso per i tuoi social, tutti con la tua identità visiva.",
      value: "Pubblichi contenuti belli e coerenti senza bisogno di un designer ogni volta.",
    },
  },

  // ── Maintenance & Growth ───────────────────────────────────────
  "maint-basic": {
    es: {
      does: "Cada mes hacemos pequeños cambios en tu web (textos, fotos, secciones), actualizaciones de seguridad y soporte por WhatsApp.",
      result: "Tu web siempre actualizada, segura y con soporte rápido cuando lo necesites.",
      value: "No te preocupas por la parte técnica. Tu web evoluciona contigo sin quedarse obsoleta.",
    },
    en: {
      does: "Every month we make small changes to your site (texts, photos, sections), security updates and WhatsApp support.",
      result: "Your website always updated, secure and with fast support when you need it.",
      value: "You don't worry about the technical side. Your site evolves with you without becoming outdated.",
    },
    ca: {
      does: "Cada mes fem petits canvis a la teva web (textos, fotos, seccions), actualitzacions de seguretat i suport per WhatsApp.",
      result: "La teva web sempre actualitzada, segura i amb suport ràpid quan el necessitis.",
      value: "No et preocupes per la part tècnica. La teva web evoluciona amb tu sense quedar obsoleta.",
    },
    it: {
      does: "Ogni mese facciamo piccole modifiche al sito (testi, foto, sezioni), aggiornamenti di sicurezza e supporto via WhatsApp.",
      result: "Il tuo sito sempre aggiornato, sicuro e con supporto rapido quando ne hai bisogno.",
      value: "Non ti preoccupi della parte tecnica. Il tuo sito evolve con te senza diventare obsoleto.",
    },
  },

  "maint-support": {
    es: {
      does: "Además del mantenimiento básico, dedicamos ~4 horas al mes a mejoras: nuevas secciones, mejoras para conseguir más contactos, ajuste de campañas y soporte prioritario.",
      result: "Tu web mejora activamente cada mes con cambios basados en datos y prioridades claras.",
      value: "Tu negocio digital crece mes a mes sin contratar una agencia para cada cambio.",
    },
    en: {
      does: "On top of basic maintenance, we dedicate ~4 hours/month to improvements: new sections, improvements to get more contacts, campaign tweaks and priority support.",
      result: "Your site actively improves every month with data-driven changes and clear priorities.",
      value: "Your digital business grows month by month without hiring an agency for every change.",
    },
    ca: {
      does: "A més del manteniment bàsic, dediquem ~4 hores al mes a millores: noves seccions, millores perquè més gent et contacti, ajustos de campanyes i suport prioritari.",
      result: "La teva web millora activament cada mes amb canvis basats en dades i prioritats clares.",
      value: "El teu negoci digital creix mes a mes sense contractar una agència per a cada canvi.",
    },
    it: {
      does: "Oltre alla manutenzione base, dedichiamo ~4 ore/mese a miglioramenti: nuove sezioni, miglioramenti per ottenere più contatti, aggiustamenti campagne e supporto prioritario.",
      result: "Il tuo sito migliora attivamente ogni mese con modifiche basate sui dati e priorità chiare.",
      value: "Il tuo business digitale cresce mese per mese senza ingaggiare un'agenzia per ogni modifica.",
    },
  },

  "maint-pro": {
    es: {
      does: "~6 horas mensuales dedicadas: mejoras continuas, nuevas funcionalidades, revisión trimestral de resultados y plan de mejoras priorizado.",
      result: "Un plan de crecimiento activo con revisiones trimestrales y ejecución mensual.",
      value: "Tienes un equipo digital trabajando en tu negocio de forma continua, como un departamento propio.",
    },
    en: {
      does: "~6 dedicated hours/month: ongoing improvements, new features, quarterly performance review and a prioritized improvement plan.",
      result: "An active growth plan with quarterly reviews and monthly execution.",
      value: "You have a digital team working on your business continuously, like your own department.",
    },
    ca: {
      does: "~6 hores mensuals dedicades: millores contínues, noves funcionalitats, revisió trimestral de resultats i pla de millores prioritzat.",
      result: "Un pla de creixement actiu amb revisions trimestrals i execució mensual.",
      value: "Tens un equip digital treballant en el teu negoci de forma contínua, com un departament propi.",
    },
    it: {
      does: "~6 ore/mese dedicate: miglioramenti continui, nuove funzionalità, revisione trimestrale dei risultati e piano di miglioramento prioritizzato.",
      result: "Un piano di crescita attivo con revisioni trimestrali ed esecuzione mensile.",
      value: "Hai un team digitale che lavora sul tuo business continuamente, come un dipartimento interno.",
    },
  },

  // ── AI & Automation ────────────────────────────────────────────
  "ai-chatbot-setup": {
    es: {
      does: "Instalamos un asistente virtual con inteligencia artificial (chatbot) en tu web y/o WhatsApp que responde preguntas frecuentes, guarda datos del visitante y pasa a una persona cuando hace falta.",
      result: "Un asistente virtual funcionando 24/7 que atiende, filtra y registra cada conversación.",
      value: "Atiendes más consultas sin más personal. Captas clientes potenciales incluso de madrugada.",
    },
    en: {
      does: "We implement an AI chatbot on your website and/or WhatsApp that answers common questions, captures visitor data and hands off to a person when appropriate.",
      result: "A virtual assistant running 24/7 that handles, filters and logs every conversation.",
      value: "You handle more enquiries without more staff. You capture potential clients even at midnight.",
    },
    ca: {
      does: "Implementem un chatbot amb IA a la teva web i/o WhatsApp que respon preguntes freqüents, captura dades del visitant i deriva a una persona quan correspon.",
      result: "Un assistent virtual funcionant 24/7 que atén, filtra i registra cada conversa.",
      value: "Atens més consultes sense més personal. Captes clients potencials fins i tot de matinada.",
    },
    it: {
      does: "Implementiamo un chatbot IA sul tuo sito e/o WhatsApp che risponde alle domande frequenti, cattura i dati del visitatore e passa a una persona quando necessario.",
      result: "Un assistente virtuale attivo 24/7 che gestisce, filtra e registra ogni conversazione.",
      value: "Gestisci più richieste senza più personale. Catturi potenziali clienti anche di notte.",
    },
  },

  "ai-chatbot-monthly": {
    es: {
      does: "Revisamos cada mes las conversaciones del asistente virtual, actualizamos respuestas, añadimos nuevas preguntas frecuentes y verificamos que funcione bien.",
      result: "Un asistente virtual que mejora cada mes y se adapta a las nuevas preguntas de tus clientes.",
      value: "Tu asistente virtual se mantiene preciso y útil, no se queda desactualizado.",
    },
    en: {
      does: "We monthly review chatbot conversations, update answers, train new common questions and check for errors.",
      result: "A chatbot that improves every month and adapts to your clients' new questions.",
      value: "Your virtual assistant stays accurate and useful — it doesn't become outdated.",
    },
    ca: {
      does: "Revisem mensualment les converses del chatbot, actualitzem respostes, entrenem noves preguntes freqüents i verifiquem que no hi hagi errors.",
      result: "Un chatbot que millora cada mes i s'adapta a les noves preguntes dels teus clients.",
      value: "El teu assistent virtual es manté precís i útil, no es queda desactualitzat.",
    },
    it: {
      does: "Revisioniamo mensilmente le conversazioni del chatbot, aggiorniamo le risposte, addestriamo nuove domande frequenti e verifichiamo che non ci siano errori.",
      result: "Un chatbot che migliora ogni mese e si adatta alle nuove domande dei clienti.",
      value: "Il tuo assistente virtuale resta preciso e utile — non diventa obsoleto.",
    },
  },

  "ai-automations": {
    es: {
      does: "Identificamos 1 tarea que haces a mano en tu negocio y la dejamos funcionando sola con herramientas de automatización (ejemplo: alguien te escribe → te llega aviso + se guarda en tu lista de contactos + se le envía un email automático).",
      result: "Un proceso automático funcionando que elimina una tarea manual de tu día a día.",
      value: "Ahorras horas cada semana en tareas repetitivas. Menos errores, más velocidad.",
    },
    en: {
      does: "We identify 1 repetitive process in your business and automate it end-to-end (n8n, Make or Zapier) (e.g.: new interested contact → notification + contact manager + email).",
      result: "A working automated flow that removes a manual task from your daily routine.",
      value: "You save hours every week on repetitive tasks. Fewer mistakes, faster execution.",
    },
    ca: {
      does: "Identifiquem 1 procés repetitiu en el teu negoci i el deixem automatitzat de punta a punta (n8n, Make o Zapier) (ex: nou contacte interessat → notificació + gestor de contactes + email).",
      result: "Un flux automàtic funcionant que elimina una tasca manual del teu dia a dia.",
      value: "Estalvies hores cada setmana en tasques repetitives. Menys errors, més velocitat.",
    },
    it: {
      does: "Identifichiamo 1 processo ripetitivo nel tuo business e lo automatizziamo end-to-end (n8n, Make o Zapier) (es: nuovo contatto interessato → notifica + gestore contatti + email).",
      result: "Un flusso automatico funzionante che elimina un'attività manuale dalla tua routine.",
      value: "Risparmi ore ogni settimana su attività ripetitive. Meno errori, più velocità.",
    },
  },

  "ai-audit": {
    es: {
      does: "Analizamos cómo trabajas hoy (ventas, atención al cliente, administración) y te entregamos un informe con las tareas donde la tecnología te puede ahorrar más tiempo y dinero.",
      result: "Un documento claro con diagnóstico y recomendaciones ordenadas por impacto y facilidad de implementar.",
      value: "Sabes exactamente dónde invertir en tecnología para obtener el mayor retorno con el menor esfuerzo.",
    },
    en: {
      does: "We analyze your current processes (sales, support, admin) and deliver a report with the opportunities where AI would save you the most time.",
      result: "A clear document with diagnosis + recommendations prioritized by impact and ease.",
      value: "You know exactly where to invest in technology for the highest return with the least effort.",
    },
    ca: {
      does: "Analitzem els teus processos actuals (vendes, atenció, administració) i entreguem un informe amb les oportunitats on la IA t'estalviaria més temps.",
      result: "Un document clar amb diagnòstic + recomanacions prioritzades per impacte i facilitat.",
      value: "Saps exactament on invertir en tecnologia per obtenir el major retorn amb el menor esforç.",
    },
    it: {
      does: "Analizziamo i tuoi processi attuali (vendite, assistenza, amministrazione) e consegniamo un report con le opportunità dove l'IA ti farebbe risparmiare più tempo.",
      result: "Un documento chiaro con diagnosi + raccomandazioni prioritizzate per impatto e facilità.",
      value: "Sai esattamente dove investire in tecnologia per il massimo ritorno con il minimo sforzo.",
    },
  },
};
