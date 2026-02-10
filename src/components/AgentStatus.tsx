"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface Props {
  opportunityCount: number;
  executedCount: number;
  pendingCount: number;
}

export default function AgentStatus(props: Props) {
  const stats = [
    { label: "DISCOVERED", value: props.opportunityCount },
    { label: "PENDING", value: props.pendingCount },
    { label: "EXECUTED", value: props.executedCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-6"
    >
      {/* Top — title row */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <div className="p-3 rounded-xl bg-sui-400/10 border border-sui-400/20">
            <Activity size={24} className="text-sui-400" />
          </div>
          <motion.span
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#000B1E]"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            Agent Network Active
          </h2>
          <p className="text-sm text-gray-400">
            Monitoring Sui DEXes in real-time
          </p>
        </div>
      </div>

      {/* Bottom — stats */}
      <div className="flex items-center justify-between border-t-2 border-sui-400/15 pt-5">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && <div className="w-px h-10 bg-sui-400/15 mx-4 lg:mx-6" />}
            <div className="text-center">
              <motion.p
                key={String(stat.value)}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-3xl font-bold text-white leading-none mb-1"
              >
                {stat.value}
              </motion.p>
              <span className="text-xs text-gray-400 uppercase tracking-[0.15em] font-semibold">
                {stat.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
