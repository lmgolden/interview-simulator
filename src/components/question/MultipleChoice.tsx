import type { MultipleChoiceOption } from '@/types';
import Spinner from '@/components/ui/Spinner';

const letters = ['A', 'B', 'C', 'D'];

interface MultipleChoiceProps {
  choices: MultipleChoiceOption[] | null;
  selected: string | null;
  onChange: (id: string) => void;
  isLoading: boolean;
}

export default function MultipleChoice({ choices, selected, onChange, isLoading }: MultipleChoiceProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 h-40 text-gray-400">
        <Spinner />
        <span className="text-sm">Generating options…</span>
      </div>
    );
  }

  if (!choices) return null;

  return (
    <div className="space-y-2">
      {choices.map((choice, i) => (
        <button
          key={choice.id}
          onClick={() => onChange(choice.id)}
          className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
            selected === choice.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'
          }`}
        >
          <span
            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              selected === choice.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {letters[i]}
          </span>
          <span className={`text-sm leading-relaxed ${selected === choice.id ? 'text-blue-900' : 'text-gray-700'}`}>
            {choice.text}
          </span>
        </button>
      ))}
    </div>
  );
}
