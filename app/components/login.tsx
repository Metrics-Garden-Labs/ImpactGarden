
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
dotenv.config();

//this login step should  only have to happen once, then all the info will be stored in the db for when they login again




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


export default function Login() {

  //signerUuid and fid are global state variables once they are fetched from farcaster.
  const [user, setUser, removeUser] = useLocalStorage("user", {
    fid: '',
    username: '',
    ethAddress: '',
    });
  const [ signerUuid, setSignerUuid] = useGlobalState('signerUuid');
  const [ fid, setFid ] = useGlobalState('fid');
  const [ username, setUsername] = useState("");
  const [ firstVerifiedEthAddress, setFirstVerifiedEthAddress ] = useGlobalState("ethAddress");


  const client_id = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  //add signout function
  const handleSignout = () => {
    setFid("");
    setUser({ fid: '', username: '', ethAddress: '' });
    setUsername("");
    setFirstVerifiedEthAddress("");
    window.location.reload();
  };


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
      setUser({
        fid: data.fid,
        username: user.username,
        ethAddress: user.ethAddress,
      });
      //signer uuid is private and part of the app
      setFid(data.fid);
    };

    return () => {
      window.onSignInSuccess = undefined;
      document.getElementById(scriptId)?.remove();
    }
  },[setUser, setSignerUuid, setFid]) 
  



  //lets se what i can get using neynar
  useEffect(() => {
    if(fid){
      console.log("FID changed, now fetching data for FID:", fid)
      fetchData(fid);
    }
  }, [fid])
  
  async function fetchData(fid:string) {
    try{
      const response = await fetch(`/api/login`, {
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
        console.log("Username", username);
        console.log("Eth Address", firstVerifiedEthAddress);
        setUser(prevUser => ({
          ...prevUser,
          username: data.username,
          ethAddress: data.ethAddress
        }));

      const newUser = {
        fid: fid.toString(),
        username: data.username,
        ethaddress: data.ethAddress || '',
        //this stores the first ethAddress they have verified, usually their public one
      };
      console.log("New User", newUser);

      //call api to insert user
      
      const dbResponse = await fetch(`/api/addUserDb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      
        if (dbResponse.ok) {
        console.log("insert user to db success", dbResponse);
      } else {
        console.error("Error inserting user to db:", dbResponse);
      }
    }
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  //make a user session that stores fid, username, eth address
  //can add the signout logic in other areas of the app


console.log("FID", fid);
console.log("userFid,", user.fid);
console.log("user", user);

return (
  <>
    <div className='relative min-h-screen bg-white text-black'>
      <Image src="/mglskel.png" alt="MGL Skeleton" width={60} height={25} className="absolute p-10 top-o left-0 h-25 w-60" />
      <div className='flex justify-ceneter items-center h-screen'>
        <div className='card max-w-lg w-full mx-auto p-10 bg-white rounded-xl shadow-xl'>
          <div className='card-body justify-center items-center'>
            {user.fid ? (
              <>
                <h2 className="text-center font-semibold text-xl mb-4">Welcome, {user.username}!</h2>
                <p className="text-center text-gray-600 mb-6">You are logged in with Farcaster.</p>
                <div className="flex items-center">
                  <button
                    onClick={handleSignout}
                    title="Sign Out"
                    className="btn btn-primary"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-center font-semibold text-xl mb-4">Sign-in</h2>
                <p className="text-center text-gray-600 mb-6">Please sign in with your Farcaster account</p>
                <div
                  className="neynar_signin mt-6"
                  data-client_id={client_id}
                  data-success-callback="onSignInSuccess"
                  data-theme='light'
                  data-variant='farcaster'
                  data-logo_size='30px'
                  data-height='48px'
                  data-width='218px'
                  data-border_radius='10px'
                  data-font_size='16px'
                  data-font_weight='300'
                  data-padding='8px 15px'
                  data-margin='0'
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);
}
          

        {/* <p>FID: {fid}</p>
        <p>Username: {username}</p>
        <p>Eth Address: {firstVerifiedEthAddress}</p> */}


