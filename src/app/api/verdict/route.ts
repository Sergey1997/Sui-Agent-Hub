import { NextRequest, NextResponse } from "next/server";
import {
  updateOpportunityVerdict,
  createAgentLog,
  getOpportunities,
} from "@/lib/supabase";
import { generateVerdict } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * POST /api/verdict — Submit an AI verdict for an opportunity.
 *
 * Body:
 * {
 *   "opportunity_id": "uuid",
 *   "is_real": true/false,
 *   "confidence": 0-100,
 *   "verdict": "Free-text analysis...",
 *   "sources_checked": ["Cetus API", "Turbos website", "CoinGecko"]
 * }
 *
 * If the verdict text is short (< 100 chars), the system will enhance it
 * with a full AI-generated analysis via Claude.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { opportunity_id, is_real, confidence, verdict, sources_checked } = body;

    if (!opportunity_id || typeof is_real !== "boolean" || !verdict) {
      return NextResponse.json(
        {
          error:
            "Required: opportunity_id (string), is_real (boolean), verdict (string)",
        },
        { status: 400 }
      );
    }

    // If verdict is short, enhance with AI analysis
    if (verdict.length < 100) {
      try {
        // Look up the opportunity to get full context
        const opportunities = await getOpportunities(50);
        const opp = opportunities.find((o) => o.id === opportunity_id);

        if (opp) {
          const aiResult = await generateVerdict({
            title: opp.title,
            type: opp.type,
            token_pair: opp.token_pair,
            source_dex: opp.source_dex,
            target_dex: opp.target_dex || "",
            buy_price: opp.buy_price,
            sell_price: opp.sell_price,
            profit_percent: opp.profit_percent,
            risk_level: opp.risk_level,
            estimated_profit_usd: opp.estimated_profit_usd,
            agent_notes: opp.agent_notes,
            sources_checked: sources_checked ?? [],
          });

          verdict = `${verdict}\n\n--- AI Analysis ---\n${aiResult.verdict}\n\nReasoning: ${aiResult.reasoning}`;
          confidence = aiResult.confidence;
          is_real = aiResult.isReal;
        }
      } catch (e) {
        console.error("AI verdict enhancement failed:", e);
        // Continue with original verdict
      }
    }

    const updated = await updateOpportunityVerdict(opportunity_id, {
      ai_verdict: verdict,
      verdict_confidence: Math.min(100, Math.max(0, confidence ?? 50)),
      is_real_opportunity: is_real,
      sources_checked: sources_checked ?? [],
    });

    // Log the verdict
    const label = is_real ? "REAL" : "NOT REAL";
    await createAgentLog(
      `Verdict: ${label} (${confidence}% confidence)`,
      `${updated.title} — ${verdict.slice(0, 200)}`,
      is_real ? "success" : "info"
    ).catch(() => {});

    return NextResponse.json({ opportunity: updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
