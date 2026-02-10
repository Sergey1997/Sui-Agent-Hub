"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />
      <Header />

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-6 sm:px-10 pt-28 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <h1 className="text-4xl sm:text-5xl font-light text-white mb-4">
            Sui Opportunities Hunter
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Data service for AI agents — enhanced DeFi opportunities on demand
          </p>

          {/* Core Value Proposition */}
          {/* <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              What We Provide
            </h2>
            <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-8 mb-6">
              <p className="text-xl text-gray-200 leading-relaxed mb-6">
                <strong className="text-white">Sui Opportunities Hunter is a data service for AI agents.</strong>{" "}
                When your agent needs opportunities, market data, or DeFi intelligence, we provide
                enhanced, validated, and actionable data on demand.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Instead of agents building their own scrapers, API integrations, and data pipelines, they simply
                request opportunities from us. We handle the complexity of aggregating data from multiple DEXes,
                validating prices, analyzing liquidity, and enriching opportunities with AI-powered insights.
              </p>
            </div>
          </section> */}

          {/* How Agents Use Our Service */}
          {/* <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              How Agents Use Our Service
            </h2>

            <div className="space-y-6">
              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Request Opportunities</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Agents call <code className="bg-white/10 px-2 py-1 rounded">GET /api/scan</code> to request
                  all available opportunities. We scan Sui DEXes, compare prices, and return
                  validated opportunities ready for analysis.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">What we provide:</strong> Complete opportunity data including
                  token pairs, buy/sell prices, profit percentages, liquidity estimates, and risk assessments.
                  All data is enriched with cross-referenced prices from multiple sources.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Get Enhanced Data</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Every opportunity we provide includes:
                </p>
                <ul className="text-gray-300 space-y-2 ml-4">
                  <li>
                    <strong className="text-white">Multi-source validation</strong> — Prices verified across
                    Cetus, Turbos, on-chain pools, and CoinGecko
                  </li>
                  <li>
                    <strong className="text-white">Liquidity analysis</strong> — Estimated slippage and depth
                    for each DEX
                  </li>
                  <li>
                    <strong className="text-white">Historical context</strong> — Price persistence and spread
                    stability metrics
                  </li>
                  <li>
                    <strong className="text-white">Risk scoring</strong> — Pre-calculated risk levels based on
                    liquidity, volatility, and market conditions
                  </li>
                </ul>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Submit Discoveries</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Agents can also contribute opportunities they discover through web research or other methods
                  via <code className="bg-white/10 px-2 py-1 rounded">POST /api/opportunities</code>.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">Value added:</strong> When agents share discoveries, we enrich
                  them with our validation pipeline, cross-reference with our data sources, and make them
                  available to the entire network. Your discovery becomes enhanced data for everyone.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Get AI Analysis</h3>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Agents can request AI-powered analysis for any opportunity via{" "}
                  <code className="bg-white/10 px-2 py-1 rounded">POST /api/verdict</code>. We provide
                  detailed verdicts with confidence scores, risk assessments, and execution recommendations.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  <strong className="text-white">What we analyze:</strong> Price persistence, liquidity depth,
                  slippage impact, market volatility, and execution feasibility. This saves agents from
                  building their own analysis pipelines.
                </p>
              </div>
            </div>
          </section> */}

          {/* Data Enhancement */}
          {/* <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              Data Enhancement & Enrichment
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              We don't just aggregate raw data — we enhance it with intelligence and validation:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Multi-Source Aggregation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We query Cetus API, Turbos API, on-chain Sui pools, and CoinGecko simultaneously, then
                  normalize and cross-reference prices to ensure accuracy.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Liquidity Intelligence</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Every opportunity includes liquidity depth analysis, estimated slippage, and trade size
                  recommendations based on pool capacity.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Price Validation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We verify price persistence across multiple checks and time intervals, filtering out transient
                  spreads that would disappear before execution.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Risk Scoring</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Each opportunity comes with pre-calculated risk levels based on liquidity, volatility, spread
                  stability, and market conditions.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">AI-Powered Insights</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Opportunities are analyzed by Claude AI, providing detailed verdicts, confidence scores, and
                  execution recommendations.
                </p>
              </div>

              <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Real-Time Updates</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Data is continuously updated as new opportunities emerge, prices change, and market conditions
                  evolve. Agents always get the latest intelligence.
                </p>
              </div>
            </div>
          </section> */}

          {/* Value for Agents */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              Value for AI Agents
            </h2>
            <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
              <ul className="text-gray-300 space-y-4">
                <li>
                  <strong className="text-white">No Infrastructure Needed</strong> — Don't build scrapers,
                  API integrations, or data pipelines. Just request opportunities when you need them.
                </li>
                <li>
                  <strong className="text-white">Pre-Validated Data</strong> — Every opportunity is already
                  validated across multiple sources, saving agents from building their own validation logic.
                </li>
                <li>
                  <strong className="text-white">Enhanced Intelligence</strong> — Get liquidity analysis,
                  risk scores, and AI verdicts without implementing complex analysis pipelines.
                </li>
                <li>
                  <strong className="text-white">Collective Intelligence</strong> — Access opportunities
                  discovered by the entire network. Your agent benefits from discoveries made by others.
                </li>
                <li>
                  <strong className="text-white">Focus on Strategy</strong> — Spend time on trading logic and
                  execution, not data collection and validation.
                </li>
                <li>
                  <strong className="text-white">Always Up-to-Date</strong> — Real-time data ensures your agent
                  never misses opportunities due to stale information.
                </li>
              </ul>
            </div>
          </section>

          {/* Multi-Agent Network */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              The Network Effect
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              When multiple agents use our service, everyone benefits:
            </p>
            <ul className="text-gray-300 space-y-3">
              <li>
                <strong className="text-white">Shared Discoveries</strong> — When one agent finds an
                opportunity, it becomes available to all agents through our network. No duplicate work.
              </li>
              <li>
                <strong className="text-white">Cross-Validation</strong> — Multiple agents can verify the same
                opportunity, increasing confidence and reducing false positives.
              </li>
              <li>
                <strong className="text-white">Continuous Coverage</strong> — With multiple agents scanning
                different DEXes and time intervals, the network provides comprehensive market coverage.
              </li>
              <li>
                <strong className="text-white">Collective Intelligence</strong> — The more agents contribute,
                the richer the data becomes. Each agent's discoveries enhance the intelligence available to
                everyone.
              </li>
            </ul>
          </section>

          {/* API Reference */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              API Reference
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Simple REST API — request data, get enhanced opportunities:
            </p>
            <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6 overflow-x-auto">
              <table className="w-full text-sm text-gray-300">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white font-semibold">Method</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">Endpoint</th>
                    <th className="text-left py-3 px-4 text-white font-semibold">What You Get</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded">GET</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/scan</td>
                    <td className="py-3 px-4">
                      Fresh opportunities with validated prices, liquidity data, and risk scores
                    </td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-blue-400/20 text-blue-300 px-2 py-1 rounded">POST</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/scan</td>
                    <td className="py-3 px-4">Filtered opportunities (min_profit_percent, specific pairs)</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded">GET</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/opportunities</td>
                    <td className="py-3 px-4">All available opportunities from the network</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-blue-400/20 text-blue-300 px-2 py-1 rounded">POST</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/opportunities</td>
                    <td className="py-3 px-4">Share a discovery — we'll enhance and validate it</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-blue-400/20 text-blue-300 px-2 py-1 rounded">POST</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/verdict</td>
                    <td className="py-3 px-4">Get AI analysis and verdict for any opportunity</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3 px-4">
                      <code className="bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded">GET</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/agent-logs</td>
                    <td className="py-3 px-4">View activity history and network status</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <code className="bg-emerald-400/20 text-emerald-300 px-2 py-1 rounded">GET</code>
                    </td>
                    <td className="py-3 px-4 font-mono">/api/skill</td>
                    <td className="py-3 px-4">Download SKILL.md agent instructions</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-16">
            <h2 className="text-3xl font-semibold text-white mb-6 border-b-2 border-sui-400/30 pb-3">
              Getting Started
            </h2>
            <div className="bg-white/[0.03] border-2 border-white/[0.1] rounded-xl p-6">
              <ol className="text-gray-300 space-y-4 list-decimal list-inside">
                <li>
                  <strong className="text-white">Download SKILL.md</strong> — Get the agent instructions from
                  the dashboard header.
                </li>
                <li>
                  <strong className="text-white">Configure your agent</strong> — Set{" "}
                  <code className="bg-white/10 px-2 py-1 rounded">DASHBOARD_URL</code> to point to our API.
                </li>
                <li>
                  <strong className="text-white">Request opportunities</strong> — Call{" "}
                  <code className="bg-white/10 px-2 py-1 rounded">GET /api/scan</code> to get enhanced
                  opportunities.
                </li>
                <li>
                  <strong className="text-white">Use the data</strong> — Analyze opportunities, request AI
                  verdicts, and make trading decisions based on our enriched data.
                </li>
                <li>
                  <strong className="text-white">Contribute discoveries</strong> — Share opportunities you
                  find to enhance the network's collective intelligence.
                </li>
              </ol>
            </div>
          </section>
        </motion.article>
      </main>

      <Footer />
    </div>
  );
}
