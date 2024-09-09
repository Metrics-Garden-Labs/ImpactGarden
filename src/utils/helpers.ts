// utils/helpers.ts

export const getSmileyRatingLabel = (rating: number): string => {
  const ratingLabelMap: { [key: number]: string } = {
    1: "Neutral",
    2: "Somewhat Upset",
    3: "Extremely Upset",
  };

  return ratingLabelMap[rating] || "Unknown"; // Fallback if rating is out of range
};
