"use client"

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import {
  Dithering,
  Warp,
} from "@paper-design/shaders-react"

// Magnetic button effect
function MagneticButton({ children, href, className = "", external = true }: { children: React.ReactNode; href: string; className?: string; external?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { clientX, clientY } = e
    const { width, height, left, top } = ref.current!.getBoundingClientRect()
    const x = (clientX - left - width / 2) * 0.3
    const y = (clientY - top - height / 2) * 0.3
    setPosition({ x, y })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
    >
      {children}
    </motion.a>
  )
}

// Animated text reveal
function AnimatedText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <span ref={ref} className={`inline-block overflow-hidden ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {text}
      </motion.span>
    </span>
  )
}

// Stagger children animation wrapper
function StaggerContainer({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Floating particles background
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Scramble text effect - letters change to random symbols then back
function ScrambleText({ text, className = "" }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text)
  const [isAnimating, setIsAnimating] = useState(false)
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789"

  const scramble = () => {
    if (isAnimating) return
    setIsAnimating(true)

    const originalLetters = text.split("")
    let iterations = 0
    const maxIterations = 10

    const interval = setInterval(() => {
      setDisplayText(
        originalLetters
          .map((letter, i) => {
            if (iterations > i * 1.5) return letter
            return symbols[Math.floor(Math.random() * symbols.length)]
          })
          .join("")
      )

      iterations += 1

      if (iterations > maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
        setIsAnimating(false)
      }
    }, 50)
  }

  return (
    <span
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  )
}

// Copy email button with feedback (icon version)
function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText("thiagohthomas@gmail.com")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.button
      onClick={handleCopy}
      className="relative p-3 rounded-full border border-zinc-700 text-zinc-300 hover:text-violet-400
               hover:border-violet-400/50 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {copied ? (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}

      {/* Tooltip */}
      <motion.span
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300 whitespace-nowrap"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: copied ? 1 : 0, y: copied ? 0 : -5 }}
        transition={{ duration: 0.2 }}
      >
        Copied!
      </motion.span>
    </motion.button>
  )
}

// Copy email link with fill animation (for contact section)
function CopyEmailLink() {
  const [state, setState] = useState<"idle" | "filling" | "copied" | "unfilling">("idle")
  const email = "thiagohthomas@gmail.com"

  const handleCopy = async () => {
    if (state !== "idle") return
    await navigator.clipboard.writeText(email)

    setState("filling")
    setTimeout(() => setState("copied"), 600)
    setTimeout(() => setState("unfilling"), 1800)
    setTimeout(() => setState("idle"), 2400)
  }

  const showCopied = state === "copied" || state === "unfilling"

  return (
    <motion.button
      onClick={handleCopy}
      className="group relative inline-flex items-center gap-2 sm:gap-4 text-xl sm:text-3xl lg:text-4xl font-display font-bold"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
    >
      {/* Text container */}
      <span className="relative overflow-hidden">
        {/* Base white text */}
        <span className="text-zinc-100">
          {showCopied ? "Copied!" : email}
        </span>

        {/* Purple fill overlay */}
        <motion.span
          className="absolute inset-0 text-violet-400 overflow-hidden pointer-events-none"
          initial={{ width: "0%" }}
          animate={{
            width: state === "filling" || state === "copied" ? "100%" :
                   state === "unfilling" ? "0%" : "0%"
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{ originX: state === "unfilling" ? 1 : 0 }}
        >
          <span className="whitespace-nowrap">
            {showCopied ? "Copied!" : email}
          </span>
        </motion.span>
      </span>

      {/* Icon - hidden when showing "Copied!" */}
      {!showCopied && (
        <span className="relative flex-shrink-0">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </span>
      )}
    </motion.button>
  )
}

// Experience card with hover effect
function ExperienceCard({
  company,
  companyUrl,
  role,
  period,
  location,
  sector,
  highlights,
  index
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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-violet-400/50 via-violet-400/20 to-transparent" />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-0 top-2 w-3 h-3 -translate-x-1/2 rounded-full border-2 border-violet-400 bg-zinc-950"
        animate={{ scale: isHovered ? 1.5 : 1 }}
        transition={{ duration: 0.2 }}
      />

      <div className="pl-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h4 className="text-xl font-display font-medium text-zinc-100 group-hover:text-violet-400 transition-colors duration-300">
              {companyUrl ? (
                <a href={companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {company}
                </a>
              ) : company}
            </h4>
            <p className="text-violet-400/80 font-medium">{role}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sector.split(" · ").map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider
                             bg-violet-500/20 text-violet-200 border border-violet-400/30
                             rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-zinc-200 text-sm tabular-nums font-medium">{period}</p>
            <p className="text-zinc-400 text-xs">{location}</p>
          </div>
        </div>

        <motion.ul
          className="space-y-2.5"
          animate={{ opacity: isHovered ? 1 : 0.85 }}
          transition={{ duration: 0.2 }}
        >
          {highlights.map((highlight, i) => (
            <motion.li
              key={i}
              className="text-zinc-300 text-sm leading-relaxed flex gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
            >
              <span className="text-violet-400 mt-1.5">
                <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                  <circle cx="3" cy="3" r="3" />
                </svg>
              </span>
              {highlight}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  )
}

// Skill tag with glow effect
function SkillTag({ skill, index }: { skill: string; index: number }) {
  return (
    <motion.span
      className="relative px-4 py-2 text-sm border border-zinc-600 rounded-full text-zinc-200
                 hover:border-violet-400/50 hover:text-violet-400 transition-all duration-300
                 hover:shadow-[0_0_20px_rgba(167,139,250,0.15)] cursor-default bg-zinc-800/30"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ y: -2 }}
    >
      {skill}
    </motion.span>
  )
}

// Noise overlay
function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Mobile menu component
function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const menuItems = ["About", "Experience", "Skills", "Contact"]

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
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md"
        variants={{
          open: { opacity: 1 },
          closed: { opacity: 0 },
        }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* Menu panel */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-[280px] bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800/50"
        variants={{
          open: { x: 0 },
          closed: { x: "100%" },
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-violet-400 transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu items */}
        <nav className="flex flex-col pt-24 px-8">
          {menuItems.map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={onClose}
              className="py-4 text-2xl font-display font-medium text-zinc-300 hover:text-violet-400
                       transition-colors border-b border-zinc-800/50"
              variants={{
                open: {
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.1 + i * 0.05 },
                },
                closed: {
                  opacity: 0,
                  x: 20,
                },
              }}
            >
              {item}
            </motion.a>
          ))}

          {/* Resume button in mobile menu */}
          <motion.a
            href="/resume.pdf"
            className="mt-8 py-3 px-6 text-center font-medium bg-violet-400 text-zinc-950 rounded-full
                     hover:bg-violet-300 transition-all duration-300"
            variants={{
              open: {
                opacity: 1,
                x: 0,
                transition: { delay: 0.3 },
              },
              closed: {
                opacity: 0,
                x: 20,
              },
            }}
          >
            Resume
          </motion.a>

          {/* Social links in mobile menu */}
          <motion.div
            className="flex items-center gap-4 mt-8 pt-8 border-t border-zinc-800/50"
            variants={{
              open: {
                opacity: 1,
                transition: { delay: 0.35 },
              },
              closed: { opacity: 0 },
            }}
          >
            <a
              href="https://github.com/thiagothomas"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-zinc-600 text-zinc-200 hover:text-violet-400
                       hover:border-violet-400/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/thiagothomas"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-zinc-600 text-zinc-200 hover:text-violet-400
                       hover:border-violet-400/50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
            </a>
          </motion.div>
        </nav>
      </motion.div>
    </motion.div>
  )
}

export default function Portfolio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [activeShader, setActiveShader] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Smooth scroll progress for parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Hero parallax transforms
  const heroY = useTransform(smoothProgress, [0, 0.3], [0, -150])
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.95])

  // Shader background opacity
  const shaderOpacity = useTransform(smoothProgress, [0, 0.1], [0.6, 0.3])

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Cycle through shaders
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveShader(prev => (prev + 1) % 5)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const shaders = [
    <Dithering key="dither-warp" style={{ height: "100%", width: "100%" }} colorBack="transparent" colorFront="hsl(270, 80%, 65%)" shape="warp" type="4x4" pxSize={2} scale={1} speed={0.8} />,
    <Dithering key="dither-swirl" style={{ height: "100%", width: "100%" }} colorBack="transparent" colorFront="hsl(280, 70%, 60%)" shape="swirl" type="8x8" pxSize={2} scale={1} speed={1} />,
    <Dithering key="dither-wave" style={{ height: "100%", width: "100%" }} colorBack="transparent" colorFront="hsl(260, 75%, 65%)" shape="wave" type="4x4" pxSize={3} scale={1.2} speed={0.6} />,
    <Dithering key="dither-simplex" style={{ height: "100%", width: "100%" }} colorBack="transparent" colorFront="hsl(275, 80%, 60%)" shape="simplex" type="4x4" pxSize={2} scale={0.8} speed={0.5} />,
    <Warp key="warp" style={{ height: "100%", width: "100%" }} speed={0.05} scale={1} />,
  ]

  const experiences = [
    {
      company: "Purch",
      companyUrl: "http://purch.xyz",
      role: "Co-Founder",
      period: "Oct 2025 — Present",
      location: "Remote",
      sector: "Agentic Commerce · AI",
      highlights: ["Building Agentic Commerce"]
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
      ]
    },
    {
      company: "SAP",
      role: "Software Engineer",
      period: "Nov 2021 — Apr 2025",
      location: "Hybrid · São Leopoldo, Brazil",
      sector: "Enterprise Software · Procurement",
      highlights: [
        "SAP Ariba Guided Sourcing: Java, Spring Boot, Angular, TypeScript",
        "SAP Ariba Category Management: TypeScript, UI5, CAP, BTP",
        "Led cross-functional collaboration with teams across USA, India, and Brazil",
        "Developed automated tenant provisioning and seamless app integration",
        "Implemented comprehensive automated testing with Katalon framework",
      ]
    },
    {
      company: "NTT DATA",
      role: "Java Developer",
      period: "Jul 2021 — Nov 2021",
      location: "Remote · Itaú Unibanco",
      sector: "Open Banking · Finance",
      highlights: [
        "Open Banking/Finance: Built microservices with Spring Boot & hexagonal architecture",
        "Integrated AWS services with SQS messaging for real-time transaction processing",
      ]
    },
    {
      company: "Meta IT",
      role: "Junior Java Developer",
      period: "Oct 2020 — Jul 2021",
      location: "Remote · São Leopoldo, Brazil",
      sector: "Enterprise Software · Identity",
      highlights: [
        "Developed enterprise SSO portal using Java and Spring Boot",
        "Maintained Jenkins CI/CD pipelines, deployed on OpenShift",
        "Implemented TDD practices with JUnit and Mockito",
      ]
    },
  ]

  const skillCategories = [
    {
      title: "Languages",
      skills: ["Java", "TypeScript", "JavaScript", "Python", "PHP", "SQL"]
    },
    {
      title: "Backend",
      skills: ["Spring Boot", "Node.js", "NestJS", "Express", "CAP", "GraphQL"]
    },
    {
      title: "Frontend",
      skills: ["React", "Next.js", "Angular", "Vue.js", "React Native", "UI5"]
    },
    {
      title: "AI & ML",
      skills: ["LLM Orchestration", "LangGraph", "AI Agents", "Prompt Engineering", "Vector Databases", "Multi-Agent Systems", "Reinforcement Learning"]
    },
    {
      title: "Web3",
      skills: ["Solana", "Smart Contracts", "NFTs", "USDC", "Ethereum", "Wallet Integration"]
    },
    {
      title: "Cloud & DevOps",
      skills: ["AWS", "GCP", "Docker", "Kubernetes", "Jenkins", "OpenShift", "SAP BTP"]
    },
  ]

  return (
    <>
      <NoiseOverlay />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Custom cursor glow */}
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-40 hidden lg:block"
        style={{
          background: "radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)",
          x: cursorPosition.x - 192,
          y: cursorPosition.y - 192,
        }}
      />

      <div ref={containerRef} className="relative bg-zinc-950 text-zinc-100 min-h-screen overflow-x-hidden">

        {/* Animated shader background */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{ opacity: shaderOpacity }}
        >
          {shaders[activeShader]}
        </motion.div>

        {/* Gradient overlays */}
        <div className="fixed inset-0 z-[1] bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950" />
        <div className="fixed inset-0 z-[1] bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60" />

        {/* Loading animation */}
        <motion.div
          className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1, pointerEvents: isLoaded ? "none" : "auto" }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div
            className="text-6xl font-display font-bold text-violet-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            TT
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <motion.a
              href="#"
              className="text-2xl font-display font-bold tracking-tight"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-violet-400">T</span>
              <span className="text-zinc-100">T</span>
            </motion.a>

            <div className="flex items-center gap-8">
              <nav className="hidden md:flex items-center gap-8 text-sm">
                {["About", "Experience", "Skills", "Contact"].map((item, i) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-zinc-300 hover:text-violet-400 transition-colors duration-300 relative group"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
              </nav>

              <motion.a
                href="/resume.pdf"
                className="hidden md:block px-5 py-2.5 text-sm font-medium bg-violet-400 text-zinc-950 rounded-full
                         hover:bg-violet-300 transition-all duration-300 hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Resume
              </motion.a>

              {/* Mobile hamburger button */}
              <motion.button
                className="md:hidden p-2 text-zinc-300 hover:text-violet-400 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          className="relative z-10 min-h-screen flex items-center px-6 sm:px-12"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <FloatingParticles />

          <div className="max-w-7xl mx-auto w-full pt-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left: Text content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                >
                  <p className="text-violet-400 font-mono text-sm tracking-widest mb-4">
                    FULL-STACK ENGINEER
                  </p>
                </motion.div>

                <div className="space-y-2">
                  <div className="overflow-hidden">
                    <motion.h1
                      className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.4 }}
                    >
                      <ScrambleText text="THIAGO" />
                    </motion.h1>
                  </div>
                  <div className="overflow-hidden">
                    <motion.h1
                      className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.9] tracking-tight text-violet-400"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                    >
                      <ScrambleText text="THOMAS" />
                    </motion.h1>
                  </div>
                </div>

                <motion.p
                  className="text-xl text-zinc-300 max-w-lg leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.7 }}
                >
                  Building the future at the intersection of{" "}
                  <span className="text-white font-medium">AI</span>,{" "}
                  <span className="text-white font-medium">Web3</span>, and{" "}
                  <span className="text-white font-medium">distributed systems</span>.
                </motion.p>

                <motion.div
                  className="flex items-center gap-6 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.9 }}
                >
                  <MagneticButton
                    href="https://linkedin.com/in/thiagothomas"
                    className="group flex items-center gap-3 px-6 py-3 border border-zinc-700 rounded-full
                             hover:border-violet-400/50 transition-all duration-300"
                  >
                    <span className="text-zinc-300 group-hover:text-violet-400 transition-colors">Let&apos;s talk</span>
                    <svg className="w-4 h-4 text-zinc-300 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </MagneticButton>

                  <div className="flex items-center gap-4">
                    <CopyEmailButton />
                    <MagneticButton
                      href="https://github.com/thiagothomas"
                      className="p-3 rounded-full border border-zinc-700 text-zinc-300 hover:text-violet-400
                               hover:border-violet-400/50 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                    </MagneticButton>
                    <MagneticButton
                      href="https://linkedin.com/in/thiagothomas"
                      className="p-3 rounded-full border border-zinc-700 text-zinc-300 hover:text-violet-400
                               hover:border-violet-400/50 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                      </svg>
                    </MagneticButton>
                  </div>
                </motion.div>
              </div>

              {/* Right: Stats/highlights */}
              <motion.div
                className="hidden lg:grid grid-cols-2 gap-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 2 }}
              >
                {[
                  { value: "5+", label: "Years Experience" },
                  { value: "Top 10", label: "Solana Hackathon" },
                  { value: "MSc", label: "AI Research" },
                  { value: "∞", label: "Curiosity" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm
                             hover:border-violet-400/30 transition-all duration-500 group"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <p className="text-4xl font-display font-bold text-violet-400 mb-2 group-hover:scale-110 transition-transform origin-left">
                      {stat.value}
                    </p>
                    <p className="text-zinc-300 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <motion.div
              className="flex flex-col items-center gap-2 text-zinc-600"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-xs tracking-widest">SCROLL</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* About Section */}
        <section id="about" className="relative z-10 py-32 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              <div className="lg:sticky lg:top-32">
                <StaggerContainer delay={0.2}>
                  <StaggerItem>
                    <p className="text-violet-400 font-mono text-sm tracking-widest mb-4">ABOUT</p>
                  </StaggerItem>
                  <StaggerItem>
                    <h2 className="text-4xl sm:text-5xl font-display font-bold mb-8 leading-tight">
                      Crafting digital <br />
                      <span className="text-violet-400">experiences</span> that matter
                    </h2>
                  </StaggerItem>
                </StaggerContainer>
              </div>

              <StaggerContainer className="space-y-6" delay={0.4}>
                <StaggerItem>
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    I&apos;m a Full-Stack Engineer with a backend focus, currently pursuing my Master&apos;s in Computer Science
                    researching AI agents and multi-agent reinforcement learning at PUCRS.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-zinc-300 leading-relaxed">
                    As Co-Founder of <a href="http://purch.xyz" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 transition-colors">Purch</a>, I&apos;m building the future of Agentic Commerce.
                    Previously as Founding Engineer at Blorm, I built autonomous AI agents and decentralized infrastructure,
                    winning Top 10 at the Solana Mobile Hackathon. Before that, I developed enterprise solutions at SAP
                    for global procurement systems serving Fortune 500 companies.
                  </p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-zinc-300 leading-relaxed">
                    I thrive at the intersection of AI, Web3, and distributed systems—building technology
                    that pushes boundaries and creates real impact.
                  </p>
                </StaggerItem>

                <StaggerItem>
                  <div className="pt-8 grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-violet-400/80 text-xs font-mono uppercase tracking-wider mb-2">Education</p>
                      <p className="text-zinc-100 font-medium">MSc Computer Science</p>
                      <p className="text-zinc-300 text-sm">PUCRS · 2025-2026</p>
                    </div>
                    <div>
                      <p className="text-violet-400/80 text-xs font-mono uppercase tracking-wider mb-2">Location</p>
                      <p className="text-zinc-100 font-medium">Brazil</p>
                      <p className="text-zinc-300 text-sm">Remote Worldwide</p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="relative z-10 py-32 px-6 sm:px-12 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <AnimatedText text="EXPERIENCE" className="text-violet-400 font-mono text-sm tracking-widest mb-4 block" />
              <h2 className="text-4xl sm:text-5xl font-display font-bold">
                <AnimatedText text="Where I've" delay={0.1} />{" "}
                <AnimatedText text="made" className="text-violet-400" delay={0.2} />{" "}
                <AnimatedText text="impact" delay={0.3} />
              </h2>
            </div>

            <div className="max-w-3xl">
              {experiences.map((exp, i) => (
                <ExperienceCard key={i} {...exp} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="relative z-10 py-32 px-6 sm:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <AnimatedText text="SKILLS" className="text-violet-400 font-mono text-sm tracking-widest mb-4 block" />
              <h2 className="text-4xl sm:text-5xl font-display font-bold">
                <AnimatedText text="Technologies" delay={0.1} />{" "}
                <AnimatedText text="&" className="text-zinc-600" delay={0.2} />{" "}
                <AnimatedText text="tools" className="text-violet-400" delay={0.3} />
              </h2>
            </div>

            <div className="space-y-12">
              {skillCategories.map((category, catIndex) => (
                <motion.div
                  key={catIndex}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                >
                  <h3 className="text-violet-400/90 text-sm font-mono mb-4 tracking-wider uppercase">{category.title}</h3>
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillTag key={skillIndex} skill={skill} index={skillIndex + catIndex * 10} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact/Footer Section */}
        <section id="contact" className="relative z-10 py-20 sm:py-32 px-6 sm:px-12 border-t border-zinc-800/50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end">
              <div className="min-w-0">
                <motion.p
                  className="text-violet-400 font-mono text-sm tracking-widest mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  LET&apos;S CONNECT
                </motion.p>
                <motion.h2
                  className="text-2xl sm:text-4xl lg:text-6xl font-display font-bold mb-6 sm:mb-8 break-words"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  Have a project in mind?
                </motion.h2>
                <motion.p
                  className="text-base sm:text-lg text-zinc-300 mb-6 sm:mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  I&apos;m always open to discussing new opportunities, especially in AI, Web3, and backend engineering.
                </motion.p>

                <CopyEmailLink />
              </div>

              <motion.div
                className="flex flex-col gap-4 sm:gap-6 lg:items-end"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  {[
                    { href: "https://github.com/thiagothomas", label: "GitHub" },
                    { href: "https://linkedin.com/in/thiagothomas", label: "LinkedIn" },
                  ].map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 sm:px-6 py-2 sm:py-3 border border-zinc-700 rounded-full text-zinc-200 text-sm sm:text-base
                               hover:border-violet-400/50 hover:text-violet-400 transition-all duration-300"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="text-zinc-600 text-xs sm:text-sm">
                  © 2025 Thiago Thomas
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Shader selector (bottom right) - larger touch targets on mobile */}
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-1 sm:gap-2 p-2 sm:p-0
                     bg-zinc-900/50 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => setActiveShader(i)}
              className={`rounded-full transition-all duration-300 ${
                activeShader === i
                  ? "bg-violet-400 w-8 h-3 sm:w-6 sm:h-2"
                  : "bg-zinc-700 hover:bg-zinc-500 w-3 h-3 sm:w-2 sm:h-2"
              }`}
              aria-label={`Switch to shader ${i + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </>
  )
}
