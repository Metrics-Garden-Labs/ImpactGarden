import Link from 'next/link';
import React from 'react';
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer p-6 sm:p-8 md:p-12 bg-headerblack text-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <button className="btn bg-headerblack text-xl border-none">
            <Image src="/mglwhite.png" alt="MGL Logo" width={12} height={12} className="h-12 w-12" />
          </button>
          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <Link href="/" className="text-white text-lg hover:text-opacity-75">
              HOME
            </Link>
            <Link href="/metricsdb" className="text-white text-lg hover:text-opacity-75">
              METRICS DATABASE
            </Link>
            <Link href="/searchProject" className="text-white text-lg hover:text-opacity-75">
              PROJECTS
            </Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end items-center gap-2 sm:gap-8 mt-4 md:mt-0 pl-70">
          <Link href="https://discord.com/invite/" target="_blank" className="flex items-center">
            <FaDiscord className="text-white text-lg w-6 h-6" />
            <p className="ml-1 text-lg">Discord</p>
          </Link>
          <Link href="https://twitter.com/" target="_blank" className="flex items-center">
            <FaXTwitter className="text-white text-lg w-6 h-6" />
            <p className="ml-1 text-lg">Twitter</p>
          </Link>
        </div>
      </div>
    </footer>
  );
}
