// SmileyRatingScale.tsx
import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface SmileyRatingScaleProps {
  rating: number;
  handleRating: (rate: number) => void;
  additionalInfo: string[];
}

const SmileyRatingScale: React.FC<SmileyRatingScaleProps> = ({ rating, handleRating, additionalInfo }) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const options = [
    { value: 1, label: 'Neutral', emoji: '🙂', color: 'bg-red-200', brightColor: 'bg-red-600' },
    { value: 2, label: 'Somewhat Upset', emoji: '🫠', color: 'bg-yellow-200', brightColor: 'bg-yellow-400' },
    { value: 3, label: 'Extremely Upset', emoji: '😭', color: 'bg-green-200', brightColor: 'bg-green-400' }
  ];

  return (
    <div className="text-center">
      <div className="flex justify-center mt-4 space-x-2">
        {options.map((option) => (
          <div
            key={option.value}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => handleRating(option.value)}
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full text-white ${
                rating === option.value ? option.brightColor : option.color
              } ${
                rating === option.value ? 'ring-2 ring-offset-2 ring-gray-500' : ''
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
            </div>
            <span className="text-xs mt-1 w-24 text-center">{option.label}</span>
          </div>
        ))}
      </div>

      <button 
        className="flex items-center justify-center w-full mt-4 text-sm text-gray-600 hover:text-gray-800"
        onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
      >
        {showAdditionalInfo ? "Hide" : "View"} additional info
        {showAdditionalInfo ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
      </button>

      {showAdditionalInfo && (
        <div className="flex flex-col mt-2 text-sm items-center justify-center">
          {options.map((option, index) => (
            <p key={option.value} className='text-sm mt-2'>
              <span className='font-semibold'>{option.label}:</span> {additionalInfo[index]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmileyRatingScale;
