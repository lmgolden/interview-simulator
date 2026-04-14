import type { StarScore } from '@/types';

const components: { key: keyof StarScore; label: string; full: string }[] = [
  { key: 'situation', label: 'S', full: 'Situation' },
  { key: 'task', label: 'T', full: 'Task' },
  { key: 'action', label: 'A', full: 'Action' },
  { key: 'result', label: 'R', full: 'Result' },
];

interface StarFrameworkProps {
  star: StarScore;
}

export default function StarFramework({ star }: StarFrameworkProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">STAR Framework</h3>
      <div className="space-y-2">
        {components.map(({ key, label, full }) => {
          const val = star[key];
          const present = val?.present ?? false;
          return (
            <div
              key={key}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                present ? 'border-emerald-200 bg-emerald-50' : 'border-red-100 bg-red-50'
              }`}
            >
              <div
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  present ? 'bg-emerald-500 text-white' : 'bg-red-400 text-white'
                }`}
              >
                {label}
              </div>
              <div>
                <p className={`text-xs font-semibold mb-0.5 ${present ? 'text-emerald-700' : 'text-red-600'}`}>
                  {full}
                  <span className="ml-1.5 font-normal">{present ? '✓' : '✗'}</span>
                </p>
                {val?.notes && (
                  <p className="text-xs text-gray-600 leading-relaxed">{val.notes}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
