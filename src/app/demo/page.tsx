import ScenarioInput from '@/components/ScenarioInput';

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="badge mb-6">
              <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Interactive Demo</span>
            </div>

            <h1 className="mb-4">Generate Space Scenarios</h1>

            <p className="text-lg text-[var(--gray-500)]">
              Describe your client&apos;s office space needs in natural language.
              Our AI generates 3-5 optimized scenarios in seconds.
            </p>
          </div>

          <ScenarioInput />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="container">
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                ),
                title: 'Real-time Results',
                description: 'Scenarios in under 10 seconds',
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
                title: 'Financial Modeling',
                description: 'Full cost projections included',
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                ),
                title: 'Compare Options',
                description: 'Side-by-side analysis',
              },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-[var(--gray-50)] border border-[var(--border)]">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-[var(--border)] text-[var(--primary)] flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-base font-medium text-[var(--gray-900)] mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--gray-500)]">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-2xl bg-[var(--gray-900)] text-center">
            <h2 className="text-white text-2xl md:text-3xl mb-3">Ready for the full experience?</h2>
            <p className="text-[var(--gray-400)] mb-8 max-w-lg mx-auto">
              Unlock unlimited scenarios, local market data, professional exports, and more with SpaceLogic Pro.
            </p>
            <button className="btn bg-white text-[var(--gray-900)] hover:bg-[var(--gray-100)]">
              Start Free Trial
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
