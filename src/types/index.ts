export interface CandidateInfo {
  name: string;
  experience: string;
  skills: string[];
  role: string;
  education?: string;
  location?: string;
  email?: string;
}

export interface DialogueItem {
  speaker: 'interviewer' | 'candidate';
  question?: string;
  answer?: string;
  rawText: string;
}

export interface InterviewRound {
  roundNumber: number;
  topic: string;
  dialogue: DialogueItem[];
}

export interface ImportantInfo {
  category: 'project' | 'achievement' | 'challenge' | 'salary' | 'noticePeriod' | 'other';
  content: string;
}

export interface InterviewSummary {
  candidate: CandidateInfo;
  rounds: InterviewRound[];
  highlights: string[];
  weaknesses: string[];
  importantInfo: ImportantInfo[];
}

export interface AnalysisError {
  code: 'EMPTY_TRANSCRIPT' | 'API_ERROR' | 'PARSE_ERROR' | 'INVALID_FORMAT';
  message: string;
  details?: string;
}

// 面试历史记录类型
export interface InterviewHistoryItem {
  id: string;
  transcript: string;
  result: {
    candidate: {
      name: string;
      role: string;
      experience: string;
      skills: string[];
      education?: string;
      location?: string;
    };
    highlights: string[];
    improvements: string[];
    keyInfo: {
      projects: string;
      salary: string;
      noticePeriod: string;
    };
    topics: {
      timeRange: string;
      topic: string;
      summary: string;
    }[];
  };
  createdAt: number;
  updatedAt: number;
}
