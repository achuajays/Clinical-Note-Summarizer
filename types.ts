export interface MedicalCode {
  code: string;
  description: string;
}

export interface NlpInsights {
  sentiment: string[];
  negations: string[];
  temporalInformation: string[];
}

export interface ClinicalSummary {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icdCodes: MedicalCode[];
  cptCodes: MedicalCode[];
  suggestedDiagnosis: string;
  isEmergency: boolean;
  emergencyReason: string;
  nlpInsights: NlpInsights;
}