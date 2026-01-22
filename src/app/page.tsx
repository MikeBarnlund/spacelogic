import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section pt-32 md:pt-40 pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="badge mb-6 opacity-0 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
              <span>AI-Powered Space Planning</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 opacity-0 animate-fade-in-up delay-100">
              Office space scenarios.
              <br />
              <span className="text-[var(--primary)]">In minutes, not hours.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-[22px] text-[var(--gray-500)] leading-relaxed mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up delay-200">
              AI-powered space planning and financial modeling for CRE brokers.
              Generate professional proposals in real-time, right in your client meetings.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
              <Link href="/demo" className="btn btn-primary px-8">
                Try Demo
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/app" className="btn btn-secondary px-8">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-[var(--border)] bg-[var(--gray-50)]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: '8-15', unit: 'hrs', label: 'Saved per client' },
              { value: '<10', unit: 'sec', label: 'To generate scenarios' },
              { value: '3-5', unit: '', label: 'Scenarios per query' },
              { value: '$299', unit: '/mo', label: 'Unlimited access' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-[var(--gray-900)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                  <span className="text-[var(--primary)] text-xl md:text-2xl">{stat.unit}</span>
                </div>
                <p className="text-sm text-[var(--gray-500)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="mb-4">Built for CRE Professionals</h2>
            <p className="text-lg text-[var(--gray-500)] max-w-xl mx-auto">
              Everything you need to analyze space requirements and close deals faster.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                ),
                title: 'Natural Language Input',
                description: 'Describe needs in plain English. Our AI extracts headcount, budget, and preferences to generate optimized scenarios.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                ),
                title: 'Side-by-Side Comparison',
                description: 'Compare 3-5 scenarios with full financial breakdowns. Help clients visualize tradeoffs clearly.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                ),
                title: 'Professional Exports',
                description: 'Generate client-ready PDFs, Word docs, and Excel models with your branding.',
              },
            ].map((feature, i) => (
              <div key={i} className="card p-8">
                <div className="w-12 h-12 rounded-xl bg-[var(--gray-100)] text-[var(--primary)] flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="mb-3">{feature.title}</h3>
                <p className="text-[var(--gray-500)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-[var(--gray-900)] text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-white mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-[var(--gray-400)] text-lg mb-8">
              Join brokers who are closing deals faster with AI-powered scenario generation.
              Try the demo now — no signup required.
            </p>
            <Link href="/demo" className="btn bg-white text-[var(--gray-900)] hover:bg-[var(--gray-100)] px-8">
              Try Demo Free
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[var(--primary)] rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <span className="text-sm text-[var(--gray-500)]">SpaceLogic</span>
            </div>
            <p className="text-sm text-[var(--gray-400)]">
              AI-powered office space planning for CRE professionals
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
