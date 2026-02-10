import { NextResponse } from "next/server";
import { getScans } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/scans — Fetch recent scan history.
 *
 * Returns all scans with AI summaries so any user
 * can see what's happening across all agents.
 */
export async function GET() {
  try {
    const scans = await getScans(50);
    return NextResponse.json({ scans });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
