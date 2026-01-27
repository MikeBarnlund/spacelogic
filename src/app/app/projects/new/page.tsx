'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProjectForm } from '@/components/projects';

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
  const [error, setError] = useState<string | null>(null);

  const handleStep1Submit = (data: ProjectFormData) => {
    setProjectData(data);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!promptText.trim() || !projectData) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Step 1: Create the project first (without scenarios)
      const createResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description || null,
          client_name: projectData.client_name || null,
          prompt_text: promptText,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const createData = await createResponse.json();
      const projectId = createData.project.id;

      // Step 2: Generate scenarios for the project
      const generateResponse = await fetch(`/api/projects/${projectId}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_text: promptText }),
      });

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Failed to generate scenarios');
      }

      // Redirect to the project page
      router.push(`/app/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsGenerating(false);
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
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => setStep(1)}
                disabled={isGenerating}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-50"
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
                      <span>Creating Project...</span>
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
        )}
      </div>
    </div>
  );
}
