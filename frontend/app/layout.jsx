import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WalletProvider from "../components/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EthMem",
  description: "EthMem — Unified LLM Memory tied to your blockchain identity",
};

export default function RootLayout({ children }) {
  return (
    // Enable dark theme by default so dashboard components that rely on dark tokens render as intended.
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
