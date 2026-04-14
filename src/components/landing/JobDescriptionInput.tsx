const MAX_CHARS = 3000;

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-700">Job description</p>
          <p className="text-xs text-gray-400 mt-0.5">Optional — tailors questions to a specific role</p>
        </div>
        <span className={`text-xs ${value.length > MAX_CHARS * 0.9 ? 'text-orange-500' : 'text-gray-400'}`}>
          {value.length} / {MAX_CHARS}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Paste the job description, or describe the role and key responsibilities…"
        rows={5}
        className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />
    </div>
  );
}
