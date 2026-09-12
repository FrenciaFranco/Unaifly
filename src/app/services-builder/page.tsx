import type { Metadata } from "next";
import ServiceBuilder from "@/components/ui/service-builder";

export const metadata: Metadata = {
  title: "Planificador de servicios digitales",
  description: "Elige los servicios que tu negocio necesita y calcula precios en tiempo real.",
  alternates: {
    canonical: "/services-builder",
  },
};

export default async function ServicesBuilderPage({ searchParams }: { searchParams: Promise<{ language?: string; currency?: string }> }) {
  const params = await searchParams;
  const language = ["es", "en", "ca", "it"].includes(params.language ?? "") ? params.language as "es" | "en" | "ca" | "it" : undefined;
  const currency = ["EUR", "USD", "ARS", "BTC"].includes(params.currency ?? "") ? params.currency as "EUR" | "USD" | "ARS" | "BTC" : undefined;
  return <ServiceBuilder initialLanguage={language} initialCurrency={currency} />;
}
