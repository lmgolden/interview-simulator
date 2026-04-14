import Spinner from '@/components/ui/Spinner';

interface SubmitButtonProps {
  onSubmit: () => void;
  disabled: boolean;
  isLoading: boolean;
}

export default function SubmitButton({ onSubmit, disabled, isLoading }: SubmitButtonProps) {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled || isLoading}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          Analyzing your answer…
        </>
      ) : (
        'Analyze my answer →'
      )}
    </button>
  );
}
