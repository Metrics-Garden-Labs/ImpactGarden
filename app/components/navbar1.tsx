'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import FarcasterLogin from './farcasterLogin';
import { isMobile } from 'react-device-detect';

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center navbar bg-headerblack text-neutral-content p-3 md:p-8">
        <Link href='/'>
          <button
            className={`btn bg-headerblack text-xl border-none ${
              isMobile ? 'pl-2' : 'pl-10'
            }`}
          >
            <Image src='/mglwhite.png' alt='MGL Logo' width={40} height={40} className='h-10 w-10'/>
          </button>
        </Link>
        <div className="hidden md:flex justify-end items-center lg:gap-x-8 md:gap-x-2">
          <Link href='/projectSignUp' className='text-white lg:text-md md:text-sm hover:text-opacity-75'>REGISTER PROJECT</Link>
          <Link href='/searchProject' className='text-white lg:text-md md:text-sm hover:text-opacity-75'>SEARCH PROJECTS</Link>
          <Link href='/searchUsers' className='text-white text-md md:text-sm hover:text-opacity-75'>SEARCH USERS</Link>
        </div>
        <div className="flex items-center">
          <FarcasterLogin />
          <div className="md:hidden ml-4">
            <button className="text-white focus:outline-none" onClick={toggleSidebar}>
              {isSidebarOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={closeSidebar}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-headerblack text-white p-4 transition-transform duration-300 ease-in-out transform z-50 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end">
          <button className="text-white focus:outline-none" onClick={toggleSidebar}>
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <ul className="space-y-4 mt-8">
          <li>
            <Link href='/projectSignUp' className='block py-2' onClick={closeSidebar}>REGISTER PROJECT</Link>
          </li>
          <li>
            <Link href='/searchProject' className='block py-2' onClick={closeSidebar}>SEARCH PROJECTS</Link>
          </li>
          <li>
            <Link href='/searchUsers' className='block py-2' onClick={closeSidebar}>SEARCH USERS</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
