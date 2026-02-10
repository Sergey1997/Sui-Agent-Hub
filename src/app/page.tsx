"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import AnimatedBackground from "@/components/AnimatedBackground";
import AgentStatus from "@/components/AgentStatus";
import OpportunityCard from "@/components/OpportunityCard";
import AgentLogFeed from "@/components/AgentLogFeed";
import ScanHistory from "@/components/ScanHistory";

import {
  subscribeToOpportunities,
  subscribeToAgentLogs,
  subscribeToScans,
  type Opportunity,
  type AgentLog,
  type Scan,
} from "@/lib/supabase";

const TYPE_FILTERS = [
  { key: "all",       label: "All" },
  { key: "arbitrage", label: "Arbitrage" },
  { key: "yield",     label: "Yield" },
  { key: "hackathon", label: "Hackathon" },
  { key: "defi",      label: "DeFi" },
  { key: "swap",      label: "Swap" },
  { key: "nft",       label: "NFT" },
];

const PER_PAGE = 6;

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  // ─── Fetch ──────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      try {
        const [oR, lR, sR] = await Promise.all([
          fetch("/api/opportunities"),
          fetch("/api/agent-logs"),
          fetch("/api/scans"),
        ]);
        const [oD, lD, sD] = await Promise.all([
          oR.json(),
          lR.json(),
          sR.json(),
        ]);
        setOpportunities(oD.opportunities || []);
        setLogs(lD.logs || []);
        setScans(sD.scans || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ─── Realtime ───────────────────────────────────────────

  useEffect(() => {
    const c1 = subscribeToOpportunities((opp) => {
      setOpportunities((prev) => {
        const exists = prev.find((p) => p.id === opp.id);
        if (exists) return prev.map((p) => (p.id === opp.id ? opp : p));
        return [opp, ...prev].slice(0, 50);
      });
    });
    const c2 = subscribeToAgentLogs((log) => {
      setLogs((prev) => [log, ...prev].slice(0, 50));
    });
    const c3 = subscribeToScans((scan) => {
      setScans((prev) => [scan, ...prev].slice(0, 50));
    });
    return () => { c1.unsubscribe(); c2.unsubscribe(); c3.unsubscribe(); };
  }, []);

  // ─── Actions ────────────────────────────────────────────

  const handleApprove = useCallback(async (id: string) => {
    await fetch("/api/opportunities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "approved" }),
    });
  }, []);

  const handleReject = useCallback(async (id: string) => {
    await fetch("/api/opportunities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "rejected" }),
    });
  }, []);

  // ─── Filtered + Paginated ─────────────────────────────

  const filtered = useMemo(() => {
    if (typeFilter === "all") return opportunities;
    return opportunities.filter((o) => o.type === typeFilter);
  }, [opportunities, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageOpps = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Reset page when filter changes
  useEffect(() => { setPage(1); }, [typeFilter]);

  // Count by type for filter badges
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: opportunities.length };
    for (const opp of opportunities) {
      counts[opp.type] = (counts[opp.type] || 0) + 1;
    }
    return counts;
  }, [opportunities]);

  // ─── Computed ───────────────────────────────────────────

  const executed = opportunities.filter((o) => o.status === "executed").length;
  const pending = opportunities.filter(
    (o) => o.status === "discovered" || o.status === "pending" || o.status === "approved"
  ).length;

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="flex flex-col min-h-screen relative">
      <AnimatedBackground />
      <Header />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 pt-28 pb-24">
        {/* Hero + Status sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mb-12">
          <Hero />
          <div className="flex flex-col gap-6 pt-8">
            <AgentStatus
              opportunityCount={opportunities.length}
              executedCount={executed}
              pendingCount={pending}
            />
          </div>
        </div>

        {/* Opportunities + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10" id="opportunities">
          <div className="lg:col-span-2">
            {/* Header + Filters */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Opportunities</h2>
              <span className="text-sm text-gray-400 font-medium">
                {filtered.length} found
              </span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {TYPE_FILTERS.map((f) => {
                const count = typeCounts[f.key] || 0;
                const active = typeFilter === f.key;
                return (
                  <button
                    key={f.key}
                    onClick={() => setTypeFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      active
                        ? "bg-sui-400/15 text-sui-400 border-sui-400/30"
                        : "bg-white/[0.03] text-gray-400 border-white/[0.08] hover:border-white/[0.15] hover:text-gray-300"
                    }`}
                  >
                    {f.label}
                    {count > 0 && (
                      <span className={`ml-1.5 ${active ? "text-sui-300" : "text-gray-500"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cards */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card h-40 animate-pulse" />
                ))}
              </div>
            ) : pageOpps.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {pageOpps.map((opp, i) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-lg text-gray-400 mb-2">
                  {typeFilter === "all" ? "No opportunities yet" : `No ${typeFilter} opportunities`}
                </p>
                <p className="text-sm text-gray-500">
                  {typeFilter === "all"
                    ? "Download SKILL.md and start your OpenClaw agent"
                    : "Try a different filter or scan for more"}
                </p>
              </div>
            )}

            {/* Pagination */}
            {filtered.length > PER_PAGE && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/[0.06]">
                <span className="text-sm text-gray-500">
                  {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="p-2 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm text-gray-400 font-medium min-w-[60px] text-center">
                    {safePage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="p-2 rounded-lg border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/[0.15] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <AgentLogFeed logs={logs} />
          </div>
        </div>

        {/* Scan History */}
        <ScanHistory scans={scans} />
      </main>

      <Footer />
    </div>
  );
}
