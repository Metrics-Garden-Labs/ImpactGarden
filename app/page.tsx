import Image from "next/image";
import Attestbox from "./components/attestbox";
import Navbar from "./components/navbar1";
import Footer from "./components/footer";

//the plan for this is to recreate the mockup that Mari sent in
//add the connect wallet button to the top right of the screen. 

// pages/framer-landing.js
import React from 'react';

const FramerLanding = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <iframe
        src="https://artsy-app-411405.framer.app/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Framer Landing Page"
      ></iframe>
    </div>
  );
};


export default function Home() {
  return (
    <>
    <main className="bg-white text-black">
      <Navbar />
      <FramerLanding />
    </main>
    </>
  );
}


