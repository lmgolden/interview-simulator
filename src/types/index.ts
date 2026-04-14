export type QuestionType = 'behavioral' | 'open-ended' | 'situational';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AnswerMode = 'free-form' | 'multiple-choice';
export type AppView = 'landing' | 'question' | 'results';

export interface QuestionConfig {
  questionType: QuestionType;
  difficulty: Difficulty;
  jobDescription: string;
}

export interface GeneratedQuestion {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  jobDescription: string;
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface StarScore {
  situation: { present: boolean; notes: string };
  task: { present: boolean; notes: string };
  action: { present: boolean; notes: string };
  result: { present: boolean; notes: string };
}

export interface AnswerFeedback {
  strengths: string[];
  improvements: string[];
  star: StarScore | null;
  overallScore: number | null;
}

export interface AppState {
  view: AppView;
  config: QuestionConfig;
  question: GeneratedQuestion | null;
  choices: MultipleChoiceOption[] | null;
  answerMode: AnswerMode;
  userAnswer: string;
  selectedChoice: string | null;
  feedback: AnswerFeedback | null;
  isLoadingQuestion: boolean;
  isLoadingChoices: boolean;
  isAnalyzing: boolean;
  error: string | null;
}

// API shapes
export interface GenerateQuestionRequest {
  questionType: QuestionType;
  difficulty: Difficulty;
  jobDescription: string;
}

export interface GenerateChoicesRequest {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
}

export interface AnalyzeAnswerRequest {
  questionText: string;
  questionType: QuestionType;
  userAnswer: string;
  answerMode: AnswerMode;
}

export type StreamEvent =
  | { type: 'strength'; text: string }
  | { type: 'improvement'; text: string }
  | { type: 'star'; component: keyof StarScore; present: boolean; notes: string }
  | { type: 'score'; value: number }
  | { type: 'done' }
  | { type: 'error'; message: string };
