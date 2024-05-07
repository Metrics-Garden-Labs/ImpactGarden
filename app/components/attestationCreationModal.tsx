import Image from 'next/image'

export default function AttestationCreationModal() {

    return(
    <div className="fixed inset-0 flex items-center rounded justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Image  
              src="/MGLIcon.png"
              alt="Loading"
              width={100}
              height={100}
              className='justify-center mx-auto object-contain mt-6 mb-6'
            />
            <h2 className="text-xl font-bold mb-4 justify-center text-center mt-6 mb-6">Processing Attestation</h2>
            <div className="flex items-center">
              <p>Please wait while your attestation is being processed...</p>
            </div>
            <div className="flex justify-center items-center mb-6 mt-6">
              <p className="loading loading-spinner loading-lg text-center"></p>
            </div>
          </div>
        </div>
    )
}