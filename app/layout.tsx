import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Manrope } from "next/font/google";
import '@rainbow-me/rainbowkit/styles.css';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "../app/api/uploadthing/core";
import {useEffect} from 'react';
import MatomoTracker from '../app/components/MatomoTracker';


import "./globals.css";
import { Providers } from './providers';
import Navbar from "./components/navbar1";

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
      <head>
        <MatomoTracker />
      </head>
      <body className={`${manrope.className} m-0 p-0`}>
        
        <Providers>
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <div className="min-h-screen bg-white">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
        </body>
    </html>
  );
}
