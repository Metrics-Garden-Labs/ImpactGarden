// components/FarcasterLogin.tsx
'use client';

import React, { useEffect, useContext, useState, use } from 'react';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import useLocalStorage from '../../src/hooks/use-local-storage-state';
import { useGlobalState } from '../../src/config/config';
import dotenv from 'dotenv';
import { useRouter } from 'next/router';
//import { insertUser } from 'app/lib/db';
import { NEXT_PUBLIC_URL } from '../../src/config/config';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import FarcasterConnected  from '../../public/farcasterConnected.svg';


dotenv.config();

declare global {
    interface Window {
      onSignInSuccess?: (data: SignInSuccessData) => void | undefined;
    }
    //had to do this to stop it from erroring
}
  
interface SignInSuccessData {
    signer_uuid: string;
    fid: string;
}
  

export default function FarcasterLogin() {
  //signerUuid and fid are global state variables once they are fetched from farcaster.
  const [user, setUser, removeUser] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: [],
  });
  const [ fid, setFid ] = useGlobalState('fid');
  const [ username, setUsername] = useState("");
  const [ firstVerifiedEthAddress, setFirstVerifiedEthAddress ] = useGlobalState("ethAddress");
  const [isSignedIn, setIsSignedIn] = useState(Boolean(user.fid));


  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  };

  useEffect(() => {
    // Identify or create the script element
    const scriptId = "neynar-signin-script";
    let script = document.getElementById(scriptId)as HTMLScriptElement | null;

    //runs the script to log in with neynar
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      // Set attributes and source of the script
      script.src = "https://neynarxyz.github.io/siwn/raw/1.2.0/index.js";
      script.async = true;
      script.defer = true;

      document.body.appendChild(script);
    }
    window.onSignInSuccess = (data) => {
      console.log("Sign in success", data);
      setUser({
        fid: data.fid,
        username: user.username,
        ethAddress: user.ethAddress,
      });
      //signer uuid is private and part of the app
      setFid(data.fid);
      //trigger a seemless reload to ui update to register signed in state
      //window.location.reload();
    };

    return () => {
      window.onSignInSuccess = undefined;
      document.getElementById(scriptId)?.remove();
    }
  },[setUser, setFid, user.username, user.ethAddress]);

  console.log("user", user);


  //add signout function
  const handleSignout = () => {
    removeUser();
    setFid("");
    setUser({ fid: '', username: '', ethAddress: [] });
    setUsername(""); 
    setFirstVerifiedEthAddress("");
    setIsSignedIn(false);
    window.location.reload();
  };
  
  //lets se what i can get using neynar
  useEffect(() => {
    if(fid){
      console.log("FID changed, now fetching data for FID:", fid)
      fetchData(fid);
    }
  }, [fid])
  
  async function fetchData(fid:string) {
    try{
      const response = await fetch(`${NEXT_PUBLIC_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fid }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data", data);
        setUsername(data.username);
        setFirstVerifiedEthAddress(data.ethAddress);

        setUser(current => ({ ...current, username: data.username, ethAddress: data.ethAddress }));

      const newUser = {
        fid: fid.toString(),
        username: data.username,
        ethaddress: data.ethAddress || '',
        //this stores the first ethAddress they have verified, usually their public one
      };
      console.log("New User, ", newUser);

      //reload
      window.location.reload();
    }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  //make a user session that stores fid, username, eth address
  //can add the signout logic in other areas of the app


console.log("FID", fid);

  return (
    <div className="bg-headerblack flex items-center">
      {isSignedIn ? (
        <>
        <details className="dropdown ">
        <summary className="btn bg-headerblack border-none flex items-center gap-2 text-white text-lg p-2">
          {/* Logo Image with Proper Alignment */}
          <div className=" w-12 h-12 h-full mr-6 flex items-center">
          <svg width="93" height="64" viewBox="0 0 93 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-[60%] transform -translate-y-1/2">
            <g filter="url(#filter0_d_351_2429)">
            <rect x="12.8311" y="8" width="68.1689" height="40" rx="14" fill="white" shape-rendering="crispEdges"/>
            <rect x="28.8311" y="17.9155" width="20.1689" height="20.1689" rx="4.48199" fill="#855DCD"/>
            <path d="M34.0302 21.0529H43.8009V34.9471H42.3667V28.5827H42.3526C42.1941 26.8237 40.7158 25.4453 38.9155 25.4453C37.1153 25.4453 35.637 26.8237 35.4785 28.5827H35.4644V34.9471H34.0302V21.0529Z" fill="white"/>
            <path d="M31.4306 23.025L32.0133 24.9971H32.5063V32.975C32.2587 32.975 32.0581 33.1757 32.0581 33.4232V33.961H31.9684C31.7209 33.961 31.5202 34.1617 31.5202 34.4092V34.9471H36.5401V34.4092C36.5401 34.1617 36.3394 33.961 36.0919 33.961H36.0022V33.4232C36.0022 33.1757 35.8016 32.975 35.554 32.975H35.0162V23.025H31.4306Z" fill="white"/>
            <path d="M42.4563 32.975C42.2088 32.975 42.0081 33.1757 42.0081 33.4232V33.961H41.9185C41.6709 33.961 41.4703 34.1617 41.4703 34.4092V34.9471H46.4901V34.4092C46.4901 34.1617 46.2894 33.961 46.0419 33.961H45.9522V33.4232C45.9522 33.1757 45.7516 32.975 45.504 32.975V24.9971H45.9971L46.5797 23.025H42.9941V32.975H42.4563Z" fill="white"/>
            <circle cx="61" cy="28" r="4" fill="#04DF00"/>
            </g>
            <defs>
            <filter id="filter0_d_351_2429" x="0.831055" y="0" width="92.1689" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="6"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_351_2429"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_351_2429" result="shape"/>
            </filter>
            </defs>
          </svg>
          </div>
        </summary>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40"
        >
          <li>
            <p onClick={handleSignout}>Sign Out</p>
          </li>
        </ul>
      </details>

      <div className="inline-block ml-4">
        <ConnectButton
          accountStatus="address"
          chainStatus="none"
          showBalance={false}
        />
      </div>
      </>
      
      ) : (
        <div
          className="neynar_signin rounded-lg"
          data-client_id={client_id}
          data-success-callback="onSignInSuccess"
          data-theme='light'
          data-variant='farcaster'
          data-logo_size='25px'
          data-height='36px'
          data-width='120px'
          data-border_radius='10px'
          data-font_size='16px'
          data-font_weight='300'
          data-padding='4px 15px'
          data-margin='0'
        />
      )}
    </div>
  );
}