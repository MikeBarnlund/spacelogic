'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          >
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[var(--bg-primary)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="text-base font-semibold text-[var(--text-primary)] tracking-tight">
              SpaceLogic
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Link
              href="/demo"
              className={`btn-ghost ${
                pathname === '/demo'
                  ? 'text-[var(--text-primary)] bg-[rgba(255,255,255,0.08)]'
                  : ''
              }`}
            >
              Demo
            </Link>
            <Link
              href="/app"
              className={`btn-ghost ${
                pathname === '/app'
                  ? 'text-[var(--text-primary)] bg-[rgba(255,255,255,0.08)]'
                  : ''
              }`}
            >
              Dashboard
            </Link>
            <div className="w-px h-5 bg-[var(--border)] mx-2" />
            <Link href="/app" className="btn btn-primary text-sm py-2 px-4">
              Sign In
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
