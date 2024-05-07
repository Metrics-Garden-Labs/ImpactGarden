import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import React from 'react';
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import FarcasterLogin from './farcasterLogin';

export default function Navbar() {
  return (
    <>
        <div className="flex justify-between navbar bg-headerblack text-neutral-content p-3 md:p-8">
            <Link href='/'>
                <button className="btn bg-headerblack text-xl border-none pl-10">
                 <Image src='/mglwhite.png' alt='MGL Logo' width={10} height={10} className='h-10 w-10'/>
                </button>
            </Link>

            {/* Buttons on the Right Side */}
            <div className="flex justify-end">
                <div className='flex items-center gap-x-8'>
                    <Link href='/projectSignUp' className='text-white text-md hover:text-opacity-75'>REGISTER PROJECT</Link>
                    <Link href='/metricsdb' className='text-white text-md hover:text-opacity-75'>METRICS DATABASE</Link>
                    {/*<details className="dropdown">
                     <summary className="m-1 btn bg-headerblack font-normal border-none text-lg text-white">
                        PROJECTS
                        <FaChevronDown className='inline-block text-xs'/>
                    </summary>
                    <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                        <li className='hover:bg-gray-200 rounded'><Link href="/projectSignUp">REGISTER PROJECT</Link></li>
                        <li className='hover:bg-gray-200 rounded'><Link href="/searchProject">SEARCH PROJECTS</Link></li>
                    </ul>
                    </details> */}
                    <Link href='/searchProject' className='text-white text-md hover:text-opacity-75'>SEARCH PROJECTS</Link>
                    <Link href='/searchUsers' className='text-white text-md hover:text-opacity-75'>SEARCH USERS</Link>
                    
                    <div className='inline-block'>
                        <FarcasterLogin />
                    </div>

                </div>
            </div>

        </div>
    </>
  )}
