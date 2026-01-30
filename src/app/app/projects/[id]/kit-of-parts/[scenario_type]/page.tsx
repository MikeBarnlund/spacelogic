'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Project } from '@/types/project';
import { Scenario } from '@/types/scenario';
import { WorkstylePreset, SpaceCategory } from '@/types/kit-of-parts';
import {
  WorkpointsCard,
  CategorySection,
  TotalsSummary,
} from '@/components/kit-of-parts';
import Tooltip from '@/components/ui/Tooltip';
import { SCENARIO_TYPE_TOOLTIPS } from '@/constants/tooltips';

const scenarioConfig: Record<WorkstylePreset, { label: string; color: string; bg: string }> = {
  traditional: {
    label: 'Traditional',
    color: 'var(--traditional)',
    bg: 'var(--traditional-bg)',
  },
  moderate: {
    label: 'Moderate',
    color: 'var(--moderate)',
    bg: 'var(--moderate-bg)',
  },
  progressive: {
    label: 'Progressive',
    color: 'var(--progressive)',
    bg: 'var(--progressive-bg)',
  },
};

export default function KitOfPartsPage() {
  const params = useParams<{ id: string; scenario_type: string }>();
  const { id, scenario_type } = params;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate scenario_type
  const validScenarioTypes: WorkstylePreset[] = ['traditional', 'moderate', 'progressive'];
  if (!validScenarioTypes.includes(scenario_type as WorkstylePreset)) {
    notFound();
  }

  const workstylePreset = scenario_type as WorkstylePreset;
  const config = scenarioConfig[workstylePreset];

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-6 bg-[var(--bg-secondary)] rounded w-64 mb-8" />
            <div className="h-10 bg-[var(--bg-secondary)] rounded w-80 mb-8" />
            <div className="card p-6 mb-6">
              <div className="h-40 bg-[var(--bg-secondary)] rounded" />
            </div>
            <div className="card p-6">
              <div className="h-60 bg-[var(--bg-secondary)] rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
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
            <p className="text-[var(--error)] mb-4">{error || 'Project not found'}</p>
            <Link href="/app" className="btn btn-secondary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find the matching scenario
  const scenarios = (project.scenarios as Scenario[]) || [];
  const scenario = scenarios.find(s => s.scenario_type === workstylePreset);

  if (!scenario || !scenario.kit_of_parts) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--warning)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[var(--text-tertiary)] mb-4">
              Kit of Parts data not available for this scenario.
              <br />
              Try regenerating the scenarios.
            </p>
            <Link href={`/app/projects/${id}`} className="btn btn-secondary">
              Back to Project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const kit = scenario.kit_of_parts;
  const headcount = scenario.attendance_metrics.total_headcount;
  const categories: SpaceCategory[] = ['concentration', 'collaboration', 'socialization', 'amenity'];

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
          <Link href="/app" className="hover:text-[var(--text-secondary)] transition-colors">
            Projects
          </Link>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link
            href={`/app/projects/${id}`}
            className="hover:text-[var(--text-secondary)] transition-colors truncate max-w-[150px]"
          >
            {project.name}
          </Link>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-[var(--text-secondary)]">Kit of Parts</span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ml-1"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
            {config.label}
          </span>
          <Tooltip
            heading={SCENARIO_TYPE_TOOLTIPS[workstylePreset].heading}
            content={SCENARIO_TYPE_TOOLTIPS[workstylePreset].content}
            position="bottom"
          />
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-box w-12 h-12">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Kit of Parts</h1>
              <p className="text-[var(--text-muted)]">{scenario.scenario_name}</p>
            </div>
          </div>
        </div>

        {/* Workpoints Card */}
        <div className="mb-6">
          <WorkpointsCard
            kit={kit}
            headcount={headcount}
            workstylePreset={workstylePreset}
          />
        </div>

        {/* Category Sections */}
        <div className="space-y-6 mb-6">
          {categories.map((category) => (
            <CategorySection
              key={category}
              category={category}
              spaces={kit.spaces}
            />
          ))}
        </div>

        {/* Totals Summary */}
        <TotalsSummary kit={kit} />

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/app/projects/${id}`}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Project
          </Link>
        </div>
      </div>
    </div>
  );
}
