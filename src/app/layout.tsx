import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import CookieBanner from "@/components/cookie-banner";

const GA_ID = "G-96T6Q7Q7L1";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://unaifly.com"),
  title: {
    default: "UNAiFLY | Consultoría tecnológica, automatización e IA",
    template: "%s | UNAiFLY",
  },
  description:
    "Analizamos y mejoramos los procesos de tu empresa con automatización, inteligencia artificial, integraciones y sistemas a medida. Consultoría tecnológica en Barcelona.",
  keywords: [
    "consultoría tecnológica Barcelona",
    "optimización de procesos empresariales",
    "automatización administrativa y operativa",
    "automatización de procesos",
    "inteligencia artificial para empresas",
    "agentes de IA",
    "CRM y automatización comercial",
    "integraciones entre sistemas",
    "dashboards y reporting",
    "gestión de datos",
    "sistemas internos a medida",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    siteName: "UNAiFLY",
    title: "UNAiFLY | Consultoría tecnológica, automatización e IA",
    description:
      "Primero entendemos tu empresa. Después diseñamos automatizaciones, IA y sistemas para ahorrar tiempo, reducir costes y mejorar la operación.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNAiFLY | Consultoría tecnológica, automatización e IA",
    description:
      "Mejoramos los procesos de tu empresa con automatización, IA, integraciones y sistemas inteligentes.",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* ── GA4 + Consent Mode v2: Standard Google snippet ── */}
        {/* Step 1: Define gtag function + consent defaults BEFORE anything loads */}
        <Script
          id="gtag-consent-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted',
                wait_for_update: 500
              });

              gtag('js', new Date());
              gtag('config', '${GA_ID}', { send_page_view: false });
            `,
          }}
        />
        {/* Step 2: Load gtag.js asynchronously */}
        <Script
          id="gtag-js"
          strategy="beforeInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
