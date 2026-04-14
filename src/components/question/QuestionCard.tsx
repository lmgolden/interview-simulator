import type { GeneratedQuestion } from '@/types';
import Badge from '@/components/ui/Badge';

interface QuestionCardProps {
  question: GeneratedQuestion;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Badge questionType={question.type} />
        <Badge difficulty={question.difficulty} />
      </div>
      <p className="text-xl font-semibold text-gray-900 leading-snug">{question.text}</p>
      {question.type === 'behavioral' && (
        <p className="mt-3 text-sm text-gray-400">
          Tip: Structure your answer using <span className="font-medium text-gray-500">Situation → Task → Action → Result</span>
        </p>
      )}
    </div>
  );
}
