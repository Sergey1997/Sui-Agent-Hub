"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Scan } from "@/lib/supabase";

interface Props {
  scans: Scan[];
}

export default function ScanHistory({ scans }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">
          Scan History
        </h3>
        <span className="text-base text-gray-400 font-medium">{scans.length} scans</span>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {scans.map((scan, i) => (
            <ScanRow key={scan.id} scan={scan} index={i} />
          ))}
        </AnimatePresence>

        {scans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400 font-medium">No scans yet</p>
            <p className="text-base text-gray-500 mt-2">
              Scans will appear here as agents run
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanRow({ scan, index }: { scan: Scan; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="p-6 rounded-xl bg-white/[0.02] border-2 border-white/[0.1] hover:border-sui-400/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-white">
            {scan.opportunities_found}
          </span>
          <span className="text-base text-gray-400">
            opportunities found from {scan.prices_queried} price points
          </span>
        </div>
        <div className="flex items-center gap-2 text-base text-gray-400">
          <Clock size={18} />
          {formatDistanceToNow(new Date(scan.scanned_at), { addSuffix: true })}
        </div>
      </div>

      {/* Sources */}
      {scan.sources?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {scan.sources.map((src) => (
            <span
              key={src}
              className="text-sm px-4 py-2 rounded-lg bg-sui-400/[0.1] text-sui-300 border border-sui-400/25 font-medium"
            >
              {src}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary + Insights */}
      {(scan.ai_summary || scan.ai_insights) && (
        <div className="mt-4 p-5 rounded-xl bg-sui-400/[0.06] border-2 border-sui-400/25">
          <div className="flex items-center gap-3 mb-3">
            <Brain size={20} className="text-sui-400" />
            <span className="text-base font-bold text-sui-400 uppercase tracking-wider">
              AI Analysis
            </span>
          </div>
          {scan.ai_summary && (
            <p className="text-base text-gray-300 leading-relaxed mb-3">
              {scan.ai_summary}
            </p>
          )}
          {scan.ai_insights && (
            <InsightsList text={scan.ai_insights} />
          )}
        </div>
      )}
    </motion.div>
  );
}

/** Render bullet-point insights as a clean list */
function InsightsList({ text }: { text: string }) {
  // Split on newlines, strip bullet chars (•, -, *)
  const items = text
    .split("\n")
    .map((line) => line.replace(/^[\s•\-\*]+/, "").trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return (
    <ul className="space-y-2 border-t border-sui-400/15 pt-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-sui-400/60 mt-2 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}
