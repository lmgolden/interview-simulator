import type { AnswerFeedback, GeneratedQuestion } from '@/types';
import StrengthsList from './StrengthsList';
import ImprovementsList from './ImprovementsList';
import StarFramework from './StarFramework';
import Spinner from '@/components/ui/Spinner';

interface FeedbackCardProps {
  feedback: AnswerFeedback;
  question: GeneratedQuestion;
  isStreaming: boolean;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 8 ? 'text-emerald-600' : score >= 6 ? 'text-blue-600' : score >= 4 ? 'text-amber-600' : 'text-red-500';
  return (
    <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 ${color.replace('text-', 'border-')} bg-white shrink-0`}>
      <span className={`text-3xl font-bold ${color}`}>{score}</span>
      <span className="text-xs text-gray-400">/10</span>
    </div>
  );
}

export default function FeedbackCard({ feedback, question, isStreaming }: FeedbackCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Feedback</h2>
          {isStreaming && (
            <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-400">
              <Spinner size="sm" />
              Analyzing your answer…
            </div>
          )}
        </div>
        {feedback.overallScore !== null ? (
          <ScoreRing score={feedback.overallScore} />
        ) : (
          isStreaming && (
            <div className="w-20 h-20 rounded-full border-4 border-gray-100 flex items-center justify-center">
              <Spinner />
            </div>
          )
        )}
      </div>

      {/* Strengths */}
      <StrengthsList strengths={feedback.strengths} isStreaming={isStreaming} />

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Improvements */}
      <ImprovementsList improvements={feedback.improvements} isStreaming={isStreaming} />

      {/* STAR (behavioral only) */}
      {(feedback.star || (isStreaming && question.type === 'behavioral')) && (
        <>
          <hr className="border-gray-100" />
          {feedback.star ? (
            <StarFramework star={feedback.star} />
          ) : (
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
