'use client';

import React, { useEffect, useState } from 'react';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import useLocalStorage from '../../../src/hooks/use-local-storage-state';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../../src/config/config';
import dotenv from 'dotenv';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import FarcasterConnected from '../../public/farcasterConnected.svg';
import UserDropdown from './userSignoutDropdown';

dotenv.config();

declare global {
  interface Window {
    onSignInSuccess?: (data: SignInSuccessData) => void | undefined;
  }
}

interface SignInSuccessData {
  signer_uuid: string;
  fid: string;
}

const FarcasterLogin = () => {
  const [user, setUser, removeUser] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: [],
  });
  
  const [fid, setFid] = useGlobalState('fid');
  const [username, setUsername] = useState("");
  const [firstVerifiedEthAddress, setFirstVerifiedEthAddress] = useGlobalState("ethAddress");
  const [isSignedIn, setIsSignedIn] = useState(Boolean(user.fid));

  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  if (!client_id) {
    throw new Error("NEXT_PUBLIC_NEYNAR_CLIENT_ID is not defined in .env");
  }

  useEffect(() => {
    const scriptId = "neynar-signin-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
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
      setFid(data.fid);
      setIsSignedIn(true);
    };

    return () => {
      window.onSignInSuccess = undefined;
      document.getElementById(scriptId)?.remove();
    };
  }, [setUser, setFid, user.username, user.ethAddress]);

  console.log("user", user);

  const handleSignout = () => {
    removeUser();
    setFid("");
    setUser({ fid: '', username: '', ethAddress: [] });
    setUsername("");
    setFirstVerifiedEthAddress("");
    setIsSignedIn(false);
  };

  useEffect(() => {
    if (fid) {
      console.log("FID changed, now fetching data for FID:", fid);
      fetchData(fid);
    }
  }, [fid]);

  async function fetchData(fid: string) {
    try {
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
        };
        console.log("New User, ", newUser);
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  console.log("FID", fid);

  return (
    <div className="bg-headerblack flex items-center">
      {isSignedIn ? (
        <>
          <UserDropdown onSignout={handleSignout} />
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
};

export default FarcasterLogin;
