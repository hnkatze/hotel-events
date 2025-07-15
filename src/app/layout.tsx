import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import AuthGuard from "@/components/auth-guard"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Sistema de Eventos - Hotel Management",
    template: "%s | Sistema de Eventos"
  },
  description: "Sistema completo de gestión de eventos para hoteles. Administra salones, personal, reservas y eventos de manera eficiente con una interfaz moderna y responsive.",
  keywords: [
    "gestión de eventos",
    "hotel management",
    "reservas",
    "salones",
    "personal",
    "eventos corporativos",
    "sistema de reservas",
    "administración hotelera"
  ],
  authors: [{ name: "Hotel Events Team" }],
  creator: "Hotel Events System",
  publisher: "Hotel Events",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hotel-events.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Sistema de Eventos - Hotel Management",
    description: "Sistema completo de gestión de eventos para hoteles. Administra salones, personal, reservas y eventos de manera eficiente.",
    url: 'https://hotel-events.vercel.app',
    siteName: 'Sistema de Eventos',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sistema de Eventos - Hotel Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sistema de Eventos - Hotel Management",
    description: "Sistema completo de gestión de eventos para hoteles",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <AuthGuard>{children}</AuthGuard>
        </AuthProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
