import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyzes a logo using Gemini to provide professional branding context and asset parameters.
 */
export const analyzeLogoForIcons = async (fileName: string, base64Data: string): Promise<any> => {
  try {
    const prompt = `
      You are the FaviconGen Brand Intelligence engine.
      Analyze this logo/image: "${fileName}".
      
      1. Dominant brand hex color (themeColor).
      2. Perfect contrasting background hex color for app icons (backgroundColor).
      3. Precise paddingPercentage (integer 0-40) to ensure the logo isn't cut off but isn't too small.
      4. A 1-sentence professional "shortDescription" of the brand identity based on visual cues.
      5. "contrastAdvice": Specific tips for UI designers using this logo.
      
      Return as valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: prompt }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            paddingPercentage: { type: Type.INTEGER },
            shortDescription: { type: Type.STRING },
            contrastAdvice: { type: Type.STRING }
          },
          required: ["themeColor", "backgroundColor", "paddingPercentage", "shortDescription", "contrastAdvice"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      themeColor: "#6366f1",
      backgroundColor: "#ffffff",
      paddingPercentage: 15,
      shortDescription: "A modern, high-performance digital identity.",
      contrastAdvice: "Ensure sufficient contrast when layering over complex backgrounds."
    };
  }
};

/**
 * Handles chat interactions for the AI Literacy Guide in Assistant.tsx
 */
export const sendMessageToGemini = async (history: { role: string, text: string }[], message: string): Promise<string> => {
  try {
    const contents = history.map(h => ({
      role: h.role as 'user' | 'model',
      parts: [{ text: h.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "You are a friendly AI Literacy Guide. Your mission is to help users understand digital safety, AI concepts, and navigate the app.",
      }
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Error communicating with AI.";
  }
};

/**
 * Extracts structured contact data from a business card image for the POS component.
 */
export const extractContactFromImage = async (base64Data: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: "Extract contact information from this business card. Return as JSON with fields: name, jobTitle, company, email, phone, linkedinUrl, address, fax, telex." }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            company: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            linkedinUrl: { type: Type.STRING },
            address: { type: Type.STRING },
            fax: { type: Type.STRING },
            telex: { type: Type.STRING },
          },
          required: ["name", "company"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("OCR Error:", error);
    return null;
  }
};

/**
 * Provides AI-driven insights or conversation starters for a contact.
 */
export const getEnrichment = async (name: string, company: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a 1-sentence interesting insight or "conversation starter" for a business professional named ${name} who works at ${company}. Think about industry trends or general professional context.`,
    });
    return response.text || "Ready to connect.";
  } catch (error) {
    console.error("Enrichment Error:", error);
    return "No insights available.";
  }
};

/**
 * Summarizes a file's content (text or image) for the FileWhisperer component.
 */
export const whisperFileSummary = async (fileName: string, data: string, isImage: boolean): Promise<any> => {
  try {
    const parts: any[] = [{ text: `Distill the essence of this file: ${fileName}.` }];
    if (isImage) {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: data } });
    } else {
      parts.push({ text: data });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            distillation: { type: Type.STRING },
            keyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            context: { type: Type.STRING }
          },
          required: ["title", "distillation", "keyPoints", "context"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Whisper Error:", error);
    return null;
  }
};