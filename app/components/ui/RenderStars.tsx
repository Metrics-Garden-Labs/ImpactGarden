import { IoStarHalfSharp, IoStarOutline, IoStarSharp } from "react-icons/io5";

interface RatingSectionProps {
  title: string;
  rating: number;
  renderStars: (rating: number) => JSX.Element;  // Change JSX.Element[] to JSX.Element
  scaleFactor?: number;  // Optional for scaling rating (e.g., divide by 2 for 0-10 scale)
}

export const RatingSection: React.FC<RatingSectionProps> = ({ title, rating, renderStars, scaleFactor = 1 }) => {
  return (
    <div className="flex flex-col items-center mx-4">
      <h3 className="font-semibold text-gray-500 text-center text-xs whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </h3>
      <div className="flex items-center text-orange-400">
        {renderStars(rating)} {/* Now renderStars can return a single JSX element */}
        <span className="ml-2 text-sm text-gray-500">
          {(rating / scaleFactor).toFixed(1)}
        </span>
      </div>
    </div>
  );
};



export const renderStars5 = (rating: number) => {
  const fullStarsCount = Math.floor(rating);
  const halfStarsCount = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStarsCount = 5 - fullStarsCount - halfStarsCount;

  return (
    <div className="flex items-center text-orange-400">
      {Array.from({ length: fullStarsCount }, (_, index) => (
        <IoStarSharp key={`full-${index}`} />
      ))}
      {Array.from({ length: halfStarsCount }, (_, index) => (
        <IoStarHalfSharp key={`half-${index}`} />
      ))}
      {Array.from({ length: emptyStarsCount }, (_, index) => (
        <IoStarOutline key={`empty-${index}`} />
      ))}
    </div>
  );
};

export const renderStars10 = (rating: number) => {
  const fullStarsCount = Math.floor(rating / 2);
  const halfStarsCount = rating % 2 >= 1 ? 1 : 0;
  const emptyStarsCount = 5 - fullStarsCount - halfStarsCount;

  return (
    <div className="flex items-center text-orange-400">
      {Array.from({ length: fullStarsCount }, (_, index) => (
        <IoStarSharp key={`full-${index}`} />
      ))}
      {Array.from({ length: halfStarsCount }, (_, index) => (
        <IoStarHalfSharp key={`half-${index}`} />
      ))}
      {Array.from({ length: emptyStarsCount }, (_, index) => (
        <IoStarOutline key={`empty-${index}`} />
      ))}
    </div>
  );
};