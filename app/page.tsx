"use client"

import {
  Dithering,
  LiquidMetal,
  Metaballs,
  NeuroNoise,
  Swirl,
  GodRays,
  Voronoi,
  Water,
  Warp,
  SmokeRing,
  PerlinNoise,
  GrainGradient
} from "@paper-design/shaders-react"
import { useState } from "react"

export default function ResumePage() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [shaderIndex, setShaderIndex] = useState(0)
  const [randomSeed, setRandomSeed] = useState(0)

  // Random parameter generators
  const random = (min: number, max: number) => Math.random() * (max - min) + min
  const randomInt = (min: number, max: number) => Math.floor(random(min, max))
  const randomColor = (dark: boolean) => {
    const h = randomInt(0, 360)
    const s = randomInt(60, 90)
    const l = dark ? randomInt(20, 50) : randomInt(50, 80)
    return `hsl(${h}, ${s}%, ${l}%)`
  }

  // Shape options for dithering
  const ditheringShapes = ["cat", "circle", "cross", "diamond", "heart", "hexagon", "octagon", "pentagon", "plus", "square", "star", "triangle"]
  const ditheringTypes = ["2x2", "3x3", "4x4", "8x8", "ordered", "random"]

  const shaders = [
    // All Dithering variations first
    {
      name: "Dithering",
      component: (
        <Dithering
          key={0} // Keep original, no randomization
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 95%)"}
          colorFront={isDarkMode ? "hsl(180, 80%, 50%)" : "hsl(200, 90%, 50%)"}
          shape="simplex"
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      )
    },
    {
      name: "Dither Warp",
      component: (
        <Dithering
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          colorBack="transparent"
          colorFront={randomColor(isDarkMode)}
          shape="warp"
          type="4x4"
          pxSize={random(2, 4)}
          scale={random(0.8, 1.5)}
          speed={random(0.5, 2)}
        />
      )
    },
    {
      name: "Dither Swirl",
      component: (
        <Dithering
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          colorBack="transparent"
          colorFront={randomColor(isDarkMode)}
          shape="swirl"
          type="8x8"
          pxSize={random(2, 3)}
          scale={random(0.8, 1.2)}
          speed={random(0.5, 2)}
        />
      )
    },
    {
      name: "Dither Wave",
      component: (
        <Dithering
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          colorBack="transparent"
          colorFront={randomColor(isDarkMode)}
          shape="wave"
          type="4x4"
          pxSize={random(2, 4)}
          scale={random(0.8, 1.5)}
          speed={random(0.5, 2)}
        />
      )
    },
    {
      name: "Dither Dots",
      component: (
        <Dithering
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          colorBack="transparent"
          colorFront={randomColor(isDarkMode)}
          shape="dots"
          type="4x4"
          pxSize={random(2, 4)}
          scale={random(0.8, 1.5)}
          speed={random(0.5, 2)}
        />
      )
    },
    {
      name: "Dither Ripple",
      component: (
        <Dithering
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          colorBack="transparent"
          colorFront={randomColor(isDarkMode)}
          shape="ripple"
          type="8x8"
          pxSize={random(2, 3)}
          scale={random(0.8, 1.2)}
          speed={random(0.5, 2)}
        />
      )
    },
    {
      name: "Dither Sphere",
      component: (
        <Dithering
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          colorBack="transparent"
          colorFront={randomColor(isDarkMode)}
          shape="sphere"
          type="4x4"
          pxSize={random(2, 4)}
          scale={random(0.8, 1.5)}
          speed={random(0.5, 2)}
        />
      )
    },
    // Other shaders
    {
      name: "Liquid Metal",
      component: (
        <LiquidMetal
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.01, 0.1)}
          scale={random(0.3, 1.5)}
        />
      )
    },
    {
      name: "Warp",
      component: (
        <Warp
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.02, 0.15)}
          scale={random(0.5, 2)}
        />
      )
    },
    {
      name: "Smoke Ring",
      component: (
        <SmokeRing
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.02, 0.1)}
          scale={random(0.8, 2)}
        />
      )
    },
    {
      name: "Perlin Noise",
      component: (
        <PerlinNoise
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.01, 0.08)}
          scale={random(2, 6)}
        />
      )
    },
    {
      name: "Metaballs",
      component: (
        <Metaballs
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.05, 0.3)}
          scale={random(0.5, 3)}
        />
      )
    },
    {
      name: "Neural",
      component: (
        <NeuroNoise
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.005, 0.05)}
          scale={random(1, 5)}
        />
      )
    },
    {
      name: "God Rays",
      component: (
        <GodRays
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.01, 0.05)}
          scale={random(0.5, 1.5)}
        />
      )
    },
    {
      name: "Voronoi",
      component: (
        <Voronoi
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.01, 0.05)}
          scale={random(1, 3)}
        />
      )
    },
    {
      name: "Water",
      component: (
        <Water
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.5, 2)}
          scale={random(0.3, 1)}
        />
      )
    },
    {
      name: "Grain Gradient",
      component: (
        <GrainGradient
          key={randomSeed}
          style={{ height: "100%", width: "100%" }}
          speed={random(0.01, 0.08)}
          scale={random(0.5, 2)}
        />
      )
    }
  ]

  const nextShader = () => {
    setShaderIndex((prev) => (prev + 1) % shaders.length)
    setRandomSeed(Math.random()) // Trigger re-randomization for all parameters
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col lg:flex-row">
      <div
        className={`w-full lg:w-1/2 p-8 font-mono relative z-10 overflow-y-auto transition-all duration-500 ease-in-out ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* Theme toggle button in top right of left panel */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-8 right-8 p-2 rounded-full transition-all duration-300 ${
            isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
          aria-label="Toggle theme"
        >
          <div className="relative w-6 h-6">
            {/* Sun icon */}
            <svg
              className={`absolute inset-0 transform transition-all duration-500 ${
                isDarkMode ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            {/* Moon icon */}
            <svg
              className={`absolute inset-0 transform transition-all duration-500 ${
                isDarkMode ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
              }`}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </div>
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-lg font-normal mb-8">thiago.cv</h1>
          <div className="mb-8">
            <h2 className="text-lg font-normal">THIAGO THOMAS</h2>
            <h3 className="text-lg font-normal">FULL-STACK ENGINEER (BACKEND-HEAVY)</h3>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-12">
          <h3 className="text-lg font-normal mb-4">EDUCATION</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-normal">Pontifícia Universidade Católica do Rio Grande do Sul</span>
                <span>Mar 2025 – Dec 2026</span>
              </div>
              <div>Master of Science in Computer Science</div>
              <div className="text-xs mt-1 opacity-80">Research: AI - Goal Recognition, Multi-Agent Reinforcement Learning</div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-normal">Universidade do Vale do Rio dos Sinos</span>
                <span>Mar 2020 – Dec 2024</span>
              </div>
              <div>Bachelor of Science in Computer Science</div>
              <div className="text-xs mt-1 opacity-80">GPA: 3.65 (9.12/10.0)</div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-12">
          <h3 className="text-lg font-normal mb-4">EXPERIENCE</h3>
          <div className="space-y-6 text-sm">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-normal">Blorm - Founding Engineer</span>
                <span>Apr 2025 – Present</span>
              </div>
              <div className="text-xs opacity-80">Remote - California, United States</div>
              <ul className="mt-2 space-y-1 text-xs opacity-90">
                <li>• Solana Mobile Hackathon Winner (Top 10/276 submissions, 1,000+ upvotes)</li>
                <li>• Built crypto payment rails with Coinbase Onramp API & USDC integration</li>
                <li>• Architected LLM orchestration platform with multi-provider failover</li>
                <li>• Developed Web3 chat platform with wallet-connect & NFT minting</li>
                <li>• Engineered RabbitMQ queue for async blockchain operations</li>
                <li>• Implemented Phala Network TEE key management</li>
                <li>• Built multi-platform bot framework (Twitter, Telegram, Discord)</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-normal">SAP - Software Engineer</span>
                <span>Nov 2021 – Apr 2025</span>
              </div>
              <div className="text-xs opacity-80">Hybrid - São Leopoldo, RS</div>
              <ul className="mt-2 space-y-1 text-xs opacity-90">
                <li>• SAP Ariba Guided Sourcing: Java, Spring Boot, Angular, TypeScript, SQL</li>
                <li>• SAP Ariba Category Management: TypeScript, UI5, CAP, BTP</li>
                <li>• Implemented automated testing with Katalon</li>
                <li>• Global collaboration with cross-functional teams (USA/India/Brazil)</li>
                <li>• Developed automated tenant provisioning and app integration</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-normal">NTT DATA - Java Developer</span>
                <span>Jul 2021 – Nov 2021</span>
              </div>
              <div className="text-xs opacity-80">Remote - Allocated at Itaú Unibanco</div>
              <ul className="mt-2 space-y-1 text-xs opacity-90">
                <li>• Open Banking/Finance: Spring Boot, hexagonal architecture</li>
                <li>• AWS services with SQS messaging for real-time processing</li>
              </ul>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-normal">Meta - Junior Java Developer</span>
                <span>Oct 2020 – Jul 2021</span>
              </div>
              <div className="text-xs opacity-80">Remote - São Leopoldo, RS</div>
              <ul className="mt-2 space-y-1 text-xs opacity-90">
                <li>• Developed SSO portal using Java and Spring Boot</li>
                <li>• Maintained Jenkins pipelines, deployed on OpenShift</li>
                <li>• Implemented TDD with JUnit and Mockito</li>
                <li>• Participated in Scrum methodology and architecture definitions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technologies Section */}
        <div className="mb-12">
          <h3 className="text-lg font-normal mb-4">TECHNOLOGIES</h3>
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-normal">Languages:</span> Java, JavaScript, TypeScript, Python, PHP
            </div>
            <div>
              <span className="font-normal">Back-end:</span> Spring, Spring Boot, Node.js, Nest.js, Express, CAP
            </div>
            <div>
              <span className="font-normal">Front-end:</span> React, React Native, Angular, Next.js, Vue.js, UI5
            </div>
            <div>
              <span className="font-normal">AI/ML:</span> LLM Orchestration, LangGraph, AI Agents, n8n, MCP Server/Client,
              Prompt Engineering, Vector Databases, Multi-Agent Systems, Reinforcement Learning
            </div>
            <div>
              <span className="font-normal">Web3:</span> Solana, Smart Contracts, Web3, NFTs, USDC, Ethereum
            </div>
            <div>
              <span className="font-normal">Cloud:</span> AWS (SQS, Lambda), GCP, Docker, Kubernetes, Jenkins, OpenShift, BTP
            </div>
            <div>
              <span className="font-normal">Databases:</span> SQL, Vector Stores, RabbitMQ, SQS
            </div>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="mt-20 pb-8">
          <div className="flex items-center gap-6">
            <a
              href="mailto:thiagohthomas@gmail.com"
              className="hover:opacity-70 transition-all duration-300 transform hover:scale-110"
              aria-label="Email"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/thiagothomas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-all duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="https://github.com/thiagothomas"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <span className="text-xs opacity-60 ml-auto">Brazil • Remote Worldwide</span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative h-64 lg:h-auto">
        {shaders[shaderIndex].component}

        {/* Shader switcher button */}
        <button
          onClick={nextShader}
          className={`absolute top-8 right-8 px-4 py-2 rounded-full transition-all duration-500 font-mono text-sm backdrop-blur-md border ${
            isDarkMode
              ? "bg-black/50 hover:bg-black/70 text-white border-white/30"
              : "bg-white/50 hover:bg-white/70 text-black border-black/30"
          } shadow-lg hover:shadow-xl transform hover:scale-105`}
          aria-label="Switch animation"
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            {shaders[shaderIndex].name}
          </span>
        </button>
      </div>
    </div>
  )
}