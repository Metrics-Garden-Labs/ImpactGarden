import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return (
    <>
        <div className="flex justify-between navbar bg-headerblack text-neutral-content p-4 md:p-8">
            <Link href='/'>
                <button className="btn bg-headerblack text-xl border-none pl-10">
                 <img src='/mglwhite.png' alt='MGL Logo' className='h-12 w-12'/>
                </button>
            </Link>

            {/* Buttons on the Right Side */}
            <div className="flex justify-end">
                <div className='flex items-center gap-x-8'>
                    <Link href='/' className='text-white text-lg hover:text-opacity-75'>HOME</Link>
                    <Link href='/login' className='text-white text-lg hover:text-opacity-75'>LOGIN</Link>
                    <Link href='/about' className='text-white text-lg hover:text-opacity-75'>METRICS DATABASE</Link>
                    <Link href='/attest' className='text-white text-lg hover:text-opacity-75'>ATTEST</Link>
                    <Link href='/searchProject' className='text-white text-lg hover:text-opacity-75'>SEARCH PROJECTS</Link>
                    <Link href='/projects' className='text-white text-lg hover:text-opacity-75'>PROJECTS</Link>
                    {/* <ConnectButton /> */}
                </div>
            </div>

        </div>
    </>
  )}
