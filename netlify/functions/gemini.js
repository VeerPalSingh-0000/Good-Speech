const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const language = body.language || "Hindi";
    const customPrompt =
      typeof body.prompt === "string" ? body.prompt.trim() : "";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error:
            "Missing server env: GEMINI_API_KEY. Add it in Netlify Environment Variables and redeploy.",
        }),
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =
      customPrompt ||
      `Write a creative, engaging, and easy-to-read short story in ${language}. 
The story should take about 15 minutes to read aloud (roughly 1500 to 2000 words). 
Do not include a title or markdown formatting, just return the plain text of the story. 
Make the vocabulary suitable for someone practicing their speaking and pronunciation skills.`;

    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.();

    if (!text) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Gemini returned an empty response." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message || "Unknown server error" }),
    };
  }
};
