interface TryAgainButtonProps {
  onReset: () => void;
}

export default function TryAgainButton({ onReset }: TryAgainButtonProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onReset}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Try another question →
      </button>
      <button
        onClick={onReset}
        className="flex-1 border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-colors"
      >
        Change settings
      </button>
    </div>
  );
}
