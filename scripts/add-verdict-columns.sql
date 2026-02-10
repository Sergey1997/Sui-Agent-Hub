-- ============================================================
-- Migration: Add AI Verdict columns to opportunities table
-- Run this if you already have the base schema
-- ============================================================

ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS ai_verdict TEXT;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS verdict_confidence INTEGER DEFAULT 0;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS is_real_opportunity BOOLEAN DEFAULT NULL;
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS sources_checked TEXT[] DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_opportunities_verdict ON opportunities(is_real_opportunity);
