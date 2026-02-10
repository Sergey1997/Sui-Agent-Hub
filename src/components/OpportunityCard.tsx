"use client";

import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  ArrowRight,
  TrendingUp,
  Trophy,
  Layers,
  Repeat,
  Image,
  ExternalLink,
  Check,
  X,
  Loader2,
  Brain,
  ShieldCheck,
  ShieldAlert,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Opportunity, OpportunityType } from "@/lib/supabase";

// ─── Config ─────────────────────────────────────────────

const typeConfig: Record<
  string,
  { icon: typeof ArrowRightLeft; label: string; color: string; bg: string }
> = {
  arbitrage: { icon: ArrowRightLeft, label: "Arbitrage", color: "text-sui-400", bg: "bg-sui-400/10 border-sui-400/25" },
  yield:     { icon: TrendingUp,    label: "Yield",     color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25" },
  hackathon: { icon: Trophy,        label: "Hackathon", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/25" },
  defi:      { icon: Layers,        label: "DeFi",      color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/25" },
  swap:      { icon: Repeat,        label: "Swap",      color: "text-sky-400", bg: "bg-sky-400/10 border-sky-400/25" },
  nft:       { icon: Image,         label: "NFT",       color: "text-pink-400", bg: "bg-pink-400/10 border-pink-400/25" },
};

const riskConfig: Record<string, { text: string; cls: string; dot: string }> = {
  low:    { text: "Low",    cls: "text-emerald-400", dot: "bg-emerald-400" },
  medium: { text: "Medium", cls: "text-amber-400",   dot: "bg-amber-400" },
  high:   { text: "High",   cls: "text-red-400",     dot: "bg-red-400" },
};

const statusConfig: Record<string, { cls: string; bg: string; text: string }> = {
  discovered: { cls: "text-sui-400",     bg: "bg-sui-400/10 border-sui-400/25",     text: "Discovered" },
  pending:    { cls: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/25", text: "Pending" },
  approved:   { cls: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25", text: "Approved" },
  executing:  { cls: "text-sui-300",     bg: "bg-sui-300/10 border-sui-300/25",     text: "Executing" },
  executed:   { cls: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25", text: "Executed" },
  failed:     { cls: "text-red-400",     bg: "bg-red-400/10 border-red-400/25",     text: "Failed" },
  rejected:   { cls: "text-gray-500",    bg: "bg-gray-500/10 border-gray-500/25",   text: "Rejected" },
};

// ─── Markdown Bold Helper ───────────────────────────────

/** Convert **bold** markdown to <strong> elements */
function BoldText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

// ─── Main Component ─────────────────────────────────────

interface Props {
  opportunity: Opportunity;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  index?: number;
}

export default function OpportunityCard({
  opportunity: opp,
  onApprove,
  onReject,
  index = 0,
}: Props) {
  const tc = typeConfig[opp.type] || typeConfig.arbitrage;
  const Icon = tc.icon;
  const risk = riskConfig[opp.risk_level] || riskConfig.medium;
  const status = statusConfig[opp.status] || statusConfig.discovered;
  const canAct = opp.status === "discovered" || opp.status === "pending";
  const hasVerdict = opp.ai_verdict != null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, delay: index * 0.03 }}
      className="card overflow-hidden"
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b-2 border-sui-400/15 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${status.bg} ${status.cls}`}>
            {opp.status === "executing" && <Loader2 size={12} className="inline mr-1 animate-spin" />}
            {status.text}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${tc.bg} ${tc.color}`}>
            <Icon size={12} className="inline mr-1" />
            {tc.label}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} />
            <span className={`text-xs font-medium ${risk.cls}`}>{risk.text}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} />
          {formatDistanceToNow(new Date(opp.created_at), { addSuffix: true })}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-base font-bold text-white mb-3 leading-snug">
          <BoldText text={opp.title} />
        </h3>

        {/* Type-specific body */}
        {opp.type === "arbitrage" ? (
          <ArbitrageBody opp={opp} />
        ) : opp.type === "yield" ? (
          <YieldBody opp={opp} />
        ) : opp.type === "hackathon" ? (
          <HackathonBody opp={opp} />
        ) : (
          <GenericBody opp={opp} />
        )}

        {/* ── Verdict ── */}
        {hasVerdict ? (
          <VerdictBox opp={opp} />
        ) : (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <Brain size={16} className="shrink-0" /> Awaiting AI verdict...
          </div>
        )}

        {/* Agent notes (only if no verdict) */}
        {opp.agent_notes && !hasVerdict && (
          <p className="text-sm text-gray-400 mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] leading-relaxed">
            <BoldText text={opp.agent_notes} />
          </p>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
          {canAct && onApprove && onReject && (
            <>
              <button
                onClick={() => onApprove(opp.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-colors border border-emerald-400/25 text-xs font-semibold"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => onReject(opp.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors border border-red-400/25 text-xs font-semibold"
              >
                <X size={14} /> Reject
              </button>
            </>
          )}
          {opp.tx_hash && (
            <a
              href={`https://suiscan.xyz/mainnet/tx/${opp.tx_hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sui-400/10 text-sui-400 hover:bg-sui-400/20 transition-colors border border-sui-400/25 text-xs font-semibold"
            >
              <ExternalLink size={14} /> Explorer
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Type-Specific Bodies ───────────────────────────────

function ArbitrageBody({ opp }: { opp: Opportunity }) {
  return (
    <>
      {/* DEX flow */}
      <div className="flex items-stretch gap-2 mb-4">
        <div className="flex-1 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Buy on</span>
          <span className="text-sm font-bold text-white block">{opp.source_dex}</span>
          <span className="text-sm font-bold text-gray-300 font-mono">${opp.buy_price.toFixed(6)}</span>
        </div>
        <div className="flex items-center">
          <div className="p-1.5 rounded-md bg-sui-400/10 border border-sui-400/20">
            <ArrowRight size={14} className="text-sui-400" />
          </div>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Sell on</span>
          <span className="text-sm font-bold text-white block">{opp.target_dex || "—"}</span>
          <span className="text-sm font-bold text-gray-300 font-mono">${opp.sell_price.toFixed(6)}</span>
        </div>
      </div>
      {/* Profit row */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-sui-400/[0.06] border border-sui-400/20 mb-4">
        <div>
          <span className="text-xs text-gray-400">Spread</span>
          <span className="text-lg font-bold text-sui-400 ml-2">{opp.profit_percent.toFixed(2)}%</span>
        </div>
        <div>
          <span className="text-xs text-gray-400">Est. Profit</span>
          <span className="text-base font-bold text-white ml-2">${opp.estimated_profit_usd?.toFixed(2) ?? "—"}</span>
        </div>
      </div>
    </>
  );
}

function YieldBody({ opp }: { opp: Opportunity }) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-1">Source</span>
        <span className="text-sm font-bold text-white">{opp.source_dex}</span>
      </div>
      <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-1">Pair</span>
        <span className="text-sm font-bold text-white">{opp.token_pair}</span>
      </div>
      <div className="p-3 rounded-lg bg-emerald-400/[0.06] border border-emerald-400/20">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-1">APY / Profit</span>
        <span className="text-lg font-bold text-emerald-400">{opp.profit_percent.toFixed(2)}%</span>
      </div>
    </div>
  );
}

function HackathonBody({ opp }: { opp: Opportunity }) {
  return (
    <div className="mb-4">
      {/* Description from agent_notes */}
      {opp.agent_notes && (
        <p className="text-sm text-gray-300 leading-relaxed mb-3 p-3 rounded-lg bg-amber-400/[0.04] border border-amber-400/15">
          <BoldText text={opp.agent_notes} />
        </p>
      )}
      <div className="flex items-center gap-3">
        {opp.estimated_profit_usd > 0 && (
          <div className="p-3 rounded-lg bg-amber-400/[0.06] border border-amber-400/20">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Prize</span>
            <span className="text-lg font-bold text-amber-400">${opp.estimated_profit_usd.toFixed(0)}</span>
          </div>
        )}
        {opp.source_dex && (
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Platform</span>
            <span className="text-sm font-bold text-white">{opp.source_dex}</span>
          </div>
        )}
        {opp.token_pair && opp.token_pair !== "N/A" && (
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Token</span>
            <span className="text-sm font-bold text-white">{opp.token_pair}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GenericBody({ opp }: { opp: Opportunity }) {
  return (
    <div className="mb-4">
      {opp.agent_notes && (
        <p className="text-sm text-gray-300 leading-relaxed mb-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
          <BoldText text={opp.agent_notes} />
        </p>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        {opp.source_dex && (
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Source</span>
            <span className="text-sm font-bold text-white">{opp.source_dex}</span>
          </div>
        )}
        {opp.token_pair && opp.token_pair !== "N/A" && (
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Pair</span>
            <span className="text-sm font-bold text-white">{opp.token_pair}</span>
          </div>
        )}
        {opp.profit_percent > 0 && (
          <div className="p-3 rounded-lg bg-sui-400/[0.06] border border-sui-400/20">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Profit</span>
            <span className="text-lg font-bold text-sui-400">{opp.profit_percent.toFixed(2)}%</span>
          </div>
        )}
        {opp.estimated_profit_usd > 0 && (
          <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold block mb-0.5">Est. Value</span>
            <span className="text-sm font-bold text-white">${opp.estimated_profit_usd.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Verdict ────────────────────────────────────────────

function VerdictBox({ opp }: { opp: Opportunity }) {
  const real = opp.is_real_opportunity;
  return (
    <div
      className={`mb-4 p-4 rounded-lg border ${
        real
          ? "bg-emerald-400/[0.05] border-emerald-400/20"
          : "bg-red-400/[0.05] border-red-400/20"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {real ? (
          <ShieldCheck size={16} className="text-emerald-400" />
        ) : (
          <ShieldAlert size={16} className="text-red-400" />
        )}
        <span
          className={`text-sm font-bold uppercase tracking-wide ${
            real ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {real ? "Viable" : "Not Viable"}
        </span>
        {opp.verdict_confidence > 0 && (
          <span className="ml-auto text-xs text-gray-400 font-medium">
            {opp.verdict_confidence}%
          </span>
        )}
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">
        <BoldText text={opp.ai_verdict || ""} />
      </p>
      {opp.sources_checked?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {opp.sources_checked.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-gray-400 border border-white/[0.08]"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
