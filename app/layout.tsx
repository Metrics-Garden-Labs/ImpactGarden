import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Manrope } from "next/font/google";
import '@rainbow-me/rainbowkit/styles.css';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../app/api/uploadthing/core";


import "./globals.css";
import { Providers } from './providers';

const manrope = Manrope({subsets: ["latin"]})


//get the gambetta font, figure out how to put it in

//const gambetta = localFont({ src: './fonts/Gambetta-Italic.otf' })

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
    <html lang="en" data-theme='light'>
      <body className={manrope.className}>
        <Providers>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          {children}
        </Providers>
        </body>
    </html>
  );
}
