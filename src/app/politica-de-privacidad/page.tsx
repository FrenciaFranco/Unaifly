import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politica de privacidad",
  description: "Politica de privacidad de UNAiFLY.",
  alternates: {
    canonical: "/politica-de-privacidad",
  },
};

export default function PoliticaDePrivacidadPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 text-white sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Política de Privacidad</h1>
      <p className="mt-4 text-white/80">
        En UNAiFLY respetamos tu privacidad y tratamos tus datos personales con confidencialidad, 
        solo para responder consultas, preparar propuestas, mejorar la experiencia del sitio y 
        cumplir con obligaciones legales.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">1. Responsable del tratamiento de datos</h2>
      <div className="mt-3 space-y-2 text-white/80">
        <p><strong>Nombre:</strong> Franco Frencia</p>
        <p><strong>Email:</strong> info@unaifly.com</p>
        <p><strong>Ubicación:</strong> Barcelona, España</p>
        <p><strong>Base legal:</strong> GDPR (UE), LOPDGDD (España)</p>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">2. Datos que recopilamos</h2>
      <h3 className="mt-4 text-lg font-semibold">A. Datos que nos das directamente:</h3>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Formularios de contacto:</strong> Nombre, email, teléfono, mensaje</li>
        <li><strong>Calendly (reservas):</strong> Nombre, email, hora preferida</li>
        <li><strong>WhatsApp:</strong> Teléfono, conversaciones (almacenadas en WhatsApp, no en nuestros servidores)</li>
        <li><strong>Reuniones comerciales:</strong> Información de negocio para propuestas</li>
      </ul>

      <h3 className="mt-4 text-lg font-semibold">B. Datos que recopilamos automáticamente:</h3>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Analítica (Google Analytics):</strong> Páginas visitadas, duración de sesión, dispositivo, navegador, ubicación general</li>
        <li><strong>Cookies:</strong> Ver la <Link href="/politica-de-cookies" className="underline hover:text-white">Política de Cookies</Link></li>
        <li><strong>Logs del servidor:</strong> IP del visitante (registrada anónimamente en GA4)</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">3. Google Analytics y datos de navegación</h2>
      <p className="mt-3 text-white/80">
        <strong>Herramienta:</strong> Google Analytics 4 (GA4) - ID: G-96T6Q7Q7L1
      </p>
      <p className="mt-3 text-white/80">
        <strong>Datos recopilados:</strong>
      </p>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li>Páginas visitadas y eventos clave (clics, descargas, videos)</li>
        <li>Duración de la sesión y número de sesiones</li>
        <li>Dispositivo (móvil, tablet, escritorio) y navegador usado</li>
        <li>Ubicación aproximada (país, ciudad, no dirección exacta)</li>
        <li>IP anonimizada (Google trata los datos, nosotros no vemos tu IP completa)</li>
      </ul>

      <p className="mt-4 text-white/80">
        <strong>¿Por qué?</strong> Para entender cómo usas el sitio, detectar problemas, 
        mejorar contenido y optimizar la experiencia de usuario.
      </p>

      <p className="mt-4 text-white/80">
        <strong>Consentimiento:</strong> GA4 solo se carga si aceptas cookies en el banner. 
        Si rechazas, Google Analytics no se ejecuta.
      </p>

      <p className="mt-4 text-white/80">
        <strong>Más info:</strong> 
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white"> 
          Política de Privacidad de Google
        </a>
      </p>

      <h2 className="mt-8 text-2xl font-semibold">4. Uso de tus datos</h2>
      <p className="mt-3 text-white/80">Usamos tus datos para:</p>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li>✅ Responder a consultas y preguntas</li>
        <li>✅ Preparar presupuestos y propuestas comerciales</li>
        <li>✅ Mejorar el sitio web y la experiencia de usuario</li>
        <li>✅ Enviar comunicaciones comerciales (solo si das consentimiento)</li>
        <li>✅ Cumplir con obligaciones legales (facturación, impuestos)</li>
        <li>✅ Detectar y prevenir fraude</li>
        <li>❌ <strong>NO vendemos</strong> tus datos a terceros</li>
        <li>❌ <strong>NO compartimos</strong> tus datos sin base legal</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">5. Duración del almacenamiento</h2>
      <p className="mt-3 text-white/80">
        Guardamos tus datos el tiempo necesario para cumplir con el propósito:
      </p>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Datos de contacto:</strong> Máximo 3 años (o según obligación fiscal)</li>
        <li><strong>Datos de navegación (GA4):</strong> 2 años</li>
        <li><strong>Cookies:</strong> Según especificado en la <Link href="/politica-de-cookies" className="underline hover:text-white">Política de Cookies</Link></li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">6. Tus derechos</h2>
      <p className="mt-3 text-white/80">
        Según GDPR y LOPDGDD, tienes derecho a:
      </p>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Acceso (ARCO):</strong> Saber qué datos tenemos sobre ti</li>
        <li><strong>Rectificación:</strong> Corregir datos incorrectos</li>
        <li><strong>Supresión:</strong> Eliminar tus datos ("derecho al olvido")</li>
        <li><strong>Portabilidad:</strong> Obtener tus datos en formato transferible</li>
        <li><strong>Oposición:</strong> Rechazar el uso de tus datos para ciertos fines</li>
        <li><strong>Limitación:</strong> Pausar el tratamiento de tus datos</li>
      </ul>

      <p className="mt-4 text-white/80">
        Para ejercer cualquiera de estos derechos, contacta a:
      </p>
      <div className="mt-3 space-y-1 text-white/80">
        <p><strong>Email:</strong> info@unaifly.com</p>
        <p><strong>Teléfono:</strong> +34 644 58 38 08</p>
        <p><strong>Respuesta esperada:</strong> Máximo 30 días</p>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">7. Seguridad de tus datos</h2>
      <p className="mt-3 text-white/80">
        Implementamos medidas técnicas y organizativas para proteger tus datos:
      </p>
      <ul className="mt-2 list-disc space-y-2 pl-6 text-white/80">
        <li>✅ Conexión HTTPS cifrada en todo el sitio</li>
        <li>✅ No almacenamos contraseñas ni datos de tarjetas de crédito</li>
        <li>✅ Acceso restringido a datos personales</li>
        <li>✅ Backups regulares</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">8. Cambios en esta política</h2>
      <p className="mt-3 text-white/80">
        Podemos actualizar esta política cuando lo consideremos necesario. 
        Te notificaremos de cambios importantes. La continua uso del sitio 
        implica tu aceptación de los cambios.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">9. Contacto y reclamaciones</h2>
      <p className="mt-3 text-white/80">
        <strong>Contacto directo:</strong>
      </p>
      <div className="mt-3 space-y-1 text-white/80">
        <p>Email: info@unaifly.com</p>
        <p>Teléfono: +34 644 58 38 08</p>
      </div>

      <p className="mt-6 text-white/80">
        <strong>Autoridad de protección de datos (España):</strong>
      </p>
      <div className="mt-3 space-y-1 text-white/80">
        <p>
          <strong>AEPD</strong> (Agencia Española de Protección de Datos)
        </p>
        <p>
          <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
            www.aepd.es
          </a>
        </p>
      </div>

      <p className="mt-6 text-xs text-white/60">
        Última actualización: Marzo de 2026  
        Esta política cumple con GDPR (UE) y LOPDGDD (España).
      </p>
    </main>
  );
}
