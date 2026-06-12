export interface StudentProfile {
  name: string;
  branch: string;
  skills: string;
  targetRole: string;
  resumeName: string | null;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed';
  codeTemplate?: string;
  placeholderCode?: string;
  testCases?: { input: any[]; expected: any }[];
  functionName?: string;
}

export interface Question {
  id: string;
  category: 'coding' | 'technical' | 'hr' | 'aptitude';
  difficulty: 'easy' | 'medium' | 'hard';
  title: string;
  questionText: string;
  solution: string;
  explanation: string;
  practiced?: boolean;
}

export interface MockQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
}

export interface MockTest {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  questions: MockQuestion[];
}

export interface Resource {
  id: string;
  title: string;
  category: 'programming' | 'aiml' | 'career';
  description: string;
  type: 'youtube' | 'article' | 'course';
  url: string;
  thumbnail: string;
}

export interface JDAnalysisResult {
  skillsRequired: string[];
  topicsToLearn: string[];
  interviewQuestions: {
    question: string;
    answer: string;
    category: 'coding' | 'technical' | 'hr';
  }[];
  roadmap: {
    phase: string;
    description: string;
    duration: string;
  }[];
  resources: {
    title: string;
    type: string;
    url: string;
  }[];
}

export interface ScheduleItem {
  day: number;
  topics: string[];
  tasks: string[];
  completed?: boolean;
}

export interface AIScheduleResult {
  schedule: ScheduleItem[];
  tips: string[];
}
