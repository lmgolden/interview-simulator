const MIN_WORDS = 10;

interface FreeFormAnswerProps {
  value: string;
  onChange: (value: string) => void;
  questionType: string;
}

export default function FreeFormAnswer({ value, onChange, questionType }: FreeFormAnswerProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const placeholder =
    questionType === 'behavioral'
      ? 'Start with the situation: "In my previous role at…"'
      : 'Walk through your thinking step by step…';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={8}
        className="w-full text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none leading-relaxed"
      />
      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {wordCount < MIN_WORDS && wordCount > 0
            ? `${MIN_WORDS - wordCount} more words to unlock submit`
            : wordCount > 0
            ? `${wordCount} words`
            : ''}
        </p>
        {questionType === 'behavioral' && (
          <p className="text-xs text-gray-400">S · T · A · R</p>
        )}
      </div>
    </div>
  );
}
