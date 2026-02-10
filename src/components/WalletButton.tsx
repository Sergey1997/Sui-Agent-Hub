"use client";

import { useState, useRef, useEffect } from "react";
import {
  useCurrentAccount,
  useDisconnectWallet,
  useConnectWallet,
  useWallets,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown } from "lucide-react";

function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatSui(mist: string) {
  return (Number(BigInt(mist)) / 1_000_000_000).toFixed(2);
}

export default function WalletButton() {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { data: balanceData } = useSuiClientQuery(
    "getBalance",
    { owner: account?.address as string, coinType: "0x2::sui::SUI" },
    { enabled: !!account?.address }
  );

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const network = process.env.NEXT_PUBLIC_SUI_NETWORK || "mainnet";
  const explorerBase = network === "mainnet"
    ? "https://suiscan.xyz/mainnet"
    : "https://suiscan.xyz/testnet";

  // ─── Connected state ───────────────────────────────────
  if (account) {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-sui-400/30 transition-colors"
        >
          <Wallet size={14} className="text-sui-400" />
          <code className="text-xs text-gray-300 font-mono font-medium">
            {formatAddress(account.address)}
          </code>
          {balanceData && (
            <span className="text-xs font-bold text-sui-400">
              {formatSui(balanceData.totalBalance)} SUI
            </span>
          )}
          <ChevronDown
            size={12}
            className={`text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0d1932] border-2 border-sui-400/20 shadow-2xl shadow-black/50 overflow-hidden z-50">
            {/* Address + Balance */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                  Connected
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sui-400/10 text-sui-400 border border-sui-400/20 font-semibold uppercase">
                  {network}
                </span>
              </div>
              <code className="text-sm text-white font-mono font-semibold block mb-2">
                {formatAddress(account.address)}
              </code>
              {balanceData && (
                <span className="text-lg font-bold text-sui-400">
                  {formatSui(balanceData.totalBalance)} SUI
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="p-2 space-y-0.5">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors"
              >
                <Copy size={14} className={copied ? "text-emerald-400" : "text-gray-500"} />
                {copied ? "Copied!" : "Copy Address"}
              </button>
              <a
                href={`${explorerBase}/account/${account.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/[0.04] transition-colors"
              >
                <ExternalLink size={14} className="text-gray-500" />
                View on Explorer
              </a>
              <button
                onClick={() => { disconnect(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-400/[0.06] transition-colors"
              >
                <LogOut size={14} />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── Disconnected state ────────────────────────────────
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sui-400/10 text-sui-400 hover:bg-sui-400/20 transition-colors text-sm font-semibold border border-sui-400/25"
      >
        <Wallet size={15} />
        Connect Wallet
      </button>

      {/* Wallet picker */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0d1932] border-2 border-sui-400/20 shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">Connect a Wallet</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Choose a wallet to connect to Sui {network}
            </p>
          </div>
          <div className="p-2 space-y-0.5">
            {wallets.length > 0 ? (
              wallets.map((w) => (
                <button
                  key={w.name}
                  onClick={() => {
                    connect({ wallet: w }, { onSuccess: () => setOpen(false) });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-gray-200 hover:bg-white/[0.05] transition-colors"
                >
                  {w.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={w.icon}
                      alt={w.name}
                      className="w-7 h-7 rounded-lg"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-sui-400/10 border border-sui-400/20 flex items-center justify-center">
                      <Wallet size={14} className="text-sui-400" />
                    </div>
                  )}
                  <div className="text-left">
                    <span className="font-semibold block">{w.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-6 text-center">
                <Wallet size={24} className="text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-1">No wallets found</p>
                <a
                  href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-sui-400 hover:underline"
                >
                  Install Sui Wallet →
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
