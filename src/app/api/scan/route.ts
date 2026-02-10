import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner";
import { createOpportunity, createAgentLog, createScan, supabase } from "@/lib/supabase";
import { generateScanSummary } from "@/lib/ai";

export const dynamic = "force-dynamic";

/**
 * Persist scan results: scan record, opportunities, agent logs.
 * Awaits everything so nothing is lost in serverless execution.
 */
async function storeScanResults(
  result: Awaited<ReturnType<typeof runScan>>,
  label: string
) {
  // 1. Log scan start
  await createAgentLog(
    label,
    `Querying ${result.sources.join(", ") || "sources"}`,
    "info"
  ).catch((e) => console.error("[scan] log start failed:", e));

  // 2. Create scan record immediately (no AI yet)
  let scanRecord;
  try {
    scanRecord = await createScan({
      sources: result.sources,
      opportunities_found: result.opportunities.length,
      prices_queried: result.prices.length,
      ai_summary: null,
      ai_insights: null,
      metadata: { scannedAt: result.scannedAt },
    });
  } catch (e) {
    console.error("[scan] createScan failed:", e);
  }

  // 3. Store opportunities
  const stored: string[] = [];
  for (const opp of result.opportunities.slice(0, 5)) {
    try {
      await createOpportunity(opp);
      stored.push(opp.title);
    } catch (e) {
      console.error("[scan] createOpportunity failed:", e);
    }
  }

  // 4. Log results
  if (result.opportunities.length > 0) {
    await createAgentLog(
      `Found ${result.opportunities.length} opportunities`,
      `Sources: ${result.sources.join(", ")}. Stored: ${stored.length}. Top: ${result.opportunities[0]?.title ?? "none"}`,
      "success"
    ).catch((e) => console.error("[scan] log success failed:", e));
  } else {
    await createAgentLog(
      "Scan complete — no opportunities",
      `Queried ${result.prices.length} prices from ${result.sources.join(", ") || "0 sources"}`,
      "info"
    ).catch((e) => console.error("[scan] log empty failed:", e));
  }

  // 5. Generate AI summary in background and update scan record
  //    This is the only fire-and-forget — but the scan already exists in DB.
  if (scanRecord) {
    generateScanSummary({
      sources: result.sources,
      opportunitiesFound: result.opportunities.length,
      pricesQueried: result.prices.length,
      topOpportunities: result.opportunities.slice(0, 5).map((opp) => ({
        token_pair: opp.token_pair,
        profit_percent: opp.profit_percent,
        source_dex: opp.source_dex,
        target_dex: opp.target_dex || "",
      })),
      metadata: { scannedAt: result.scannedAt },
    })
      .then(async (aiData) => {
        // Update the existing scan record with AI data
        await supabase
          .from("scans")
          .update({
            ai_summary: aiData.summary,
            ai_insights: aiData.insights,
          })
          .eq("id", scanRecord.id);
      })
      .catch((e) => console.error("[scan] AI summary failed:", e));
  }

  return { stored: stored.length, scanId: scanRecord?.id };
}

/**
 * GET /api/scan — Run a full DEX scan and return opportunities.
 *
 * This endpoint:
 * 1. Queries real Sui DEX APIs (Cetus, Turbos)
 * 2. Queries on-chain pool data via Sui SDK
 * 3. Compares prices to find arbitrage
 * 4. Stores results in Supabase (pass ?store=false to skip)
 */
export async function GET(req: NextRequest) {
  const store = req.nextUrl.searchParams.get("store") !== "false";

  try {
    const result = await runScan();

    let storeResult;
    if (store) {
      storeResult = await storeScanResults(result, "Scanning Sui DEX prices...");
    }

    return NextResponse.json({
      ...result,
      stored: store,
      count: result.opportunities.length,
      ...(storeResult ? { scanId: storeResult.scanId, storedOpportunities: storeResult.stored } : {}),
    });
  } catch (error) {
    if (store) {
      await createAgentLog("Scan failed", String(error), "error").catch(() => {});
    }

    return NextResponse.json(
      { error: String(error), prices: [], opportunities: [] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/scan — Trigger a scan with custom parameters.
 *
 * Body:
 * {
 *   "min_profit_percent": 0.5,
 *   "store": true,
 *   "pairs": ["SUI/USDC", "SUI/USDT"]
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const store = body.store !== false;

    const result = await runScan();

    // Filter by min profit if specified
    const minProfit = body.min_profit_percent ?? 0.3;
    const filtered = result.opportunities.filter(
      (o) => o.profit_percent >= minProfit
    );

    // Filter by pairs if specified
    const pairs = body.pairs as string[] | undefined;
    const finalOpps = pairs
      ? filtered.filter((o) =>
          pairs.some((p) => o.token_pair.toUpperCase().includes(p.toUpperCase()))
        )
      : filtered;

    // Replace result opportunities with filtered set before storing
    const filteredResult = { ...result, opportunities: finalOpps };

    if (store) {
      await storeScanResults(
        filteredResult,
        `Agent-triggered scan (min profit: ${minProfit}%)`
      );
    }

    return NextResponse.json({
      prices: result.prices,
      opportunities: finalOpps,
      scannedAt: result.scannedAt,
      sources: result.sources,
      stored: store,
      count: finalOpps.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
