// src/lib/gemini.js

const getErrorMessageFromResponse = async (response) => {
  try {
    const data = await response.json();
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    return `Server error (${response.status})`;
  } catch {
    return `Server error (${response.status})`;
  }
};

// Keep this if you use it in other components
export const generateQuickStory = async (language = "Hindi") => {
  try {
    const response = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessageFromResponse(response));
    }

    const data = await response.json();
    if (!data?.text) throw new Error("Server ne kahani return nahi ki.");
    return data.text;
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error(
      error?.message || "Kahani nahi ban payi, ek baar fir try karo!",
    );
  }
};

// ADD THIS NEW FUNCTION for AIGenerator.jsx
export const generateAIStory = async (prompt) => {
  try {
    const response = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Yahan hum prompt bhej rahe hain backend ko
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(await getErrorMessageFromResponse(response));
    }

    const data = await response.json();
    if (!data?.text) throw new Error("Server ne kahani return nahi ki.");
    return data.text;
  } catch (error) {
    console.error("Error generating AI story:", error);
    throw new Error(
      error?.message || "Kahani nahi ban payi, ek baar fir try karo!",
    );
  }
};
