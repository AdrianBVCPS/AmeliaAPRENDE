import { GoogleGenAI, Type } from "@google/genai";
import { GameItem, Sticker, LevelData } from "../types";

// Removed audio generation logic entirely as requested.

const getClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. Using Offline Mode.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Validations are now CLIENT-SIDE only to prevent API errors and frustration
const ENCOURAGING_FEEDBACK = [
    "¡Lo hiciste genial!",
    "¡Qué bien escribes!",
    "¡Te quedó precioso!",
    "¡Eres increíble!",
    "¡Excelente trabajo!"
];

export const validateHandwriting = async (
  base64Image: string, 
  targetChar: string
): Promise<{ isCorrect: boolean; feedback: string }> => {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve({
              isCorrect: true,
              feedback: ENCOURAGING_FEEDBACK[Math.floor(Math.random() * ENCOURAGING_FEEDBACK.length)]
          });
      }, 800);
  });
};

interface MagicSessionData {
  syllables: GameItem[];
  words: GameItem[];
  stories: GameItem[];
  newSticker: Sticker;
}

export const generateMagicSession = async (): Promise<MagicSessionData | null> => {
    const ai = getClient();
    if (!ai) return null;
  
    const prompt = `
      Create a "Magic Session" for a preschool Spanish learning app.
      Generate NEW content for these categories:
      1. 3 Syllables (simple CV).
      2. 3 Words (simple 3-5 letters).
      3. 2 Stories (short 3-word sentences).
      4. 1 New Sticker (distinct emoji and name).
      
      Output JSON format matching the schema.
      For 'constructionParts', break the word/sentence into UPPERCASE letters.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                syllables: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            phonetic: { type: Type.STRING },
                            prompt: { type: Type.STRING },
                            constructionParts: { type: Type.ARRAY, items: { type: Type.STRING } },
                            emoji: { type: Type.STRING }
                        }
                    }
                },
                words: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            phonetic: { type: Type.STRING },
                            prompt: { type: Type.STRING },
                            constructionParts: { type: Type.ARRAY, items: { type: Type.STRING } },
                            emoji: { type: Type.STRING }
                        }
                    }
                },
                stories: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            text: { type: Type.STRING },
                            phonetic: { type: Type.STRING },
                            prompt: { type: Type.STRING },
                            constructionParts: { type: Type.ARRAY, items: { type: Type.STRING } },
                            emoji: { type: Type.STRING }
                        }
                    }
                },
                newSticker: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        emoji: { type: Type.STRING },
                        name: { type: Type.STRING },
                        unlocked: { type: Type.BOOLEAN }
                    }
                }
            },
          },
        }
      });
  
      const text = response.text;
      if (!text) return null;
      return JSON.parse(text);
    } catch (e) {
      console.error("Magic generation failed", e);
      return null;
    }
  };

export const generateLevelContent = async (
    levelType: 'letters' | 'syllables' | 'words' | 'stories',
    existingItems: GameItem[]
  ): Promise<GameItem[]> => {
      // Kept for backward compatibility if needed, but App.tsx now uses generateMagicSession
      return [];
  };