// src/features/hindi/utils/helpers.js

export const formatTime = (deciseconds) => {
  const totalSeconds = deciseconds / 10;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = (totalSeconds % 60).toFixed(2);
  return `${minutes.toString().padStart(2, "0")}:${seconds.padStart(5, "0")}`;
};

export const formatSafeDate = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("hi-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "N/A";
  }
};

export const calculateQuality = (timeInSeconds) => {
  if (timeInSeconds >= 120) return "उत्कृष्ट";
  if (timeInSeconds >= 90) return "अच्छा";
  if (timeInSeconds >= 60) return "सामान्य";
  return "सुधार की आवश्यकता";
};

export const getStoryName = (storyType) => {
  const names = {
    short: "छोटी कहानी",
    medium: "मध्यम कहानी",
    long: "लंबी कहानी",
    extended: "विस्तृत कहानी",
  };
  return names[storyType] || storyType;
};