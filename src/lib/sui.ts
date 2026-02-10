import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";

// ─── Network Config ─────────────────────────────────────

const network =
  (process.env.NEXT_PUBLIC_SUI_NETWORK as "testnet" | "mainnet") || "mainnet";

export const suiClient = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl(network),
});

// ─── Utilities ───────────────────────────────────────────

export function formatSuiAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function mistToSui(mist: string | bigint): number {
  return Number(BigInt(mist)) / 1_000_000_000;
}

export function suiToMist(sui: number): bigint {
  return BigInt(Math.floor(sui * 1_000_000_000));
}

export function getSuiExplorerUrl(
  type: "tx" | "address" | "object",
  id: string
): string {
  const base =
    network === "mainnet"
      ? "https://suiscan.xyz/mainnet"
      : "https://suiscan.xyz/testnet";

  switch (type) {
    case "tx":
      return `${base}/tx/${id}`;
    case "address":
      return `${base}/account/${id}`;
    case "object":
      return `${base}/object/${id}`;
  }
}
