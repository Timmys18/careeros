import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { DevBanner } from "@/components/shared/dev-banner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "https://careeros.app"),
  title: {
    default: "CareerOS — Know your true career value",
    template: "%s · CareerOS",
  },
  description:
    "Upload your resume and get your AI Career Report: market value, Career DNA, lost money, and your next best move.",
  keywords: ["career", "AI", "salary", "market value", "resume", "LinkedIn"],
  openGraph: {
    title: "CareerOS — Know your true career value",
    description: "Your career has no agent. Now it does.",
    type: "website",
    siteName: "CareerOS",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerOS",
    description: "Know your true career value.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#030305",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          <DevBanner />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
