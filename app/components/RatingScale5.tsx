import React from 'react';
import { RatingScaleProps } from '@/src/types';

const RatingScale5: React.FC<RatingScaleProps> = ({ rating, handleRating }) => {
  const colors = [
    'bg-red-600', 'bg-orange-400', 'bg-yellow-300', 'bg-green-400', 'bg-green-600'
  ];

  return (
    <div className="text-center">
      <div className="flex justify-between mb-2">
        <span className="text-sm">1 = Not likely at all</span>
        <span className="text-sm">5 = Extremely likely</span>
      </div>
      <div className="flex justify-center mt-2">
        {[...Array(5).keys()].map((num) => (
          <div
            key={num}
            className={`w-10 h-10 mx-1 flex items-center justify-center cursor-pointer rounded-full text-white ${colors[num]} ${
              rating === num  ? 'ring-2 ring-offset-2 ring-blue-500' : ''
            }`}
            onClick={() => handleRating(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingScale5;
