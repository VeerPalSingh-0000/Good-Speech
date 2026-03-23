// Fetch a random 15-minute story from Render backend by language
export const fetchRandomStory = async (languageCode) => {
  try {
    // Replace with your actual Render backend URL
    const RENDER_API_URL =
      import.meta.env.VITE_RENDER_API_URL ||
      "https://your-render-app.onrender.com";

    const response = await fetch(
      `${RENDER_API_URL}/api/stories/random?language=${languageCode}&duration=900`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const story = await response.json();

    // Transform API response to match your story structure
    return {
      id: story.id || `story_${Date.now()}`,
      title: story.title,
      content: story.content,
      category: story.category || languageCode,
      language: languageCode,
      duration: story.duration || "15 mins",
      author: story.author || "Anonymous",
      createdAt: story.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch story:", error);
    throw new Error(`Could not load story: ${error.message}`);
  }
};

// Optional: Fetch multiple stories for a language
export const fetchStoriesByLanguage = async (languageCode, count = 5) => {
  try {
    const RENDER_API_URL =
      import.meta.env.VITE_RENDER_API_URL ||
      "https://your-render-app.onrender.com";

    const response = await fetch(
      `${RENDER_API_URL}/api/stories?language=${languageCode}&limit=${count}&duration=900`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const stories = await response.json();

    return Array.isArray(stories) ? stories : stories.data || [];
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    throw error;
  }
};
