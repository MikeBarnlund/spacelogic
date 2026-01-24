import { CATEGORY_CONFIG, SpaceCategory } from '@/types/kit-of-parts';

interface CategoryBarProps {
  category: SpaceCategory;
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CategoryBar({
  category,
  percentage,
  showLabel = true,
  size = 'md'
}: CategoryBarProps) {
  const config = CATEGORY_CONFIG[category];

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const labelWidths = {
    sm: 'w-16',
    md: 'w-20',
    lg: 'w-24',
  };

  return (
    <div className="flex items-center gap-2">
      {showLabel && (
        <div className={`${labelWidths[size]} text-xs text-[var(--text-muted)]`}>
          {config.label}
        </div>
      )}
      <div className={`flex-1 ${heights[size]} bg-[var(--bg-tertiary)] rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-300`}
          style={{
            width: `${Math.max(percentage, 0)}%`,
            backgroundColor: config.color,
          }}
        />
      </div>
      <div className="w-12 text-xs text-[var(--text-secondary)] text-right mono">
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
}
