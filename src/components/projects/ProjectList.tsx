'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectCard from './ProjectCard';
import EmptyProjectsState from './EmptyProjectsState';

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="card p-5 animate-pulse"
          >
            <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4 mb-3" />
            <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2 mb-4" />
            <div className="h-16 bg-[var(--bg-secondary)] rounded mb-4" />
            <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--warning-muted)] border border-[var(--warning)]/30 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-[var(--warning)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-[var(--error)] mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-secondary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return <EmptyProjectsState />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
