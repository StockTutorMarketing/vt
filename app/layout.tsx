import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { MyProvider } from "@/context/symbolecontext";
import Header from "./component/VirtualTradingcomp/charts/Header";
import StocklistDrawer from "./component/VirtualTradingcomp/charts/StocklistDrawer";

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
      <body >
        <div className="flex flex-col max-h-screen">

          <MyProvider>
            <Header />

            <div className="flex  gap-0 ">
              <div className="w-[33.37%] h-full">
                <StocklistDrawer />
              </div>

              <div className="w-full overflow-auto">
                {children}
              </div>
            </div>

          </MyProvider>
        </div>
      </body>
    </html>
  );
}
