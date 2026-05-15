export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface DetailedFeedback {
  aspect: string;
  problem: string;
  improvement: string;
}

export interface Subscore {
  score: number;
  reason: string;
}

export interface Subscores {
  structure: Subscore;
  argumentation: Subscore;
  coherence: Subscore;
  analysis: Subscore;
  grammar: Subscore;
  relevance: Subscore;
  [key: string]: Subscore;
}

export interface Essay {
  id: number;
  user_id: number;
  original_filename: string;
  final_score: number;
  grade: string;
  summary: string;
  subscores: Subscores;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailed_feedback: DetailedFeedback[];
  created_at: string;
}

export interface EssayHistoryItem {
  id: number;
  original_filename: string;
  final_score: number;
  grade: string;
  created_at: string;
}

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
