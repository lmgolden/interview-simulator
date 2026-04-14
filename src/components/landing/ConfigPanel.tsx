import type { QuestionConfig, QuestionType, Difficulty } from '@/types';
import Spinner from '@/components/ui/Spinner';

const questionTypes: { value: QuestionType; label: string; description: string }[] = [
  { value: 'behavioral', label: 'Behavioral', description: 'STAR method stories from your past' },
  { value: 'open-ended', label: 'Case', description: 'Structured thinking on business scenarios' },
  { value: 'situational', label: 'Situational', description: 'Hypothetical judgment calls' },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

interface ConfigPanelProps {
  config: QuestionConfig;
  onTypeChange: (t: QuestionType) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export default function ConfigPanel({
  config,
  onTypeChange,
  onDifficultyChange,
  onGenerate,
  isLoading,
}: ConfigPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Question Type */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Question type</p>
        <div className="grid grid-cols-3 gap-2">
          {questionTypes.map((qt) => (
            <button
              key={qt.value}
              onClick={() => onTypeChange(qt.value)}
              className={`text-left p-3 rounded-xl border transition-all ${
                config.questionType === qt.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{qt.label}</div>
              <div className="text-xs text-gray-400 mt-0.5 leading-tight">{qt.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Difficulty</p>
        <div className="flex gap-2">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => onDifficultyChange(d.value)}
              className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-all ${
                config.difficulty === d.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            Generating question…
          </>
        ) : (
          'Generate question'
        )}
      </button>
    </div>
  );
}
