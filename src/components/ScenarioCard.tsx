import Link from 'next/link';
import { Scenario } from '@/types/scenario';
import { CATEGORY_CONFIG, SpaceCategory } from '@/types/kit-of-parts';

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  projectId?: string;
}

const scenarioConfig = {
  traditional: {
    color: 'var(--traditional)',
    bg: 'var(--traditional-bg)',
    label: 'Traditional',
  },
  moderate: {
    color: 'var(--moderate)',
    bg: 'var(--moderate-bg)',
    label: 'Moderate',
  },
  progressive: {
    color: 'var(--progressive)',
    bg: 'var(--progressive-bg)',
    label: 'Progressive',
  },
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Category bar component for displaying space distribution
function CategoryBar({
  category,
  percentage
}: {
  category: SpaceCategory;
  percentage: number;
}) {
  const config = CATEGORY_CONFIG[category];

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 text-xs text-[var(--text-muted)]">{config.label}</div>
      <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: config.color,
          }}
        />
      </div>
      <div className="w-10 text-xs text-[var(--text-secondary)] text-right mono">
        {percentage.toFixed(0)}%
      </div>
    </div>
  );
}

export default function ScenarioCard({ scenario, index, projectId }: ScenarioCardProps) {
  const config = scenarioConfig[scenario.scenario_type] || scenarioConfig.moderate;
  const hasKitOfParts = !!scenario.kit_of_parts;
  const kit = scenario.kit_of_parts;

  return (
    <div
      className="card p-5 opacity-0 animate-fade-in-up flex flex-col"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium mb-2"
            style={{
              backgroundColor: config.bg,
              color: config.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {config.label}
          </span>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {scenario.scenario_name}
          </h3>
        </div>
      </div>

      {/* Cost Range - Primary display */}
      <div className="mb-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
        <div className="text-xs text-[var(--text-muted)] mb-1 uppercase tracking-wider">Annual Cost</div>
        <div className="text-2xl font-semibold text-[var(--accent)] mono">
          {formatCompactCurrency(scenario.annual_cost_range.mid)}
        </div>
        <div className="text-sm text-[var(--text-muted)] mt-1 mono">
          {formatCompactCurrency(scenario.annual_cost_range.low)} – {formatCompactCurrency(scenario.annual_cost_range.high)}
        </div>
      </div>

      {/* Standards badges */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-sm font-medium text-[var(--text-primary)] mono">{scenario.sqft_per_person}</div>
          <div className="text-xs text-[var(--text-muted)]">sqft/person</div>
        </div>
        <div className="flex-1 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
          <div className="text-sm font-medium text-[var(--text-primary)] mono">{scenario.seats_per_person}</div>
          <div className="text-xs text-[var(--text-muted)]">seats/person</div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-[var(--border)]">
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-0.5">Total Space</div>
          <div className="text-sm font-medium text-[var(--text-primary)] mono">
            {formatNumber(scenario.total_sqft)} sqft
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--text-muted)] mb-0.5">Cost/Employee</div>
          <div className="text-sm font-medium text-[var(--text-primary)] mono">
            {formatCompactCurrency(scenario.cost_per_employee_range.mid)}
          </div>
          <div className="text-xs text-[var(--text-muted)] mono">
            {formatCompactCurrency(scenario.cost_per_employee_range.low)}–{formatCompactCurrency(scenario.cost_per_employee_range.high)}
          </div>
        </div>
      </div>

      {/* Kit of Parts - Category Distribution */}
      {hasKitOfParts && kit ? (
        <div className="mb-4">
          <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Space Distribution</div>
          <div className="space-y-2">
            <CategoryBar category="concentration" percentage={kit.category_summary.concentration.percentage} />
            <CategoryBar category="collaboration" percentage={kit.category_summary.collaboration.percentage} />
            <CategoryBar category="socialization" percentage={kit.category_summary.socialization.percentage} />
            <CategoryBar category="amenity" percentage={kit.category_summary.amenity.percentage} />
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">{kit.total_spaces}</div>
              <div className="text-xs text-[var(--text-muted)]">Spaces</div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">{kit.total_seats}</div>
              <div className="text-xs text-[var(--text-muted)]">Seats</div>
            </div>
            <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
              <div className="text-sm font-medium text-[var(--accent)] mono">{kit.workpoints}</div>
              <div className="text-xs text-[var(--text-muted)]">Workpoints</div>
            </div>
          </div>

          {/* View Kit of Parts Link */}
          {projectId && (
            <Link
              href={`/app/projects/${projectId}/kit-of-parts/${scenario.scenario_type}`}
              className="flex items-center justify-center gap-2 mt-4 py-2 px-3 rounded-lg bg-[var(--accent-muted)] border border-[var(--border-accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              View Kit of Parts
            </Link>
          )}
        </div>
      ) : (
        // Fallback to legacy layout mix
        <div className="mb-4">
          <div className="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Layout Mix</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="icon-box w-7 h-7">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M9 3v18" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)] mono">{scenario.layout_mix.private_offices}</div>
                <div className="text-xs text-[var(--text-muted)]">Offices</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="icon-box w-7 h-7">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="6" width="6" height="12" rx="1" />
                  <rect x="9" y="6" width="6" height="12" rx="1" />
                  <rect x="16" y="6" width="6" height="12" rx="1" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)] mono">{scenario.layout_mix.open_desks}</div>
                <div className="text-xs text-[var(--text-muted)]">Desks</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="icon-box w-7 h-7">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)] mono">{scenario.layout_mix.conference_rooms}</div>
                <div className="text-xs text-[var(--text-muted)]">Conf.</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="icon-box w-7 h-7">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-[var(--text-primary)] mono">{formatNumber(scenario.layout_mix.common_areas)} sqft</div>
                <div className="text-xs text-[var(--text-muted)]">Common</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pros and Cons */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-[var(--success)] mb-2 uppercase tracking-wider">Pros</div>
          <ul className="space-y-1.5">
            {scenario.pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-tertiary)]">
                <svg className="w-3 h-3 text-[var(--success)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-medium text-[var(--warning)] mb-2 uppercase tracking-wider">Cons</div>
          <ul className="space-y-1.5">
            {scenario.cons.map((con, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--text-tertiary)]">
                <svg className="w-3 h-3 text-[var(--warning)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
