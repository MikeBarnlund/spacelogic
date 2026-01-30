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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
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
          <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-280px)]">
            {/* Project header with back button */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep(1)}
                disabled={isGenerating}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)] transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                  {projectData?.name}
                </h1>
                {projectData?.client_name && (
                  <p className="text-sm text-[var(--text-muted)]">{projectData.client_name}</p>
                )}
              </div>
            </div>

            {/* Main content area - centered vertically */}
            <div className="flex-1 flex flex-col justify-center">
              {/* AI Avatar and Welcome */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-bright)] mb-5 shadow-lg" style={{ boxShadow: '0 0 40px rgba(45, 212, 191, 0.3)' }}>
                  <SparkleIcon className="w-7 h-7 text-[var(--bg-primary)]" />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  What are your space requirements?
                </h2>

                <p className="text-[var(--text-tertiary)] max-w-lg mx-auto">
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
                      onClick={() => setPromptText(example.prompt)}
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
                    id="prompt-input"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
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
                    disabled={!promptText.trim() || isGenerating}
                    className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                      promptText.trim() && !isGenerating
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
        )}
      </div>
    </div>
  );
}
