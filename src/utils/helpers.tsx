// utils/helpers.ts

interface SmileyRatingSectionProps {
  title: string;
  description: string;
}

export const SmileyRatingSection: React.FC<SmileyRatingSectionProps> = ({ title,  description }) => {
  return (
    <div className="flex flex-col items-center mx-4">
      <h3 className="text-sm font-semibold text-gray-500 text-center">
        {title}
      </h3>
      <p className="text-center">{getSmileyRatingEmoji(description)}</p>
      <p className="text-center text-xs text-gray-500">
        {description || 'N/A'}
      </p>
    </div>
  );
};

export const getSmileyRatingLabel = (rating: number): string => {
  const ratingLabelMap: { [key: number]: string } = {
    1: "Neutral",
    2: "Somewhat Upset",
    3: "Extremely Upset",
  };

  return ratingLabelMap[rating] || "Unknown"; // Fallback if rating is out of range
};

export const getSmileyRatingEmoji = (rating: string): string => {
  const ratingEmojiMap: { [key: string]: string } = {
    Neutral: "🙂",
    "Somewhat Upset": "🫠",
    "Extremely Upset": "😭",
  };

  return ratingEmojiMap[rating] || "Unknown"; // Fallback if rating is out of range
};
