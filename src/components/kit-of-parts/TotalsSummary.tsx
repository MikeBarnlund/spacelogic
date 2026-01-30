import { KitOfParts, CATEGORY_CONFIG, SpaceCategory } from '@/types/kit-of-parts';
import CategoryBar from './CategoryBar';
import Tooltip from '@/components/ui/Tooltip';
import { METRIC_TOOLTIPS } from '@/constants/tooltips';

// Space factors from generation.ts
const CIRCULATION_FACTOR = 0.35;
const CORE_FACTOR = 0.10;

interface TotalsSummaryProps {
  kit: KitOfParts;
  headcount: number;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function TotalsSummary({ kit, headcount }: TotalsSummaryProps) {
  const categories: SpaceCategory[] = ['concentration', 'collaboration', 'socialization', 'amenity'];

  // Calculate seats per category from spaces
  const getCategorySeats = (category: SpaceCategory): number => {
    return kit.spaces
      .filter(space => space.category === category)
      .reduce((sum, space) => sum + space.total_capacity, 0);
  };

  // Calculate sqft values
  const usableSqft = kit.total_usable_sqft;
  const circulationSqft = Math.round(usableSqft * CIRCULATION_FACTOR);
  const usablePlusCirculation = usableSqft + circulationSqft;
  const coreSqft = Math.round(usablePlusCirculation * CORE_FACTOR);
  const grossSqft = usablePlusCirculation + coreSqft;

  // Calculate seats per person metrics
  const totalSeatsPerPerson = kit.total_seats / headcount;

  // Effective seats = concentration seats + 50% of collaboration seats
  const concentrationSeats = getCategorySeats('concentration');
  const collaborationSeats = getCategorySeats('collaboration');
  const effectiveSeats = concentrationSeats + (collaborationSeats * 0.5);
  const effectiveSeatsPerPerson = effectiveSeats / headcount;

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
          const categorySeats = getCategorySeats(category);

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
                {formatNumber(summary.total_sqft)} <span className="text-sm font-normal text-[var(--text-muted)]">sqft</span>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {categorySeats} seats · {summary.percentage.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Metrics - Headcount and Seats per Person */}
      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-[var(--border)]">
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)] mono">
            {formatNumber(headcount)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Headcount</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-2xl font-semibold text-[var(--text-primary)] mono">
              {totalSeatsPerPerson.toFixed(2)}
            </span>
            <Tooltip
              heading={METRIC_TOOLTIPS.totalSeatsPerPerson.heading}
              content={METRIC_TOOLTIPS.totalSeatsPerPerson.content}
              position="top"
            />
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Seats / Person</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)] text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-2xl font-semibold text-[var(--accent)] mono">
              {effectiveSeatsPerPerson.toFixed(2)}
            </span>
            <Tooltip
              heading={METRIC_TOOLTIPS.effectiveSeatsPerPerson.heading}
              content={METRIC_TOOLTIPS.effectiveSeatsPerPerson.content}
              position="top"
            />
          </div>
          <div className="text-sm text-[var(--text-muted)]">Effective Seats / Person</div>
        </div>
      </div>

      {/* Space Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)] mono">
            {kit.total_spaces}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Spaces</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-2xl font-semibold text-[var(--text-primary)] mono">
            {kit.total_seats}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Total Seats</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-xl font-semibold text-[var(--text-primary)] mono">
            {formatNumber(usablePlusCirculation)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Usable Sqft</div>
          <div className="text-xs text-[var(--text-muted)]">(incl. circulation)</div>
        </div>
        <div className="p-4 rounded-xl bg-[var(--accent-muted)] border border-[var(--border-accent)] text-center">
          <div className="text-xl font-semibold text-[var(--accent)] mono">
            {formatNumber(grossSqft)}
          </div>
          <div className="text-sm text-[var(--text-muted)]">Gross Sqft</div>
          <div className="text-xs text-[var(--text-muted)]">(incl. core)</div>
        </div>
      </div>
    </div>
  );
}
