import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import React from 'react';
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import FarcasterLogin from './farcasterLogin';

export default function Navbar() {
  return (
    <>
        <div className="flex justify-between navbar bg-headerblack text-neutral-content p-4 md:p-8">
            <Link href='/'>
                <button className="btn bg-headerblack text-xl border-none pl-10">
                 <Image src='/mglwhite.png' alt='MGL Logo' width={12} height={12} className='h-12 w-12'/>
                </button>
            </Link>

            {/* Buttons on the Right Side */}
            <div className="flex justify-end">
                <div className='flex items-center gap-x-8'>
                    <Link href='/metricsdb' className='text-white text-lg hover:text-opacity-75'>METRICS DATABASE</Link>

                    <details className="dropdown">
                    <summary className="m-1 btn bg-headerblack font-normal border-none text-lg text-white">
                        PROJECTS
                        <FaChevronDown className='inline-block text-xs'/>
                    </summary>
                    <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                        <li className='hover:bg-gray-200 rounded'><Link href="/projectSignUp">REGISTER PROJECTS</Link></li>
                        <li className='hover:bg-gray-200 rounded'><Link href="/searchProject">SEARCH PROJECTS</Link></li>
                    </ul>
                    </details>

                    <Link href='/searchUsers' className='text-white text-lg hover:text-opacity-75'>SEARCH USERS</Link>
                    
                    <div className='inline-block'>
                        <FarcasterLogin />
                    </div>

                </div>
            </div>

        </div>
    </>
  )}
