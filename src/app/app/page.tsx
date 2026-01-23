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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <a
              href="/demo"
              className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-medium hover:bg-[var(--accent-hover)] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[var(--accent)]/20"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Try the Demo</span>
              <svg
                className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>

            <div
              className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--gray-100)] border border-[var(--border)] text-[var(--gray-400)] cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="font-medium">New Project</span>
              <span className="text-xs bg-[var(--gray-200)] px-2 py-0.5 rounded-full">Soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
