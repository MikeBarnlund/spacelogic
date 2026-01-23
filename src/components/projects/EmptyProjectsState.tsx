import Link from 'next/link';

export default function EmptyProjectsState() {
  return (
    <div className="text-center py-16 px-4">
      {/* Icon */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--accent-muted)] border border-[var(--border-accent)] flex items-center justify-center opacity-0 animate-fade-in-up">
        <svg
          className="w-8 h-8 text-[var(--accent)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M3 7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <line x1="9" y1="14" x2="15" y2="14" />
        </svg>
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2 opacity-0 animate-fade-in-up delay-100">
        No projects yet
      </h3>
      <p className="text-[var(--text-tertiary)] mb-8 max-w-md mx-auto opacity-0 animate-fade-in-up delay-200">
        Create your first project to start generating and saving workspace scenarios for your clients.
      </p>

      {/* CTA */}
      <Link
        href="/app/projects/new"
        className="opacity-0 animate-fade-in-up delay-300 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:bg-[var(--accent-bright)] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent)]/20"
        style={{ animationFillMode: 'forwards' }}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Create Your First Project</span>
      </Link>
    </div>
  );
}
