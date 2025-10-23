import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Thiago Thomas - Software Engineer",
  description: "Full-Stack Engineer specializing in AI agents, Web3, and blockchain. Founding Engineer at Blorm, building autonomous onchain agents and decentralized AI infrastructure.",
  keywords: ["Software Engineer", "Full-Stack Developer", "AI Agents", "Web3", "Blockchain", "LLM", "Solana", "React", "Node.js", "TypeScript"],
  authors: [{ name: "Thiago Thomas" }],
  openGraph: {
    title: "Thiago Thomas - Software Engineer",
    description: "Full-Stack Engineer specializing in AI agents, Web3, and blockchain",
    type: "website",
    locale: "en_US",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.variable}>{children}</body>
    </html>
  )
}