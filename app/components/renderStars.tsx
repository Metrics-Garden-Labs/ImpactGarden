import { IoStarHalfSharp, IoStarOutline, IoStarSharp } from "react-icons/io5";

const renderStars = (rating: number) => {
  const fullStarsCount = Math.floor(rating);
  const halfStarsCount = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStarsCount = 5 - fullStarsCount - halfStarsCount;

  return (
    <div className="flex items-center">
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
