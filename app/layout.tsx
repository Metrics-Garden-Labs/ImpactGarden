import type { Metadata } from "next";
import localFont from 'next/font/local'
import { Manrope } from "next/font/google";
import '@rainbow-me/rainbowkit/styles.css';
 


import "./globals.css";
import { Providers } from './providers';

const manrope = Manrope({subsets: ["latin"]})


//get the gambetta font, figure out how to put it in

//const gambetta = localFont({ src: './fonts/Gambetta-Italic.otf' })





export const metadata: Metadata = {
  title: "Metrics Garden Labs Module 3",
  description: "Module 3 lofi of the Metrics Garden Labs project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Providers>
          {children}
        </Providers>
        </body>
    </html>
  );
}
