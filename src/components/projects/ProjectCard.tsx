'use client';

import Link from 'next/link';
import { Project, formatRelativeTime, truncateText } from '@/types/project';
import { ExtractedRequirements } from '@/types/scenario';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const scenarioCount = project.scenarios?.length ?? 0;
  const extractedRequirements = project.extracted_requirements as ExtractedRequirements | null;
  const location = extractedRequirements?.location;

  return (
    <Link href={`/app/projects/${project.id}`}>
      <div
        className="card p-5 opacity-0 animate-fade-in-up cursor-pointer group h-full flex flex-col"
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: 'forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
              {project.name}
            </h3>
            {project.client_name && (
              <p className="text-sm text-[var(--text-muted)] truncate mt-0.5">
                {project.client_name}
              </p>
            )}
          </div>
          {scenarioCount > 0 && (
            <span className="ml-3 flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--border-accent)]">
              {scenarioCount} scenario{scenarioCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-[var(--text-tertiary)] mb-4 line-clamp-2">
            {truncateText(project.description, 120)}
          </p>
        )}

        {/* Spacer to push footer to bottom */}
        <div className="flex-1" />

        {/* Footer with location and timestamp */}
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
          {/* Location */}
          {location ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <svg
                className="w-3.5 h-3.5 text-[var(--accent)] flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {location}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] flex-shrink-0">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{formatRelativeTime(project.updated_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
