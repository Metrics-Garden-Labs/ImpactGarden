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
import UserDropdown from './userSignoutDropdown';


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
  const [user, setUser, 
    removeUser] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: [],
  });
  
  const [ fid, setFid ] = useGlobalState('fid');
  const [ username, setUsername] = useState("");
  const [ firstVerifiedEthAddress, setFirstVerifiedEthAddress ] = useGlobalState("ethAddress");
  const [isSignedIn, setIsSignedIn] = useState(Boolean(user.fid));
  //get signeruuid
  //const [signerUuid, setSignerUuid] = useGlobalState('signerUuid');


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
      // setSignerUuid(data.signer_uuid);
      //console.log("FID", data.fid);
      // console.log("Signer UUID", data.signer_uuid);
      setIsSignedIn(true);
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
      setIsSignedIn(true)
     
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
        <UserDropdown onSignout={handleSignout}/>
    
        <div className="inline-block ml-4">
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
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