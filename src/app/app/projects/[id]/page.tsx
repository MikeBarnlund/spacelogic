'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Project, formatRelativeTime } from '@/types/project';
import { Scenario, ExtractedRequirements } from '@/types/scenario';
import { DeleteProjectDialog } from '@/components/projects';
import ScenarioCard from '@/components/ScenarioCard';

// Helper to detect if projection is a reduction (checks both flag and text)
function isReduction(requirements: ExtractedRequirements): boolean {
  if (requirements.is_reduction === true) return true;
  if (!requirements.growth_projection) return false;
  const text = requirements.growth_projection.toLowerCase();
  return /\b(reduction|reduce|decrease|downsize|downsizing|shrink|layoff|rif|cut)\b/.test(text);
}

export default function ProjectViewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedClientName, setEditedClientName] = useState('');
  const [editedPrompt, setEditedPrompt] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Regenerate state
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Delete state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project');
        }
        const data = await res.json();
        setProject(data.project);
        setUserDisplayName(data.userDisplayName || 'User');
        setEditedName(data.project.name);
        setEditedDescription(data.project.description || '');
        setEditedClientName(data.project.client_name || '');
        setEditedPrompt(data.project.prompt_text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSave = async () => {
    if (!project) return;

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedName.trim(),
          description: editedDescription.trim() || null,
          client_name: editedClientName.trim() || null,
          prompt_text: editedPrompt.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save changes');
      }

      const data = await res.json();
      setProject(data.project);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!project) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_text: editedPrompt.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to regenerate scenarios');
      }

      const data = await res.json();
      setProject(data.project);
      setEditedPrompt(data.project.prompt_text);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate scenarios');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }

      router.push('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleCancelEdit = () => {
    if (project) {
      setEditedName(project.name);
      setEditedDescription(project.description || '');
      setEditedClientName(project.client_name || '');
      setEditedPrompt(project.prompt_text);
    }
    setIsEditing(false);
  };

  const scenarios = (project?.scenarios as Scenario[]) || [];
  const extractedRequirements = project?.extracted_requirements as ExtractedRequirements | null;

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-6 bg-[var(--bg-secondary)] rounded w-32 mb-8" />
            <div className="h-10 bg-[var(--bg-secondary)] rounded w-64 mb-2" />
            <div className="h-5 bg-[var(--bg-secondary)] rounded w-40 mb-8" />
            <div className="card p-6 mb-8">
              <div className="h-32 bg-[var(--bg-secondary)] rounded" />
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-5">
                  <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4 mb-3" />
                  <div className="h-20 bg-[var(--bg-secondary)] rounded mb-4" />
                  <div className="h-16 bg-[var(--bg-secondary)] rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--error)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[var(--error)] mb-4">{error}</p>
            <Link href="/app" className="btn btn-secondary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) return null;

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
          <span className="text-[var(--text-secondary)] truncate max-w-[200px]">{project.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="input text-2xl font-semibold"
                  placeholder="Project name"
                />
                <input
                  type="text"
                  value={editedClientName}
                  onChange={(e) => setEditedClientName(e.target.value)}
                  className="input"
                  placeholder="Client name (optional)"
                />
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="input"
                  placeholder="Description (optional)"
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                  {project.name}
                </h1>
                {project.client_name && (
                  <p className="text-[var(--text-muted)] mt-1">{project.client_name}</p>
                )}
                {project.description && (
                  <p className="text-[var(--text-tertiary)] mt-2">{project.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mt-3">
                  <span>Created {formatRelativeTime(project.created_at)} by {userDisplayName}</span>
                  <span>·</span>
                  <span>Updated {formatRelativeTime(project.updated_at)} by {userDisplayName}</span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                  disabled={isSaving || isRegenerating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                  disabled={isSaving || isRegenerating || !editedName.trim()}
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
                    'Save Changes'
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-secondary"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="btn bg-transparent text-[var(--error)] border-[var(--error)]/30 hover:bg-[var(--error)]/10"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] text-sm">
            {error}
          </div>
        )}

        {/* Prompt section */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="icon-box w-8 h-8">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </div>
              <span className="font-medium text-[var(--text-primary)]">Requirements Prompt</span>
            </div>
            {!isEditing && (
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="btn btn-secondary text-sm"
              >
                {isRegenerating ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span>Regenerate Scenarios</span>
                  </>
                )}
              </button>
            )}
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="input min-h-[120px]"
                placeholder="Describe the workspace requirements..."
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-[var(--text-muted)]">
                  Edit the prompt and regenerate to update scenarios
                </span>
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating || !editedPrompt.trim()}
                  className="btn btn-primary text-sm"
                >
                  {isRegenerating ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Regenerating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span>Regenerate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[var(--text-tertiary)] whitespace-pre-wrap">{project.prompt_text}</p>
          )}
        </div>

        {/* Summary Card */}
        {extractedRequirements && (
          <div className="summary-card mb-8">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="icon-box w-8 h-8">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <span className="font-medium text-[var(--text-primary)]">Summary</span>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-3 gap-5 pb-5 border-b border-[var(--border)]">
              {/* Headcount */}
              <div className="flex items-center gap-3">
                <div className="icon-box w-11 h-11">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-0.5">Headcount</div>
                  <div className="text-2xl font-semibold mono text-[var(--text-primary)]">
                    {extractedRequirements.current_headcount || '—'}
                    {scenarios[0]?.attendance_metrics && extractedRequirements.growth_projection && (
                      <span className="text-base font-normal text-[var(--accent)] ml-1.5">
                        → {scenarios[0].attendance_metrics.total_headcount}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Growth/Reduction */}
              {extractedRequirements.growth_projection ? (
                <div className="flex items-center gap-3">
                  <div className="icon-box w-11 h-11 bg-[var(--accent)]/10 border-[var(--accent)]/20">
                    <svg className="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {isReduction(extractedRequirements) ? (
                        <>
                          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                          <polyline points="17 18 23 18 23 12" />
                        </>
                      ) : (
                        <>
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </>
                      )}
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">
                      {isReduction(extractedRequirements) ? 'Projected Reduction' : 'Projected Growth'}
                    </div>
                    <div className="text-lg font-semibold text-[var(--accent)] truncate">
                      {extractedRequirements.growth_projection}
                    </div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}

              {/* Location */}
              {extractedRequirements.location ? (
                <div className="flex items-center gap-3">
                  <div className="icon-box w-11 h-11">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-0.5">Location</div>
                    <div className="text-lg font-semibold text-[var(--text-primary)]">{extractedRequirements.location}</div>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Workstyle Distribution */}
            {extractedRequirements.workstyle_distribution && (
              <div className="py-5 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Workstyle Distribution</span>
                </div>

                {/* Stacked Bar with Labels */}
                <div className="flex items-center gap-4">
                  {/* Bar */}
                  <div className="flex-1 h-10 rounded-lg overflow-hidden flex bg-[var(--bg-tertiary)]">
                    {extractedRequirements.workstyle_distribution.on_site > 0 && (
                      <div
                        className="h-full flex items-center justify-center text-sm font-semibold text-white transition-all"
                        style={{
                          width: `${extractedRequirements.workstyle_distribution.on_site}%`,
                          backgroundColor: 'var(--traditional)',
                        }}
                      >
                        {extractedRequirements.workstyle_distribution.on_site >= 12 && (
                          <span>{extractedRequirements.workstyle_distribution.on_site}%</span>
                        )}
                      </div>
                    )}
                    {extractedRequirements.workstyle_distribution.hybrid > 0 && (
                      <div
                        className="h-full flex items-center justify-center text-sm font-semibold text-white transition-all"
                        style={{
                          width: `${extractedRequirements.workstyle_distribution.hybrid}%`,
                          backgroundColor: 'var(--moderate)',
                        }}
                      >
                        {extractedRequirements.workstyle_distribution.hybrid >= 12 && (
                          <span>{extractedRequirements.workstyle_distribution.hybrid}%</span>
                        )}
                      </div>
                    )}
                    {extractedRequirements.workstyle_distribution.remote > 0 && (
                      <div
                        className="h-full flex items-center justify-center text-sm font-semibold text-white transition-all"
                        style={{
                          width: `${extractedRequirements.workstyle_distribution.remote}%`,
                          backgroundColor: 'var(--progressive)',
                        }}
                      >
                        {extractedRequirements.workstyle_distribution.remote >= 12 && (
                          <span>{extractedRequirements.workstyle_distribution.remote}%</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-5 mt-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[var(--traditional)]"></span>
                    <span className="text-xs text-[var(--text-muted)]">On-site (4-5 days)</span>
                    {extractedRequirements.workstyle_distribution.on_site < 12 && (
                      <span className="text-xs font-medium text-[var(--text-secondary)] mono">{extractedRequirements.workstyle_distribution.on_site}%</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[var(--moderate)]"></span>
                    <span className="text-xs text-[var(--text-muted)]">Hybrid (1-3 days)</span>
                    {extractedRequirements.workstyle_distribution.hybrid < 12 && (
                      <span className="text-xs font-medium text-[var(--text-secondary)] mono">{extractedRequirements.workstyle_distribution.hybrid}%</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-[var(--progressive)]"></span>
                    <span className="text-xs text-[var(--text-muted)]">Remote (&lt;1 day)</span>
                    {extractedRequirements.workstyle_distribution.remote < 12 && (
                      <span className="text-xs font-medium text-[var(--text-secondary)] mono">{extractedRequirements.workstyle_distribution.remote}%</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Office Attendance */}
            {scenarios[0]?.attendance_metrics && (
              <div className="pt-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Office Attendance</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Projected Headcount */}
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                    <div className="text-2xl font-semibold mono text-[var(--text-primary)]">
                      {scenarios[0].attendance_metrics.total_headcount}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      Projected Headcount
                    </div>
                  </div>

                  {/* Average Daily */}
                  <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
                    <div className="text-2xl font-semibold mono text-[var(--text-primary)]">
                      {Math.round(scenarios[0].attendance_metrics.average_daily_attendance)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      Average Daily
                    </div>
                  </div>

                  {/* Peak Attendance */}
                  <div className="p-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)] text-center">
                    <div className="text-2xl font-semibold mono text-[var(--accent)]">
                      {Math.round(scenarios[0].attendance_metrics.peak_attendance)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] mt-1">
                      Peak (Tue-Wed-Thu)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scenarios */}
        {scenarios.length > 0 ? (
          <>
            <div className="flex items-center gap-2 mb-5">
              <div className="icon-box w-8 h-8">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span className="font-medium text-[var(--text-primary)]">Scenarios</span>
              <span className="text-sm text-[var(--text-muted)]">({scenarios.length})</span>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {scenarios.map((scenario, index) => (
                <ScenarioCard
                  key={index}
                  scenario={scenario}
                  index={index}
                  projectId={project.id}
                  kitOverrides={project.kit_overrides?.[scenario.scenario_type] || null}
                />
              ))}
            </div>

            <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
              Space calculated from peak attendance · Costs shown as annual estimates
            </p>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <p className="text-[var(--text-tertiary)] mb-4">No scenarios generated yet</p>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="btn btn-primary"
            >
              {isRegenerating ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                'Generate Scenarios'
              )}
            </button>
          </div>
        )}

        {/* Delete Dialog */}
        <DeleteProjectDialog
          isOpen={showDeleteDialog}
          projectName={project.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
