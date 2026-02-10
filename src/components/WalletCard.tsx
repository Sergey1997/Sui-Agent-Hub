"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wallet, ExternalLink, Copy, RefreshCw } from "lucide-react";

interface WalletData {
  address: string;
  balance: string;
  balanceFormatted: string;
  network: string;
  explorerUrl: string;
  recentTransactions: {
    digest: string;
    status: string;
    explorerUrl: string;
  }[];
}

export default function WalletCard() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      if (data.error) setError(data.error);
      else { setWallet(data); setError(null); }
    } catch {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  const copyAddress = () => {
    if (!wallet?.address) return;
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const shortAddr = wallet?.address
    ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}`
    : "---";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-6"
    >
      {/* Top — title row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-sui-400/10 border border-sui-400/20">
            <Wallet size={24} className="text-sui-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Agent Wallet</h3>
        </div>
        <button
          onClick={fetchWallet}
          className="p-2.5 rounded-xl hover:bg-white/5 text-gray-400 transition-colors border border-white/[0.08]"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Bottom — wallet info */}
      <div className="border-t-2 border-sui-400/15 pt-5">
        {error ? (
          <p className="text-base text-gray-400">
            {error.includes("SUI_PRIVATE_KEY")
              ? "Add SUI_PRIVATE_KEY to .env.local"
              : error}
          </p>
        ) : loading ? (
          <div className="h-5 w-48 rounded bg-white/5 animate-pulse" />
        ) : wallet ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <code className="text-base text-gray-300 font-mono font-semibold">{shortAddr}</code>
              <button
                onClick={copyAddress}
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors border border-white/[0.08]"
              >
                <Copy size={16} />
              </button>
              {copied && <span className="text-sm text-emerald-400 font-semibold">Copied</span>}
              <a
                href={wallet.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors border border-white/[0.08]"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm px-3 py-1.5 rounded-lg bg-sui-400/10 text-sui-400 border border-sui-400/25 font-semibold">
                {wallet.network}
              </span>
              <span className="text-2xl font-bold text-sui-400">
                {wallet.balanceFormatted}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
