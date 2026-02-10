# 🦞 Sui Opportunity Hunter

> Autonomous DeFi opportunity agent on Sui — powered by OpenClaw

**Track**: Local God Mode 🤖 | **Hackathon**: Mission: OpenClaw | **Prize**: $20K USDC on Sui

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Any user installs our OpenClaw skill (skill/CLAUDE.md)         │
│                                                                 │
│  OpenClaw Agent                                                 │
│  ├── CURL: GET /api/scan?store=true (triggers real DEX scan)    │
│  ├── BROWSER: verifies prices on Cetus/Turbos/Aftermath         │
│  ├── TERMINAL: sui client gas, sui client call                  │
│  └── CURL: POST /api/agent-logs (reports activity)              │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────┐       ┌──────────────────────┐       │
│  │  Next.js Backend     │──────▶│  Supabase (Postgres)  │       │
│  │  /api/scan           │  real │  opportunities table  │       │
│  │  /api/opportunities  │  data │  agent_logs table     │       │
│  │  /api/agent-logs     │       │  realtime enabled     │       │
│  │  /api/wallet         │       └──────────────────────┘       │
│  └──────────┬───────────┘                                      │
│             │ queries                                           │
│             ▼                                                   │
│  ┌───────────────────────────────────────────────────┐         │
│  │  Real Data Sources                                 │         │
│  │  ├── Cetus API (https://api-sui.cetus.zone)        │         │
│  │  ├── Turbos API (https://api.turbos.finance)       │         │
│  │  ├── On-chain pools via Sui SDK (suiClient)        │         │
│  │  └── CoinGecko reference price                     │         │
│  └───────────────────────────────────────────────────┘         │
│              │                                                  │
│              ▼                                                  │
│  ┌─────────────────────────────────────┐                       │
│  │  Dashboard (Next.js + Framer Motion) │                       │
│  │  - Live opportunity cards            │                       │
│  │  - Agent activity feed (realtime)    │                       │
│  │  - Wallet balance + Sui Explorer     │                       │
│  │  - Approve / Reject buttons          │                       │
│  └─────────────────────────────────────┘                       │
│              │                                                  │
│              ▼                                                  │
│  ┌──────────────────────┐                                      │
│  │  Sui Testnet         │                                      │
│  │  - Real transactions │                                      │
│  │  - suiscan.xyz       │                                      │
│  └──────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## How It Works

1. **Agent calls `/api/scan`** — backend queries Cetus API, Turbos API, and on-chain Sui pools
2. **Real prices compared** — finds arbitrage when price difference > 0.3%
3. **Stored in Supabase** — opportunities saved with realtime broadcast
4. **Agent verifies in browser** — opens DEX websites to confirm prices
5. **Dashboard shows** — real-time cards with profit %, risk, prices
6. **Human approves** — clicks ✅, status → "approved"
7. **Agent executes** — runs `sui client call` (terminal)
8. **On-chain proof** — tx hash links to Sui Explorer

---

## OpenClaw Usage

| Feature | How Used |
|---------|----------|
| **Browser** | Verify prices on Cetus, Turbos, Aftermath websites |
| **Terminal** | Run `sui client gas`, `sui client call`, `curl` to API |
| **Skill file** | `CLAUDE.md` + `skill/CLAUDE.md` (publishable on clawhub.ai) |
| **Installable** | Any user copies `skill/CLAUDE.md` → their agent uses our platform |

## Sui Stack Usage

| Feature | How Used |
|---------|----------|
| **Sui SDK** | `@mysten/sui` — on-chain pool queries, wallet, signing |
| **Sui CLI** | Agent runs `sui client call` for trades |
| **Sui Explorer** | Dashboard links to suiscan.xyz |
| **Sui Testnet** | All transactions on testnet RPC |
| **On-chain data** | `suiClient.getObject()` reads real pool reserves |
| **Ed25519 Keypair** | `@mysten/sui/keypairs/ed25519` for tx signing |

## Real Data Sources

| Source | What it provides |
|--------|------------------|
| **Cetus API** | Pool prices, liquidity, TVL from top Sui DEX |
| **Turbos API** | Pool prices from second major Sui DEX |
| **Sui SDK** | On-chain pool objects (reserves, balances) |
| **CoinGecko** | Reference price for SUI/USD |

---

## Setup

### 1. Install & configure

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local with Supabase credentials + Sui private key
```

### 2. Setup database

Run `scripts/setup-db.sql` in Supabase SQL Editor.

### 3. Get testnet SUI

```bash
# Generate key (if needed)
sui keytool generate ed25519

# Export private key → add to .env.local as SUI_PRIVATE_KEY
sui keytool export --key-identity <alias>

# Get testnet tokens
curl -X POST https://faucet.testnet.sui.io/v1/gas \
  -H "Content-Type: application/json" \
  -d '{"FixedAmountRequest":{"recipient":"<YOUR_ADDRESS>"}}'
```

### 4. Start dashboard

```bash
pnpm run dev
# → http://localhost:3000
```

### 5. Start OpenClaw agent

```bash
# Install OpenClaw (if not installed)
npm install -g openclaw@latest
openclaw onboard --install-daemon

# Start gateway
openclaw gateway --port 18789

# Agent reads CLAUDE.md and starts scanning
```

---

## Demo Script (2 min)

1. **Show dashboard** — beautiful UI with animated background, empty state
2. **Show wallet** — agent's testnet address + balance from Sui SDK
3. **Start agent** — OpenClaw reads CLAUDE.md, opens browser, navigates to Cetus
4. **Agent finds opportunity** — card animates in: "SUI/USDC +1.78%"
5. **Activity feed** — logs appear in real-time: "Scanning Cetus...", "Price: $1.234"
6. **Click Approve** — status changes, agent executes via `sui client call`
7. **Show Sui Explorer** — click tx hash → real on-chain transaction
8. **Stats update** — profit counter goes up

---

## Why Judges Will Love It

### Creativity
- **Not just a dashboard** — it's a full agent that browses real websites, extracts data, makes decisions
- **Human-in-the-loop** — agent proposes, human approves (safe + practical)

### Technical Merit
- Clean architecture: OpenClaw → API → Supabase → Dashboard
- Real-time updates via Supabase subscriptions
- Proper wallet integration with Ed25519 keypair
- Transaction signing + on-chain execution

### Sui Integration
- `@mysten/sui` SDK for blockchain queries
- `sui client call` for transaction execution
- Sui Explorer links for verification
- Testnet wallet with real balance display

### OpenClaw Integration
- Browser automation: navigates DEX websites
- Terminal access: executes Sui CLI commands
- Skill file: `CLAUDE.md` defines agent behavior
- Autonomous operation with logging

---

## File Structure

```
├── CLAUDE.md              ← OpenClaw skill (for this project)
├── skill/
│   └── CLAUDE.md          ← Publishable skill (for any user)
├── src/
│   ├── app/
│   │   ├── page.tsx       ← Dashboard (Framer Motion)
│   │   ├── layout.tsx     ← Root layout
│   │   ├── globals.css    ← Styles + glassmorphism
│   │   └── api/
│   │       ├── scan/route.ts           ← Real DEX scanner
│   │       ├── opportunities/route.ts  ← CRUD
│   │       ├── agent-logs/route.ts     ← Logs
│   │       └── wallet/route.ts         ← Wallet info
│   ├── components/
│   │   ├── OpportunityCard.tsx
│   │   ├── AgentStatus.tsx
│   │   ├── AgentLogFeed.tsx
│   │   ├── WalletCard.tsx
│   │   └── AnimatedBackground.tsx
│   └── lib/
│       ├── supabase.ts    ← DB client + queries + realtime
│       ├── sui.ts         ← Sui SDK + Ed25519 keypair + signing
│       └── scanner.ts     ← Real DEX price scanner
├── scripts/
│   └── setup-db.sql       ← Supabase migration
├── .env.example           ← Template
└── package.json
```

---

## Links

- [OpenClaw Docs](https://docs.openclaw.ai/)
- [Sui Docs](https://docs.sui.io)
- [Community Sui Skill](https://clawhub.ai/EasonC13/sui-move)
- [Sui Stack Plugin](https://github.com/0x-j/sui-stack-claude-code-plugin)
- [DeepSurge](https://deepsurge.xyz)
