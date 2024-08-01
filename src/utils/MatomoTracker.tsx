'use client';

import React, { useEffect } from 'react';

declare global {
  interface Window {
    _mtm: any[];
    _paq: any[];
  }
}

const MatomoTracker: React.FC = () => {
  useEffect(() => {
    const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;

    if (!matomoUrl) {
      console.error('Matomo URL is not defined in environment variables.');
      return;
    }

    console.log("Matomo URL", matomoUrl);

    window._mtm = window._mtm || [];
    window._mtm.push({ 'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start' });

    const d = document;
    const g = d.createElement('script');
    const s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = matomoUrl;
    s.parentNode?.insertBefore(g, s);
  }, []);

  return null;
};

export default MatomoTracker;



// const MatomoTracker: React.FC = () => {
   
//     useEffect(() => {

//         var _mtm = window._mtm = window._mtm || [];
//         _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
       
//         const matomoUrl = process.env.NEXT_PUBLIC_MATOMO_URL;
//         if (!matomoUrl) {
//             console.error('Matomo URL is not defined in environment variables.');
//             return;
//         }
       
//         var d=document,
//          g=d.createElement('script'),
//          s=d.getElementsByTagName('script')[0];
//         g.async=true;
//         g.src=matomoUrl;
//         if (s && s.parentNode) {
//             s.parentNode.insertBefore(g,s);
//         }
//         }, []);

//     return null;

   
// }

// export default MatomoTracker;



// components/MatomoTracker.tsx

