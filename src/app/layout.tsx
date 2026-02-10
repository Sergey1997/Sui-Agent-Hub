import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sui Opportunity Hunter",
  description:
    "Autonomous AI agent that hunts DeFi opportunities on Sui blockchain — powered by OpenClaw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
