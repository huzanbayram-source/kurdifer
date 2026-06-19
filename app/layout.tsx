import type { Metadata } from "next";
import { Nunito, Rubik } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["600", "700", "800", "900"],
});

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "KurdiFêr — Çocuklar için Kürtçe",
  description: "Çocukların eğlenerek Kürtçe öğrendiği platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${nunito.variable} ${rubik.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
