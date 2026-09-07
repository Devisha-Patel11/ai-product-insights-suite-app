import { GoogleGenAI, Type } from "@google/genai";
import { FeedbackAnalysisItem, FeatureRequestItem } from "../types";

const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";

// Initialize using the official SDK installed in your package.json
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeFeedback = async (inputText: string): Promise<FeedbackAnalysisItem[]> => {
  if (!inputText.trim()) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze the following customer feedback text. Break it down into distinct insights if applicable.
      For each item, determine sentiment, extract pain points, and assign priority.
      
      Feedback:
      ${inputText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sourceSnippet: { type: Type.STRING },
              sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
              painPoints: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
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
  } catch (e: any) {
    console.error("Gemini Error:", e);
    alert("Error running analysis: " + (e?.message || "Check API Key"));
    return [];
  }
};

export const prioritizeFeatures = async (inputText: string): Promise<FeatureRequestItem[]> => {
  if (!inputText.trim()) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze these feature requests. Identify each feature request, evaluate Impact and Urgency, and assign a priorityScore from 1 to 10.
      
      Input:
      ${inputText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              featureName: { type: Type.STRING },
              impactDescription: { type: Type.STRING },
              urgencyDescription: { type: Type.STRING },
              priorityScore: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ["featureName", "impactDescription", "urgencyDescription", "priorityScore", "reasoning"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as FeatureRequestItem[];
  } catch (e: any) {
    console.error("Gemini Error:", e);
    return [];
  }
};