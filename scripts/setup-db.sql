-- ============================================================
-- Sui Opportunity Hunter — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Opportunities Table ─────────────────────────────────

CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'arbitrage',              -- arbitrage, yield, nft, swap
  source_dex TEXT NOT NULL,
  target_dex TEXT,
  token_pair TEXT NOT NULL,
  buy_price DECIMAL(18, 8) NOT NULL DEFAULT 0,
  sell_price DECIMAL(18, 8) NOT NULL DEFAULT 0,
  profit_percent DECIMAL(10, 4) NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'medium',            -- low, medium, high
  estimated_profit_usd DECIMAL(18, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'discovered',            -- discovered, pending, approved, executing, executed, failed, rejected
  tx_hash TEXT,
  agent_notes TEXT,

  -- AI Verdict fields
  ai_verdict TEXT,                                      -- Agent's analysis of the opportunity
  verdict_confidence INTEGER DEFAULT 0,                 -- 0-100 confidence score
  is_real_opportunity BOOLEAN DEFAULT NULL,             -- Agent's conclusion: true = real, false = not real, null = not yet analyzed
  sources_checked TEXT[] DEFAULT '{}',                  -- Which sources the agent verified

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Agent Logs Table ────────────────────────────────────

CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'info',                  -- success, error, info
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_opportunities_status ON opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_created ON opportunities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_type ON opportunities(type);
CREATE INDEX IF NOT EXISTS idx_opportunities_verdict ON opportunities(is_real_opportunity);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created ON agent_logs(created_at DESC);

-- ─── Enable Realtime ─────────────────────────────────────

ALTER PUBLICATION supabase_realtime ADD TABLE opportunities;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_logs;

-- ─── Row Level Security ────────────────────────────────

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- Allow all access (hackathon mode)
CREATE POLICY "Allow all access to opportunities"
  ON opportunities FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to agent_logs"
  ON agent_logs FOR ALL
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_opportunities_updated_at ON opportunities;
CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
