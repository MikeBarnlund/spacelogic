import { KitOfParts, WorkstylePreset, WORKSTYLE_RATIOS } from '@/types/kit-of-parts';

interface WorkpointsCardProps {
  kit: KitOfParts;
  headcount: number;
  workstylePreset: WorkstylePreset;
}

export default function WorkpointsCard({ kit, headcount, workstylePreset }: WorkpointsCardProps) {
  const ratio = WORKSTYLE_RATIOS[workstylePreset];

  const presetLabels: Record<WorkstylePreset, string> = {
    traditional: 'Traditional',
    moderate: 'Moderate',
    progressive: 'Progressive',
  };

  const presetDescriptions: Record<WorkstylePreset, string> = {
    traditional: 'More dedicated seats, lower sharing',
    moderate: 'Balanced mix of dedicated and shared',
    progressive: 'Higher sharing, activity-based working',
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="icon-box w-10 h-10">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Workpoints Calculation</h3>
          <p className="text-sm text-[var(--text-muted)]">How concentration seats are determined</p>
        </div>
      </div>

      {/* Calculation Formula */}
      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] mb-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mono">{headcount}</div>
            <div className="text-xs text-[var(--text-muted)]">Headcount</div>
          </div>
          <div className="text-xl text-[var(--text-muted)]">/</div>
          <div>
            <div className="text-2xl font-semibold text-[var(--text-primary)] mono">{ratio.toFixed(2)}</div>
            <div className="text-xs text-[var(--text-muted)]">Ratio</div>
          </div>
          <div className="text-xl text-[var(--text-muted)]">=</div>
          <div>
            <div className="text-2xl font-semibold text-[var(--accent)] mono">{kit.workpoints}</div>
            <div className="text-xs text-[var(--text-muted)]">Workpoints</div>
          </div>
        </div>
      </div>

      {/* Preset Info */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--accent-muted)] border border-[var(--border-accent)]">
        <div className="icon-box w-8 h-8 bg-[var(--accent)]/10">
          <svg className="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-[var(--text-primary)]">
            {presetLabels[workstylePreset]} Preset
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {presetDescriptions[workstylePreset]}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-[var(--accent)] mono">{ratio.toFixed(2)}:1</div>
          <div className="text-xs text-[var(--text-muted)]">employee:seat</div>
        </div>
      </div>

      {/* Ratio Explanation */}
      <div className="mt-4 text-xs text-[var(--text-muted)]">
        <p>
          <strong>Workpoints</strong> represent the number of concentration seats needed for your headcount.
          The {presetLabels[workstylePreset].toLowerCase()} ratio of {ratio.toFixed(2)} means every {ratio.toFixed(2)} employees
          share 1 concentration seat on average.
        </p>
      </div>
    </div>
  );
}
