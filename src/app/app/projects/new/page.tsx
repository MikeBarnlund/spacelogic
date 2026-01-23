'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scenario, ExtractedRequirements, GenerateScenariosResponse } from '@/types/scenario';
import { ProjectForm } from '@/components/projects';
import ScenarioCard from '@/components/ScenarioCard';

// Helper to detect if projection is a reduction (checks both flag and text)
function isReduction(requirements: ExtractedRequirements): boolean {
  if (requirements.is_reduction === true) return true;
  if (!requirements.growth_projection) return false;
  const text = requirements.growth_projection.toLowerCase();
  return /\b(reduction|reduce|decrease|downsize|downsizing|shrink|layoff|rif|cut)\b/.test(text);
}

interface ProjectFormData {
  name: string;
  description: string;
  client_name: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [projectData, setProjectData] = useState<ProjectFormData | null>(null);
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [extractedRequirements, setExtractedRequirements] = useState<ExtractedRequirements | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStep1Submit = (data: ProjectFormData) => {
    setProjectData(data);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    setError(null);
    setScenarios([]);
    setExtractedRequirements(null);

    try {
      const response = await fetch('/api/generate-scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: promptText }),
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

  const handleSaveProject = async () => {
    if (!projectData || !promptText.trim() || scenarios.length === 0) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description || null,
          client_name: projectData.client_name || null,
          prompt_text: promptText,
          scenarios,
          extracted_requirements: extractedRequirements,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save project');
      }

      const data = await response.json();
      router.push(`/app/projects/${data.project.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
      setIsSaving(false);
    }
  };

  const examples = [
    "100 employees - 30 in office full-time, 50 hybrid (2-3 days), 20 remote. Growing 20% over 2 years. Downtown Austin.",
    "Tech startup, 60 engineers mostly hybrid, need collaboration spaces. 15% work fully remote. San Francisco.",
    "Law firm with 25 attorneys (all in-office 5 days) plus 15 support staff hybrid. Chicago Loop.",
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
          <Link href="/app" className="hover:text-[var(--text-secondary)] transition-colors">
            Projects
          </Link>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-[var(--text-secondary)]">New Project</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
            <span className={`w-7 h-7 rounded-full text-sm font-medium flex items-center justify-center ${step === 1 ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)] border border-[var(--border)]'}`}>
              {step > 1 ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : '1'}
            </span>
            <span className="text-sm font-medium">Project Details</span>
          </div>
          <div className="w-8 h-px bg-[var(--border)]" />
          <div className={`flex items-center gap-2 ${step === 2 ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
            <span className={`w-7 h-7 rounded-full text-sm font-medium flex items-center justify-center ${step === 2 ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'bg-[var(--bg-secondary)] border border-[var(--border)]'}`}>
              2
            </span>
            <span className="text-sm font-medium">Generate Scenarios</span>
          </div>
        </div>

        {/* Step 1: Project details */}
        {step === 1 && (
          <div className="max-w-lg">
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
              Create New Project
            </h1>
            <p className="text-[var(--text-tertiary)] mb-8">
              Enter the basic details for your project. You can update these later.
            </p>

            <div className="card p-6">
              <ProjectForm onSubmit={handleStep1Submit} submitLabel="Continue to Scenarios" />
            </div>
          </div>
        )}

        {/* Step 2: Generate scenarios */}
        {step === 2 && (
          <div className="max-w-6xl">
            {scenarios.length === 0 ? (
              /* Prompt input */
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                    {projectData?.name}
                  </h1>
                </div>
                {projectData?.client_name && (
                  <p className="text-[var(--text-muted)] mb-6 ml-8">{projectData.client_name}</p>
                )}

                <div className="card p-6 md:p-8 mt-6">
                  <label
                    htmlFor="prompt-input"
                    className="block text-sm font-medium text-[var(--text-muted)] mb-3 uppercase tracking-wider"
                  >
                    Describe Requirements
                  </label>

                  <textarea
                    id="prompt-input"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
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
                      {promptText.length > 0 ? `${promptText.length} chars` : 'Natural language'}
                    </span>

                    <button
                      onClick={handleGenerate}
                      disabled={!promptText.trim() || isGenerating}
                      className={`btn ${
                        promptText.trim() && !isGenerating
                          ? 'btn-primary'
                          : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)] cursor-not-allowed'
                      }`}
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <span>Generate Scenarios</span>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Examples */}
                <div className="mt-10">
                  <p className="text-center text-sm text-[var(--text-muted)] mb-5 uppercase tracking-wider">
                    Try an example
                  </p>

                  <div className="space-y-3">
                    {examples.map((example, i) => (
                      <button
                        key={i}
                        onClick={() => setPromptText(example)}
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
              </div>
            ) : (
              /* Show generated scenarios */
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="badge mb-3">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>Analysis Complete</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                      {projectData?.name}
                    </h1>
                    {projectData?.client_name && (
                      <p className="text-[var(--text-muted)] mt-1">{projectData.client_name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setScenarios([]);
                        setExtractedRequirements(null);
                      }}
                      className="btn btn-secondary text-sm"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      Regenerate
                    </button>
                    <button
                      onClick={handleSaveProject}
                      disabled={isSaving}
                      className="btn btn-primary"
                    >
                      {isSaving ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                          </svg>
                          <span>Save Project</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm">
                    {error}
                  </div>
                )}

                {/* Summary Card */}
                {extractedRequirements && (
                  <div className="summary-card mb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="icon-box w-8 h-8">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M3 9h18M9 21V9" />
                        </svg>
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">Summary</span>
                    </div>

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
        )}
      </div>
    </div>
  );
}
