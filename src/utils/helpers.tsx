// utils/helpers.ts

interface SmileyRatingSectionProps {
  title: string;
  description: string;
  inline?: boolean; // Optional flag for inline display
}

export const SmileyRatingSection: React.FC<SmileyRatingSectionProps> = ({ title, description, inline = false }) => {
  return (
    <div className="mx-4">
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-500 text-center">
        {title}
      </h3>
      {/* Emoji and Description inline */}
      <div className={`flex ${inline ? 'flex-row justify-center items-center space-x-2' : 'flex-col items-center'}`}>
        <p className="text-center">{getSmileyRatingEmoji(description)}</p>
        <p className="text-xs text-gray-500">
          {description || 'N/A'}
        </p>
      </div>
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
