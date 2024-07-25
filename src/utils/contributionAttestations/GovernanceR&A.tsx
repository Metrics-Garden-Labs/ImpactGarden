import React from 'react';
import { RxCross2 } from 'react-icons/rx';
import { contributionRolesKey } from '@/src/types';
import RatingScale5 from '@/app/components/RatingScale5';
import RatingScale10 from '@/app/components/RatingScale10';

interface GovernanceRAndAFormProps {
  contributionRoles: { [key in contributionRolesKey]: boolean };
  handleRating1: (rate: number) => void;
  handleRating2: (rate: number) => void;
  handleRating3: (rate: number) => void;
  rating1: number;
  rating2: number;
  rating3: number;
  handleClick: (key: contributionRolesKey) => void;
  labels: { [key in contributionRolesKey]: string };
  feedback: string;
  setFeedback: (feedback: string) => void;
  extrafeedback: string;
  setExtraFeedback: (extraFeedback: string) => void;
  onClose: () => void;
}

const GovernanceRAndDForm: React.FC<GovernanceRAndAFormProps> = ({
  handleRating1,
  handleRating2,
  handleRating3,
  rating1,
  rating2,
  rating3,
  contributionRoles,
  handleClick,
  labels,
  feedback,
  setFeedback,
  extrafeedback,
  setExtraFeedback,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div
        className="relative m-auto p-6 bg-white rounded-lg shadow-lg max-w-4xl w-3/4 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto mx-4 md:mx-20"
        onClick={(e) => e.stopPropagation()}
      >
        <>
          <h2 className="text-xl font-bold mb-6 text-center">Attest to Contribution</h2>

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>How likely are you to recommend this contribution to someone in your role or position?</h3>
            <RatingScale10 rating={rating1} handleRating={handleRating1} />
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>Has this contribution been useful for you to understand Optimism’s governance performance?</h3>
            <RatingScale5 rating={rating2} handleRating={handleRating2} />
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <h3 className='font-semibold text-center mb-2'>How effectively were you able to create improvements to Optimism’s governance based on this research or analysis?</h3>
            <RatingScale5 rating={rating3} handleRating={handleRating3} />
          </div>
          <hr className="my-4" />

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Please explain your rating.<span className='italic'> What makes this research valuable or insightful, or what limitations do you see without it?</span></label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{feedback.length}/200</div>
          </div>
          <hr className="my-4" />
          
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Any additional feedback or suggestions on this contribution? This response will be confidential and only shared with the contributor.</label>
            <textarea
              value={extrafeedback}
              onChange={(e) => setExtraFeedback(e.target.value)}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows={4}
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-500 mt-1">{extrafeedback.length}/200</div>
          </div>
          <hr className="my-4" />

          <div className="text-center py-3">
            <button className='btn bg-headerblack text-white hover:bg-blue-500 mr-2' onClick={onClose}>Back</button>
            <button className="btn bg-headerblack text-white hover:bg-blue-500">Send Review</button>
          </div>
        </>

        <button onClick={onClose} className="text-black absolute top-0 right-0 w-5 h-5 mt-4 mr-4">
          <RxCross2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GovernanceRAndDForm;
