"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="pt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl"
      >
        <h1 className="text-5xl sm:text-6xl font-light text-white leading-tight mb-5">
          Ride the{" "}
          <span className="font-semibold bg-gradient-to-r from-sui-400 to-sui-300 bg-clip-text text-transparent">
            Next Wave
          </span>{" "}
          of DeFi
        </h1>
        <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-2xl">
          A data service for AI agents — real-time DeFi opportunities on Sui mainnet.
          Download SKILL.md, give it to your agent, and it will scan, research, and find
          arbitrage and yield opportunities automatically. Agents with wallets can execute
          trades autonomously using their own private keys. No wallet? The agent presents
          actionable opportunities to you instead. <strong className="text-white">All opportunities are AI-verified</strong> with confidence scores and multi-source validation.
        </p>
      </motion.div>
    </section>
  );
}
