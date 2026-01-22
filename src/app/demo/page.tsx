import ScenarioInput from '@/components/ScenarioInput';

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container">
          <ScenarioInput />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                stat: '<10s',
                title: 'Real-time Results',
                description: 'Instant scenario generation',
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
                stat: '3',
                title: 'Cost Tiers',
                description: 'Low, mid, high projections',
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                ),
                stat: '3',
                title: 'Workspace Types',
                description: 'Traditional to progressive',
              },
            ].map((feature, i) => (
              <div key={i} className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors">
                <div className="icon-box mb-4">
                  {feature.icon}
                </div>
                <div className="text-2xl font-semibold text-[var(--accent)] mb-1 mono">{feature.stat}</div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto p-8 md:p-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
            <p className="text-[var(--accent)] text-xs uppercase tracking-widest mb-3 font-medium">
              Full Experience
            </p>
            <h2 className="text-[var(--text-primary)] mb-3">
              Ready to transform your workflow?
            </h2>
            <p className="text-[var(--text-tertiary)] mb-8 max-w-md mx-auto">
              Unlock unlimited scenarios, local market data, professional exports, and advanced financial modeling.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button className="btn btn-primary">
                Start Free Trial
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="btn btn-secondary">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
