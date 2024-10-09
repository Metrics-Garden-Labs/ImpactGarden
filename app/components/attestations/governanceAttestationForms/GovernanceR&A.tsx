import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { contributionRolesKey } from '@/src/types';
import RatingScale5 from '@/app/components/ui/RatingScale5';
import RatingScale10 from '@/app/components/ui/RatingScale10';

interface GovernanceRAndAFormProps {
  rating1: number;
  rating2: number;
  rating3: number;
  feedback: string;
  setFeedback: (feedback: string) => void;
  extrafeedback: string;
  setExtraFeedback: (extraFeedback: string) => void;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const GovernanceRAndDForm: React.FC<GovernanceRAndAFormProps> = ({
  rating1,
  rating2,
  rating3,
  feedback,
  setFeedback,
  extrafeedback,
  setExtraFeedback,
  onSubmit,
  onClose,
}) => {
  const [localRating1, setLocalRating1] = useState(rating1);
  const [localRating2, setLocalRating2] = useState(rating2);
  const [localRating3, setLocalRating3] = useState(rating3);
  const [localFeedback, setLocalFeedback] = useState(feedback);
  const [localExtraFeedback, setLocalExtraFeedback] = useState(extrafeedback);

  const handleSubmit = () => {
    const formData = {
      likely_to_recommend: localRating1,
      useful_for_understanding: localRating2,
      effective_for_improvements: localRating3,
      explanation: localFeedback,
      private_feedback: localExtraFeedback,
    };
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex text-black justify-center items-center" onClick={onClose}>
      <div
        className="relative m-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-2/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <>
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" 
            onClick={onClose}
          >
            <RxCross2 className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-bold mb-6 text-center">Attest to Contribution</h2>

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>How likely are you to recommend this contribution to someone in your role or position?</h3>
            <RatingScale10 rating={localRating1} handleRating={setLocalRating1} />
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>Has this contribution been useful for you to understand Optimism’s governance performance?</h3>
            <RatingScale5 rating={localRating2} handleRating={setLocalRating2} />
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>How effectively were you able to create improvements to Optimism’s governance based on this research or analysis?</h3>
            <RatingScale5 rating={localRating3} handleRating={setLocalRating3} />
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Please explain your rating.<span className='italic'> What makes this research valuable or insightful, or what limitations do you see without it?</span></label>
            <textarea
              value={localFeedback}
              onChange={(e) => setLocalFeedback(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{localFeedback.length}/200</div>
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
      </div>
    </div>
  );
};

export default GovernanceRAndDForm;
