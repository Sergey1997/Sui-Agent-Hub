import { NextRequest, NextResponse } from "next/server";
import { createAgentLog, getAgentLogs } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/agent-logs — fetch recent agent logs
export async function GET() {
  try {
    const logs = await getAgentLogs(50);
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

// POST /api/agent-logs — create new agent log (called by OpenClaw agent)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await createAgentLog(
      body.action,
      body.details || null,
      body.status || "info"
    );
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
