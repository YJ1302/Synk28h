export type Page = 'Chequeo' | 'Práctica' | 'Conectar' | 'Taller';

export interface PracticeSession {
  prompt: string;
  answer: string;
  score: number;
  feedback: string;
  timestamp: Date;
}

export type MainChallenge =
  | 'social_anxiety'
  | 'boundary_issues'
  | 'communication_gaps'
  | 'authenticity_doubt'
  | 'other';

export interface ProfileScores {
  social_energy: number;
  social_anxiety: number;
  communication_gaps: number;
  authenticity_boundaries: number;
}

export interface DiagnosisResult {
  main_challenge: MainChallenge;
  confidence: number;
  traits: string[];
  insight: string;
  recommended_scenario: string;
  scores: ProfileScores;
}

export interface BaselineCheckin {
  question: string;
  score: number;
  note: string;
  timestamp: Date;
}

export interface DailyCheckin {
  question: string;
  label: string;
  note: string;
  timestamp: Date;
}

export interface Question {
  id: number;
  text: string;
  type: 'scale' | 'multiple-choice';
  options: string[];
  helperText?: string;
}

export type Answers = { [key: number]: string };

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  content: string;
}

export interface ChatbotProfile {
  id: string;
  name: string;
  avatar: 'avatar1' | 'avatar2' | 'avatar3' | 'avatar4';
  bio: string;
  personality: string[];
}
