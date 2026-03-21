// src/data/stories/index.js
// This file combines all stories from different files/collections

import { pdfStories } from "./pdfStories";

// Combine all stories into one array
export const allStories = [
  ...pdfStories
];

export { pdfStories };
