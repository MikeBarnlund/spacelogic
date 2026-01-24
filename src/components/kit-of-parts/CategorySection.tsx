import { CalculatedSpace, SpaceCategory, CATEGORY_CONFIG } from '@/types/kit-of-parts';
import SpaceTypeRow from './SpaceTypeRow';

interface CategorySectionProps {
  category: SpaceCategory;
  spaces: CalculatedSpace[];
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function CategorySection({
  category,
  spaces,
}: CategorySectionProps) {
  const config = CATEGORY_CONFIG[category];

  // Filter spaces for this category
  const categorySpaces = spaces.filter(s => s.category === category);

  if (categorySpaces.length === 0) {
    return null;
  }

  // Calculate category totals
  const categorySqft = categorySpaces.reduce((sum, s) => sum + s.total_sqft, 0);
  const categorySeats = categorySpaces.reduce((sum, s) => sum + s.total_capacity, 0);
  const categoryCount = categorySpaces.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="card overflow-hidden">
      {/* Category Header */}
      <div
        className="px-5 py-4 border-b border-[var(--border)]"
        style={{ backgroundColor: config.bgColor }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <h3 className="text-base font-semibold" style={{ color: config.color }}>
              {config.label}
            </h3>
            <span className="text-sm text-[var(--text-muted)]">
              ({categorySpaces.length} {categorySpaces.length === 1 ? 'type' : 'types'})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {categoryCount}
              </div>
              <div className="text-xs text-[var(--text-muted)]">spaces</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {formatNumber(categorySqft)}
              </div>
              <div className="text-xs text-[var(--text-muted)]">sqft</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-[var(--text-primary)] mono">
                {categorySeats}
              </div>
              <div className="text-xs text-[var(--text-muted)]">seats</div>
            </div>
          </div>
        </div>
      </div>

      {/* Space Types List */}
      <div className="px-5">
        {categorySpaces.map((space) => (
          <SpaceTypeRow key={space.space_type_key} space={space} />
        ))}
      </div>
    </div>
  );
}
