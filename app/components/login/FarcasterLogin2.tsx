'use client';

import React, { useEffect, useState } from 'react';
import { verifyUser, removeSearchParams } from '../../../src/utils/verifyUserHelper';
import useLocalStorage from '../../../src/hooks/use-local-storage-state';
import { NEXT_PUBLIC_URL, useGlobalState } from '../../../src/config/config';
import dotenv from 'dotenv';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import UserDropdown from './userSignoutDropdown';
import { zeroAddress } from 'viem';


dotenv.config();

declare global {
  interface Window {
    onSignInSuccess?: (data: SignInSuccessData) => Promise<void> | void;
  }
}

interface SignInSuccessData {
  signer_uuid: string;
  fid: string;
  is_authenticated: boolean;
  signer_permissions: string[];
  user: {
    active_status: string;
    custody_address: string;
    display_name: string;
    fid: string;
    follower_count: number;
    following_count: number;
    object: string;
    pfp_url: string;
    power_badge: boolean;
    profile: {
      bio: {
        text: string;
      } 
    };
    username: string;
    verifications: string[];  
    verified_addresses: {
      eth_addresses: string[];  
      sol_addresses?: string[]; 
    };
  };
}



interface UserLogin {
  fid: string;
  username: string;
  ethAddress: string;
  isAuthenticated: boolean;
}

interface FarcasterLoginProps {
  onLoginSuccess: (userData: UserLogin) => void;
}

const FarcasterLogin: React.FC<FarcasterLoginProps> = ({ onLoginSuccess }) => {
  const [user, setUser, removeUser] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
    isAuthenticated: false,
  });
  
  const [fid, setFid] = useGlobalState('fid');
  const [username, setUsername] = useState("");
  const [firstVerifiedEthAddress, setFirstVerifiedEthAddress] = useGlobalState("ethAddress");
  const [isSignedIn, setIsSignedIn] = useState(Boolean(user.fid));
  const [isAuthenticated, setIsAuthenticated] = useState(false);


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

    window.onSignInSuccess = async (data: SignInSuccessData) => {
      console.log("Sign in success", data);

      // const isVerifiedUser = await verifyUser(data.signer_uuid, data.fid);
      if (data.is_authenticated) {
        setIsAuthenticated(true);
        const updatedUser = {
          fid: data.fid,
          username: data.user.username,
          ethAddress: data.user.verified_addresses.eth_addresses[0],
          isAuthenticated: true,
        };
        await fetchData(data.fid, updatedUser);
        setIsSignedIn(true);
        removeSearchParams();
        
        setUser(updatedUser);
        onLoginSuccess(updatedUser);
      } else {
        console.error("User verification failed");
      }
    };

    console.log("User", user);

    return () => {
      window.onSignInSuccess = undefined;
      document.getElementById(scriptId)?.remove();
    };
  }, [setUser, setFid, user.username, user.ethAddress]);

  const handleSignout = () => {
    removeUser();
    setFid("");
    setUser({ fid: '', username: '', ethAddress: '', isAuthenticated: false });
    setUsername("");
    setFirstVerifiedEthAddress("");
    setIsSignedIn(false);
    setIsAuthenticated(false);
  };

  async function fetchData(fid: string, updatedUser: UserLogin) {
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
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  return (
    <div className="bg-headerblack flex items-center">
      {isSignedIn ? (
        <>
          <UserDropdown onSignout={handleSignout} />
          {/* <div className="inline-block ml-4">
            <ConnectButton
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
            />
          </div> */}
        </>
      ) : (
        <div
          className="neynar_signin rounded-lg"
          data-client_id={client_id}
          data-success_callback="onSignInSuccess"
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
