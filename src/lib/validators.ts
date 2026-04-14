import { z } from 'zod';

export const GenerateQuestionSchema = z.object({
  questionType: z.enum(['behavioral', 'open-ended', 'situational']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  jobDescription: z.string().max(3000),
});

export const GenerateChoicesSchema = z.object({
  questionText: z.string().min(10).max(500),
  questionType: z.enum(['behavioral', 'open-ended', 'situational']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export const AnalyzeAnswerSchema = z.object({
  questionText: z.string().min(10).max(500),
  questionType: z.enum(['behavioral', 'open-ended', 'situational']),
  userAnswer: z.string().min(5).max(4000),
  answerMode: z.enum(['free-form', 'multiple-choice']),
});
