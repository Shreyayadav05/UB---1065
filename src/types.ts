export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}

export enum CareRoute {
  SELF_CARE = "SELF_CARE",
  TELECONSULTATION = "TELECONSULTATION",
  EMERGENCY = "EMERGENCY"
}

export interface AssessmentResult {
  mentalScore: number;
  physicalScore: number;
  overallRisk: number;
  level: RiskLevel;
  route: CareRoute;
  reasoning: string;
  recommendations: string[];
}

export interface Appointment {
  id?: number;
  patientName: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status?: string;
}

export interface Message {
  id: string;
  sender: "user" | "ai" | "doctor";
  text: string;
  timestamp: number;
}
