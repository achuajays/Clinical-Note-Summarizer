import { GoogleGenAI, Type } from "@google/genai";
import type { ClinicalSummary } from '../types';

const SYSTEM_INSTRUCTION = `You are a specialized AI assistant for medical professionals, designed to transform unstructured clinical notes into structured SOAP summaries. Your primary function is to analyze the provided text and populate a JSON object according to a strict schema. You must extract information accurately, preserving the original clinical meaning. Do not invent or infer information that isn't present in the note. 

Critically, you must also act as an intelligent agent to identify and flag potential emergency symptoms like chest pain, shortness of breath, severe bleeding, or sudden neurological changes. If such symptoms are detected, set the 'isEmergency' flag to true and specify the reason.

Additionally, perform advanced NLP analysis to extract deeper clinical context. Identify and categorize the following:
- Sentiment: Key expressions of patient feeling (e.g., anxiety, pain level, distress).
- Negations: Explicit denials of symptoms or conditions (e.g., 'patient denies chest pain').
- Temporal Information: Phrases indicating timing or duration (e.g., 'symptoms started 3 days ago', 'pain for the last week').
Place this information in the 'nlpInsights' object.`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    subjective: {
      type: Type.STRING,
      description: "Patient's subjective complaints, history of present illness, etc., as reported by the patient or their representative.",
    },
    objective: {
      type: Type.STRING,
      description: "Objective, measurable findings from physical exams, lab results, and imaging studies.",
    },
    assessment: {
      type: Type.STRING,
      description: "The clinician's diagnosis or differential diagnoses based on the subjective and objective data.",
    },
    plan: {
      type: Type.STRING,
      description: "The treatment plan, including medications, therapies, patient education, and follow-up instructions.",
    },
    icdCodes: {
      type: Type.ARRAY,
      description: "List of identified ICD (International Classification of Diseases) diagnosis codes.",
      items: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING, description: "The specific ICD code, e.g., 'J45.909'." },
          description: { type: Type.STRING, description: "The description of the ICD code." },
        },
        required: ["code", "description"],
      },
    },
    cptCodes: {
      type: Type.ARRAY,
      description: "List of identified CPT (Current Procedural Terminology) codes for procedures performed.",
      items: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING, description: "The specific CPT code, e.g., '99213'." },
          description: { type: Type.STRING, description: "The description of the CPT code." },
        },
        required: ["code", "description"],
      },
    },
    suggestedDiagnosis: {
      type: Type.STRING,
      description: "A preliminary diagnosis suggested based on reported symptoms and medical reasoning patterns.",
    },
    isEmergency: {
      type: Type.BOOLEAN,
      description: "A flag indicating if potential emergency-level symptoms are present.",
    },
    emergencyReason: {
      type: Type.STRING,
      description: "A concise explanation if 'isEmergency' is true, detailing the specific symptoms flagged (e.g., 'Chest pain and shortness of breath'). Returns an empty string if not an emergency.",
    },
    nlpInsights: {
      type: Type.OBJECT,
      description: "Advanced NLP analysis of the clinical note.",
      properties: {
        sentiment: {
          type: Type.ARRAY,
          description: "Key expressions of patient sentiment (e.g., 'anxious', 'in severe pain').",
          items: { type: Type.STRING },
        },
        negations: {
          type: Type.ARRAY,
          description: "Explicit denials of symptoms or conditions (e.g., 'denies chest pain', 'no fever').",
          items: { type: Type.STRING },
        },
        temporalInformation: {
          type: Type.ARRAY,
          description: "Phrases indicating timing or duration of symptoms (e.g., 'symptoms started 3 days ago').",
          items: { type: Type.STRING },
        },
      },
      required: ["sentiment", "negations", "temporalInformation"],
    }
  },
  required: ["subjective", "objective", "assessment", "plan", "icdCodes", "cptCodes", "suggestedDiagnosis", "isEmergency", "emergencyReason", "nlpInsights"],
};


export const summarizeClinicalNote = async (note: string): Promise<ClinicalSummary> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: note,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const summaryData: ClinicalSummary = JSON.parse(jsonText);
    return summaryData;

  } catch (error) {
    console.error("Error summarizing clinical note:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to process the clinical note. Reason: ${error.message}`);
    }
    throw new Error("An unknown error occurred while processing the clinical note.");
  }
};