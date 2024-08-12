
import SpinnerIcon from './spinnermgl/mglspinner';
import Mgltree from './spinnermgl/mgltree';

export default function AttestationCreationModal() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center items-center mb-6 mt-6">
          <SpinnerIcon className="spinner w-16 h-16" />
          <Mgltree className="absolute w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold mb-4 justify-center text-center mt-6 mb-6">Processing Attestation</h2>
        <div className="flex items-center">
          <p>Please wait while your attestation is being processed...</p>
        </div>
        
      </div>
    </div>
  );
}
