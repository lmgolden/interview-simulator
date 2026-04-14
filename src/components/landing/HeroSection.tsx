interface HeroSectionProps {
  onStart: () => void;
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <div className="text-center pt-16 pb-12">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
        AI-Powered Interview Practice
      </div>
      <h1 className="text-5xl font-bold text-gray-900 tracking-tight mb-4">
        Ace your next interview
      </h1>
      <p className="text-xl text-gray-500 max-w-lg mx-auto mb-10">
        Practice behavioral, case, and situational questions with instant AI feedback tailored to your answers.
      </p>
      <button
        onClick={onStart}
        className="bg-gray-900 hover:bg-gray-700 text-white text-base font-semibold px-8 py-3 rounded-xl transition-colors"
      >
        Start practicing →
      </button>
    </div>
  );
}
