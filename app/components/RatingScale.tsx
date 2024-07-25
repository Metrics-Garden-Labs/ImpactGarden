// components/RatingScale.tsx
import React from 'react';

interface RatingScaleProps {
  rating: number;
  handleRating: (rate: number) => void;
}

const RatingScale: React.FC<RatingScaleProps> = ({ rating, handleRating }) => {
  return (
    <div className="flex justify-center mt-4">
      {[...Array(11).keys()].map((num) => (
        <div
          key={num}
          className={`w-10 h-10 mx-1 flex items-center justify-center cursor-pointer rounded-full ${
            rating === num ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
          }`}
          onClick={() => handleRating(num)}
        >
          {num}
        </div>
      ))}
    </div>
  );
};

export default RatingScale;
