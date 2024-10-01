import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';
import ContextProvider from "./context/WagmiContextProvider";
import "./globals.css";

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
  title: "Demo CCTP",
  description: "An app to demo cross-chain transfering USDC via CCTP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookies = headers().get('cookie')

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <ContextProvider cookies={cookies}>
            {children}
          </ContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
