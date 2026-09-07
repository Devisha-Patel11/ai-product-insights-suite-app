import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackAnalysisItem, FeatureRequestItem } from "../types";

// Vite env variable check with fallback to prevent constructor crash
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not defined in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "DUMMY_KEY_FOR_BUILD" });

// Using gemini-2.5-flash for fast, structured text analysis
const MODEL_NAME = "gemini-2.5-flash";

export const analyzeFeedback = async (inputText: string): Promise<FeedbackAnalysisItem[]> => {
  if (!inputText.trim() || !apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the following customer feedback text. It may contain multiple distinct points or be a single review. 
      Break it down into distinct insights/items if applicable. For each item, determine the sentiment, extract key pain points, and assign a priority level based on severity.
      
      Feedback Text:
      ${inputText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sourceSnippet: { type: Type.STRING, description: "A brief quote or summary of the specific feedback point." },
              sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
              painPoints: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of specific problems or pain points mentioned."
              },
              priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
            },
            required: ["sourceSnippet", "sentiment", "painPoints", "priority"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as FeedbackAnalysisItem[];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};

export const prioritizeFeatures = async (inputText: string): Promise<FeatureRequestItem[]> => {
  if (!inputText.trim() || !apiKey) return [];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the following list or text containing feature requests. 
      Identify each distinct feature request. 
      Evaluate its potential Impact (how much value it adds) and Urgency (how soon it is needed).
      Assign a Priority Score from 1 to 10 (10 being highest priority) based on these factors.
      
      Feature Requests Input:
      ${inputText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              featureName: { type: Type.STRING, description: "Name or short title of the feature." },
              impactDescription: { type: Type.STRING, description: "Brief explanation of the expected impact." },
              urgencyDescription: { type: Type.STRING, description: "Brief explanation of the urgency." },
              priorityScore: { type: Type.NUMBER, description: "Integer score from 1-10." },
              reasoning: { type: Type.STRING, description: "Short justification for the score." }
            },
            required: ["featureName", "impactDescription", "urgencyDescription", "priorityScore", "reasoning"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as FeatureRequestItem[];
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};