import { KitOfParts, CATEGORY_CONFIG, SpaceCategory } from '@/types/kit-of-parts';
import CategoryBar from './CategoryBar';

interface TotalsSummaryProps {
  kit: KitOfParts;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function TotalsSummary({ kit }: TotalsSummaryProps) {
  const categories: SpaceCategory[] = ['concentration', 'collaboration', 'socialization', 'amenity'];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-box w-10 h-10">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Totals Summary</h3>
          <p className="text-sm text-[var(--text-muted)]">Overall space allocation</p>
        </div>
      </div>

      {/* Category Breakdown Bars */}
      <div className="space-y-3 mb-6">
        {categories.map((category) => (
          <CategoryBar
            key={category}
            category={category}
            percentage={kit.category_summary[category].percentage}
            size="lg"
          />
        ))}
      </div>

      {/* Category Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-[var(--border)]">
        {categories.map((category) => {
          const config = CATEGORY_CONFIG[category];
          const summary = kit.category_summary[category];

          return (
            <div key={category} className="text-center">
              <div
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium mb-2"
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                {config.label}
              </div>
              <div className="text-lg font-semibold text-[var(--text-primary)] mono">
                {formatNumber(summary.total_sqft)}
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {summary.count} spaces · {summary.percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)] mono">
            {kit.total_spaces}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Spaces</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)] mono">
            {formatNumber(kit.total_usable_sqft)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Usable Sqft</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)] text-center">
          <div className="text-2xl font-semibold text-[var(--accent)] mono">
            {kit.total_seats}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Seats</div>
        </div>
      </div>
    </div>
  );
}
