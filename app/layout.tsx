import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MyProvider } from "@/context/symbolecontext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Stock Tutor",
  description: "New era of Paper Trading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <MyProvider>
          {children}
          </MyProvider>
      </body>
    </html>
  );
}
