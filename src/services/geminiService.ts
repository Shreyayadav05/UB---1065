import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, RiskLevel, CareRoute } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeHealthRisk(
  mentalInput: string,
  physicalInput: string
): Promise<AssessmentResult> {
  const model = "gemini-3-flash-preview";
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API Key missing. Please configure it in the Secrets panel.");
  }

  const prompt = `
    Analyze the following patient inputs for health risk.
    Mental/Emotional State: "${mentalInput}"
    Physical Symptoms: "${physicalInput}"

    Provide a structured health risk assessment in JSON format.
    - mentalScore: 0-100
    - physicalScore: 0-100
    - overallRisk: 0-100
    - level: LOW, MEDIUM, HIGH, or CRITICAL
    - route: SELF_CARE, TELECONSULTATION, or EMERGENCY
    - reasoning: Brief explanation
    - recommendations: Array of 3 strings
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mentalScore: { type: Type.NUMBER },
            physicalScore: { type: Type.NUMBER },
            overallRisk: { type: Type.NUMBER },
            level: { type: Type.STRING },
            route: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["mentalScore", "physicalScore", "overallRisk", "level", "route", "reasoning", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as AssessmentResult;
  } catch (e: any) {
    console.error("AI Analysis Error:", e);
    throw new Error(e.message || "Failed to analyze health risk");
  }
}

export async function getChatResponse(message: string, context: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    You are CareFusion AI, an intelligent healthcare orchestrator.
    Context: ${context}
    User Message: ${message}
    
    Provide a helpful, empathetic, and professional medical guidance response. 
    Do not diagnose, but guide the user to the right care level.
    Keep it concise.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt
  });

  return response.text || "I'm sorry, I couldn't process that. Please try again.";
}
