import { GoogleGenAI } from "@google/genai";

// The API key MUST be obtained exclusively from the environment variable `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getFinancialAdvice = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful financial assistant for a family. Analyze the provided data and answer questions. Be concise and clear.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating financial advice with Gemini:", error);
    return "Sorry, I am unable to provide advice at this moment. Please check the API configuration.";
  }
};
