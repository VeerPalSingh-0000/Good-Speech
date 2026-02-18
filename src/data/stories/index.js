// src/data/stories/index.js
// This file combines all stories from different files/collections

import { hindiStories } from "./hindiStories";
import { harryPotterStories } from "./harryPotter";
import { pdfStories } from "./pdfStories";
import { harryPotterHindi } from "./harryPotterHindi";
// Add more imports here as you add new story collections
// import { newStories } from './newStories';

// Combine all stories into one array
export const allStories = [
  ...hindiStories,
  ...harryPotterStories,
  harryPotterHindi,
  ...pdfStories,
  // Add more story arrays here as you add them
  // ...newStories,
];

// You can also export individual collections if needed
export { hindiStories, harryPotterStories, pdfStories };
