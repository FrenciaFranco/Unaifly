import type { ChatMessage } from "./chatbotData";

export const consultingFaq: ChatMessage[] = [
  {
    id: "consulting-services", category: "services", keywords: ["procesos", "process", "automatización", "IA", "CRM", "servicios", "services"],
    question: { es: "¿Cómo podéis mejorar mi empresa?", en: "How can you improve my business?", ca: "Com podeu millorar la meva empresa?", it: "Come potete migliorare la mia impresa?" },
    answer: {
      es: "Analizamos cómo trabaja tu equipo y detectamos tareas repetitivas, cuellos de botella y oportunidades. Después diseñamos la solución adecuada: automatización, IA, CRM, integraciones, datos o sistemas internos. Primero entendemos el negocio.",
      en: "We study how your team works and identify repetitive tasks, bottlenecks and opportunities. Then we design the right solution: automation, AI, CRM, integrations, data or internal systems. We understand the business first.",
      ca: "Analitzem com treballa el teu equip i detectem tasques repetitives, colls d'ampolla i oportunitats. Després dissenyem la solució adequada: automatització, IA, CRM, integracions, dades o sistemes interns. Primer entenem el negoci.",
      it: "Analizziamo come lavora il tuo team e individuiamo attività ripetitive, colli di bottiglia e opportunità. Poi progettiamo la soluzione adatta: automazione, IA, CRM, integrazioni, dati o sistemi interni. Prima comprendiamo il business.",
    },
  },
  {
    id: "consulting-start", category: "process", keywords: ["análisis", "diagnóstico", "empezar", "start", "contacto", "reunión"],
    question: { es: "¿Cómo empezamos?", en: "How do we get started?", ca: "Com comencem?", it: "Come iniziamo?" },
    answer: {
      es: "Cuéntanos por WhatsApp qué os está quitando tiempo o reserva una llamada desde la sección de diagnóstico. Analizamos, detectamos oportunidades, diseñamos, implementamos y medimos. Definimos el alcance contigo antes de empezar.",
      en: "Tell us on WhatsApp what is taking up your time, or book a call in the diagnosis section. We analyze, identify opportunities, design, implement and measure. We agree on the scope with you before starting.",
      ca: "Explica'ns per WhatsApp què us està traient temps o reserva una trucada a la secció de diagnòstic. Analitzem, detectem oportunitats, dissenyem, implementem i mesurem. Definim l'abast amb tu abans de començar.",
      it: "Raccontaci su WhatsApp cosa vi fa perdere tempo o prenota una chiamata nella sezione di analisi. Analizziamo, individuiamo opportunità, progettiamo, implementiamo e misuriamo. Concordiamo l'ambito prima di iniziare.",
    },
  },
  {
    id: "consulting-pricing", category: "pricing", keywords: ["precio", "coste", "price", "cost", "preu", "prezzo"],
    question: { es: "¿Cuánto cuesta una solución?", en: "How much does a solution cost?", ca: "Quant costa una solució?", it: "Quanto costa una soluzione?" },
    answer: {
      es: "Depende de los procesos, las herramientas que utilizas y el alcance de la mejora. Tras entender tu situación, definimos una propuesta. Los importes del planificador corresponden a servicios individuales, no a un diagnóstico completo ni a una solución empresarial cerrada.",
      en: "It depends on your processes, existing tools and the scope of the improvement. Once we understand your situation, we define a proposal. Planner amounts cover individual services, not a complete diagnosis or a fixed business solution.",
      ca: "Depèn dels processos, les eines que utilitzes i l'abast de la millora. Després d'entendre la situació, definim una proposta. Els imports del planificador són de serveis individuals, no d'un diagnòstic complet ni d'una solució empresarial tancada.",
      it: "Dipende dai processi, dagli strumenti utilizzati e dall'ambito del miglioramento. Dopo aver compreso la situazione, definiamo una proposta. Gli importi del pianificatore riguardano singoli servizi, non un'analisi completa o una soluzione aziendale a prezzo fisso.",
    },
  },
  {
    id: "consulting-tools", category: "services", keywords: ["herramientas", "tools", "Excel", "integraciones", "CRM", "web"],
    question: { es: "¿Tengo que cambiar mis herramientas?", en: "Do I need to replace my tools?", ca: "He de canviar les meves eines?", it: "Devo cambiare i miei strumenti?" },
    answer: {
      es: "Primero revisamos lo que ya utilizas. Siempre que sea adecuado, conectamos y mejoramos esas herramientas. Solo proponemos nuevos sistemas, agentes de IA o desarrollo web cuando responden a una necesidad real.",
      en: "We first review what you already use. Where appropriate, we connect and improve those tools. We propose new systems, AI agents or web development when they meet a real need.",
      ca: "Primer revisem el que ja utilitzes. Quan és adequat, connectem i millorem aquestes eines. Proposem nous sistemes, agents d'IA o desenvolupament web quan responen a una necessitat real.",
      it: "Prima esaminiamo ciò che già utilizzi. Quando opportuno, colleghiamo e miglioriamo questi strumenti. Proponiamo nuovi sistemi, agenti IA o sviluppo web quando rispondono a un'esigenza reale.",
    },
  },
];
