"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";

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
              Sui Opportunity Hunter
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
            <a href="#opportunities" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
              Opportunities
            </a>
            <a href="#scans" className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-medium">
              Scans
            </a>
          </nav>

          {/* Download */}
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
    </motion.header>
  );
}
