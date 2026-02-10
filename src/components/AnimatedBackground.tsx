"use client";

/**
 * Background inspired by DeepSurge — a single organic blue wave glow.
 * No orbs, no grid. Just a diffused light at the bottom.
 */
export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[#000B1E]" />

      {/* Blue wave glow — bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px]"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, rgba(77,162,255,0.07) 0%, rgba(77,162,255,0.02) 40%, transparent 70%)",
        }}
      />

      {/* Subtle secondary glow top-left */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse at top left, rgba(77,162,255,0.03) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
