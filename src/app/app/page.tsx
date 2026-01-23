import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProjectList } from '@/components/projects';

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen py-12">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Welcome back, {displayName}
            </h1>
            <p className="text-[var(--text-muted)] mt-1">
              Manage your workspace scenario projects
            </p>
          </div>
          <Link
            href="/app/projects/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:bg-[var(--accent-bright)] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent)]/20"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>New Project</span>
          </Link>
        </div>

        {/* Projects List */}
        <ProjectList />
      </div>
    </div>
  );
}
