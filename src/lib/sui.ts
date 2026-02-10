import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";

// ─── Network Config ─────────────────────────────────────

const network =
  (process.env.NEXT_PUBLIC_SUI_NETWORK as "testnet" | "mainnet") || "mainnet";

export const suiClient = new SuiClient({
  url: process.env.NEXT_PUBLIC_SUI_RPC_URL || getFullnodeUrl(network),
});

// ─── Wallet from Private Key ─────────────────────────────

let _keypair: Ed25519Keypair | null = null;

/**
 * Get the agent's keypair from SUI_PRIVATE_KEY env var.
 * Supports formats:
 *   - Bech32: suiprivkey1...
 *   - Base64: raw 32-byte key base64-encoded
 */
export function getKeypair(): Ed25519Keypair {
  if (_keypair) return _keypair;

  const key = process.env.SUI_PRIVATE_KEY;
  if (!key) {
    throw new Error(
      "SUI_PRIVATE_KEY not set. Add it to .env.local.\n" +
        "Get one: sui keytool generate ed25519\n" +
        "Or export: sui keytool export --key-identity <alias>"
    );
  }

  try {
    if (key.startsWith("suiprivkey")) {
      // Bech32 format from `sui keytool export`
      const { secretKey } = decodeSuiPrivateKey(key);
      _keypair = Ed25519Keypair.fromSecretKey(secretKey);
    } else {
      // Raw base64 format
      const raw = Buffer.from(key, "base64");
      _keypair = Ed25519Keypair.fromSecretKey(raw);
    }
  } catch {
    throw new Error(
      "Invalid SUI_PRIVATE_KEY format. Expected bech32 (suiprivkey1...) or base64."
    );
  }

  return _keypair;
}

/**
 * Get the agent's wallet address (derived from private key).
 */
export function getAgentAddress(): string {
  return getKeypair().toSuiAddress();
}

// ─── Types ───────────────────────────────────────────────

export interface WalletInfo {
  address: string;
  balance: string;
  balanceFormatted: string;
  network: string;
}

export interface SuiTransaction {
  digest: string;
  timestampMs: string;
  status: string;
}

// ─── Queries ─────────────────────────────────────────────

export async function getWalletInfo(address: string): Promise<WalletInfo> {
  const balance = await suiClient.getBalance({ owner: address });
  const balanceMist = BigInt(balance.totalBalance);
  const balanceSui = Number(balanceMist) / 1_000_000_000;

  return {
    address,
    balance: balance.totalBalance,
    balanceFormatted: balanceSui.toFixed(4) + " SUI",
    network,
  };
}

export async function getRecentTransactions(
  address: string,
  limit = 10
): Promise<SuiTransaction[]> {
  const txns = await suiClient.queryTransactionBlocks({
    filter: { FromAddress: address },
    order: "descending",
    limit,
    options: { showEffects: true },
  });

  return txns.data.map((tx) => ({
    digest: tx.digest,
    timestampMs: tx.timestampMs || "0",
    status: tx.effects?.status?.status || "unknown",
  }));
}

export async function getTransactionDetails(digest: string) {
  return suiClient.getTransactionBlock({
    digest,
    options: {
      showInput: true,
      showEffects: true,
      showEvents: true,
    },
  });
}

/**
 * Sign and execute a transaction using the agent's keypair.
 * Returns the transaction digest.
 */
export async function signAndExecute(tx: Transaction): Promise<string> {
  const keypair = getKeypair();
  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });
  return result.digest;
}

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
