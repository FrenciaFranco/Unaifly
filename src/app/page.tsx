import ConsultingHome from "@/components/consulting-home";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://unaifly.com/#organization",
        name: "UNAiFLY",
        url: "https://unaifly.com",
        logo: "https://unaifly.com/logo.png",
        areaServed: "Barcelona",
      },
      {
        "@type": "WebSite",
        "@id": "https://unaifly.com/#website",
        url: "https://unaifly.com",
        name: "UNAiFLY",
        inLanguage: "es",
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://unaifly.com/#localbusiness",
        name: "UNAiFLY",
        alternateName: "Unaifly",
        areaServed: "Barcelona",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Barcelona",
          addressRegion: "Cataluna",
          addressCountry: "ES",
        },
        url: "https://unaifly.com",
        image: "https://unaifly.com/logo.png",
        parentOrganization: {
          "@id": "https://unaifly.com/#organization",
        },
        description:
          "Consultoría tecnológica en Barcelona. Analizamos y optimizamos procesos empresariales con automatización, inteligencia artificial, integraciones y sistemas a medida.",
        knowsAbout: [
          "Consultoría tecnológica",
          "Análisis y optimización de procesos empresariales",
          "Automatización administrativa y operativa",
          "Inteligencia artificial y agentes de IA",
          "CRM y automatización comercial",
          "Captación, seguimiento y gestión de leads",
          "Integraciones entre herramientas y sistemas",
          "Automatización de atención al cliente",
          "Dashboards, reporting y gestión de datos",
          "Sistemas internos y desarrollo web a medida",
        ],
      },
      {
        "@type": "Service",
        "@id": "https://unaifly.com/#servicio-consultoria",
        serviceType: "Consultoría tecnológica y optimización de procesos empresariales",
        areaServed: "Barcelona",
        url: "https://unaifly.com/#metodo",
        provider: {
          "@id": "https://unaifly.com/#organization",
        },
      },
      {
        "@type": "Service",
        "@id": "https://unaifly.com/#servicio-digitalizacion",
        serviceType: "Digitalización, integraciones y sistemas internos para empresas",
        areaServed: "Barcelona",
        url: "https://unaifly.com/digitalizacion-empresas-barcelona",
        provider: {
          "@id": "https://unaifly.com/#organization",
        },
      },
      {
        "@type": "Service",
        "@id": "https://unaifly.com/#servicio-ia",
        serviceType: "Automatización, inteligencia artificial y agentes de IA para empresas",
        areaServed: "Barcelona",
        url: "https://unaifly.com/inteligencia-artificial-empresas-barcelona",
        provider: {
          "@id": "https://unaifly.com/#organization",
        },
      },
      {
        "@type": "Service",
        "@id": "https://unaifly.com/#servicio-desarrollo-web",
        serviceType: "Desarrollo web integrado en soluciones empresariales",
        areaServed: "Barcelona",
        url: "https://unaifly.com/desarrollo-web-barcelona",
        provider: { "@id": "https://unaifly.com/#organization" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ConsultingHome />
    </>
  );
}
