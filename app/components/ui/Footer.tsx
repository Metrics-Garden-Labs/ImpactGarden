import Link from "next/link";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { PiTelegramLogoLight } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer p-6 sm:p-8 md:p-12 bg-headerblack text-white">
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <button className="btn bg-headerblack text-xl border-none">
            <Image
              src="/mglwhite.png"
              alt="MGL Logo"
              width={12}
              height={12}
              className="h-12 w-12"
            />
          </button>
          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <Link href="/" className="text-white text-lg hover:text-opacity-75">
              HOME
            </Link>
            <Link
              target="_blank"
              href="https://www.notion.so/a60768062a2e4e5f8b4ea787e73d38b5?v=468228b4f651454aaf4296934a8a18bd"
              className="text-white text-lg hover:text-opacity-75"
            >
              METRICS DATABASE
            </Link>
            <Link
              href="/searchProject"
              className="text-white text-lg hover:text-opacity-75"
            >
              PROJECTS
            </Link>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-auto flex gap-4 items-center justify-end">
          <Link
            href="https://x.com/metricsgarden"
            target="_blank"
            className="flex items-center"
          >
            <FaXTwitter className="text-white text-lg w-6 h-6 hover:text-opacity-75" />
          </Link>
          <Link
            href="https://t.me/+yFClKgNH2y80N2Fh"
            target="_blank"
            className="flex items-center"
          >
            <PiTelegramLogoLight className="text-white text-lg w-6 h-6 hover:text-opacity-75" />
          </Link>
          <Link
            className="flex items-center"
            href="mailto:launamu@metricsgarden.xyz"
          >
            <TfiEmail className="text-white text-lg w-6 h-6 hover:text-opacity-75" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
