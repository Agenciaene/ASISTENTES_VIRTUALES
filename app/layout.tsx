import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Master Chat - Asistentes Virtuales Especializados con IA",
  description:
    "Potencia tu empresa con asistentes virtuales especializados con IA conversacional de última generación. Integra inteligencia artificial en tu sitio web empresarial para mejorar la atención al cliente y automatizar procesos.",
  keywords: [
    "asistentes virtuales",
    "IA conversacional",
    "inteligencia artificial",
    "chatbots empresariales",
    "automatización",
    "atención al cliente",
    "AI assistants",
    "machine learning",
    "procesamiento de lenguaje natural",
    "soluciones empresariales",
  ],
  authors: [{ name: "Master Chat Team" }],
  creator: "Master Chat",
  publisher: "Master Chat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://masterchat.es"),
  alternates: {
    canonical: "/",
    languages: {
      "es-ES": "/es",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "Master Chat - Asistentes Virtuales Especializados con IA",
    description:
      "Potencia tu empresa con asistentes virtuales especializados con IA conversacional de última generación.",
    url: "https://masterchat.es",
    siteName: "Master Chat",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Master Chat - Asistentes Virtuales Especializados",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Master Chat - Asistentes Virtuales Especializados con IA",
    description:
      "Potencia tu empresa con asistentes virtuales especializados con IA conversacional de última generación.",
    images: ["/twitter-image.jpg"],
    creator: "@masterchat",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  classification: "Business Software",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
