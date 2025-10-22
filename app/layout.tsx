import type { Metadata } from "next";
import { userAgent } from "next/server";
import { headers } from "next/headers";

import { Geist, Geist_Mono } from "next/font/google";

import AppToaster from "@/components/app-toaster/app-toaster";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechRider Builder",
  description: "Tech Rider Builder App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const { device } = userAgent({ headers: headersList });

  const isMobile = device.type === "mobile";

  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <AppToaster position={isMobile ? "top-center" : "bottom-center"} />
      </body>
    </html>
  );
}
