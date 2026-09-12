import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Política de Cookies de UNAiFLY.",
  alternates: {
    canonical: "/politica-de-cookies",
  },
};

export default function PoliticaDeCookiesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 text-white sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Política de Cookies</h1>

      <p className="mt-4 text-white/80">
        Esta política explica qué son las cookies, qué tipos utilizamos en el sitio web de UNAiFLY, 
        para qué las usamos, quién las controla y cómo puedes gestionar tu consentimiento.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">¿Qué es una cookie?</h2>
      <p className="mt-3 text-white/80">
        Una cookie es un pequeño archivo de texto que se almacena en tu dispositivo (ordenador, móvil, tablet) 
        cuando visitas un sitio web. Las cookies tiene múltiples funciones: permiten recordar tus preferencias, 
        mejorar tu experiencia de navegación, analizar cómo usas el sitio y facilitar funcionalidades específicas.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Consentimiento y control</h2>
      <p className="mt-3 text-white/80">
        <strong>Importante:</strong> UNAiFLY respeta tu privacidad. En tu primer acceso al sitio, 
        verás un banner con opciones:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Aceptar:</strong> Permite todas las cookies necesarias y de análisis</li>
        <li><strong>Rechazar:</strong> Solo se cargan cookies técnicas estrictamente necesarias</li>
        <li><strong>Configurar Cookies:</strong> Puedes cambiar tu decisión en cualquier momento (botón en pie de página)</li>
      </ul>

      <p className="mt-4 text-white/80">
        <strong>Tú controlas tu consentimiento.</strong> Puedes revocar tu decisión en cualquier momento 
        haciendo clic en el botón "Configurar Cookies" en el pie de página.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Tipos de cookies que utilizamos</h2>

      <h3 className="mt-6 text-xl font-semibold">1. Cookies Técnicas / Necesarias</h3>
      <p className="mt-3 text-white/80">
        <strong>Propósito:</strong> Garantizar la funcionalidad básica del sitio, seguridad y experiencia de usuario.
      </p>
      <p className="mt-3 text-white/80">
        <strong>Requieren consentimiento:</strong> No (se cargan siempre para que el sitio funcione)
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-white/20 text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Nombre</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Propósito</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Duración</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Proveedor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">unaifly_cookie_consent</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Guardar tu decisión sobre cookies (Aceptar/Rechazar)</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">1 año</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">UNAiFLY</td>
            </tr>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">theme</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Guardar preferencia de tema (oscuro/claro)</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Sesión</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">UNAiFLY</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-xl font-semibold">2. Cookies de Análisis (Analytics)</h3>
      <p className="mt-3 text-white/80">
        <strong>Propósito:</strong> Entender cómo los usuarios interactúan con nuestro sitio para mejorarlo. 
        Nos permite detectar páginas problemáticas, medir conversiones y optimizar contenido.
      </p>
      <p className="mt-3 text-white/80">
        <strong>Requieren consentimiento:</strong> Sí (solo si aceptas en el banner)
      </p>
      <p className="mt-3 text-white/80">
        <strong>Datos que se recopilan:</strong> Páginas visitadas, duración de sesión, ubicación general (país/ciudad), 
        dispositivo usado. <strong>NO se recopila información personal identificable sin tu consentimiento.</strong>
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-white/20 text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Nombre</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Propósito</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Duración</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Proveedor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">_ga</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Identificador único para este navegador (Google Analytics)</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">2 años</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Google (ID: G-96T6Q7Q7L1)</td>
            </tr>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">_ga_G-96T6Q7Q7L1</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Seguimiento de sesión GA4 y comportamiento del usuario</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">2 años</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Google (GA4)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mt-8 text-xl font-semibold">3. Cookies de Preferencias (Funcionalidad)</h3>
      <p className="mt-3 text-white/80">
        <strong>Propósito:</strong> Recordar tus preferencias personales para personalizar tu experiencia.
      </p>
      <p className="mt-3 text-white/80">
        <strong>Requieren consentimiento:</strong> Sí (si aceptas cookies de preferencias)
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border border-white/20 text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Nombre</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Propósito</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Duración</th>
              <th className="border border-white/20 px-3 py-2 text-left text-white">Proveedor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">language</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Guardar tu idioma preferido (es, en, ca, it)</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">1 año</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">UNAiFLY</td>
            </tr>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">currency</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Guardar moneda preferida (EUR, USD, ARS, BTC)</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">1 año</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">UNAiFLY</td>
            </tr>
            <tr>
              <td className="border border-white/20 px-3 py-2 text-white/80">bubble-corner</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Guardar posición del bubble de información</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">Sesión</td>
              <td className="border border-white/20 px-3 py-2 text-white/80">UNAiFLY</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">Cookies de terceros</h2>
      <p className="mt-3 text-white/80">
        Nuestro sitio puede contener enlaces a servicios de terceros que también usan cookies:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Calendly:</strong> Calendario de reservas (sujeto a su Política de Cookies)</li>
        <li><strong>WhatsApp:</strong> Enlaces para contacto directo (no almacenan datos en nuestro sitio)</li>
        <li><strong>Google Fonts:</strong> Fuentes (no usan cookies de seguimiento)</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">¿Cómo revocar consentimiento o eliminar cookies?</h2>

      <h3 className="mt-6 text-lg font-semibold">Opción 1: Usar "Configurar Cookies"</h3>
      <p className="mt-3 text-white/80">
        Haz clic en el botón <strong>"Configurar Cookies"</strong> en el pie de página de cualquier página del sitio. 
        Se abrirá el banner de consentimiento para que cambies tu decisión.
      </p>

      <h3 className="mt-6 text-lg font-semibold">Opción 2: Eliminar cookies desde tu navegador</h3>
      <p className="mt-3 text-white/80">
        Puedes eliminar todas las cookies de unaifly.com directamente desde la configuración de tu navegador:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li>
          <strong>Chrome:</strong> Configuración → Privacidad y seguridad → Borrar datos de navegación 
          → Selecciona "Cookies y otros datos de sitios" → Indicador de tiempo: "Todo el tiempo" → Borrar datos
        </li>
        <li>
          <strong>Firefox:</strong> Preferencias → Privacidad y seguridad → Historial → 
          "Consentimiento de cookies" → "Borrar datos del sitio" → Selecciona unaifly.com
        </li>
        <li>
          <strong>Safari:</strong> Preferencias → Privacidad → Administrar datos de sitios web → 
          Selecciona unaifly.com → Eliminar
        </li>
        <li>
          <strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Borrar datos de navegación 
          → "Cookies y otros datos de sitios" → Borrar datos
        </li>
      </ul>

      <h3 className="mt-6 text-lg font-semibold">Opción 3: Desactivar cookies a nivel global</h3>
      <p className="mt-3 text-white/80">
        Puedes configurar tu navegador para rechazar todas las cookies automáticamente, aunque esto 
        puede afectar la funcionalidad de algunos sitios web.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Privacidad en Google Analytics</h2>
      <p className="mt-3 text-white/80">
        Usamos Google Analytics con anonimización de IP, lo que significa que Google no puede identificar 
        tu dirección IP real. Además, respetamos tus decisiones sobre cookies:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li>Si rechazas cookies, Google Analytics <strong>NO se carga</strong></li>
        <li>Si aceptas, solo recopilamos datos agregados y anónimos</li>
        <li>Google respeta el "Do Not Track" si lo tienes activado en tu navegador</li>
      </ul>

      <p className="mt-4 text-sm text-white/60">
        Más info: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Política de Privacidad de Google</a>
      </p>

      <h2 className="mt-8 text-2xl font-semibold">Contacto para dudas sobre cookies</h2>
      <p className="mt-3 text-white/80">
        Si tienes preguntas sobre esta política de cookies, cómo gestionamos tus datos o deseas ejercer 
        tus derechos (acceso, rectificación, eliminación), contáctanos:
      </p>
      <div className="mt-3 space-y-1 text-white/80">
        <p>
          <strong>Email:</strong> info@unaifly.com
        </p>
        <p>
          <strong>Teléfono:</strong> +34 644 58 38 08
        </p>
        <p>
          <strong>Respuesta media:</strong> Menos de 24 horas
        </p>
      </div>

      <p className="mt-6 text-xs text-white/60">
        Última actualización: Marzo de 2026  
        Esta política cumple con GDPR (UE), LOPDGDD (España) y LSSI-CE.
      </p>
    </main>
  );
}
