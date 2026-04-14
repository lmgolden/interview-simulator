interface StrengthsListProps {
  strengths: string[];
  isStreaming: boolean;
}

export default function StrengthsList({ strengths, isStreaming }: StrengthsListProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-emerald-700 flex items-center gap-1.5 mb-3">
        <span className="text-base">✓</span> Strengths
      </h3>
      {strengths.length === 0 && isStreaming ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
