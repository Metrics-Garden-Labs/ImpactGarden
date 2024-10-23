import type { Metadata } from "next";
import localFont from "next/font/local";
import { Manrope } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import ClientHelmetProvider from "./components/ClientHelmetProvider";
import MatomoTracker from "../src/utils/MatomoTracker";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Impact Garden",
  description: "Impact Garden, Rate your favorite web3 projects",
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
            <div className="min-h-screen flex flex-col bg-white">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </Providers>
        </ClientHelmetProvider>
      </body>
    </html>
  );
}
