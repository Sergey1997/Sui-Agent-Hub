import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Sui Opportunities Hunter",
  description:
    "Data service for AI agents — enhanced DeFi opportunities on demand. Autonomous AI agents scanning Sui for all possible opportunities in real-time.",
  keywords: [
    "Sui",
    "DeFi",
    "AI agents",
    "arbitrage",
    "yield farming",
    "cryptocurrency",
    "blockchain",
    "OpenClaw",
    "opportunities",
    "trading",
  ],
  authors: [{ name: "Sergey", url: "https://x.com/sergey1997bsu" }],
  creator: "Sergey",
  publisher: "Sui Opportunities Hunter",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sui-opportunities-hunter.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Sui Opportunities Hunter",
    description: "Data service for AI agents — enhanced DeFi opportunities on demand",
    url: "/",
    siteName: "Sui Opportunities Hunter",
    images: [
      {
        url: "/SUH.png",
        width: 1200,
        height: 630,
        alt: "Sui Opportunities Hunter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sui Opportunities Hunter",
    description: "Data service for AI agents — enhanced DeFi opportunities on demand",
    images: ["/SUH.png"],
    creator: "@sergey1997bsu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: { url: "/sui-logo.svg", type: "image/svg+xml" },
    shortcut: "/sui-logo.svg",
    apple: "/sui-logo.svg",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#000B1E" },
    { media: "(prefers-color-scheme: dark)", color: "#000B1E" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
