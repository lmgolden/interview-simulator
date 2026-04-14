import type { AnswerMode } from '@/types';

interface AnswerModeToggleProps {
  mode: AnswerMode;
  onChange: (mode: AnswerMode) => void;
  disabled?: boolean;
}

export default function AnswerModeToggle({ mode, onChange, disabled }: AnswerModeToggleProps) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
      {(['free-form', 'multiple-choice'] as AnswerMode[]).map((m) => (
        <button
          key={m}
          onClick={() => !disabled && onChange(m)}
          disabled={disabled}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
            mode === m
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {m === 'free-form' ? 'Write answer' : 'Multiple choice'}
        </button>
      ))}
    </div>
  );
}
