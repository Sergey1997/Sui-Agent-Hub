import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/skill — Download the SKILL.md file.
 *
 * Users download this file, install it via OpenClaw,
 * and their agent connects back to our dashboard API.
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), "SKILL.md");
    const content = await readFile(filePath, "utf-8");

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="SKILL.md"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "SKILL.md not found" },
      { status: 404 }
    );
  }
}
