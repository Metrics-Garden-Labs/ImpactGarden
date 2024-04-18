'use client';

import React, {useState} from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

//get the fonts and stuff right afterwards

export default function Attestbox() {

    const clearInput = () => {
        const input = document.getElementById('walletAddress') as HTMLInputElement;
        if (input) input.value = '';
      };

    const [ hasAttested, setHasAttested ] = useState(false);

    const handleAttestClick = () => {
        // do the attestation
        setHasAttested(true);
    }

    const handleReset = () => {
        setHasAttested(false);
    }
  
    

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <main className=" flex flex-col items-center justify-center w-full flex-1 p-4 md:px-20 text-center">

                <div className="card w-full md:w-1/2 sm:w-3/4 bg-base-100 shadow-xl" style={{ height: '40vh' }}>
                    <div className="card-body">

                        {!hasAttested ? (
                            <>
                        
                            {/* Title "Attest" aligned to the left */}
                            <div className="text-left w-full pl-5"> 
                                <p className="text-l">Attester : </p> 
                            </div>
                            <div className='text-left w-full pl-5 font-bold'>
                                <p>Account Placeholder</p>
                            </div>

                            <div className="text-left w-full pl-5">
                                <p>Attest:</p>
                            </div>

                            <div className="text-left w-full pl-5">
                                {/* needs to contain the options with the icons */}

                            </div>

                            {/* Attestation Options, add the icons*/}
                            <div className='flex justify-center md:justify-start md:space-x-4 w-full pl-5'>
                                {["Vote", "Like", "Build With", "Used", "Custom"].map(action => (
                                    <div key={action} className='card bg-base-100 shadow-s border border-gray-500 rounded-md w-full md:w-1/5 mb-4 md:mb-0 px-2'>
                                        <div className='px-4 py-3 flex items-center'>
                                            <IoIosArrowDropright className='mr-1'/>
                                            <p className='text-sm flex-grow'>{action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="text-left w-full pl-5 py-1">
                                <label className='text-gray-700 '>To: </label>
                            </div>

                            {/* Input for the Address*/}
                            <div className="pl-5 py-0.5 w-full flex justify-center ">
                                <div className="relative rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600  w-full">
                                    <form className='w-full'>
                                    <input
                                        type="text"
                                        name="walletAddress"
                                        id="walletAddress"
                                        autoComplete="Wallet-Address"
                                        className="block w-full border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="Wallet Address"
                                    />
                                    <button
                                        onClick={clearInput}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                                        type="button"
                                        >
                                    <RxCross2 className='text-black' size={20}/>   
                                    </button>
                                    </form> 
                                </div>
                            </div>
                            
                            {/* Put in the logic for div that shows if the address matches one we have in the database */}



                            {/* Attest Button at the bottom of the card */}
                            <div className='justify-center items-center py-10'>
                                <button onClick={handleAttestClick} className="btn w-1/5  bg-black btn-primary hover:bg-gray-500 text-white rounded-md ">Attest</button>
                            </div>
                        </>
                        ) : (
                            <div className="text-center p-10">
                                <button onClick={handleReset} className="absolute top-0 right-0 mt-2 mr-2 text-xl">
                                    <RxCross2 className='text-black'/>
                                </button>
                                <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
                                <p>You have successfully attested.</p>
                                <div className='text-center p-4'>
                                    <button className='btn text-white bg-black '>See all project attestations</button>
                                </div>
                            </div>
                        )}

                  

                    </div>
                </div>

           
        </main>
    </div>
  )
}
