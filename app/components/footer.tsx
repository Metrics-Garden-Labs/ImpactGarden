import Link from 'next/link';
import React from 'react';
import { FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <>
    <footer className="footer p-12 bg-headerblack text-white">
        <div className='left-side'>
        <button className="btn bg-headerblack text-xl border-none pl-5">
                <img src='/mglwhite.png' alt='MGL Logo' className='h-12 w-12'/>
        </button>

        <div className='flex gap-x-8 py-8 pl-5'>
            <Link href='/' className='text-white text-lg hover:text-opactiy-75'>HOME</Link>
            <Link href='/about' className='text-white text-lg hover:text-opactiy-75'>METRICS DATABASE</Link>
            <Link href='/about' className='text-white text-lg hover:text-opactiy-75'>ATTEST</Link>
            <Link href='/about' className='text-white text-lg hover:text-opactiy-75'>PROJECTS</Link>
        </div>
        </div>

        <div className="right-side flex flex-col items-end pr-10 pb-4 w-full">
            <div className='spacer flex-grow py-12'>
            <div className='spacer flex-grow py-10'>
            <div className='links flex justify-end space-x-4 w-full'>
                <Link href="https://discord.com/invite/" target="_blank" className="flex items-center">
                    <FaDiscord className='text-white text-lg w-6 h-6'/>
                    <p className="ml-1 text-lg px-3">Discord</p>
                </Link>
                <Link href="https://twitter.com/" target="_blank" className="flex items-center px-4">
                    <FaXTwitter className='text-white text-lg w-6 h-6'/>
                    <p className="ml-1 text-lg px-3 ">Twitter</p>
                </Link>
          </div>
          </div>
          </div>
        </div>
    </footer>
    </>
  );};