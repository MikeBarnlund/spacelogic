'use client';

import { useState } from 'react';
import { Scenario, GenerateScenariosResponse, ExtractedRequirements } from '@/types/scenario';
import ScenarioCard from './ScenarioCard';

// Helper to detect if projection is a reduction (checks both flag and text)
function isReduction(requirements: ExtractedRequirements): boolean {
  if (requirements.is_reduction === true) return true;
  if (!requirements.growth_projection) return false;
  const text = requirements.growth_projection.toLowerCase();
  return /\b(reduction|reduce|decrease|downsize|downsizing|shrink|layoff|rif|cut)\b/.test(text);
}

// Sparkle icon component for AI branding
function SparkleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}

// Example prompts with labels and descriptions
const EXAMPLE_PROMPTS = [
  {
    label: "Corporate Office",
    icon: "building",
    description: "Mixed workstyles with growth",
    prompt: "100 employees - 30 in office full-time, 50 hybrid (2-3 days), 20 remote. Growing 20% over 2 years. Downtown Austin.",
  },
  {
    label: "Tech Startup",
    icon: "code",
    description: "Hybrid-first engineering team",
    prompt: "Tech startup, 60 engineers mostly hybrid, need collaboration spaces. 15% work fully remote. San Francisco.",
  },
  {
    label: "Law Firm",
    icon: "scale",
    description: "Traditional in-office culture",
    prompt: "Law firm with 25 attorneys (all in-office 5 days) plus 15 support staff hybrid. Chicago Loop.",
  },
];

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleReset = () => {
    setScenarios([]);
    setExtractedRequirements(null);
    setInput('');
    setError(null);
  };

  // Icon renderer for example cards
  const renderIcon = (icon: string) => {
    switch (icon) {
      case 'building':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
            <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
          </svg>
        );
      case 'code':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        );
      case 'scale':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18M3 7l3-4 3 4M3 7v4a3 3 0 0 0 6 0V7M15 7l3-4 3 4M15 7v4a3 3 0 0 0 6 0V7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Show input form when no scenarios */}
      {scenarios.length === 0 ? (
        <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-200px)]">
          {/* Main content area - centered vertically */}
          <div className="flex-1 flex flex-col justify-center">
            {/* AI Avatar and Welcome */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bright)] mb-6 shadow-lg" style={{ boxShadow: '0 0 40px rgba(45, 212, 191, 0.3)' }}>
                <SparkleIcon className="w-8 h-8 text-[var(--bg-primary)]" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                What are your space requirements?
              </h1>

              <p className="text-lg text-[var(--text-tertiary)] max-w-xl mx-auto">
                Tell me about your team and I&apos;ll generate optimized office scenarios.
                Include details like headcount, work patterns, and location.
              </p>
            </div>

            {/* Example prompts - Prominent cards */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span className="text-sm font-medium text-[var(--accent)]">Try an example to see what works</span>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {EXAMPLE_PROMPTS.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(example.prompt)}
                    disabled={isGenerating}
                    className="group relative text-left p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {/* Label badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--accent-muted)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)] transition-all">
                        {renderIcon(example.icon)}
                      </span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{example.label}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[var(--text-muted)] mb-3">{example.description}</p>

                    {/* Prompt preview */}
                    <p className="text-sm text-[var(--text-tertiary)] leading-relaxed line-clamp-3 group-hover:text-[var(--text-secondary)] transition-colors">
                      &ldquo;{example.prompt}&rdquo;
                    </p>

                    {/* Click hint */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat-style input area - Fixed at bottom */}
          <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent">
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              {/* Input container with AI indicator */}
              <div className="flex items-start gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_var(--accent-muted)] transition-all">
                {/* AI indicator */}
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--accent-muted)] border border-[var(--border-accent)] mt-1">
                  <SparkleIcon className="w-4 h-4 text-[var(--accent)]" />
                </div>

                {/* Textarea */}
                <textarea
                  id="scenario-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your team: headcount, workstyles (on-site/hybrid/remote), growth plans, location..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] min-h-[60px] max-h-[160px]"
                  rows={2}
                  disabled={isGenerating}
                  style={{ lineHeight: '1.5' }}
                />

                {/* Send button */}
                <button
                  onClick={handleGenerate}
                  disabled={!input.trim() || isGenerating}
                  className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                    input.trim() && !isGenerating
                      ? 'bg-[var(--accent)] text-[var(--bg-primary)] hover:bg-[var(--accent-bright)] shadow-lg'
                      : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Helper text */}
              <div className="flex items-center justify-between mt-3 px-1">
                <span className="text-xs text-[var(--text-muted)]">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-tertiary)] font-mono text-[10px]">Enter</kbd> to send
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  AI analyzes workstyle patterns to calculate peak attendance
                </span>
              </div>
            </div>
          </div>
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
              <h1 className="text-2xl md:text-3xl font-bold">Scenario Comparison</h1>
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
                      <div className="text-xs text-[var(--text-muted)] mb-1">
                        {isReduction(extractedRequirements) ? 'Projected Reduction' : 'Projected Growth'}
                      </div>
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

              {/* Office Attendance - Calculated from Workstyle */}
              {extractedRequirements.workstyle_distribution && scenarios[0]?.attendance_metrics && (
                <div className="mt-6 pt-6 border-t border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Office Attendance</span>
                    <span className="text-xs text-[var(--text-muted)]">(calculated from workstyle)</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)]">
                    <div className="grid grid-cols-3 gap-6 text-center">
                      {/* Total Headcount */}
                      <div>
                        <div className="text-2xl font-semibold mono text-[var(--text-primary)]">
                          {scenarios[0].attendance_metrics.total_headcount}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Total Headcount
                          {extractedRequirements.growth_projection && (
                            <span className="block text-[var(--accent)]">
                              {isReduction(extractedRequirements) ? '(after reduction)' : '(after growth)'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Average Daily */}
                      <div className="border-x border-[var(--border-accent)]">
                        <div className="text-2xl font-semibold mono text-[var(--text-primary)]">
                          {Math.round(scenarios[0].attendance_metrics.average_daily_attendance)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Average Daily
                          <span className="block">(typical day)</span>
                        </div>
                      </div>

                      {/* Peak */}
                      <div>
                        <div className="text-2xl font-semibold mono text-[var(--accent)]">
                          {Math.round(scenarios[0].attendance_metrics.peak_attendance)}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Peak Attendance
                          <span className="block">(Tue-Wed-Thu)</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculation formula - subtle */}
                    <div className="mt-4 pt-3 border-t border-[var(--border-accent)] text-xs text-[var(--text-muted)] text-center">
                      Peak = Avg Daily × 1.25 buffer for mid-week clustering
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
