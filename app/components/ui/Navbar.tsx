"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";
import FarcasterLogin, { atomIsSignedIn } from "../login/FarcasterLogin2";
import { isMobile } from "react-device-detect";
import ReviewCarousel from "../attestations/ReviewCarousel";
import useLocalStorage from "@/src/hooks/use-local-storage-state";
import OnboardingCarousel from "../OnboardingCarousel";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useAtom } from "jotai";

interface UserLogin {
  fid: string;
  username: string;
  ethAddress: string;
  isAuthenticated: boolean;
}

export default function Navbar() {
  const [isSignedIn] = useAtom(atomIsSignedIn);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isOnboardingCarouselOpen, setisOnboardingCarouselOpen] =
    useState(false);

  const [user] = useLocalStorage("user", {
    fid: "",
    username: "",
    ethAddress: "",
    isAuthenticated: false,
  });
  const [hasJustSignedIn, setHasJustSignedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user.isAuthenticated && hasJustSignedIn) {
      setisOnboardingCarouselOpen(true);
      setHasJustSignedIn(false); // Reset the flag
    }
  }, [user.isAuthenticated, hasJustSignedIn]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginSuccess = (userData: UserLogin) => {
    setUsername(userData.username);
    setHasJustSignedIn(true);
    setisOnboardingCarouselOpen(true);
    console.log("User logged in successfully,, opening carousel");
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const closeModal = () => {
    setisOnboardingCarouselOpen(false);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center navbar bg-headerblack text-neutral-content p-3 md:p-8">
        <Link href="/">
          <button
            className={`btn bg-headerblack text-xl border-none ${
              isMobile ? "pl-2" : "pl-10"
            }`}
          >
            <Image
              src="/mglwhite.png"
              alt="MGL Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </button>
        </Link>
        <div className="hidden md:flex justify-end items-center lg:gap-x-8 md:gap-x-2">
          <div className="relative inline-block">
            <button
              onClick={toggleDropdown}
              className="text-white lg:text-md md:text-sm hover:text-opacity-75 flex items-center"
            >
              IMPACT FRAMEWORK
              <RiArrowDropDownLine
                className={`inline-block ml-1 transition-transform duration-300 text-3xl ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div
                className="absolute w-full bg-headerblack border border-gray-700 rounded shadow-md mt-2 z-50 animate-dropdown"
                onMouseLeave={closeDropdown}
              >
                <Link
                  href="/impact-framework/rpgf3/"
                  className="block px-4 py-2 text-sm text-white hover:text-black hover:bg-primarylp"
                  onClick={closeDropdown}
                >
                  RPGF3
                </Link>
                <Link
                  href="/impact-framework/season7/"
                  className="block px-4 py-2 text-sm text-white hover:text-black hover:bg-primarylp"
                  onClick={closeDropdown}
                >
                  SEASON7
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/projectSignUp"
            className="text-white lg:text-md md:text-sm hover:text-opacity-75"
          >
            REGISTER PROJECT
          </Link>
          <Link
            href="/searchProject"
            className="text-white lg:text-md md:text-sm hover:text-opacity-75"
          >
            RATE PROJECTS
          </Link>
          <Link
            href="/searchUsers"
            className="text-white text-md md:text-sm hover:text-opacity-75"
          >
            SEARCH USERS
          </Link>
        </div>
        <div className="flex items-center">
          <FarcasterLogin onLoginSuccess={handleLoginSuccess} />
          <div className="md:hidden ml-4">
            <button
              className="text-white focus:outline-none"
              onClick={toggleSidebar}
            >
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
        />
      )}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-headerblack text-white p-4 transition-transform duration-300 ease-in-out transform z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end">
          <button
            className="text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <ul className="space-y-4 mt-8">
          <li>
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full py-2"
            >
              IMPACT FRAMEWORK
              <RiArrowDropDownLine
                className={`ml-2 text-2xl transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isDropdownOpen && (
              <ul className="pl-4 mt-1 space-y-2">
                <li>
                  <Link
                    href="/impact-framework/rpgf3/"
                    className="block py-1"
                    onClick={closeSidebar}
                  >
                    RPGF3
                  </Link>
                </li>
                <li>
                  <Link
                    href="/impact-framework/season7/"
                    className="block py-1"
                    onClick={closeSidebar}
                  >
                    SEASON7
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              href="/projectSignUp"
              className="block py-2"
              onClick={closeSidebar}
            >
              REGISTER PROJECT
            </Link>
          </li>
          <li>
            <Link
              href="/searchProject"
              className="block py-2"
              onClick={closeSidebar}
            >
              RATE PROJECTS
            </Link>
          </li>
          <li>
            <Link
              href="/searchUsers"
              className="block py-2"
              onClick={closeSidebar}
            >
              SEARCH USERSS
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
