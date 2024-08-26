//still waiting for the questions for this one.

import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { contributionRolesKey } from '@/src/types';
import SmileyRatingScale from '../../ui/SmileyRatingScale';

interface GovernanceStructuresFormProps {
  smileyRating: number;
  feedback: string;
  setFeedback: (feedback: string) => void;
  feedback2: string;
  setFeedback2: (feedback: string) => void;
  extrafeedback: string;
  setExtraFeedback: (extraFeedback: string) => void;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const GovernanceStructuresFrom: React.FC<GovernanceStructuresFormProps> = ({
  smileyRating,
  feedback,
  feedback2,
  setFeedback2,
  setFeedback,
  extrafeedback,
  setExtraFeedback,
  onSubmit,
  onClose,
}) => {

  const [localFeedback1, setLocalFeedback1] = useState(feedback);
  const [localFeedback2, setLocalFeedback2] = useState(feedback2);
  const [localExtraFeedback, setLocalExtraFeedback] = useState(extrafeedback);
  const [localSmileyRating, setLocalSmileyRating] = useState(smileyRating);

  const additionalInfo = [
    "The absence of this tool would significantly disrupt my work.",
    "The absence of this tool would cause considerable inconvenience.",
    "The absence of this tool would have little to no impact on my work."
  ];


  const handleSubmit = () => {
    const formData = {
      feeling_if_didnt_exist: localSmileyRating,
      why: localFeedback1,
      explanation: localFeedback2,
      private_feedback: localExtraFeedback,
    };
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div
        className="relative m-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-2/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <h2 className="text-xl font-bold mb-6 text-center">Attest to Contribution</h2>
            {/* Q1 */}
          <div className="mb-6">
            <h3 className='font-semibold text-center'>How would you feel if this tool/contribution ceased to exist?</h3>
            <SmileyRatingScale 
              rating={localSmileyRating} 
              handleRating={setLocalSmileyRating} 
              additionalInfo={additionalInfo}
              />

          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>Why?</h3>
           <textarea
              value={localFeedback1}
              onChange={(e) => setLocalFeedback1(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{localFeedback2.length}/200</div>
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Please give examples of how this contribution has been useful for you. Please give a shout out to individuals that have made a difference. </label>
            <textarea
              value={localFeedback2}
              onChange={(e) => setLocalFeedback2(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{localFeedback2.length}/200</div>
          </div>
          <hr className="my-4" />
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Any additional feedback or suggestions on this contribution? This response will be confidential and only shared with the contributor.</label>
            <textarea
              value={localExtraFeedback}
              onChange={(e) => setLocalExtraFeedback(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{localExtraFeedback.length}/200</div>
          </div>
          <hr className="my-4" />

          <div className="text-center py-3">
            <button className='btn bg-headerblack text-white hover:bg-blue-500 mr-2' onClick={onClose}>Back</button>
            <button className="btn bg-headerblack text-white hover:bg-blue-500" onClick={handleSubmit}>Send Review</button>
          </div>
        </>

        <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GovernanceStructuresFrom;
