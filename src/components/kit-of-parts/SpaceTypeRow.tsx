import { CalculatedSpace } from '@/types/kit-of-parts';

interface SpaceTypeRowProps {
  space: CalculatedSpace;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function SpaceTypeRow({ space }: SpaceTypeRowProps) {
  return (
    <div className="flex items-center py-3 border-b border-[var(--border)] last:border-0">
      {/* Space Name */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
          {space.space_type_name}
        </div>
        <div className="text-xs text-[var(--text-muted)]">
          {space.sqft_per_unit} sqft each · {space.capacity_per_unit} {space.capacity_per_unit === 1 ? 'seat' : 'seats'}
        </div>
      </div>

      {/* Count */}
      <div className="w-16 text-center">
        <div className="text-sm font-medium text-[var(--text-primary)] mono">
          {space.count}
        </div>
        <div className="text-xs text-[var(--text-muted)]">qty</div>
      </div>

      {/* Total Sqft */}
      <div className="w-24 text-right">
        <div className="text-sm font-medium text-[var(--text-primary)] mono">
          {formatNumber(space.total_sqft)}
        </div>
        <div className="text-xs text-[var(--text-muted)]">sqft</div>
      </div>

      {/* Total Capacity */}
      <div className="w-20 text-right">
        <div className="text-sm font-medium text-[var(--text-primary)] mono">
          {space.total_capacity}
        </div>
        <div className="text-xs text-[var(--text-muted)]">seats</div>
      </div>
    </div>
  );
}
