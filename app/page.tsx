import Image from "next/image";




// pages/framer-landing.js
import React from 'react';

const FramerLanding = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', paddingTop: '-60px' }}>
      <iframe
        src="https://artsy-app-411405.framer.app/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Metrics Garden Landing Page"
      ></iframe>
    </div>
  );
};


export default function Home() {
  return (

    <div className="bg-white text-black">
      <FramerLanding />
    </div>

  );
}


