import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { GeistPixelSquare } from "geist/font/pixel"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: "#000000",
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
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/favicon.png" }],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://thiagothomas.dev",
  },
}

// Static string with no user input — safe for inline script to prevent theme flash
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.add("light");document.documentElement.style.colorScheme="light";}else{document.documentElement.style.colorScheme="dark";}}catch(e){}})();`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-pixel antialiased">
        {children}
      </body>
    </html>
  )
}
