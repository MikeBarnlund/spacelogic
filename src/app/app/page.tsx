import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function AppPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/signin');
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen flex items-center justify-center py-20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          {/* Welcome Icon */}
          <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[var(--accent)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </div>

          <h1 className="text-2xl md:text-3xl mb-3">
            Welcome, {displayName}
          </h1>
          <p className="text-[var(--gray-500)] mb-8">
            Your SpaceLogic dashboard is ready. Start creating projects and generating professional exports.
          </p>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <a
              href="/demo"
              className="p-4 rounded-xl bg-[var(--gray-100)] border border-[var(--border)] hover:border-[var(--accent)]/30 transition-colors group"
            >
              <div className="w-10 h-10 mb-3 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[var(--accent)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">
                Try the Demo
              </h3>
              <p className="text-sm text-[var(--gray-400)]">
                Explore the interactive demo
              </p>
            </a>

            <div className="p-4 rounded-xl bg-[var(--gray-100)] border border-[var(--border)] opacity-60">
              <div className="w-10 h-10 mb-3 rounded-lg bg-[var(--gray-200)] flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-[var(--gray-400)]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <h3 className="font-medium text-[var(--text-primary)] mb-1">
                New Project
              </h3>
              <p className="text-sm text-[var(--gray-400)]">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
