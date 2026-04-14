import type { Difficulty, QuestionType } from '@/types';

const difficultyStyles: Record<Difficulty, string> = {
  easy: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-50 text-blue-700',
  hard: 'bg-orange-50 text-orange-700',
};

const typeLabels: Record<QuestionType, string> = {
  behavioral: 'Behavioral',
  'open-ended': 'Case',
  situational: 'Situational',
};

interface BadgeProps {
  difficulty?: Difficulty;
  questionType?: QuestionType;
}

export default function Badge({ difficulty, questionType }: BadgeProps) {
  if (difficulty) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyStyles[difficulty]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  }
  if (questionType) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
        {typeLabels[questionType]}
      </span>
    );
  }
  return null;
}
