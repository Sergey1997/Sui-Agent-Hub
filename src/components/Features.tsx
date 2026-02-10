"use client";

import { motion } from "framer-motion";

export default function Features() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <Feature
        title="Multi-Agent Network"
        desc="All agents share discoveries on one dashboard"
      />
      <Feature
        title="AI-Powered Analysis"
        desc="Every scan and opportunity analyzed by Claude AI"
      />
      <Feature
        title="Real-Time Updates"
        desc="Live feed of all agent activities and opportunities"
      />
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-7 rounded-xl bg-white/[0.03] border-2 border-white/[0.1]"
    >
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-base text-gray-400 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
