// src/lib/gemini.js

export const generateQuickStory = async (language = "Hindi") => {
  try {
    // Ab hum direct Google ko call nahi kar rahe, Netlify function ko bhej rahe hain
    const response = await fetch('/.netlify/functions/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language }), // Sirf language bhej rahe hain
    });

    if (!response.ok) throw new Error("Server se response nahi aaya");

    const data = await response.json();
    return data.text; // Netlify function se aayi hui story
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Kahani nahi ban payi, ek baar fir try karo!");
  }
};