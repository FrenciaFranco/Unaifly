import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unaifly.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services-builder",
    "/desarrollo-web-barcelona",
    "/desarrollo-web-restaurantes-barcelona",
    "/desarrollo-web-cafes-barcelona",
    "/desarrollo-web-clinicas-barcelona",
    "/desarrollo-web-bares-barcelona",
    "/desarrollo-web-esteticas-barcelona",
    "/desarrollo-web-barberias-barcelona",
    "/digitalizacion-empresas-barcelona",
    "/inteligencia-artificial-empresas-barcelona",
    "/terminos-y-condiciones",
    "/politica-de-privacidad",
    "/politica-de-cookies",
    "/aviso-legal",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
