import { NextResponse } from "next/server";
import { getAgentAddress, getWalletInfo, getRecentTransactions, getSuiExplorerUrl } from "@/lib/sui";

export const dynamic = "force-dynamic";

// GET /api/wallet — returns agent wallet info (balance, address, recent txs)
export async function GET() {
  try {
    const address = getAgentAddress();
    const [info, txs] = await Promise.all([
      getWalletInfo(address),
      getRecentTransactions(address, 5),
    ]);

    return NextResponse.json({
      ...info,
      explorerUrl: getSuiExplorerUrl("address", address),
      recentTransactions: txs.map((tx) => ({
        ...tx,
        explorerUrl: getSuiExplorerUrl("tx", tx.digest),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
