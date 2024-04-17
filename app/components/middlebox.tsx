'use client';

import React from 'react'
import { IoIosArrowDropright } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

//get the fonts and stuff right afterwards

export default function Middlebox() {

    const clearInput = () => {
        const input = document.getElementById('walletAddress') as HTMLInputElement;
        if (input) input.value = '';
      };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <main className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <div className="card w-1/2 bg-base-100 shadow-xl" style={{ height: '40vh' }}>
                    <div className="card-body">
                        
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
                        <div className='flex justify-center space-x-4 w-full pl-5'>
                            <div className='card bg-base-100 shadow-s border border-gray-500 rounded-md w-full'>
                                <div className='px-4 py-2 flex items-center space-x-1'>
                                    <IoIosArrowDropright className='mr-1'/>
                                    <p className='text-sm flex-grow'>Vote</p>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-s border border-gray-500 rounded-md w-full">
                                <div className='px-4 py-2 flex items-center space-x-1'>
                                    <IoIosArrowDropright className='mr-1'/>
                                    <p className='text-sm flex-grow'>Like</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="card bg-base-100 shadow-s border border-gray-500 rounded-md  w-full">
                                <div className=' px-4 py-2 flex items-center'>
                                    <IoIosArrowDropright className='mr-1'/>
                                    <p className='text-sm flex-grow'>Build With</p>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="card bg-base-100 shadow-s border border-gray-500 rounded-md w-full">
                                <div className='px-4 py-2 flex items-center'>
                                    <IoIosArrowDropright className='mr-1'/>
                                    <p className='text-sm flex-grow'>Used</p>
                                </div>
                            </div>

                            {/* Card 5 */}
                            <div className="card bg-base-100 shadow-s border border-gray-500 rounded-md w-full ">
                                <div className=' px-4 py-2 flex items-center'>
                                    <IoIosArrowDropright className='mr-1'/>
                                    <p className='text-sm flex-grow'>Custom</p>
                                </div>
                            </div>
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
                        <button className="btn w-1/5  bg-black btn-primary hover:bg-gray-500 text-white rounded-md ">Attest</button>
                        </div>

                    </div>
                </div>

           
        </main>
    </div>
  )
}
