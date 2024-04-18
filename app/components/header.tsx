import Link from 'next/link';
import React from 'react';

export default function Header() {
  return (
    <>
        <div className="flex justify-between navbar bg-headerblack text-neutral-content p-4 md:p-8">
            <button className="btn bg-headerblack text-xl border-none pl-10">
                <img src='/mglwhite.png' alt='MGL Logo' className='h-12 w-12'/>
            </button>

            {/* Buttons on the Right Side */}
            <div className="flex-none flex justify-end">
                <div className='flex items-centergap-x-8'>
                    <Link href='/' className='text-white text-lg hover:text-opactiy-75'>HOME</Link>
                    <Link href='/about' className='text-white text-lg hover:text-opactiy-75'>METRICS DATABASE</Link>
                    <Link href='/about' className='text-white text-lg hover:text-opactiy-75'>ATTEST</Link>
                    <Link href='/about' className='text-white text-lg hover:text-opactiy-75'>PROJECTS</Link>
                </div>
            </div>
        </div>
    </>
  )}
