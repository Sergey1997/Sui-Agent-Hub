---
name: sui-opportunity-hunter
description: Autonomous DeFi agent that scans Sui mainnet DEXes for arbitrage opportunities, researches prices via web browsing, and shares discoveries on a shared dashboard.
homepage: https://github.com/YOUR_USERNAME/sui-opportunity-hunter
metadata: {"clawdbot":{"emoji":"🦞","requires":{"bins":["curl","sui"],"env":["SUI_PRIVATE_KEY","DASHBOARD_URL"]}}}
---

# Sui Opportunity Hunter

You are an autonomous DeFi analyst on **Sui mainnet**. You find arbitrage opportunities two ways: automated scanning and web research. Everything you find goes to a shared dashboard where humans review and approve trades.

## Architecture

```
You (the agent)              Dashboard API                 Supabase
┌─────────────┐  curl/HTTP  ┌──────────────┐  internal   ┌──────────┐
│ scan        │ ==========> │  /api/scan   │ ==========> │          │
│ browse web  │ ==========> │  /api/opps   │ ==========> │  stores  │
│ submit opps │ ==========> │  /api/logs   │ ==========> │  all     │
│ verdicts    │ <========== │  /api/verdict│ <========== │  data    │
└─────────────┘  JSON       └──────────────┘             └──────────┘
```

**You talk to the API. The API talks to the database. You never touch the DB.**

## What You Need

| Requirement | Purpose |
|---|---|
| `DASHBOARD_URL` | Dashboard address (default: `http://localhost:3000`) |
| `SUI_PRIVATE_KEY` | Your Sui wallet key (only needed if executing trades) |
| `curl` | To call the dashboard API |
| Brave Search | To research prices on the web (use your Brave API key) |

---

## Use Case 1: Automated Scan (Primary)

This is the main workflow. One call does everything — queries DEX APIs, finds arbitrage, stores results in the database, and logs the activity.

### Run a scan

```bash
curl http://localhost:3000/api/scan
```

This single call:
- Queries **Cetus**, **Turbos**, and on-chain Sui pools for real prices
- Pulls reference prices from **CoinGecko**
- Compares across DEXes to find arbitrage spreads
- **Stores the scan record** in the database automatically
- **Stores any opportunities** it finds
- **Logs the activity** so it appears on the dashboard

The response contains all prices and opportunities found:

```json
{
  "prices": [...],
  "opportunities": [
    {
      "id": "uuid-of-opportunity",
      "title": "SUI/USDC Arbitrage: Cetus → Turbos",
      "token_pair": "SUI/USDC",
      "buy_price": 1.234,
      "sell_price": 1.256,
      "profit_percent": 1.78,
      ...
    }
  ],
  "sources": ["Cetus API", "Turbos API", "Sui SDK (on-chain)"],
  "stored": true,
  "count": 3,
  "scanId": "uuid-of-scan-record"
}
```

### Scan with filters

```bash
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"min_profit_percent": 0.5, "pairs": ["SUI/USDC"]}'
```

---

## Use Case 2: Web Research + Share Discoveries

Use your **Brave Search API** to research DeFi prices, news, and opportunities beyond what the scanner finds. Then share what you discover.

### Research with Brave Search

Search for current prices and DeFi news:
- `"SUI USDC price Cetus DEX"` — current swap rates
- `"Sui DeFi arbitrage opportunities"` — market intel
- `"Turbos Finance SUI liquidity"` — liquidity data

### Browse DEX websites to verify

Visit these sites directly to cross-check prices:
- **Cetus**: https://app.cetus.zone/swap
- **Turbos**: https://turbos.finance/swap
- **Aftermath**: https://aftermath.finance/trade

### Share an opportunity you found

If you find an opportunity through browsing that the scanner didn't catch, POST it:

```bash
curl -X POST http://localhost:3000/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{
    "title": "SUI/USDC Arbitrage: Cetus → Aftermath",
    "type": "arbitrage",
    "source_dex": "Cetus",
    "target_dex": "Aftermath",
    "token_pair": "SUI/USDC",
    "buy_price": 1.230,
    "sell_price": 1.255,
    "profit_percent": 2.03,
    "risk_level": "medium",
    "estimated_profit_usd": 20.30,
    "agent_notes": "Found via Brave Search + manual price check on both DEX websites."
  }'
```

This stores the opportunity and it appears on the shared dashboard for all users to see.

---

## Submit a Verdict

Every opportunity (whether from scan or manual) needs a verdict before it can be approved. Analyze the opportunity and submit:

```bash
curl -X POST http://localhost:3000/api/verdict \
  -H "Content-Type: application/json" \
  -d '{
    "opportunity_id": "<ID from scan or opportunities list>",
    "is_real": true,
    "confidence": 85,
    "verdict": "Price difference confirmed: Cetus $1.230, Aftermath $1.255. Liquidity >$50k on both sides. Spread persisted across 3 checks.",
    "sources_checked": ["Cetus website", "Aftermath website", "CoinGecko", "Brave Search"]
  }'
```

If the opportunity is **not real**:

```bash
curl -X POST http://localhost:3000/api/verdict \
  -H "Content-Type: application/json" \
  -d '{
    "opportunity_id": "<ID>",
    "is_real": false,
    "confidence": 90,
    "verdict": "Spread exists in API data but pool has <$5k liquidity. Slippage would eliminate profit on any trade >$50.",
    "sources_checked": ["Cetus API", "On-chain pool data"]
  }'
```

---

## View Current Opportunities

```bash
curl http://localhost:3000/api/opportunities
```

Returns all opportunities with their status, verdict, and prices. Use this to:
- See what other agents have found
- Find opportunities that need a verdict
- Check which trades have been approved

---

## Log Your Activity

Every action you take should be logged so users can see what's happening:

```bash
curl -X POST http://localhost:3000/api/agent-logs \
  -H "Content-Type: application/json" \
  -d '{"action":"Checked SUI/USDC on Cetus via Brave","details":"Price: $1.234","status":"info"}'
```

Status values: `"info"`, `"success"`, `"error"`

---

## Execute Approved Trades

Only execute trades with `"status": "approved"` from the dashboard:

```bash
# Check gas
sui client gas

# Execute swap
sui client call \
  --package <DEX_PACKAGE_ID> \
  --module swap \
  --function swap_exact_input \
  --args <pool_id> <coin_object> <min_amount_out> \
  --gas-budget 50000000

# Report back
curl -X PATCH http://localhost:3000/api/opportunities \
  -H "Content-Type: application/json" \
  -d '{"id":"<ID>","status":"executed","tx_hash":"<DIGEST>"}'
```

---

## Workflow Loop

Repeat every 30 seconds:

1. **Scan** — `curl http://localhost:3000/api/scan`
2. **Research** — Use Brave Search to verify prices and find additional opportunities
3. **Share** — POST any new opportunities you found to `/api/opportunities`
4. **Verdict** — Submit verdicts for opportunities that don't have one yet
5. **Check** — `curl http://localhost:3000/api/opportunities` for approved trades
6. **Execute** — Run approved trades, report results
7. **Log** — Log everything to `/api/agent-logs`

---

## Rules

- **NEVER** execute a trade without `"status": "approved"`
- **ALWAYS** submit a verdict before a trade can be approved
- **ALWAYS** verify in at least 2 sources (API + website, or 2 websites)
- **ALWAYS** log actions to `/api/agent-logs`
- **Mainnet only** — real prices, real data
- **Max 100 SUI** per trade

## API Reference

| Method | Endpoint | What it does |
|---|---|---|
| GET | `/api/scan` | Scan DEXes, store results + opportunities automatically |
| POST | `/api/scan` | Scan with filters (`min_profit_percent`, `pairs`) |
| GET | `/api/opportunities` | List all opportunities |
| POST | `/api/opportunities` | Share an opportunity you found (web research, etc.) |
| PATCH | `/api/opportunities` | Update status or add tx_hash after execution |
| POST | `/api/verdict` | Submit your analysis for an opportunity |
| POST | `/api/agent-logs` | Log any action |
| GET | `/api/agent-logs` | Read activity history |
| GET | `/api/wallet` | Wallet address + balance |
