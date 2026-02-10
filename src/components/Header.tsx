"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Wallet, Copy, ExternalLink } from "lucide-react";

interface WalletData {
  address: string;
  balanceFormatted: string;
  network: string;
  explorerUrl: string;
}

function HeaderWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setWallet(d); })
      .catch(() => {});
  }, []);

  if (!wallet) return null;

  const shortAddr = `${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}`;

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.1]">
      <Wallet size={14} className="text-sui-400" />
      <button onClick={copyAddress} className="flex items-center gap-1.5 hover:text-white transition-colors">
        <code className="text-xs text-gray-300 font-mono">{shortAddr}</code>
        <Copy size={12} className={copied ? "text-emerald-400" : "text-gray-500"} />
      </button>
      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sui-400/10 text-sui-400 border border-sui-400/25 font-semibold uppercase">
        {wallet.network}
      </span>
      <span className="text-xs font-bold text-sui-400">{wallet.balanceFormatted}</span>
      <a
        href={wallet.explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-white transition-colors"
      >
        <ExternalLink size={12} />
      </a>
    </div>
  );
}

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#000B1E]/90 backdrop-blur-md border-b-2 border-sui-400/25"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sui-400/10 border border-sui-400/20 flex items-center justify-center">
              <span className="text-sui-400 text-xl">🦞</span>
            </div>
            <span className="text-lg font-bold text-white">
              Sui Opportunities Hunter
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
              Dashboard
            </a>
            <a href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
              Docs
            </a>
          </nav>

          {/* Wallet + Download */}
          <div className="flex items-center gap-3">
            <HeaderWallet />
            <a
              href="/api/skill"
              download="SKILL.md"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sui-400/10 text-sui-400 hover:bg-sui-400/20 transition-colors text-sm font-semibold border border-sui-400/25"
            >
              <Download size={16} />
              Download SKILL.md
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
