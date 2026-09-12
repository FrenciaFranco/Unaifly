import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso Legal de UNAiFLY.",
  alternates: {
    canonical: "/aviso-legal",
  },
};

export default function AvisoLegalPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-16 text-white sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold sm:text-4xl">Aviso Legal</h1>

      <h2 className="mt-8 text-2xl font-semibold">1. Identificación del responsable</h2>
      <div className="mt-3 space-y-2 text-white/80">
        <p>
          <strong>Nombre legal:</strong> Franco Frencia (Autónomo)
        </p>
        <p>
          <strong>Sector:</strong> Desarrollo web, digitalización y automatización de pymes
        </p>
        <p>
          <strong>Domicilio:</strong> Barcelona, España
        </p>
        <p>
          <strong>Email de contacto:</strong> info@unaifly.com
        </p>
        <p>
          <strong>Teléfono:</strong> +34 644 58 38 08
        </p>
      </div>

      <h2 className="mt-8 text-2xl font-semibold">2. Objeto del sitio web</h2>
      <p className="mt-3 text-white/80">
        Este sitio web tiene por objeto ofrecer información sobre servicios de desarrollo web, 
        digitalización, automatización de procesos y soluciones de inteligencia artificial para empresas 
        en Barcelona y sus alrededores. También permite el contacto directo para consultas y presupuestos.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">3. Propiedad intelectual e industrial</h2>
      <p className="mt-3 text-white/80">
        Todos los contenidos del sitio web (textos, diseños, imágenes, logotipos, código fuente, 
        vídeos y cualquier otro material) están protegidos por derechos de autor y propiedad intelectual 
        según la legislación española e internacional.
      </p>
      <p className="mt-3 text-white/80">
        Está prohibida la reproducción, distribución, transmisión, venta o uso de cualquier contenido 
        de este sitio sin consentimiento expreso y por escrito de UNAiFLY. Esto incluye:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li>Copiar código, diseños o maquetaciones</li>
        <li>Usar contenidos en otros sitios web sin autorización</li>
        <li>Modificar o crear derivados sin permiso</li>
        <li>Usar logs, imágenes o vídeos de nuestros proyectos</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">4. Limitación de responsabilidad</h2>
      <p className="mt-3 text-white/80">
        UNAiFLY no se responsabiliza por:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li>Errores, omisiones o fallos en el contenido de este sitio</li>
        <li>Disponibilidad ininterrumpida del sitio (puede haber mantenimientos)</li>
        <li>Daños derivados del uso de la información aquí contenida</li>
        <li>Fallos en la transmisión de datos o pérdida de información</li>
        <li>Virus, malware u otros problemas de seguridad derivados del acceso</li>
      </ul>

      <h2 className="mt-8 text-2xl font-semibold">5. Enlaces a terceros</h2>
      <p className="mt-3 text-white/80">
        Este sitio puede contener enlaces a sitios web de terceros (Calendly, WhatsApp, redes sociales, etc.). 
        UNAiFLY no controla estos sitios ni es responsable de su contenido, disponibilidad, prácticas de 
        privacidad o cumplimiento legal. Al acceder a sitios externos, el usuario acepta que lo hace bajo 
        su propia responsabilidad.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">6. Modificación del aviso</h2>
      <p className="mt-3 text-white/80">
        UNAiFLY se reserva el derecho de modificar este aviso legal en cualquier momento. 
        Los cambios entraránm en vigor inmediatamente tras su publicación en el sitio.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">7. Derecho aplicable y jurisdicción</h2>
      <p className="mt-3 text-white/80">
        Este aviso legal se rige por la ley española, en particular por:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-white/80">
        <li><strong>Ley Orgánica de Protección de Datos (LOPDGDD)</strong></li>
        <li><strong>Reglamento General de Protección de Datos (GDPR)</strong></li>
        <li><strong>Ley de Servicios de la Sociedad de la Información (LSSI-CE)</strong></li>
        <li><strong>Ley de Propiedad Intelectual</strong></li>
      </ul>
      <p className="mt-3 text-white/80">
        Cualquier disputa será resuelta por los juzgados y tribunales competentes de Barcelona, España.
      </p>

      <h2 className="mt-8 text-2xl font-semibold">8. Contacto para reclamaciones y sanciones</h2>
      <p className="mt-3 text-white/80">
        Para cualquier reclamación, denuncia o solicitud de derechos:
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
      </p>
    </main>
  );
}
