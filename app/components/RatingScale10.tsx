import React from 'react';
import { RatingScaleProps } from '@/src/types';


const RatingScale10: React.FC<RatingScaleProps> = ({ rating, handleRating }) => {
  const colors = [
    'bg-red-600', 'bg-red-500', 'bg-red-400', 'bg-orange-400', 'bg-orange-300',
    'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-green-400', 'bg-green-500',
    'bg-green-600'
  ];

  return (
    <div className="text-center">
      <div className="flex justify-between mb-2">
        <span className="text-sm">0 = Not likely at all</span>
        <span className="text-sm">10 = Extremely likely</span>
      </div>
      <div className="flex justify-center mt-2">
        {[...Array(11).keys()].map((num) => (
          <div
            key={num}
            className={`w-10 h-10 mx-1 flex items-center justify-center cursor-pointer rounded-full text-white ${colors[num]} ${
              rating === num ? 'ring-2 ring-offset-2 ring-blue-500' : ''
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

export default RatingScale10;
