import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { contributionRolesKey } from '@/src/types';
import SmileyRatingScale from '@/app/components/ui/SmileyRatingScale';
import RatingScale10 from '@/app/components/ui/RatingScale10';
import { getSmileyRatingLabel } from '@/src/utils/helpers';

interface GovernanceCollabAndOnboardingProps {
  smileyRating: number;
  rating1: number;
  feedback: string;
  setFeedback: (feedback: string) => void;
  extrafeedback: string;
  setExtraFeedback: (extraFeedback: string) => void;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const GovernanceCollabAndOnboarding: React.FC<GovernanceCollabAndOnboardingProps> = ({
  rating1,
  smileyRating,   
  feedback,
  setFeedback,
  extrafeedback,
  setExtraFeedback,
  onSubmit,
  onClose,
}) => {
  const [knowledgeLevel, setKnowledgeLevel] = useState('');
  const [localRating1, setLocalRating1] = useState(rating1);
  const [localSmileyRating, setLocalSmileyRating] = useState(smileyRating);
  const [localFeedback, setLocalFeedback] = useState(feedback);
  const [localExtraFeedback, setLocalExtraFeedback] = useState(extrafeedback);

  const additionalInfo = [
    "The absence of this tool would have had little to no impact on my journey.",
    "Understanding and engaging in Optimism’s governance would have been considerably more challenging.",
    "I wouldn’t have been able to understand and engage in governance without it.",
  ];


  const handleKnowledgeLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setKnowledgeLevel(event.target.value);
  };

  const handleSubmit = () => {

    if (localSmileyRating === 0 || undefined ) {
      alert("Please leave rating, Neutral, Slighly Upset or Extremely Upset.");
      return; // Prevent form submission
    }
    //convert smiley rating to label
    const smileyRatingLabel = getSmileyRatingLabel(localSmileyRating);

    const formData = {
      governance_knowledge: knowledgeLevel,
      recommend_contribution: localRating1.toString(),
      feeling_if_didnt_exist: smileyRatingLabel,
      explanation: localFeedback,
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
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800" 
            onClick={onClose}
          >
            <RxCross2 className="h-6 w-6" />
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">Attest to Contribution</h2>

          {/* Q1 */}
          <div className="mb-6">
            {/* <h3 className='font-semibold text-center'>Your knowledge level about Optimism’s Governance</h3> */}
            <select
              value={knowledgeLevel}
              onChange={handleKnowledgeLevelChange}
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none mt-2"
            >
              <option value="" disabled>Select your knowledge level</option>
              <option value="No Knowledge">No Knowledge: I am not familiar with Optimism’s Governance at all.</option>
              <option value="Basic Knowledge">Basic Knowledge: I have limited understanding of its principles and structure.</option>
              <option value="Intermediate Knowledge">Intermediate Knowledge: I understand the basic principles and structure, and have some familiarity with its processes.</option>
              <option value="Advanced Knowledge">Advanced Knowledge: I have a good understanding of Optimism’s Governance, and have followed its development closely.</option>
              <option value="Expert Knowledge">Expert Knowledge: I have an in-depth understanding of Optimism’s Governance, and have actively contributed to its governance discussions or activities.</option>
            </select>
          </div>
          <hr className="my-4" />

          {/* Q2 */}
          <div className="mb-6">
            <h3 className='font-semibold text-center'>How likely are you to recommend this contribution to someone in your role or an ecosystem participant?</h3>
            <RatingScale10 rating={localRating1} handleRating={setLocalRating1} />
          </div>
          <hr className="my-4" />

          {/* Q3 */}
          <div className="mb-8">
            <h3 className='font-semibold text-center'>How would you feel if this contribution ceased to exist?</h3>
            <SmileyRatingScale 
              rating={localSmileyRating} 
              handleRating={setLocalSmileyRating} 
              additionalInfo={additionalInfo}
              />

          </div>
          <hr className="my-4" />

          {/* Q4 */}
          <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Please give examples of how this collaboration or onboarding contribution has been useful for you. 
            {/* <div className="italic">Did it increase your participation?</div> */}
          </label>

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

          {/* Q5 */}
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

export default GovernanceCollabAndOnboarding;
