import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, BriefcaseBusiness, ClipboardList, Database, Headphones, Layers3, Megaphone, Plus, Settings2, MessageCircle } from "lucide-react";
import DiagnosticContact, { CookieSettings } from "./diagnostic-contact";
import HeroFuturistic from "./ui/hero-futuristic";
import { ThemeSwitch, HomeTools } from "./home-controls";
import wordlogo from "../../images/wordlogo.png";
import styles from "./consulting-home.module.css";

const steps = [
  ["Analizamos", "Escuchamos a tu equipo y entendemos cómo trabaja, qué herramientas utiliza y qué objetivos tiene."],
  ["Detectamos oportunidades", "Identificamos tareas repetitivas, cuellos de botella y mejoras. Priorizamos por impacto y esfuerzo."],
  ["Diseñamos la solución", "Definimos qué cambiar, cómo hacerlo y con qué indicadores comprobar si funciona."],
  ["Implementamos", "Conectamos herramientas, automatizamos y ponemos el sistema en marcha con tu equipo."],
  ["Medimos y mejoramos", "Revisamos tiempos, errores y resultados. Ajustamos la solución a la evolución de tu empresa."],
];

const problems = [
  ["Tu equipo pierde horas copiando información entre herramientas.", "Conectamos tus sistemas para que los datos pasen de uno a otro sin volver a introducirlos. Definimos validaciones para detectar errores antes de que se propaguen."],
  ["Los comerciales hacen seguimiento manual de cada lead.", "Centralizamos los contactos interesados en un CRM, organizamos las oportunidades y automatizamos recordatorios y seguimientos para que el equipo sepa a quién atender y cuándo."],
  ["Administración repite las mismas tareas cada día.", "Automatizamos la recogida de documentos, el registro de datos y los avisos de aprobación. Tu equipo conserva el control de las decisiones y dedica menos tiempo a tareas mecánicas."],
  ["Los clientes hacen siempre las mismas preguntas.", "Diseñamos una atención automatizada con información de tu empresa. Resuelve consultas habituales, recoge solicitudes y deriva a una persona cuando necesita ayuda."],
  ["La información está repartida entre Excel, emails y el CRM.", "Organizamos y centralizamos los datos, eliminamos duplicidades y conectamos las fuentes para que cada persona encuentre la información que necesita."],
  ["Los responsables no ven con claridad qué ocurre en la empresa.", "Creamos paneles de seguimiento con indicadores de ventas, operaciones y carga de trabajo. Así puedes detectar retrasos y decidir con información actualizada."],
];

const areas = [
  { name: "Ventas", icon: BriefcaseBusiness, text: "Captación, seguimiento y gestión de leads y oportunidades." },
  { name: "Administración", icon: ClipboardList, text: "Documentos, registros, aprobaciones y tareas recurrentes." },
  { name: "Operaciones", icon: Settings2, text: "Coordinación de equipos, pedidos y flujos de trabajo." },
  { name: "Atención al cliente", icon: Headphones, text: "Consultas, solicitudes y derivación al equipo adecuado." },
  { name: "Marketing", icon: Megaphone, text: "Conexión entre campañas, contactos y seguimiento comercial." },
  { name: "Reporting", icon: BarChart3, text: "Indicadores claros para conocer la evolución del negocio." },
  { name: "Gestión de datos", icon: Database, text: "Información centralizada, ordenada y disponible." },
  { name: "Sistemas internos", icon: Layers3, text: "Herramientas a medida que se adaptan a tu forma de trabajar." },
];

const cases = [
  { area: "Ventas", title: "Cada oportunidad llega a la persona adecuada.", situation: "Una empresa recibe leads por formularios, email y campañas. Los comerciales los reúnen y persiguen manualmente.", solution: "Centralizamos los leads en el CRM, automatizamos el seguimiento y utilizamos IA para ayudar a priorizar oportunidades.", result: "Menos trabajo manual y mayor velocidad comercial." },
  { area: "Administración", title: "Del documento al registro, sin copiar cada dato.", situation: "El equipo recibe facturas por email, copia los datos y pregunta por el estado de cada aprobación.", solution: "Organizamos la entrada de documentos, extraemos la información y conectamos el registro con un circuito de revisión y aprobación.", result: "Menos transcripción y mayor control de los documentos pendientes." },
  { area: "Atención al cliente", title: "Las consultas frecuentes dejan espacio a las importantes.", situation: "El equipo responde una y otra vez sobre horarios, servicios o el estado de una solicitud.", solution: "Preparamos un agente de IA con información validada, conectado a los sistemas necesarios y con derivación a una persona.", result: "Respuestas más ágiles y más tiempo para los casos que necesitan atención personal." },
  { area: "Operaciones y reporting", title: "Una visión compartida de lo que está pasando.", situation: "Los responsables reúnen hojas de cálculo de varios departamentos para saber qué pedidos van con retraso.", solution: "Conectamos las fuentes de datos, creamos un panel compartido y configuramos avisos ante bloqueos o desviaciones.", result: "Menos preparación de informes y más visibilidad para tomar decisiones." },
];

const technologies = [
  ["Automatizaciones e integraciones", "Para que las tareas avancen y las herramientas compartan información mediante conexiones y APIs."],
  ["IA y agentes de IA", "Para interpretar documentos, clasificar solicitudes y asistir al equipo con límites y supervisión definidos."],
  ["CRM y automatización comercial", "Para centralizar contactos, coordinar el seguimiento y dar continuidad a cada oportunidad."],
  ["Dashboards y datos", "Para reunir la información y convertirla en indicadores que ayuden a decidir."],
  ["Sistemas internos a medida", "Para resolver necesidades de gestión que tus herramientas actuales no cubren."],
  ["Desarrollo web", "Cuando la solución necesita una web, un portal o un formulario conectado a tus procesos y sistemas."],
];

export default function ConsultingHome() {
  return (
    <div className={styles.page}>
      <a href="#contenido" className={styles.skipLink}>Saltar al contenido</a>
      <header className={`${styles.container} ${styles.header}`}>
        <Link href="/" className={styles.brand} aria-label="UNAiFLY, inicio">
          <Image src={wordlogo} alt="UNAiFLY" className={styles.wordLogo} sizes="(max-width: 520px) 130px, 180px" priority />
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <a href="#metodo">Cómo trabajamos</a>
          <a href="#soluciones">Qué mejoramos</a>
          <a href="#casos">Casos de uso</a>
        </nav>
        <div className={styles.headerActions}><ThemeSwitch /><a href="#diagnostico" className={styles.headerCta}>Analizar mi empresa</a></div>
      </header>

      <main id="contenido">
        <HeroFuturistic consulting />

        <section className={styles.positioning} aria-labelledby="positioning-title">
          <div className={`${styles.container} ${styles.positioningGrid}`}>
            <h2 id="positioning-title">No empezamos por la tecnología. Empezamos por entender tu empresa.</h2>
            <div><p>Nos sentamos con quienes conocen el trabajo diario. Vemos cómo entra una solicitud, quién la gestiona, dónde se repite trabajo y qué impide avanzar.</p><p>Después proponemos la solución adecuada: simplificar un proceso, automatizar una tarea, conectar herramientas o desarrollar un sistema. La IA entra cuando aporta valor.</p><p className={styles.positioningEnd}>Cada cambio debe responder a una necesidad real del negocio.</p></div>
          </div>
        </section>

        <section id="metodo" className={`${styles.container} ${styles.section}`} aria-labelledby="method-title">
          <div className={styles.sectionHeading}><h2 id="method-title">Cómo trabajamos</h2><p>De entender el problema a comprobar la mejora. Un proceso compartido con tu equipo.</p></div>
          <ol className={styles.steps}>{steps.map(([title, description], index) => <li key={title}><div className={styles.stepTop}><span>{String(index + 1).padStart(2, "0")}</span>{index < steps.length - 1 && <ArrowRight size={20} aria-hidden="true" />}</div><h3>{title}</h3><p>{description}</p></li>)}</ol>
        </section>

        <section id="soluciones" className={`${styles.container} ${styles.section} ${styles.problems}`} aria-labelledby="problems-title">
          <div><h2 id="problems-title">¿Te suena alguno de estos problemas?</h2><p className={styles.sectionIntro}>El trabajo repetitivo suele parecer parte del día a día. No tiene por qué seguir siéndolo.</p><a className={styles.textLink} href="#diagnostico">Cuéntanos qué está pasando <ArrowRight size={17} aria-hidden="true" /></a></div>
          <div className={styles.problemList}>{problems.map(([problem, solution], index) => <details key={problem} open={index === 0}><summary>{problem}<Plus size={20} aria-hidden="true" /></summary><p>{solution}</p></details>)}</div>
        </section>

        <section id="areas" className={styles.areasSection} aria-labelledby="areas-title">
          <div className={`${styles.container} ${styles.section}`}>
            <div className={styles.sectionHeading}><h2 id="areas-title">Áreas que podemos optimizar</h2><p>Miramos cada departamento y, sobre todo, lo que ocurre entre ellos.</p></div>
            <div className={styles.areas}>{areas.map(({ name, icon: Icon, text }) => <article key={name}><Icon size={25} strokeWidth={1.5} aria-hidden="true" /><h3>{name}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        <section id="casos" className={`${styles.container} ${styles.section}`} aria-labelledby="cases-title">
          <div className={styles.sectionHeading}><h2 id="cases-title">Así se traduce en el día a día</h2><p>Ejemplos de aplicación y beneficios esperados. El alcance y los resultados se definen tras analizar cada empresa.</p></div>
          <div className={styles.cases}>{cases.map(item => <article key={item.title} className={styles.case}><p className={styles.caseArea}>{item.area}</p><h3>{item.title}</h3><dl><dt>La situación</dt><dd>{item.situation}</dd><dt>La solución</dt><dd>{item.solution}</dd><div className={styles.caseResult}><dt>Qué buscamos mejorar</dt><dd>{item.result}</dd></div></dl></article>)}</div>
        </section>

        <section id="tecnologia" className={`${styles.container} ${styles.section} ${styles.technology}`} aria-labelledby="technology-title">
          <div><h2 id="technology-title">La tecnología adecuada para cada mejora.</h2><p className={styles.sectionIntro}>Aprovechamos las herramientas que ya utilizas y añadimos lo que haga falta. Elegimos según el problema, la integración y el uso que hará tu equipo.</p></div>
          <div className={styles.techList}>{technologies.map(([name, text]) => <article key={name}><h3>{name}</h3><p>{text}</p></article>)}</div>
        </section>

        <section id="diagnostico" className={styles.diagnostic} aria-labelledby="diagnostic-title">
          <div className={styles.container}><div className={styles.contactInvitation}><h2>¿Listo para dar el siguiente paso?</h2><p>Cuéntanos qué necesita tu empresa. Empezamos por entender tus procesos y detectar dónde podemos ayudarte.</p><div className={styles.contactActions}><a href="https://wa.me/34644583808?text=Hola%2C%20quiero%20analizar%20los%20procesos%20de%20mi%20empresa." target="_blank" rel="noopener noreferrer" className={styles.whatsappCta}><MessageCircle size={19} aria-hidden="true" />Hablemos por WhatsApp</a><a href="https://calendly.com/frencia92/30min" target="_blank" rel="noopener noreferrer" className={styles.meetingCta}>Agenda una reunión <ArrowRight size={17} aria-hidden="true" /></a></div></div></div>
          <div className={`${styles.container} ${styles.diagnosticGrid}`} >
            <div><h2 id="diagnostic-title">¿Qué procesos de tu empresa podrían funcionar mejor?</h2><p className={styles.lead}>Analizamos tu situación y detectamos oportunidades de automatización y mejora.</p><p>Cuéntanos cómo trabajáis y qué os está quitando tiempo. Empezaremos por entenderlo y valorar dónde tiene sentido actuar.</p><a href="https://calendly.com/frencia92/30min" target="_blank" rel="noopener noreferrer" className={styles.textLink}>También puedes reservar una llamada <ArrowRight size={17} aria-hidden="true" /></a></div>
            <DiagnosticContact />
          </div>
        </section>
      </main>

      <footer className={`${styles.container} ${styles.footer}`}>
        <div className={styles.footerTop}><div><Link href="/" className={styles.brand}><Image src={wordlogo} alt="UNAiFLY" className={styles.wordLogo} sizes="180px" /></Link><p>Consultoría tecnológica, automatización e IA.<br />Procesos y sistemas que ayudan a tu empresa a funcionar mejor.</p></div><div><p>Barcelona · Trabajamos en remoto en España</p><a href="mailto:info@unaifly.com">info@unaifly.com</a><a href="https://wa.me/34644583808" target="_blank" rel="noopener noreferrer">+34 644 58 38 08</a></div></div>
        <nav className={styles.footerServices} aria-label="Más sobre nuestras soluciones"><Link href="/digitalizacion-empresas-barcelona">Digitalización de empresas</Link><Link href="/inteligencia-artificial-empresas-barcelona">IA aplicada a empresas</Link><Link href="/desarrollo-web-barcelona">Desarrollo web como parte de tu solución</Link></nav>
        <div className={styles.footerBottom}><span>© {new Date().getFullYear()} UNAiFLY</span><nav aria-label="Información legal"><Link href="/aviso-legal">Aviso legal</Link><Link href="/politica-de-privacidad">Privacidad</Link><Link href="/terminos-y-condiciones">Términos y condiciones</Link><Link href="/politica-de-cookies">Cookies</Link><CookieSettings /></nav></div>
      </footer>
      <HomeTools />
    </div>
  );
}
