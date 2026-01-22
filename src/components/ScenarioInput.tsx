'use client';

import { useState } from 'react';
import { Scenario, GenerateScenariosResponse, ExtractedRequirements } from '@/types/scenario';
import ScenarioCard from './ScenarioCard';

export default function ScenarioInput() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [extractedRequirements, setExtractedRequirements] = useState<ExtractedRequirements | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsGenerating(true);
    setError(null);
    setScenarios([]);
    setExtractedRequirements(null);

    try {
      const response = await fetch('/api/generate-scenarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate scenarios');
      }

      const data: GenerateScenariosResponse = await response.json();
      setScenarios(data.scenarios);
      setExtractedRequirements(data.extracted_requirements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const examples = [
    "100 employees - 30 in office full-time, 50 hybrid (2-3 days), 20 remote. Growing 20% over 2 years. Downtown Austin.",
    "Tech startup, 60 engineers mostly hybrid, need collaboration spaces. 15% work fully remote. San Francisco.",
    "Law firm with 25 attorneys (all in-office 5 days) plus 15 support staff hybrid. Chicago Loop.",
  ];

  const handleReset = () => {
    setScenarios([]);
    setExtractedRequirements(null);
    setInput('');
    setError(null);
  };

  return (
    <div className="w-full">
      {/* Show input form when no scenarios */}
      {scenarios.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          {/* Input card */}
          <div className="card p-6 md:p-8">
            <label
              htmlFor="scenario-input"
              className="block text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider"
            >
              Describe Requirements
            </label>

            <textarea
              id="scenario-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Include headcount, workstyle (on-site, hybrid, remote percentages), growth plans, and location..."
              className="input min-h-[140px] mb-5"
              disabled={isGenerating}
            />

            {error && (
              <div className="mb-5 p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--text-muted)] mono">
                {input.length > 0 ? `${input.length} chars` : 'Natural language'}
              </span>

              <button
                onClick={handleGenerate}
                disabled={!input.trim() || isGenerating}
                className={`btn ${
                  input.trim() && !isGenerating
                    ? 'btn-primary'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
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
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Scenarios</span>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Examples section */}
          <div className="mt-12">
            <p className="text-center text-sm text-[var(--text-muted)] mb-5 uppercase tracking-wider">
              Try an example
            </p>

            <div className="space-y-3">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  disabled={isGenerating}
                  className="w-full text-left p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-md bg-[var(--accent-muted)] border border-[var(--border-accent)] text-[var(--accent)] text-xs font-medium flex items-center justify-center group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] transition-all mono">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                      {example}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Helper text */}
          <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
            Our AI analyzes workstyle patterns to calculate peak attendance and generate optimized scenarios
          </p>
        </div>
      ) : (
        /* Show scenarios when generated */
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="badge mb-3">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Analysis Complete</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Office Space Options</h1>
              <p className="text-[var(--text-tertiary)] mt-2 max-w-xl">
                Based on your inputs, here are three configuration options for your office space needs.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="btn btn-secondary text-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              New Analysis
            </button>
          </div>

          {/* Summary Card */}
          {extractedRequirements && (
            <div className="summary-card mb-8">
              {/* Section header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="icon-box w-8 h-8">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <span className="font-medium text-[var(--text-primary)]">Summary</span>
              </div>

              {/* Headcount metrics */}
              <div className="grid grid-cols-3 gap-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="icon-box">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">Current Headcount</div>
                    <div className="text-2xl font-semibold mono">{extractedRequirements.current_headcount || '—'}</div>
                  </div>
                </div>

                {extractedRequirements.growth_projection && (
                  <div className="flex items-center gap-4">
                    <div className="icon-box">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-1">Projected Growth</div>
                      <div className="text-2xl font-semibold">
                        <span className="text-[var(--accent)]">{extractedRequirements.growth_projection}</span>
                      </div>
                    </div>
                  </div>
                )}

                {extractedRequirements.location && (
                  <div className="flex items-center gap-4">
                    <div className="icon-box">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] mb-1">Location</div>
                      <div className="text-lg font-medium">{extractedRequirements.location}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Workstyle Distribution */}
              {extractedRequirements.workstyle_distribution && (
                <div className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Aggregate Workstyle Distribution</span>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-xs text-[var(--text-muted)] mb-2">On-site (4-5 days)</div>
                      <div className="text-3xl font-semibold mono">{extractedRequirements.workstyle_distribution.on_site}%</div>
                    </div>
                    <div className="text-center border-x border-[var(--border)]">
                      <div className="text-xs text-[var(--text-muted)] mb-2">Hybrid (1-3 days)</div>
                      <div className="text-3xl font-semibold mono">{extractedRequirements.workstyle_distribution.hybrid}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-[var(--text-muted)] mb-2">Remote (&lt;1 day)</div>
                      <div className="text-3xl font-semibold mono">{extractedRequirements.workstyle_distribution.remote}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Scenarios grid */}
          <div className="grid md:grid-cols-3 gap-5">
            {scenarios.map((scenario, index) => (
              <ScenarioCard key={index} scenario={scenario} index={index} />
            ))}
          </div>

          {/* Disclaimer */}
          <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
            Space calculated from peak attendance · Costs shown as annual estimates
          </p>
        </div>
      )}
    </div>
  );
}
