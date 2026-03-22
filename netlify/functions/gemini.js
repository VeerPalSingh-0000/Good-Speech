const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { language } = JSON.parse(event.body);
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Model name wahi rakha hai jo tu use kar raha tha
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); 

    const prompt = `Write a creative, engaging, and easy-to-read short story in ${language}. 
    The story should take about 15 minutes to read aloud (roughly 1500 to 2000 words). 
    Do not include a title or markdown formatting, just return the plain text of the story. 
    Make the vocabulary suitable for someone practicing their speaking and pronunciation skills.`;

    const result = await model.generateContent(prompt);
    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.response.text() }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};