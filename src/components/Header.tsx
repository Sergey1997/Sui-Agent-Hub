"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download } from "lucide-react";
import WalletButton from "./WalletButton";

const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "mainnet";

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
            <div className="w-10 h-10 rounded-lg bg-sui-400/10 border border-sui-400/20 flex items-center justify-center overflow-hidden relative">
              <Image 
                src="/SUH.png" 
                alt="Sui Opportunities Hunter" 
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-bold text-white hidden sm:inline">
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

          {/* Network + Wallet + Download */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.1]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                {network}
              </span>
            </div>
            <WalletButton />
            <a
              href="/api/skill"
              download="SKILL.md"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sui-400/10 text-sui-400 hover:bg-sui-400/20 transition-colors text-sm font-semibold border border-sui-400/25"
            >
              <Download size={16} />
              SKILL.md
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
