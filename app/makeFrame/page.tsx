'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const API_KEY = process.env.NEXT_PUBLIC_GC_PASSPORT_API_KEY;
const SCORER_ID = process.env.NEXT_PUBLIC_GC_PASSPORT_SCORER_ID;
const SIGNING_MESSAGE_URI = 'https://api.scorer.gitcoin.co/registry/signing-message'
const SUBMIT_PASSPORT_URI = 'https://api.scorer.gitcoin.co/registry/submit-passport'


const headers = API_KEY ? ({
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY
}) : undefined;

export default function MakeFrame() {
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [score, setScore] = useState('');
  const [noScoreMessage, setNoScoreMessage] = useState('');

  async function checkConnection() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts && accounts[0]) {
        setConnected(true);
        setAddress(accounts[0].address);
        checkPassport(accounts[0].address);
      }
    } catch (err) {
      console.log('not connected...');
    }
  }

  useEffect(() => {
    checkConnection();
  }, []);

  async function getSigningMessage() {
    try {
      const response = await fetch(SIGNING_MESSAGE_URI, { headers });
      const json = await response.json();
      return json;
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function submitPassport() {
    setNoScoreMessage('');
    try {
      const { message, nonce } = await getSigningMessage();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      const response = await fetch(SUBMIT_PASSPORT_URI, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          address,
          scorer_id: SCORER_ID,
          signature,
          nonce
        })
      });

      const data = await response.json();
      console.log('data:', data);
    } catch (err) {
      console.log('error: ', err);
    }
  }

  async function connect() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
      setConnected(true);
      checkPassport(accounts[0]);
    } catch (err) {
      console.log('error connecting...');
    }
  }

  async function checkPassport(currentAddress = address) {
    setScore('');
    setNoScoreMessage('');
    const GET_PASSPORT_SCORE_URI = `https://api.scorer.gitcoin.co/registry/score/${SCORER_ID}/${currentAddress}`;
    try {
      const response = await fetch(GET_PASSPORT_SCORE_URI, { headers });
      const passportData = await response.json();
      if (passportData.score) {
        const roundedScore = Math.round(passportData.score * 100) / 100;
        setScore(roundedScore.toString());
      } else {
        console.log('No score available, please add stamps to your passport and then resubmit.');
        setNoScoreMessage('No score available, please submit your passport after you have added some stamps.');
      }
    } catch (err) {
      console.log('error: ', err);
    }
  }

  return (
    <div>
      <p>The goal of this page is to be able to make a custom frame with each contribution of a project</p>
      <br />
      <p>Here is a list of things that need to be done:</p>
      <ul>
        <li>- It will have to be an option for a contribution</li>
        <li>- It will populate the information which is present inside of the contribution into the frame</li>
        <li>- At the start allow them to choose the background color</li>
        <li>- Have all the functionality to create an attestation at the end and connect to the db, i think this is going to be one of the biggest issues, making it so that the apps that spin up have access to the database</li>
      </ul>
      <br /><br />
      <p>
        It will be a template that is made,
        <br />
        the repo is cloned and the inputs are put into the template through an API call
        <br />
        this will be deployed on Vercel, and it will be connected to our database.
      </p>
      <br />
      <p>
        I think depending on the user that is logged in it will retrieve their projects and which contribution they would like to make the frame absolute,
        then it will have to show the preview using the opengraph images, then it will make the dynamic route that it was talking about, hopefully
        that is enough to work.
      </p>
      <br />
      <div>
        <h2>Check Gitcoin Passport Score</h2>
        {!connected &&
          <>
            <p>Please connect your wallet to continue.</p>
            <button onClick={connect}>Connect Wallet</button>
          </>
        }
        {connected && !score &&
          <div>
            <button onClick={submitPassport}>Submit Passport</button>
            <button onClick={() => checkPassport()}>Check Passport Score</button>
          </div>
        }
        {score && (
          <div>
            <h1>Your passport score is {score}</h1>
            <p>Please continue making attestations</p>
          </div>
        )}
        {noScoreMessage && <p>{noScoreMessage}</p>}
      </div>
    </div>
  );
}
