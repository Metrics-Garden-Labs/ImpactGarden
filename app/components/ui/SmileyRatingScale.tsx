import React from 'react';

interface SmileyRatingScaleProps {
  rating: number;
  handleRating: (rate: number) => void;
}

const SmileyRatingScale: React.FC<SmileyRatingScaleProps> = ({ rating, handleRating }) => {
  const options = [
    { value: 1, label: '😭 Extremely Upset', color: 'bg-red-200', brightColor: 'bg-red-600' },
    { value: 2, label: '🫠 Somewhat Upset', color: 'bg-yellow-200', brightColor: 'bg-yellow-400' },
    { value: 3, label: '🙂 Neutral', color: 'bg-green-200', brightColor: 'bg-green-400' }
  ];

  return (
    <div className="text-center">
      <div className="flex justify-center mt-4 space-x-4">
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
              <span className="text-3xl">{option.label.split(' ')[0]}</span>
            </div>
            <span className="text-xs mt-1 w-24 text-center">{option.label.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmileyRatingScale;
