-- ============================================================
-- Migration: Add scans table for tracking all scan activities
-- This allows ALL users to see what's happening across all agents
-- ============================================================

CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sources TEXT[] DEFAULT '{}',                    -- Which DEX APIs were queried
  opportunities_found INTEGER DEFAULT 0,          -- Number of opportunities discovered
  prices_queried INTEGER DEFAULT 0,              -- Number of price points collected
  ai_summary TEXT,                                -- AI-generated summary of the scan (what happened, key findings)
  ai_insights TEXT,                                -- AI-generated insights (trends, patterns, recommendations)
  metadata JSONB DEFAULT '{}',                     -- Additional scan metadata (pairs scanned, filters used, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_opportunities_found ON scans(opportunities_found DESC);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE scans;

-- Row Level Security
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to scans"
  ON scans FOR ALL
  USING (true)
  WITH CHECK (true);
