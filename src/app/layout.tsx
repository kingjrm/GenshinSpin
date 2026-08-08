import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genshin Impact Character Spin the Wheel - Gacha Randomizer",
  description: "Spin the wheel to randomly select from all 118 Genshin Impact characters. Filter characters by rarity, element, weapon, or region, track your spin history, and customize your active pool.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
