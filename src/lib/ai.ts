/**
 * AI Service using Claude API for generating summaries, insights, and analytics.
 * Type-aware: analyzes arbitrage, yield, hackathon, defi, swap, nft opportunities differently.
 */

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514";
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
}

/**
 * Call Claude API with a prompt
 */
async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1000
): Promise<string> {
  if (!CLAUDE_API_KEY) {
    console.warn("CLAUDE_API_KEY not set, returning placeholder text");
    return "[AI analysis unavailable - CLAUDE_API_KEY not configured]";
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as ClaudeResponse;
    return data.content[0]?.text || "";
  } catch (error) {
    console.error("Claude API error:", error);
    return `[AI analysis error: ${error instanceof Error ? error.message : String(error)}]`;
  }
}

/**
 * Strip markdown code fences from Claude responses.
 */
function stripCodeFences(text: string): string {
  return text
    .replace(/^```(?:json)?\s*\n?/gm, "")
    .replace(/\n?```\s*$/gm, "")
    .trim();
}

// ─── Type-Aware System Prompts ──────────────────────────

const SYSTEM_PROMPTS: Record<string, string> = {
  arbitrage: `You are an expert DeFi analyst evaluating arbitrage opportunities on Sui blockchain.
Be critical and realistic. Consider slippage, liquidity, execution speed, and market conditions.
Determine if the price spread is real, persistent, and executable.`,

  yield: `You are a DeFi yield analyst evaluating yield farming and liquidity provision opportunities on Sui blockchain.
Assess the APY sustainability, impermanent loss risk, protocol security, TVL trends, and smart contract risks.
Determine if the yield opportunity is genuine and worth pursuing.`,

  hackathon: `You are a tech opportunity analyst evaluating hackathon bounties and developer competitions.
Assess the prize value, required skills, time commitment, competition level, and sponsor credibility.
This is NOT a trading opportunity — it's a development/building opportunity. Evaluate it on that basis.
Determine if this is a worthwhile opportunity for a developer or team.`,

  defi: `You are a DeFi strategist evaluating general DeFi opportunities on Sui blockchain.
Consider protocol risk, TVL, token economics, governance, smart contract audits, and market conditions.
Determine if this DeFi opportunity is genuine and worth pursuing.`,

  swap: `You are a DeFi analyst evaluating token swap opportunities on Sui blockchain.
Consider price impact, slippage, route efficiency, gas costs, and timing.
Determine if the swap conditions are favorable.`,

  nft: `You are an NFT market analyst evaluating NFT opportunities on Sui blockchain.
Consider floor price trends, collection reputation, liquidity, holder distribution, and market sentiment.
Determine if this NFT opportunity is genuine and worth pursuing.`,
};

function getSystemPrompt(type: string): string {
  return SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.defi;
}

// ─── Scan Summary ───────────────────────────────────────

/**
 * Generate a human-readable summary of a scan
 */
export async function generateScanSummary(data: {
  sources: string[];
  opportunitiesFound: number;
  pricesQueried: number;
  topOpportunities: Array<{
    token_pair: string;
    profit_percent: number;
    source_dex: string;
    target_dex: string;
  }>;
  metadata?: Record<string, unknown>;
}): Promise<{ summary: string; insights: string }> {
  const systemPrompt = `You are an expert DeFi analyst. Generate concise, professional summaries of DEX scan results. 
Write in clear, accessible language that any user can understand. Focus on what happened and why it matters.`;

  const userPrompt = `A scan was performed on Sui DEXes with the following results:

Sources queried: ${data.sources.join(", ")}
Price points collected: ${data.pricesQueried}
Opportunities found: ${data.opportunitiesFound}

Top opportunities:
${data.topOpportunities
  .slice(0, 5)
  .map(
    (opp, i) =>
      `${i + 1}. ${opp.token_pair}: ${opp.profit_percent.toFixed(2)}% profit (${opp.source_dex} → ${opp.target_dex})`
  )
  .join("\n")}

Generate:
1. A brief summary (2-3 sentences) of what happened in this scan
2. Key insights (trends, patterns, or recommendations) in 2-3 bullet points

Format as JSON:
{
  "summary": "...",
  "insights": "..."
}`;

  const response = await callClaude(systemPrompt, userPrompt, 500);
  
  try {
    const parsed = JSON.parse(stripCodeFences(response));
    return {
      summary: parsed.summary || response,
      insights: parsed.insights || "",
    };
  } catch {
    const lines = response.split("\n").filter((l) => l.trim());
    return {
      summary: lines[0] || response,
      insights: lines.slice(1).join("\n") || "",
    };
  }
}

// ─── Opportunity Analysis ───────────────────────────────

interface OpportunityInput {
  title: string;
  type: string;
  token_pair: string;
  source_dex: string;
  target_dex: string;
  buy_price: number;
  sell_price: number;
  profit_percent: number;
  risk_level: string;
  estimated_profit_usd: number;
  agent_notes?: string | null;
  liquidity?: number;
  sources_checked?: string[];
}

/**
 * Build a type-appropriate description of the opportunity for AI prompts
 */
function describeOpportunity(opp: OpportunityInput): string {
  const lines = [`Title: ${opp.title}`, `Type: ${opp.type}`];

  if (opp.type === "arbitrage") {
    lines.push(
      `Pair: ${opp.token_pair}`,
      `Buy on: ${opp.source_dex} at $${opp.buy_price.toFixed(6)}`,
      `Sell on: ${opp.target_dex} at $${opp.sell_price.toFixed(6)}`,
      `Spread: ${opp.profit_percent.toFixed(2)}%`,
      `Estimated profit: $${opp.estimated_profit_usd.toFixed(2)}`,
    );
  } else if (opp.type === "yield") {
    lines.push(
      `Token/Pair: ${opp.token_pair}`,
      `Platform: ${opp.source_dex}`,
      `APY/Profit: ${opp.profit_percent.toFixed(2)}%`,
      `Estimated value: $${opp.estimated_profit_usd.toFixed(2)}`,
    );
  } else if (opp.type === "hackathon") {
    lines.push(
      `Platform: ${opp.source_dex}`,
      `Prize/Value: $${opp.estimated_profit_usd.toFixed(0)}`,
    );
    if (opp.token_pair && opp.token_pair !== "N/A") lines.push(`Token: ${opp.token_pair}`);
  } else {
    if (opp.token_pair && opp.token_pair !== "N/A") lines.push(`Token/Pair: ${opp.token_pair}`);
    if (opp.source_dex) lines.push(`Source: ${opp.source_dex}`);
    if (opp.target_dex) lines.push(`Target: ${opp.target_dex}`);
    if (opp.profit_percent > 0) lines.push(`Profit: ${opp.profit_percent.toFixed(2)}%`);
    if (opp.estimated_profit_usd > 0) lines.push(`Estimated value: $${opp.estimated_profit_usd.toFixed(2)}`);
  }

  lines.push(`Risk level: ${opp.risk_level}`);
  if (opp.liquidity) lines.push(`Liquidity: $${opp.liquidity.toLocaleString()}`);
  if (opp.agent_notes) lines.push(`Notes: ${opp.agent_notes}`);
  if (opp.sources_checked?.length) lines.push(`Sources checked: ${opp.sources_checked.join(", ")}`);

  return lines.join("\n");
}

/**
 * Generate an enhanced description/analysis for an opportunity (any type)
 */
export async function generateOpportunityAnalysis(opp: OpportunityInput): Promise<string> {
  const systemPrompt = getSystemPrompt(opp.type);

  const userPrompt = `Analyze this ${opp.type} opportunity:

${describeOpportunity(opp)}

Provide a concise analysis (3-4 sentences) explaining:
- What this opportunity is and why it matters
- Key risks or considerations
- Whether it's worth pursuing and for whom`;

  return callClaude(systemPrompt, userPrompt, 300);
}

/**
 * Generate an AI verdict for an opportunity (any type)
 */
export async function generateVerdict(opp: OpportunityInput): Promise<{
  verdict: string;
  confidence: number;
  isReal: boolean;
  reasoning: string;
}> {
  const systemPrompt = getSystemPrompt(opp.type);

  const typeGuidance: Record<string, string> = {
    arbitrage: '"isReal" means: the price spread is genuine, persistent, and executable with acceptable slippage.',
    yield: '"isReal" means: the yield is sustainable, the protocol is trustworthy, and the risk/reward is favorable.',
    hackathon: '"isReal" means: the hackathon/bounty is legitimate, the prize is real, and it is a worthwhile opportunity for developers.',
    defi: '"isReal" means: the DeFi opportunity is genuine, the protocol is sound, and the expected returns are realistic.',
    swap: '"isReal" means: the swap conditions are favorable and the execution will deliver expected value.',
    nft: '"isReal" means: the NFT opportunity is genuine, fairly priced, and has real market potential.',
  };

  const guidance = typeGuidance[opp.type] || typeGuidance.defi;

  const userPrompt = `Evaluate this ${opp.type} opportunity:

${describeOpportunity(opp)}

${guidance}

Provide your verdict as JSON:
{
  "verdict": "Detailed analysis (3-4 sentences appropriate for a ${opp.type} opportunity)",
  "confidence": 85,
  "isReal": true,
  "reasoning": "Why you reached this conclusion"
}`;

  const response = await callClaude(systemPrompt, userPrompt, 500);

  try {
    const parsed = JSON.parse(stripCodeFences(response));
    return {
      verdict: parsed.verdict || response,
      confidence: Math.min(100, Math.max(0, parsed.confidence ?? 50)),
      isReal: parsed.isReal ?? false,
      reasoning: parsed.reasoning || "",
    };
  } catch {
    return {
      verdict: response,
      confidence: 50,
      isReal: false,
      reasoning: "Unable to parse AI response",
    };
  }
}
