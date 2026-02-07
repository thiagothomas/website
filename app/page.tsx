"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect, useCallback } from "react"
import {
  ExternalLink,
  Github,
  Mail,
  Copy,
  Check,
  Menu,
  Close,
  Sun,
  Moon,
  Contact,
} from "@nsmr/pixelart-react"

// ---------------------------------------------------------------------------
// Animation helpers
// ---------------------------------------------------------------------------

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1]

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

function StaggerContainer({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// ScrambleText
// ---------------------------------------------------------------------------

function ScrambleText({
  text,
  className = "",
}: {
  text: string
  className?: string
}) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  const scramble = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    const letters = text.split("")
    let i = 0
    const interval = setInterval(() => {
      setDisplayText(
        letters
          .map((ch, idx) =>
            i > idx * 1.5 ? ch : symbols[Math.floor(Math.random() * symbols.length)]
          )
          .join("")
      )
      i++
      if (i > 10) {
        clearInterval(interval)
        setDisplayText(text)
        setIsAnimating(false)
      }
    }, 50)
  }, [isAnimating, text, symbols])

  return (
    <span className={`cursor-default ${className}`} onMouseEnter={scramble}>
      {displayText}
    </span>
  )
}

// ---------------------------------------------------------------------------
// ThemeToggle
// ---------------------------------------------------------------------------

function ThemeToggle({
  theme,
  toggle,
}: {
  theme: "dark" | "light"
  toggle: () => void
}) {
  return (
    <button
      onClick={toggle}
      className="p-2 text-[var(--neutral-400)] hover:text-[var(--fg)] transition-colors duration-200
                 focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                 min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  )
}

// ---------------------------------------------------------------------------
// CopyEmailButton (icon, hero)
// ---------------------------------------------------------------------------

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText("thiagohthomas@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="p-3 rounded-full border border-[var(--neutral-800)] text-[var(--neutral-400)]
                 hover:text-[var(--fg)] hover:border-[var(--neutral-500)]
                 focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={copied ? "Email copied" : "Copy email address"}
    >
      {copied ? <Check size={24} /> : <Mail size={24} />}
    </button>
  )
}

// ---------------------------------------------------------------------------
// CopyEmailLink (contact section)
// ---------------------------------------------------------------------------

function CopyEmailLink() {
  const [copied, setCopied] = useState(false)
  const email = "thiagohthomas@gmail.com"
  const copy = async () => {
    if (copied) return
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="group inline-flex items-center gap-3 text-xl sm:text-2xl lg:text-3xl font-semibold
                 text-[var(--fg)] hover:text-[var(--neutral-300)] transition-colors duration-200
                 focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none"
    >
      <span>{copied ? "Copied!" : email}</span>
      {!copied && <Copy size={24} className="text-[var(--neutral-500)] group-hover:text-[var(--neutral-300)] transition-colors" />}
      {copied && <Check size={24} className="text-[var(--neutral-500)]" />}
    </button>
  )
}

// ---------------------------------------------------------------------------
// MobileMenu
// ---------------------------------------------------------------------------

function MobileMenu({
  isOpen,
  onClose,
  theme,
  toggleTheme,
}: {
  isOpen: boolean
  onClose: () => void
  theme: "dark" | "light"
  toggleTheme: () => void
}) {
  const items = ["About", "Experience", "Skills", "Contact"]
  return (
    <motion.div
      className="fixed inset-0 z-[60] md:hidden"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      variants={{
        open: { pointerEvents: "auto" as const },
        closed: { pointerEvents: "none" as const },
      }}
    >
      <motion.div
        className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-sm"
        variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-[280px] bg-[var(--neutral-950)] border-l border-[var(--neutral-800)]"
        variants={{ open: { x: 0 }, closed: { x: "100%" } }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          <button
            onClick={onClose}
            className="p-2 text-[var(--neutral-400)] hover:text-[var(--fg)] transition-colors
                       focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                       min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <Close size={24} />
          </button>
        </div>
        <nav className="flex flex-col pt-24 px-8">
          {items.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={onClose}
              className="py-4 text-xl font-medium text-[var(--neutral-300)] hover:text-[var(--fg)]
                         transition-colors border-b border-[var(--neutral-800)]/50
                         min-h-[44px] flex items-center"
              variants={{
                open: { opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.05 } },
                closed: { opacity: 0, x: 20 },
              }}
            >
              {item}
            </motion.a>
          ))}
          <motion.a
            href="/resume.pdf"
            className="mt-8 py-3 px-6 text-center font-medium bg-[var(--fg)] text-[var(--bg)] rounded-full
                       hover:opacity-80 transition-opacity min-h-[44px] flex items-center justify-center"
            variants={{
              open: { opacity: 1, x: 0, transition: { delay: 0.3 } },
              closed: { opacity: 0, x: 20 },
            }}
          >
            Resume
          </motion.a>
        </nav>
      </motion.div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// ExperienceCard
// ---------------------------------------------------------------------------

function ExperienceCard({
  company,
  companyUrl,
  role,
  period,
  location,
  sector,
  highlights,
  index,
}: {
  company: string
  companyUrl?: string
  role: string
  period: string
  location: string
  sector: string
  highlights: string[]
  index: number
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease, delay: index * 0.05 }}
    >
      {/* Timeline */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--neutral-800)]" />
      <div className="absolute left-0 top-[10px] w-2 h-2 -translate-x-[3.5px] rounded-full border border-[var(--neutral-600)] bg-[var(--bg)] group-hover:border-[var(--fg)] transition-colors duration-200" />

      <div className="pl-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-[var(--neutral-300)] transition-colors">
              {companyUrl ? (
                <a
                  href={companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline underline-offset-4
                             focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none"
                >
                  {company}
                  <ExternalLink size={16} className="text-[var(--neutral-500)]" />
                </a>
              ) : (
                company
              )}
            </h3>
            <p className="text-[var(--neutral-400)] font-medium text-sm">{role}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sector.split(" · ").map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider
                             text-[var(--neutral-400)] border border-[var(--neutral-800)] rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-[var(--neutral-300)] text-sm tabular-nums">{period}</p>
            <p className="text-[var(--neutral-500)] text-xs">{location}</p>
          </div>
        </div>

        <ul className="space-y-2 mt-3">
          {highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-[var(--neutral-400)] text-sm leading-relaxed flex gap-3"
            >
              <span className="text-[var(--neutral-600)] mt-1.5 shrink-0">
                <svg width="4" height="4" viewBox="0 0 4 4" fill="currentColor">
                  <circle cx="2" cy="2" r="2" />
                </svg>
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// SkillTag
// ---------------------------------------------------------------------------

function SkillTag({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.span
      className="px-3 py-1.5 text-sm border border-[var(--neutral-800)] rounded-full text-[var(--neutral-400)]
                 hover:text-[var(--fg)] hover:border-[var(--neutral-500)] transition-colors duration-200 cursor-default"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
    >
      {skill}
    </motion.span>
  )
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const experiences = [
  {
    company: "Purch",
    companyUrl: "http://purch.xyz",
    role: "Co-Founder",
    period: "Oct 2025 — Present",
    location: "Remote",
    sector: "Agentic Commerce · AI",
    highlights: ["Building Agentic Commerce"],
  },
  {
    company: "Blorm",
    role: "Founding Engineer",
    period: "Apr 2025 — Oct 2025",
    location: "Remote · California, USA",
    sector: "Web3 · AI · Blockchain · Crypto",
    highlights: [
      "Solana Mobile Hackathon Winner — Top 10 of 276 submissions with 1,000+ upvotes",
      "Architected LLM orchestration platform with multi-provider failover & intelligent routing",
      "Built crypto payment rails with Coinbase Onramp API & USDC integration",
      "Developed Web3 chat platform with wallet-connect & NFT minting capabilities",
      "Engineered RabbitMQ queue system for async blockchain operations",
      "Implemented Phala Network TEE for secure key management",
    ],
  },
  {
    company: "SAP",
    role: "Software Engineer",
    period: "Nov 2021 — Apr 2025",
    location: "Hybrid · Brazil",
    sector: "Enterprise Software · Procurement",
    highlights: [
      "SAP Ariba Guided Sourcing: Java, Spring Boot, Angular, TypeScript",
      "SAP Ariba Category Management: TypeScript, UI5, CAP, BTP",
      "Led cross-functional collaboration with teams across USA, India, and Brazil",
      "Developed automated tenant provisioning and seamless app integration",
      "Implemented comprehensive automated testing with Katalon framework",
    ],
  },
  {
    company: "NTT DATA",
    role: "Java Developer",
    period: "Jul 2021 — Nov 2021",
    location: "Remote · Itau Unibanco",
    sector: "Open Banking · Finance",
    highlights: [
      "Open Banking/Finance: Built microservices with Spring Boot & hexagonal architecture",
      "Integrated AWS services with SQS messaging for real-time transaction processing",
    ],
  },
  {
    company: "Meta IT",
    role: "Junior Java Developer",
    period: "Oct 2020 — Jul 2021",
    location: "Remote · Brazil",
    sector: "Enterprise Software · Identity",
    highlights: [
      "Developed enterprise SSO portal using Java and Spring Boot",
      "Maintained Jenkins CI/CD pipelines, deployed on OpenShift",
      "Implemented TDD practices with JUnit and Mockito",
    ],
  },
]

const skillCategories = [
  {
    title: "Languages",
    skills: ["Java", "TypeScript", "JavaScript", "Python", "PHP", "SQL"],
  },
  {
    title: "Backend",
    skills: ["Spring Boot", "Node.js", "NestJS", "Express", "CAP", "GraphQL"],
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "Angular", "Vue.js", "React Native", "UI5"],
  },
  {
    title: "AI & ML",
    skills: [
      "LLM Orchestration",
      "LangGraph",
      "AI Agents",
      "Prompt Engineering",
      "Vector Databases",
      "Multi-Agent Systems",
      "Reinforcement Learning",
    ],
  },
  {
    title: "Web3",
    skills: [
      "Solana",
      "Smart Contracts",
      "NFTs",
      "USDC",
      "Ethereum",
      "Wallet Integration",
    ],
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS", "GCP", "Docker", "Kubernetes", "Jenkins", "OpenShift", "SAP BTP"],
  },
]

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export default function Portfolio() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null
    const initial = stored || "dark"
    setTheme(initial)
    document.documentElement.classList.toggle("light", initial === "light")
    document.documentElement.style.colorScheme = initial
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      localStorage.setItem("theme", next)
      document.documentElement.classList.toggle("light", next === "light")
      document.documentElement.style.colorScheme = next
      return next
    })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* Skip to content */}
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                   focus:px-4 focus:py-2 focus:bg-[var(--fg)] focus:text-[var(--bg)] focus:rounded"
      >
        Skip to content
      </a>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="relative bg-[var(--bg)] text-[var(--fg)] min-h-[100dvh] overflow-x-hidden">
        {/* ----------------------------------------------------------------- */}
        {/* Navigation */}
        {/* ----------------------------------------------------------------- */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 transition-all duration-300 ${
            scrolled
              ? "py-4 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--neutral-800)]/50"
              : "py-6"
          }`}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <a
              href="#"
              className="text-lg font-mono font-semibold tracking-tight text-[var(--fg)]
                         focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none"
            >
              TT
            </a>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex items-center gap-8 text-sm">
                {["About", "Experience", "Skills", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-[var(--neutral-400)] hover:text-[var(--fg)] transition-colors duration-200
                               focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none"
                  >
                    {item}
                  </a>
                ))}
              </div>
              <div className="hidden md:block">
                <ThemeToggle theme={theme} toggle={toggleTheme} />
              </div>
              <a
                href="/resume.pdf"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                           bg-[var(--fg)] text-[var(--bg)] rounded-full hover:opacity-80 transition-opacity duration-200
                           focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none"
              >
                Resume
                <ExternalLink size={14} />
              </a>
              <button
                className="md:hidden p-2 text-[var(--neutral-400)] hover:text-[var(--fg)] transition-colors
                           focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                           min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>

        <main>
          {/* --------------------------------------------------------------- */}
          {/* Hero */}
          {/* --------------------------------------------------------------- */}
          <section className="min-h-[100dvh] flex items-center px-6 sm:px-12">
            <div className="max-w-6xl mx-auto w-full pt-24 pb-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.1 }}
                className="space-y-6"
              >
                <p className="font-mono text-sm tracking-widest uppercase text-[var(--neutral-500)]">
                  Full-Stack Engineer
                </p>

                <h1 className="font-pixel text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] tracking-tight">
                  <ScrambleText text="Thiago" />
                  <br />
                  <ScrambleText text="Thomas" />
                </h1>

                <p className="text-lg sm:text-xl text-[var(--neutral-400)] max-w-xl leading-relaxed">
                  Building at the intersection of{" "}
                  <span className="text-[var(--fg)]">AI</span>,{" "}
                  <span className="text-[var(--fg)]">Web3</span>, and{" "}
                  <span className="text-[var(--fg)]">distributed systems</span>.
                </p>

                <div className="flex items-center gap-3 pt-4">
                  <a
                    href="https://github.com/thiagothomas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full border border-[var(--neutral-800)] text-[var(--neutral-400)]
                               hover:text-[var(--fg)] hover:border-[var(--neutral-500)] transition-colors duration-200
                               focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                               min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="GitHub"
                  >
                    <Github size={24} />
                  </a>
                  <a
                    href="https://linkedin.com/in/thiagothomas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full border border-[var(--neutral-800)] text-[var(--neutral-400)]
                               hover:text-[var(--fg)] hover:border-[var(--neutral-500)] transition-colors duration-200
                               focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                               min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="LinkedIn"
                  >
                    <Contact size={24} />
                  </a>
                  <CopyEmailButton />
                  <a
                    href="/resume.pdf"
                    className="ml-2 inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium
                               border border-[var(--neutral-800)] rounded-full text-[var(--neutral-300)]
                               hover:text-[var(--fg)] hover:border-[var(--neutral-500)] transition-colors duration-200
                               focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                               min-h-[44px]"
                  >
                    Resume
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* --------------------------------------------------------------- */}
          {/* About */}
          {/* --------------------------------------------------------------- */}
          <section id="about" className="py-24 sm:py-32 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
                <div className="lg:sticky lg:top-32">
                  <FadeIn>
                    <p className="font-mono text-xs tracking-widest uppercase text-[var(--neutral-500)] mb-4">
                      About
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-semibold leading-tight">
                      Crafting digital
                      <br />
                      experiences that matter
                    </h2>
                  </FadeIn>
                </div>

                <StaggerContainer className="space-y-6" delay={0.2}>
                  <StaggerItem>
                    <p className="text-lg text-[var(--neutral-300)] leading-relaxed">
                      I&apos;m a Full-Stack Engineer with a backend focus, currently
                      pursuing my Master&apos;s in Computer Science researching AI agents
                      and multi-agent reinforcement learning at PUCRS.
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <p className="text-[var(--neutral-400)] leading-relaxed">
                      As Co-Founder of{" "}
                      <a
                        href="http://purch.xyz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--fg)] hover:text-[var(--neutral-300)] underline underline-offset-4 decoration-[var(--neutral-600)]
                                   hover:decoration-[var(--neutral-400)] transition-colors
                                   focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none"
                      >
                        Purch
                      </a>
                      , I&apos;m building the future of Agentic Commerce. Previously as
                      Founding Engineer at Blorm, I built autonomous AI agents and
                      decentralized infrastructure, winning Top 10 at the Solana Mobile
                      Hackathon. Before that, I developed enterprise solutions at SAP for
                      global procurement systems serving Fortune 500 companies.
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <p className="text-[var(--neutral-400)] leading-relaxed">
                      I thrive at the intersection of AI, Web3, and distributed
                      systems—building technology that pushes boundaries and creates real
                      impact.
                    </p>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="pt-8 grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-[var(--neutral-500)] mb-2">
                          Education
                        </p>
                        <p className="text-[var(--fg)] font-medium">MSc Computer Science</p>
                        <p className="text-[var(--neutral-400)] text-sm">PUCRS · 2025-2026</p>
                      </div>
                      <div>
                        <p className="text-xs font-mono uppercase tracking-wider text-[var(--neutral-500)] mb-2">
                          Location
                        </p>
                        <p className="text-[var(--fg)] font-medium">Brazil</p>
                        <p className="text-[var(--neutral-400)] text-sm">Remote Worldwide</p>
                      </div>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </div>
          </section>

          {/* --------------------------------------------------------------- */}
          {/* Experience */}
          {/* --------------------------------------------------------------- */}
          <section id="experience" className="py-24 sm:py-32 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto">
              <FadeIn className="mb-16">
                <p className="font-mono text-xs tracking-widest uppercase text-[var(--neutral-500)] mb-4">
                  Experience
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Where I&apos;ve made impact
                </h2>
              </FadeIn>

              <div className="max-w-3xl">
                {experiences.map((exp, i) => (
                  <ExperienceCard key={i} {...exp} index={i} />
                ))}
              </div>
            </div>
          </section>

          {/* --------------------------------------------------------------- */}
          {/* Skills */}
          {/* --------------------------------------------------------------- */}
          <section id="skills" className="py-24 sm:py-32 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto">
              <FadeIn className="mb-16">
                <p className="font-mono text-xs tracking-widest uppercase text-[var(--neutral-500)] mb-4">
                  Skills
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold">
                  Technologies & tools
                </h2>
              </FadeIn>

              <div className="grid md:grid-cols-2 gap-10">
                {skillCategories.map((category, catIndex) => (
                  <FadeIn key={catIndex} delay={catIndex * 0.05}>
                    <h3 className="text-sm font-mono text-[var(--neutral-500)] mb-3 tracking-wider uppercase">
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <SkillTag
                          key={skillIndex}
                          skill={skill}
                          index={skillIndex}
                        />
                      ))}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* ----------------------------------------------------------------- */}
        {/* Contact / Footer */}
        {/* ----------------------------------------------------------------- */}
        <footer
          id="contact"
          className="py-20 sm:py-32 px-6 sm:px-12 border-t border-[var(--neutral-800)]/50"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end">
              <div className="min-w-0">
                <FadeIn>
                  <p className="font-mono text-xs tracking-widest uppercase text-[var(--neutral-500)] mb-4">
                    Contact
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
                    Let&apos;s connect
                  </h2>
                  <p className="text-[var(--neutral-400)] mb-8 leading-relaxed max-w-lg">
                    I&apos;m always open to discussing new opportunities, especially in
                    AI, Web3, and backend engineering.
                  </p>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <CopyEmailLink />
                </FadeIn>
              </div>

              <FadeIn delay={0.3} className="flex flex-col gap-6 lg:items-end">
                <div className="flex items-center gap-3">
                  <a
                    href="https://github.com/thiagothomas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-[var(--neutral-800)] rounded-full text-[var(--neutral-400)] text-sm
                               hover:text-[var(--fg)] hover:border-[var(--neutral-500)] transition-colors duration-200
                               focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                               min-h-[44px] inline-flex items-center"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/thiagothomas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 border border-[var(--neutral-800)] rounded-full text-[var(--neutral-400)] text-sm
                               hover:text-[var(--fg)] hover:border-[var(--neutral-500)] transition-colors duration-200
                               focus-visible:ring-2 focus-visible:ring-[var(--neutral-500)] focus-visible:outline-none
                               min-h-[44px] inline-flex items-center"
                  >
                    LinkedIn
                  </a>
                </div>
                <p className="text-[var(--neutral-600)] text-sm">
                  &copy; {new Date().getFullYear()} Thiago Thomas
                </p>
              </FadeIn>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
