import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/shared/providers";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { DevBanner } from "@/components/shared/dev-banner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "https://careeros.app"),
  title: {
    default: "CareerOS - Your AI career agent",
    template: "%s | CareerOS",
  },
  description:
    "Upload your resume and build your AI career agent: market value, Career DNA, lost money, missions, and your next best move.",
  keywords: ["career", "AI", "salary", "market value", "resume", "LinkedIn"],
  openGraph: {
    title: "CareerOS - Your AI career agent",
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
    <html lang="en" className="h-full">
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
