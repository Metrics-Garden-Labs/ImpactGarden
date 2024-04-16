import React from 'react'

export default function Middlebox() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
        <main className=" flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

                <div className="card w-1/2 bg-base-100 shadow-xl" style={{ height: '40vh' }}>
                    <div className="card-body">
                        
                        {/* Title "Attest" aligned to the left */}
                        <div className="text-left w-full pl-5"> 
                            <p className="text-l">Attester</p> 
                        </div>


                        {/* Attest Button at the bottom of the card */}
                        <div className='justify-center items-center'>
                        <button className="btn w-1/5  bg-black btn-primary text-white">Attest</button>
                        </div>

                    </div>
                </div>

           
        </main>
    </div>
  )
}
