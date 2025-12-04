import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

// Premium display font - Clash Display for headlines
const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
})

// Modern body font - Satoshi
const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
})

// Monospace for code/accents
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://thiagothomas.dev"),
  title: {
    default: "Thiago Thomas | Full-Stack Engineer",
    template: "%s | Thiago Thomas",
  },
  description:
    "Full-Stack Engineer specializing in AI agents, Web3, and distributed systems. Founding Engineer at Blorm, building autonomous onchain agents. Solana Hackathon Winner. MSc in AI at PUCRS.",
  keywords: [
    "Software Engineer",
    "Full-Stack Developer",
    "AI Agents",
    "Web3 Developer",
    "Blockchain Engineer",
    "LLM Engineering",
    "Solana Developer",
    "React Developer",
    "Node.js",
    "TypeScript",
    "Java Developer",
    "Spring Boot",
    "Backend Engineer",
    "Distributed Systems",
    "Machine Learning",
  ],
  authors: [{ name: "Thiago Thomas", url: "https://thiagothomas.dev" }],
  creator: "Thiago Thomas",
  publisher: "Thiago Thomas",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thiagothomas.dev",
    siteName: "Thiago Thomas",
    title: "Thiago Thomas | Full-Stack Engineer",
    description:
      "Full-Stack Engineer specializing in AI agents, Web3, and distributed systems. Building the future of autonomous technology.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thiago Thomas - Full-Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiago Thomas | Full-Stack Engineer",
    description:
      "Full-Stack Engineer specializing in AI agents, Web3, and distributed systems.",
    images: ["/og-image.png"],
    creator: "@thiagothomas",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon.svg" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://thiagothomas.dev",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${satoshi.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
