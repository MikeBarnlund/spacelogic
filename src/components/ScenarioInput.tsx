'use client';

import { useState } from 'react';

export default function ScenarioInput() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  const examples = [
    "45 employees, growing to 60 in 2 years, need mix of private offices and open space, budget ~$400K/year",
    "Tech startup, 30 engineers, hybrid work model, need collaboration spaces and 2 large conference rooms",
    "Law firm with 15 attorneys needing private offices, plus 10 support staff in open area",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input card */}
      <div className="card p-6 md:p-8">
        <label
          htmlFor="scenario-input"
          className="block text-sm font-medium text-[var(--gray-500)] mb-3"
        >
          Describe your client&apos;s needs
        </label>

        <textarea
          id="scenario-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your client's office space needs..."
          className="input min-h-[180px] mb-4"
        />

        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--gray-400)]">
            {input.length > 0 ? `${input.length} characters` : 'Natural language input'}
          </span>

          <button
            onClick={handleGenerate}
            disabled={!input.trim() || isGenerating}
            className={`btn ${
              input.trim() && !isGenerating
                ? 'btn-primary'
                : 'bg-[var(--gray-200)] text-[var(--gray-400)] cursor-not-allowed'
            }`}
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Generate Scenarios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Examples section */}
      <div className="mt-10">
        <p className="text-center text-sm text-[var(--gray-400)] mb-4">
          Try an example
        </p>

        <div className="space-y-3">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => setInput(example)}
              className="w-full text-left p-4 rounded-xl border border-[var(--border)] bg-[var(--gray-50)] hover:bg-white hover:border-[var(--gray-300)] transition-all group"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--gray-200)] text-[var(--gray-500)] text-xs font-medium flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  {i + 1}
                </span>
                <p className="text-[15px] text-[var(--gray-600)] leading-relaxed group-hover:text-[var(--gray-900)] transition-colors">
                  {example}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-8 text-center text-sm text-[var(--gray-400)]">
        Our AI analyzes your input and generates 3-5 optimized scenarios instantly
      </p>
    </div>
  );
}
