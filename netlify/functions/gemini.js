const { GoogleGenerativeAI } = require("@google/generative-ai");

const extractRetrySeconds = (message) => {
  const match = String(message || "").match(/retry in\s+([\d.]+)s/i);
  if (!match) return null;
  const seconds = Number.parseFloat(match[1]);
  return Number.isFinite(seconds) ? Math.ceil(seconds) : null;
};

const isQuotaOrRateLimit = (message) => {
  const normalized = String(message || "").toLowerCase();
  return (
    normalized.includes("429") ||
    normalized.includes("quota exceeded") ||
    normalized.includes("too many requests")
  );
};

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
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

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
    const rawMessage = error?.message || "Unknown server error";

    if (isQuotaOrRateLimit(rawMessage)) {
      const retryAfterSeconds = extractRetrySeconds(rawMessage);
      const retryHint = retryAfterSeconds
        ? `Please retry after about ${retryAfterSeconds} seconds.`
        : "Please retry after a short wait.";

      return {
        statusCode: 429,
        body: JSON.stringify({
          error:
            "Gemini API quota/rate limit reached. Upgrade billing or wait for quota reset. " +
            retryHint,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: rawMessage }),
    };
  }
};
