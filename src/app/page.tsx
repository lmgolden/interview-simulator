'use client';

import { useRef } from 'react';
import { useQuestionFlow } from '@/hooks/useQuestionFlow';

import HeroSection from '@/components/landing/HeroSection';
import ConfigPanel from '@/components/landing/ConfigPanel';
import JobDescriptionInput from '@/components/landing/JobDescriptionInput';
import ErrorBanner from '@/components/ui/ErrorBanner';

import QuestionCard from '@/components/question/QuestionCard';
import AnswerModeToggle from '@/components/question/AnswerModeToggle';
import FreeFormAnswer from '@/components/question/FreeFormAnswer';
import MultipleChoice from '@/components/question/MultipleChoice';
import SubmitButton from '@/components/question/SubmitButton';
import Badge from '@/components/ui/Badge';

import FeedbackCard from '@/components/results/FeedbackCard';
import TryAgainButton from '@/components/results/TryAgainButton';

export default function Home() {
  const { state, actions } = useQuestionFlow();
  const configRef = useRef<HTMLDivElement>(null);

  const canSubmitFreeForm =
    state.answerMode === 'free-form' &&
    state.userAnswer.trim().split(/\s+/).filter(Boolean).length >= 10;
  const canSubmitMC =
    state.answerMode === 'multiple-choice' && state.selectedChoice !== null;
  const canSubmit = canSubmitFreeForm || canSubmitMC;

  const handleStart = () => {
    configRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── Landing View ──────────────────────────────────────────────────────────
  if (state.view === 'landing') {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 pb-20">
          <HeroSection onStart={handleStart} />

          {state.error && (
            <div className="mb-4">
              <ErrorBanner message={state.error} onDismiss={actions.dismissError} />
            </div>
          )}

          <div ref={configRef} className="space-y-4">
            <ConfigPanel
              config={state.config}
              onTypeChange={actions.setQuestionType}
              onDifficultyChange={actions.setDifficulty}
              onGenerate={() => actions.generateQuestion(state.config)}
              isLoading={state.isLoadingQuestion}
            />
            <JobDescriptionInput
              value={state.config.jobDescription}
              onChange={actions.setJobDescription}
            />
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-10">
            {['STAR framework scoring', 'Streaming AI feedback', 'Multiple choice mode', 'Job description tailoring'].map((f) => (
              <span key={f} className="text-xs text-gray-400 bg-white border border-gray-200 px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ─── Question View ─────────────────────────────────────────────────────────
  if (state.view === 'question' && state.question) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          {/* Back */}
          <button
            onClick={actions.reset}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            ← Back to settings
          </button>

          {state.error && (
            <ErrorBanner message={state.error} onDismiss={actions.dismissError} />
          )}

          <QuestionCard question={state.question} />

          <div className="flex items-center justify-between">
            <AnswerModeToggle
              mode={state.answerMode}
              onChange={actions.setAnswerMode}
              disabled={state.isLoadingChoices}
            />
            <span className="text-xs text-gray-400">
              {state.answerMode === 'free-form' ? 'Min. 10 words' : 'Pick the best answer'}
            </span>
          </div>

          {state.answerMode === 'free-form' ? (
            <FreeFormAnswer
              value={state.userAnswer}
              onChange={actions.setUserAnswer}
              questionType={state.question.type}
            />
          ) : (
            <MultipleChoice
              choices={state.choices}
              selected={state.selectedChoice}
              onChange={actions.setSelectedChoice}
              isLoading={state.isLoadingChoices}
            />
          )}

          <SubmitButton
            onSubmit={actions.submitAnswer}
            disabled={!canSubmit}
            isLoading={false}
          />
        </div>
      </main>
    );
  }

  // ─── Results View ──────────────────────────────────────────────────────────
  if (state.view === 'results' && state.question && state.feedback) {
    const displayAnswer =
      state.answerMode === 'multiple-choice'
        ? state.choices?.find((c) => c.id === state.selectedChoice)?.text
        : state.userAnswer;

    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Results</h1>
            <div className="flex items-center gap-2">
              <Badge questionType={state.question.type} />
              <Badge difficulty={state.question.difficulty} />
            </div>
          </div>

          {state.error && (
            <ErrorBanner message={state.error} onDismiss={actions.dismissError} />
          )}

          {/* Question recap */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Question</p>
            <p className="text-sm text-gray-700 leading-relaxed">{state.question.text}</p>
          </div>

          {/* Answer recap */}
          {displayAnswer && (
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Your answer</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{displayAnswer}</p>
            </div>
          )}

          <FeedbackCard
            feedback={state.feedback}
            question={state.question}
            isStreaming={state.isAnalyzing}
          />

          {!state.isAnalyzing && <TryAgainButton onReset={actions.reset} />}
        </div>
      </main>
    );
  }

  return null;
}
