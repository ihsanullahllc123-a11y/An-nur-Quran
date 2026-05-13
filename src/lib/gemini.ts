import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined");
  }
  return new GoogleGenAI({ apiKey });
};

export const askIslamicAssistant = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  const ai = getAI();
  
  // Use the modern SDK pattern: ai.models.generateContent or ai.chats.create
  // For chat with history, we can use generateContent with the full array or chats.create
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      ...history.map(h => ({ role: h.role, parts: h.parts })),
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction: `You are An-Nur, a premium Islamic AI Assistant. 
      Your goal is to provide accurate, respectful, and helpful guidance based on the Quran and Sunnah.
      Always respond in a compassionate and wise tone. 
      Limit your responses to Islamic topics only. 
      If asked about non-Islamic topics, politely redirect to Islamic guidance.
      Use Markdown for formatting.
      Support multiple languages as requested.`,
    },
  });

  return response.text || "I'm sorry, I couldn't generate a response.";
};
