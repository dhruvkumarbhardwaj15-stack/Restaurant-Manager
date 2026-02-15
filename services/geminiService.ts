
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAppetizingMenu = async (baseMenu: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional Michelin-star menu copywriter. 
      Rewrite these food item descriptions to be extremely appetizing and luxurious. 
      Maintain the same name and category.
      
      Input: ${baseMenu}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              price: { type: Type.NUMBER },
              category: { type: Type.STRING },
              image: { type: Type.STRING }
            },
            required: ["id", "name", "description", "price", "category", "image"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating menu:", error);
    return null;
  }
};
