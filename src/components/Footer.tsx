"use client";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t-2 border-sui-400/25 bg-[#000B1E]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="flex items-center justify-between h-16">
          <div className="text-sm text-gray-400">
            Built on <span className="text-sui-400 font-semibold">Sui</span> with{" "}
            <span className="text-sui-300 font-semibold">OpenClaw</span>
          </div>
          <div className="text-sm text-gray-500">
            OpenClaw Hackathon 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
