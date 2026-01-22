'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="container">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
          >
            <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
            <span className="font-[var(--font-display)] text-xl font-semibold text-[var(--gray-900)]" style={{ fontFamily: 'var(--font-display)' }}>
              SpaceLogic
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Link
              href="/demo"
              className={`btn-ghost rounded-full ${
                pathname === '/demo'
                  ? 'text-[var(--gray-900)] bg-[var(--gray-100)]'
                  : ''
              }`}
            >
              Demo
            </Link>
            <Link
              href="/app"
              className={`btn-ghost rounded-full ${
                pathname === '/app'
                  ? 'text-[var(--gray-900)] bg-[var(--gray-100)]'
                  : ''
              }`}
            >
              Dashboard
            </Link>
            <div className="w-px h-6 bg-[var(--border)] mx-2" />
            <Link href="/app" className="btn btn-primary text-sm py-2.5 px-5">
              Sign In
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
