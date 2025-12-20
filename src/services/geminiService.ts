import { GoogleGenAI, Type } from "@google/genai";
import { sanitizeInput, getMimeTypeFromExtension } from '../utils/sanitization';
import { retryWithBackoff, handleAIError } from '../utils/errorHandling';

// Securely get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('CRITICAL: Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.');
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Rate limiting to prevent API quota exhaustion
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCall = 0;
  private minDelay = 1000; // 1 second between calls

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const now = Date.now();
          const timeSinceLastCall = now - this.lastCall;
          if (timeSinceLastCall < this.minDelay) {
            await new Promise(r => setTimeout(r, this.minDelay - timeSinceLastCall));
          }
          this.lastCall = Date.now();
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) await task();
    }
    this.processing = false;
  }
}

const aiRateLimiter = new RateLimiter();

/**
 * Analyzes a logo using Gemini to provide professional branding context and asset parameters.
 */
export const analyzeLogoForIcons = async (fileName: string, base64Data: string): Promise<any> => {
  return aiRateLimiter.execute(async () => {
    try {
      // Sanitize inputs
      const sanitizedFileName = sanitizeInput(fileName, 255);

      if (!base64Data || base64Data.length < 100) {
        throw new Error('Invalid image data');
      }

      // Get proper MIME type from filename
      const mimeType = getMimeTypeFromExtension(sanitizedFileName);

      const prompt = `
        You are the FaviconGen Brand Intelligence engine.
        Analyze this logo/image: "${sanitizedFileName}".

        1. Dominant brand hex color (themeColor).
        2. Perfect contrasting background hex color for app icons (backgroundColor).
        3. Precise paddingPercentage (integer 0-40) to ensure the logo isn't cut off but isn't too small.
        4. A 1-sentence professional "shortDescription" of the brand identity based on visual cues.
        5. "contrastAdvice": Specific tips for UI designers using this logo.

        Return as valid JSON.
      `;

      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            {
              parts: [
                { inlineData: { mimeType, data: base64Data } },
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
      }, 2);

      // Safe JSON parsing with validation
      try {
        const result = JSON.parse(response.text || "{}");

        // Validate response structure
        if (!result.themeColor || !result.backgroundColor) {
          throw new Error('Invalid AI response structure');
        }

        return result;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      const aiError = handleAIError(error);
      console.warn(aiError.message);

      // Return safe defaults
      return {
        themeColor: "#6366f1",
        backgroundColor: "#ffffff",
        paddingPercentage: 15,
        shortDescription: "A modern, high-performance digital identity.",
        contrastAdvice: "Ensure sufficient contrast when layering over complex backgrounds."
      };
    }
  });
};

/**
 * Handles chat interactions for the AI Literacy Guide in Assistant.tsx
 */
export const sendMessageToGemini = async (history: { role: string, text: string }[], message: string): Promise<string> => {
  return aiRateLimiter.execute(async () => {
    try {
      // Sanitize user message
      const sanitizedMessage = sanitizeInput(message, 2000);

      if (!sanitizedMessage) {
        return "Please enter a message.";
      }

      // Sanitize history
      const sanitizedHistory = history.map(h => ({
        role: h.role as 'user' | 'model',
        parts: [{ text: sanitizeInput(h.text, 5000) }]
      }));

      const contents = [...sanitizedHistory, { role: 'user' as const, parts: [{ text: sanitizedMessage }] }];

      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: contents,
          config: {
            systemInstruction: "You are a friendly AI Literacy Guide. Your mission is to help users understand digital safety, AI concepts, and navigate the FaviconGen app.",
          }
        });
      }, 2);

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("Chat Error:", error);
      const aiError = handleAIError(error);
      return aiError.message;
    }
  });
};

/**
 * Extracts structured contact data from a business card image for the POS component.
 */
export const extractContactFromImage = async (base64Data: string): Promise<any> => {
  return aiRateLimiter.execute(async () => {
    try {
      if (!base64Data || base64Data.length < 100) {
        throw new Error('Invalid image data');
      }

      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
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
      }, 2);

      // Safe JSON parsing
      try {
        const result = JSON.parse(response.text || "{}");
        if (!result.name) {
          return null;
        }
        return result;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        return null;
      }
    } catch (error) {
      console.error("OCR Error:", error);
      return null;
    }
  });
};

/**
 * Provides AI-driven insights or conversation starters for a contact.
 */
export const getEnrichment = async (name: string, company: string): Promise<string> => {
  return aiRateLimiter.execute(async () => {
    try {
      // Sanitize inputs
      const sanitizedName = sanitizeInput(name, 100);
      const sanitizedCompany = sanitizeInput(company, 200);

      if (!sanitizedName || !sanitizedCompany) {
        return "Ready to connect.";
      }

      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Provide a 1-sentence interesting insight or "conversation starter" for a business professional named ${sanitizedName} who works at ${sanitizedCompany}. Think about industry trends or general professional context.`,
        });
      }, 2);

      return response.text || "Ready to connect.";
    } catch (error) {
      console.error("Enrichment Error:", error);
      return "Looking forward to connecting.";
    }
  });
};

/**
 * Summarizes a file's content (text or image) for the FileWhisperer component.
 */
export const whisperFileSummary = async (fileName: string, data: string, isImage: boolean): Promise<any> => {
  return aiRateLimiter.execute(async () => {
    try {
      // Sanitize inputs
      const sanitizedFileName = sanitizeInput(fileName, 255);

      if (!data || data.length < 10) {
        throw new Error('Invalid file data');
      }

      // Limit data size
      const maxDataLength = isImage ? 50000000 : 100000; // 50MB for images, 100KB for text
      const truncatedData = data.slice(0, maxDataLength);

      const parts: any[] = [{ text: `Distill the essence of this file: ${sanitizedFileName}.` }];

      if (isImage) {
        const mimeType = getMimeTypeFromExtension(sanitizedFileName);
        parts.push({ inlineData: { mimeType, data: truncatedData } });
      } else {
        const sanitizedText = sanitizeInput(truncatedData, 100000);
        parts.push({ text: sanitizedText });
      }

      const response = await retryWithBackoff(async () => {
        return await ai.models.generateContent({
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
      }, 2);

      // Safe JSON parsing
      try {
        const result = JSON.parse(response.text || "{}");
        if (!result.title || !result.distillation) {
          return null;
        }
        return result;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        return null;
      }
    } catch (error) {
      console.error("Whisper Error:", error);
      return null;
    }
  });
};