import { NextRequest, NextResponse } from "next/server";
import {
  createOpportunity,
  getOpportunities,
  updateOpportunityStatus,
  updateOpportunityVerdict,
  supabase,
} from "@/lib/supabase";
import { generateVerdict } from "@/lib/ai";

export const dynamic = "force-dynamic";

// GET /api/opportunities — fetch recent opportunities
// Query params:
//   ?status=approved   — only approved opportunities
//   ?status=discovered  — only discovered, etc.
//   ?type=yield         — only yield opportunities
//   ?limit=50           — max results (default 30)
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const type = req.nextUrl.searchParams.get("type");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "30", 10);

    const opportunities = await getOpportunities(limit, { status, type });
    return NextResponse.json({ opportunities });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/opportunities — create new opportunity (called by OpenClaw agent)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const opportunity = await createOpportunity({
      title: body.title,
      type: body.type || "arbitrage",
      source_dex: body.source_dex,
      target_dex: body.target_dex || null,
      token_pair: body.token_pair,
      buy_price: body.buy_price,
      sell_price: body.sell_price,
      profit_percent: body.profit_percent,
      risk_level: body.risk_level || "medium",
      estimated_profit_usd: body.estimated_profit_usd || 0,
      agent_notes: body.agent_notes || null,
    });

    // Fire-and-forget: generate AI verdict and attach it
    generateVerdict({
      title: opportunity.title,
      type: opportunity.type,
      token_pair: opportunity.token_pair,
      source_dex: opportunity.source_dex,
      target_dex: opportunity.target_dex || "",
      buy_price: opportunity.buy_price,
      sell_price: opportunity.sell_price,
      profit_percent: opportunity.profit_percent,
      risk_level: opportunity.risk_level,
      estimated_profit_usd: opportunity.estimated_profit_usd,
      agent_notes: opportunity.agent_notes,
    })
      .then(async (verdict) => {
        await updateOpportunityVerdict(opportunity.id, {
          ai_verdict: verdict.verdict,
          verdict_confidence: verdict.confidence,
          is_real_opportunity: verdict.isReal,
          sources_checked: verdict.reasoning ? [verdict.reasoning] : [],
        });
      })
      .catch((e) => console.error("AI verdict failed:", e));

    return NextResponse.json({ opportunity }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/opportunities — clear all opportunities (admin cleanup)
export async function DELETE() {
  try {
    const { error } = await supabase
      .from("opportunities")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all rows
    if (error) throw error;
    return NextResponse.json({ success: true, message: "All opportunities cleared" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// PATCH /api/opportunities — update opportunity status
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, tx_hash } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const opportunity = await updateOpportunityStatus(id, status, tx_hash);
    return NextResponse.json({ opportunity });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
