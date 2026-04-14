'use client';

import { useReducer, useCallback } from 'react';
import type {
  AppState,
  AppView,
  AnswerMode,
  QuestionConfig,
  QuestionType,
  Difficulty,
  MultipleChoiceOption,
  StarScore,
  StreamEvent,
} from '@/types';

// ─── Initial State ────────────────────────────────────────────────────────────

const initialConfig: QuestionConfig = {
  questionType: 'behavioral',
  difficulty: 'medium',
  jobDescription: '',
};

const initialState: AppState = {
  view: 'landing',
  config: initialConfig,
  question: null,
  choices: null,
  answerMode: 'free-form',
  userAnswer: '',
  selectedChoice: null,
  feedback: null,
  isLoadingQuestion: false,
  isLoadingChoices: false,
  isAnalyzing: false,
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_CONFIG'; config: Partial<QuestionConfig> }
  | { type: 'SET_VIEW'; view: AppView }
  | { type: 'QUESTION_LOADING' }
  | { type: 'QUESTION_LOADED'; question: string }
  | { type: 'QUESTION_ERROR'; error: string }
  | { type: 'SET_ANSWER_MODE'; mode: AnswerMode }
  | { type: 'CHOICES_LOADING' }
  | { type: 'CHOICES_LOADED'; choices: MultipleChoiceOption[] }
  | { type: 'CHOICES_ERROR'; error: string }
  | { type: 'SET_USER_ANSWER'; answer: string }
  | { type: 'SET_SELECTED_CHOICE'; id: string }
  | { type: 'ANALYSIS_START' }
  | { type: 'FEEDBACK_EVENT'; event: StreamEvent }
  | { type: 'DISMISS_ERROR' }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.config } };

    case 'SET_VIEW':
      return { ...state, view: action.view };

    case 'QUESTION_LOADING':
      return { ...state, isLoadingQuestion: true, error: null, question: null, feedback: null };

    case 'QUESTION_LOADED': {
      const q = {
        id: crypto.randomUUID(),
        text: action.question,
        type: state.config.questionType,
        difficulty: state.config.difficulty,
        jobDescription: state.config.jobDescription,
      };
      return {
        ...state,
        isLoadingQuestion: false,
        question: q,
        view: 'question',
        choices: null,
        answerMode: 'free-form',
        userAnswer: '',
        selectedChoice: null,
        feedback: null,
      };
    }

    case 'QUESTION_ERROR':
      return { ...state, isLoadingQuestion: false, error: action.error };

    case 'SET_ANSWER_MODE':
      return { ...state, answerMode: action.mode, choices: null };

    case 'CHOICES_LOADING':
      return { ...state, isLoadingChoices: true, error: null };

    case 'CHOICES_LOADED':
      return { ...state, isLoadingChoices: false, choices: action.choices };

    case 'CHOICES_ERROR':
      return { ...state, isLoadingChoices: false, error: action.error };

    case 'SET_USER_ANSWER':
      return { ...state, userAnswer: action.answer };

    case 'SET_SELECTED_CHOICE':
      return { ...state, selectedChoice: action.id };

    case 'ANALYSIS_START':
      return {
        ...state,
        isAnalyzing: true,
        view: 'results',
        feedback: { strengths: [], improvements: [], star: null, overallScore: null },
        error: null,
      };

    case 'FEEDBACK_EVENT': {
      const ev = action.event;
      if (!state.feedback) return state;

      if (ev.type === 'strength') {
        return {
          ...state,
          feedback: { ...state.feedback, strengths: [...state.feedback.strengths, ev.text] },
        };
      }
      if (ev.type === 'improvement') {
        return {
          ...state,
          feedback: { ...state.feedback, improvements: [...state.feedback.improvements, ev.text] },
        };
      }
      if (ev.type === 'star') {
        const prev = state.feedback.star ?? ({} as StarScore);
        return {
          ...state,
          feedback: {
            ...state.feedback,
            star: {
              ...prev,
              [ev.component]: { present: ev.present, notes: ev.notes },
            } as StarScore,
          },
        };
      }
      if (ev.type === 'score') {
        return { ...state, feedback: { ...state.feedback, overallScore: ev.value } };
      }
      if (ev.type === 'done') {
        return { ...state, isAnalyzing: false };
      }
      if (ev.type === 'error') {
        return { ...state, isAnalyzing: false, error: ev.message };
      }
      return state;
    }

    case 'DISMISS_ERROR':
      return { ...state, error: null };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

// ─── Shuffle helper (Fisher-Yates, seeded by question id) ────────────────────

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  for (let i = result.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) | 0;
    const j = Math.abs(h) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useQuestionFlow() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setQuestionType = useCallback((questionType: QuestionType) => {
    dispatch({ type: 'SET_CONFIG', config: { questionType } });
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch({ type: 'SET_CONFIG', config: { difficulty } });
  }, []);

  const setJobDescription = useCallback((jobDescription: string) => {
    dispatch({ type: 'SET_CONFIG', config: { jobDescription } });
  }, []);

  const generateQuestion = useCallback(async (config: QuestionConfig) => {
    dispatch({ type: 'QUESTION_LOADING' });
    try {
      const res = await fetch('/api/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Failed to generate question');
      const data = (await res.json()) as { question: string };
      dispatch({ type: 'QUESTION_LOADED', question: data.question });
    } catch (err) {
      dispatch({ type: 'QUESTION_ERROR', error: (err as Error).message });
    }
  }, []);

  const setAnswerMode = useCallback(
    async (mode: AnswerMode) => {
      dispatch({ type: 'SET_ANSWER_MODE', mode });
      if (mode === 'multiple-choice' && state.question) {
        dispatch({ type: 'CHOICES_LOADING' });
        try {
          const res = await fetch('/api/generate-choices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questionText: state.question.text,
              questionType: state.question.type,
              difficulty: state.question.difficulty,
            }),
          });
          if (!res.ok) throw new Error('Failed to generate choices');
          const data = (await res.json()) as { choices: MultipleChoiceOption[] };
          const shuffled = seededShuffle(data.choices, state.question.id);
          dispatch({ type: 'CHOICES_LOADED', choices: shuffled });
        } catch (err) {
          dispatch({ type: 'CHOICES_ERROR', error: (err as Error).message });
        }
      }
    },
    [state.question]
  );

  const setUserAnswer = useCallback((answer: string) => {
    dispatch({ type: 'SET_USER_ANSWER', answer });
  }, []);

  const setSelectedChoice = useCallback((id: string) => {
    dispatch({ type: 'SET_SELECTED_CHOICE', id });
  }, []);

  const submitAnswer = useCallback(async () => {
    if (!state.question) return;

    const answerText =
      state.answerMode === 'multiple-choice'
        ? state.choices?.find((c) => c.id === state.selectedChoice)?.text ?? ''
        : state.userAnswer;

    dispatch({ type: 'ANALYSIS_START' });

    try {
      const res = await fetch('/api/analyze-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: state.question.text,
          questionType: state.question.type,
          userAnswer: answerText,
          answerMode: state.answerMode,
        }),
      });

      if (!res.ok || !res.body) throw new Error('Failed to analyze answer');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as StreamEvent;
            dispatch({ type: 'FEEDBACK_EVENT', event });
          } catch {
            // skip malformed lines
          }
        }
      }

      // flush remaining buffer
      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer) as StreamEvent;
          dispatch({ type: 'FEEDBACK_EVENT', event });
        } catch {
          // ignore
        }
      }

      dispatch({ type: 'FEEDBACK_EVENT', event: { type: 'done' } });
    } catch (err) {
      dispatch({ type: 'FEEDBACK_EVENT', event: { type: 'error', message: (err as Error).message } });
    }
  }, [state.question, state.answerMode, state.userAnswer, state.selectedChoice, state.choices]);

  const dismissError = useCallback(() => {
    dispatch({ type: 'DISMISS_ERROR' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    state,
    actions: {
      setQuestionType,
      setDifficulty,
      setJobDescription,
      generateQuestion,
      setAnswerMode,
      setUserAnswer,
      setSelectedChoice,
      submitAnswer,
      dismissError,
      reset,
    },
  };
}
