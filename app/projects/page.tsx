'use client';

import Image from "next/image";
import Attestbox from "../components/attestbox";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Sidebar from "./sidebar";
import ProfilePage from "./profilepage";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";

export default function Projects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <ProfilePage />
        </main>
      </div>
      <Footer />
    </div>
  );
}

//TODO: make the footer just at the bottom once you have scrolled to the botto
        //its taking too much space at the bottom of the page