import type { Metadata } from "next";
import localFont from 'next/font/local';
import { Manrope } from "next/font/google";
import '@rainbow-me/rainbowkit/styles.css';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../app/api/uploadthing/core";
import ClientHelmetProvider from "./components/ClientHelmetProvider";
import MatomoTracker from '../src/utils/MatomoTracker';
import "./globals.css";
import { Providers } from './providers';
import Navbar from "./components/ui/Navbar";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Metrics Garden Labs",
  description: "Metrics Garden Labs Attestations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        {/* Place any meta tags or scripts that are safe for the server side */}
      </head>
      <body className={`${manrope.className} m-0 p-0`}>
        <ClientHelmetProvider>
          <MatomoTracker />
          <Providers>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>{children}</main>
            </div>
          </Providers>
        </ClientHelmetProvider>
      </body>
    </html>
  );
}
