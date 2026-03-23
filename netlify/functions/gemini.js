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

const isModelNotFound = (message) => {
  const normalized = String(message || "").toLowerCase();
  return (
    normalized.includes("404") &&
    (normalized.includes("model") || normalized.includes("models/"))
  );
};

const buildModelCandidates = () => {
  const configuredModel = process.env.GEMINI_MODEL;
  const defaults = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-latest",
  ];

  return [configuredModel, ...defaults].filter(
    (value, index, arr) => value && arr.indexOf(value) === index,
  );
};

const generateWithFallback = async (genAI, modelCandidates, prompt) => {
  const failures = [];

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result?.response?.text?.();
      if (!text) {
        failures.push(`Model ${modelName}: empty response`);
        continue;
      }

      return { text, modelName };
    } catch (error) {
      failures.push(`Model ${modelName}: ${error?.message || "Unknown error"}`);
      if (isQuotaOrRateLimit(error?.message)) {
        throw error;
      }
    }
  }

  return { text: "", failures };
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
    const modelCandidates = buildModelCandidates();

    const prompt =
      customPrompt ||
      `Write a creative, engaging, and easy-to-read short story in ${language}. 
The story should take about 15 minutes to read aloud (roughly 1500 to 2000 words). 
Do not include a title or markdown formatting, just return the plain text of the story. 
Make the vocabulary suitable for someone practicing their speaking and pronunciation skills.`;

    const generated = await generateWithFallback(
      genAI,
      modelCandidates,
      prompt,
    );
    const text = generated?.text;

    if (!text) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          error:
            "No compatible Gemini model was available for this API key/project. Set GEMINI_MODEL to a model your project supports.",
          details: generated?.failures || [],
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text, model: generated.modelName }),
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

    if (isModelNotFound(rawMessage)) {
      return {
        statusCode: 503,
        body: JSON.stringify({
          error:
            "Configured Gemini model is not available for this API/project. Update GEMINI_MODEL in Netlify and redeploy.",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: rawMessage }),
    };
  }
};
