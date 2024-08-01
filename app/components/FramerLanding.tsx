'use client';

import React, { useEffect, useState } from 'react';

const FramerLanding = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

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

export default FramerLanding;
