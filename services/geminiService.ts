import { GoogleGenAI, Type, Schema } from "@google/genai";

// Schema for structured output
const sneakerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    brand: { type: Type.STRING, description: "The brand of the sneaker (e.g., Nike, Adidas, Jordan)." },
    model: { type: Type.STRING, description: "The specific model name (e.g., Air Jordan 1 High, Yeezy Boost 350)." },
    colorway: { type: Type.STRING, description: "The common colorway name (e.g., Chicago, Bred, Panda)." },
    estimatedPrice: { type: Type.NUMBER, description: "Estimated market value in USD as a number." },
    description: { type: Type.STRING, description: "A short, punchy description of the shoe." },
  },
  required: ["brand", "model", "colorway"], // Price is now optional
};

export const identifySneaker = async (
  imageBase64: string | null,
  textPrompt: string
): Promise<{ brand: string; model: string; colorway: string; estimatedPrice?: number; description?: string } | null> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API Key not found");
      return null;
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct parts based on input availability
    const parts: any[] = [];
    
    if (imageBase64) {
      const base64Data = imageBase64.split(',')[1];
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data
        }
      });
    }

    const promptText = textPrompt 
      ? `Identify this sneaker based on the image and/or this text: "${textPrompt}". Provide the brand, model, colorway, and an estimated market price.`
      : "Identify this sneaker from the image. Provide the brand, model, colorway, and an estimated market price.";

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: parts
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: sneakerSchema,
        systemInstruction: "You are a sneaker expert. Be precise with model names and colorways. Estimate price based on average resale value.",
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    
    return null;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};