import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.example to .env.local and fill in your Supabase credentials."
    );
  }

  _supabase = createClient(url, key);
  return _supabase;
}

// Re-export as `supabase` for convenience (lazy)
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ─── Types ───────────────────────────────────────────────

export type OpportunityStatus =
  | "discovered"
  | "pending"
  | "approved"
  | "executing"
  | "executed"
  | "failed"
  | "rejected";

export type RiskLevel = "low" | "medium" | "high";

export type OpportunityType = "arbitrage" | "yield" | "hackathon" | "defi" | "swap" | "nft";

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  source_dex: string;
  target_dex: string | null;
  token_pair: string;
  buy_price: number;
  sell_price: number;
  profit_percent: number;
  risk_level: RiskLevel;
  estimated_profit_usd: number;
  status: OpportunityStatus;
  tx_hash: string | null;
  agent_notes: string | null;
  // AI Verdict
  ai_verdict: string | null;
  verdict_confidence: number;
  is_real_opportunity: boolean | null;
  sources_checked: string[];
  //
  created_at: string;
  updated_at: string;
}

export interface AgentLog {
  id: string;
  action: string;
  details: string | null;
  status: "success" | "error" | "info";
  created_at: string;
}

export interface Scan {
  id: string;
  scanned_at: string;
  sources: string[];
  opportunities_found: number;
  prices_queried: number;
  ai_summary: string | null;
  ai_insights: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Queries ─────────────────────────────────────────────

export async function getOpportunities(
  limit = 20,
  filters?: { status?: string | null; type?: string | null }
) {
  let query = supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Opportunity[];
}

export async function createOpportunity(
  opp: Omit<
    Opportunity,
    | "id"
    | "created_at"
    | "updated_at"
    | "status"
    | "tx_hash"
    | "ai_verdict"
    | "verdict_confidence"
    | "is_real_opportunity"
    | "sources_checked"
  >
) {
  const { data, error } = await supabase
    .from("opportunities")
    .insert([{ ...opp, status: "discovered" }])
    .select()
    .single();

  if (error) throw error;
  return data as Opportunity;
}

export async function updateOpportunityStatus(
  id: string,
  status: OpportunityStatus,
  tx_hash?: string
) {
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (tx_hash) updates.tx_hash = tx_hash;

  const { data, error } = await supabase
    .from("opportunities")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Opportunity;
}

export async function updateOpportunityVerdict(
  id: string,
  verdict: {
    ai_verdict: string;
    verdict_confidence: number;
    is_real_opportunity: boolean;
    sources_checked: string[];
  }
) {
  const { data, error } = await supabase
    .from("opportunities")
    .update({
      ...verdict,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Opportunity;
}

export async function getAgentLogs(limit = 50) {
  const { data, error } = await supabase
    .from("agent_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AgentLog[];
}

export async function createAgentLog(
  action: string,
  details: string | null,
  status: "success" | "error" | "info"
) {
  const { error } = await supabase
    .from("agent_logs")
    .insert([{ action, details, status }]);

  if (error) throw error;
}

// ─── Realtime ────────────────────────────────────────────

export function subscribeToOpportunities(
  callback: (opp: Opportunity) => void
) {
  return supabase
    .channel("opportunities-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "opportunities" },
      (payload) => {
        callback(payload.new as Opportunity);
      }
    )
    .subscribe();
}

export function subscribeToAgentLogs(callback: (log: AgentLog) => void) {
  return supabase
    .channel("agent-logs-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "agent_logs" },
      (payload) => {
        callback(payload.new as AgentLog);
      }
    )
    .subscribe();
}

// ─── Scans ──────────────────────────────────────────────────

export async function getScans(limit = 50) {
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .order("scanned_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Scan[];
}

export async function createScan(scan: {
  sources: string[];
  opportunities_found: number;
  prices_queried: number;
  ai_summary: string | null;
  ai_insights: string | null;
  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from("scans")
    .insert([
      {
        ...scan,
        scanned_at: new Date().toISOString(),
        metadata: scan.metadata || {},
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Scan;
}

export function subscribeToScans(callback: (scan: Scan) => void) {
  return supabase
    .channel("scans-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "scans" },
      (payload) => {
        callback(payload.new as Scan);
      }
    )
    .subscribe();
}
