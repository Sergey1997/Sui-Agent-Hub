"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import {
  Zap,
  Network,
  Brain,
  Shield,
  Database,
  Code,
  Globe,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />
      <Header />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 pt-28 pb-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl sm:text-6xl font-light text-white leading-tight mb-5">
            About{" "}
            <span className="font-semibold bg-gradient-to-r from-sui-400 to-sui-300 bg-clip-text text-transparent">
              Sui Opportunities Hunter
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A data service for AI agents — real-time DeFi opportunities on Sui blockchain.
            Built to empower autonomous agents with validated, actionable market intelligence.
          </p>
        </motion.div>

        {/* Project Description */}
        <motion.section
          {...fadeInUp}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
            <Zap className="text-sui-400" size={28} />
            Project Description
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">Sui Opportunities Hunter</strong> is a comprehensive data service
              designed specifically for AI agents operating in the Sui DeFi ecosystem. Instead of requiring
              agents to build their own scrapers, API integrations, and data pipelines, we provide a unified
              platform that aggregates, validates, and enriches DeFi opportunities in real-time.
            </p>
            <p>
              Our platform scans multiple DEXes (Cetus, Turbos, Aftermath), queries on-chain pool data,
              and cross-references prices with external sources like CoinGecko and DeFiLlama. Every opportunity
              is analyzed by Claude AI, providing detailed verdicts with confidence scores, risk assessments,
              and execution recommendations.
            </p>
            <p>
              Agents can connect via simple HTTP API calls, download our SKILL.md instructions, and immediately
              start discovering arbitrage opportunities, yield farming positions, and other DeFi strategies.
              When agents have wallets, they can execute trades autonomously. When they don't, they present
              actionable opportunities to humans with all the details needed to act.
            </p>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          {...fadeInUp}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
            <Network className="text-sui-400" size={28} />
            How It Works
          </h2>
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sui-400/10 border border-sui-400/20 flex items-center justify-center text-sui-400 font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Agent Connects</h3>
                <p className="text-gray-300 leading-relaxed">
                  An AI agent downloads SKILL.md from the dashboard, reads the instructions, and starts calling
                  our REST API endpoints. No keys, no configuration — just HTTP requests.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sui-400/10 border border-sui-400/20 flex items-center justify-center text-sui-400 font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Scan & Discover</h3>
                <p className="text-gray-300 leading-relaxed">
                  The agent calls <code className="bg-white/[0.05] px-2 py-0.5 rounded text-sui-300">GET /api/scan</code>.
                  Our backend queries Cetus, Turbos, Aftermath APIs, reads on-chain pool objects via Sui SDK,
                  fetches yield data from DeFiLlama, and compares prices across all sources to find arbitrage
                  and yield opportunities.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sui-400/10 border border-sui-400/20 flex items-center justify-center text-sui-400 font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Every opportunity is automatically analyzed by Claude AI. The AI evaluates liquidity, slippage,
                  price persistence, and market conditions, then generates a verdict with confidence scores.
                  Opportunities are stored in Supabase with full metadata.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sui-400/10 border border-sui-400/20 flex items-center justify-center text-sui-400 font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Execute or Present</h3>
                <p className="text-gray-300 leading-relaxed">
                  If the agent has a Sui wallet, it can execute trades autonomously using its own private key.
                  If not, the agent presents the opportunity to a human with all actionable details: which DEXes
                  to use, exact steps, links, and time estimates. Humans can also connect their wallet via our
                  dashboard and execute opportunities directly.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sui-400/10 border border-sui-400/20 flex items-center justify-center text-sui-400 font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">Network Effect</h3>
                <p className="text-gray-300 leading-relaxed">
                  All discoveries are shared across the network. Multiple agents can verify the same opportunity,
                  increasing confidence. The dashboard displays real-time updates via Supabase subscriptions,
                  creating a collective intelligence network.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          {...fadeInUp}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
            <Code className="text-sui-400" size={28} />
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frontend */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Globe className="text-sui-400" size={18} />
                Frontend
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Next.js 15</strong> — React framework with App Router
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">TypeScript</strong> — Type-safe development
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Tailwind CSS</strong> — Utility-first styling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Framer Motion</strong> — Smooth animations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Lucide Icons</strong> — Icon library
                </li>
              </ul>
            </div>

            {/* Backend */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Database className="text-sui-400" size={18} />
                Backend & Infrastructure
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Next.js API Routes</strong> — Serverless endpoints
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Supabase</strong> — PostgreSQL database + real-time
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Vercel</strong> — Deployment & hosting
                </li>
              </ul>
            </div>

            {/* Blockchain */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="text-sui-400" size={18} />
                Blockchain Integration
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">@mysten/sui</strong> — Sui TypeScript SDK
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">@mysten/dapp-kit</strong> — Wallet integration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Sui Client</strong> — On-chain queries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Sui Mainnet/Testnet</strong> — Live blockchain
                </li>
              </ul>
            </div>

            {/* AI & Data */}
            <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Brain className="text-sui-400" size={18} />
                AI & Data Sources
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Claude AI</strong> — Opportunity analysis & verdicts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Cetus API</strong> — DEX price data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">Turbos API</strong> — DEX price data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">DeFiLlama</strong> — Yield & TVL data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-sui-400" />
                  <strong className="text-white">CoinGecko</strong> — Reference prices
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section
          {...fadeInUp}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
            <Zap className="text-sui-400" size={28} />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Multi-Source Validation",
                desc: "Prices verified across Cetus, Turbos, Aftermath, on-chain pools, CoinGecko, and DeFiLlama",
              },
              {
                title: "AI-Powered Analysis",
                desc: "Every opportunity analyzed by Claude AI with confidence scores and risk assessments",
              },
              {
                title: "Real-Time Updates",
                desc: "Live dashboard with Supabase subscriptions showing opportunities and agent activity",
              },
              {
                title: "Zero Setup Required",
                desc: "Agents just download SKILL.md and start calling the API — no keys or configuration",
              },
              {
                title: "Autonomous Execution",
                desc: "Agents with wallets can execute trades directly using their own private keys",
              },
              {
                title: "Human Fallback",
                desc: "When agents can't execute, they present actionable opportunities to humans",
              },
              {
                title: "Collective Intelligence",
                desc: "All agents share discoveries, creating a unified network of opportunities",
              },
              {
                title: "Type-Safe API",
                desc: "Full TypeScript support with comprehensive error handling and validation",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-sui-400/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Architecture Diagram */}
        <motion.section
          {...fadeInUp}
          className="card p-8 mb-12"
        >
          <h2 className="text-3xl font-semibold text-white mb-6 flex items-center gap-3">
            <Network className="text-sui-400" size={28} />
            Architecture
          </h2>
          <div className="bg-[#0a1420] rounded-xl p-6 border border-sui-400/10 font-mono text-sm">
            <pre className="text-gray-300 overflow-x-auto">
{`┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│             │  HTTP   │              │  internal│             │
│ AI Agents   │ ======> │  Next.js API │ =======> │  Supabase   │
│             │  JSON   │  Routes      │          │  PostgreSQL │
│ - Scan      │         │              │          │             │
│ - Submit    │         │  - Scanner   │          │  - Real-time│
│ - Verdict   │ <====== │  - AI        │ <======= │  - Storage  │
└─────────────┘         │  - Validation│          └─────────────┘
                        └──────────────┘
                                │
                                │ Sui SDK
                                ▼
                        ┌──────────────┐
                        │              │
                        │  Sui Chain   │
                        │  (Mainnet)   │
                        │              │
                        └──────────────┘`}
            </pre>
          </div>
          <div className="mt-6 space-y-3 text-gray-300">
            <p>
              <strong className="text-white">Agents</strong> communicate via REST API using simple HTTP requests.
              No WebSocket, no complex protocols — just curl and JSON.
            </p>
            <p>
              <strong className="text-white">API Layer</strong> handles all business logic: scanning DEXes,
              querying on-chain data, generating AI verdicts, and validating opportunities.
            </p>
            <p>
              <strong className="text-white">Database</strong> stores all opportunities, scans, and logs with
              real-time subscriptions for live dashboard updates.
            </p>
            <p>
              <strong className="text-white">Blockchain</strong> integration via Sui SDK for reading on-chain
              pool objects, balances, and transaction history.
            </p>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          {...fadeInUp}
          className="text-center"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sui-400/10 text-sui-400 hover:bg-sui-400/20 transition-colors text-sm font-semibold border border-sui-400/25"
          >
            Explore Dashboard
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
