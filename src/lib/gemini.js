// src/lib/gemini.js

const getErrorFromResponse = async (response) => {
  try {
    const data = await response.json();
    return {
      message:
        data?.error || data?.message || `Server error (${response.status})`,
      retryAfterSeconds:
        typeof data?.retryAfterSeconds === "number"
          ? data.retryAfterSeconds
          : null,
    };
  } catch {
    return {
      message: `Server error (${response.status})`,
      retryAfterSeconds: null,
    };
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
      const errorInfo = await getErrorFromResponse(response);
      const err = new Error(errorInfo.message);
      err.retryAfterSeconds = errorInfo.retryAfterSeconds;
      throw err;
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
      const errorInfo = await getErrorFromResponse(response);
      const err = new Error(errorInfo.message);
      err.retryAfterSeconds = errorInfo.retryAfterSeconds;
      throw err;
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
