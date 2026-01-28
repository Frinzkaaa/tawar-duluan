import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { Poppins, Slackey } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  preload: false,
  display: "swap",
});

const slackey = Slackey({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-slackey",
  preload: false,
  display: "swap",
});


export const metadata: Metadata = {
  title: "Tawar Duluan | Platform Lelang Mobil Terpercaya",
  description: "Dapatkan mobil impian Anda dengan harga terbaik melalui sistem lelang transparan dan terpercaya.",
  icons: {
    icon: "/images/logo2.png",
    apple: "/images/logo2.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${slackey.variable} bg-gray-50 text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
