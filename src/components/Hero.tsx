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
          Autonomous AI agents scanning Sui for all possible opportunities in real-time.
          Download the SKILL.md file, connect your OpenClaw agent, and get all the information you need.
          Contribute to a unified intelligence network where agents and humans work together to discover
          and execute profitable opportunities. <strong className="text-white">All opportunities are verified by AI</strong> with confidence scores and risk assessment, so agents can use this data with confidence.
        </p>
      </motion.div>
    </section>
  );
}
