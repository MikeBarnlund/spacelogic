'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { YearlyCashFlow } from '@/types/financial-model';

interface CashFlowChartProps {
  cashFlows: YearlyCashFlow[];
}

function formatCompactCurrency(value: number): string {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload) return null;

  const total = payload.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
      <div className="text-sm font-medium text-[var(--text-primary)] mb-2">Year {label}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          entry.value !== 0 && (
            <div key={entry.name} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[var(--text-secondary)]">{entry.name}</span>
              </div>
              <span className={`font-medium mono ${entry.value < 0 ? 'text-[var(--success)]' : 'text-[var(--text-primary)]'}`}>
                {formatFullCurrency(entry.value)}
              </span>
            </div>
          )
        ))}
        <div className="flex items-center justify-between gap-4 text-xs border-t border-[var(--border)] pt-1 mt-1">
          <span className="text-[var(--text-secondary)] font-medium">Total</span>
          <span className="font-semibold text-[var(--accent)] mono">{formatFullCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default function CashFlowChart({ cashFlows }: CashFlowChartProps) {
  const [showCumulative, setShowCumulative] = useState(false);

  // Transform data for the chart
  const chartData = cashFlows.map((cf) => ({
    year: cf.year,
    'Base Rent': cf.base_rent,
    'Operating': cf.operating_costs,
    'TI Costs': cf.ti_costs,
    'TI Credit': cf.ti_credit,
    'Brokerage': cf.brokerage,
    cumulative: cf.cumulative,
    total: cf.total,
  }));

  const maxValue = Math.max(...cashFlows.map((cf) => cf.total));
  const minValue = Math.min(...cashFlows.map((cf) => cf.ti_credit));

  return (
    <div className="h-[400px] w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
          {showCumulative ? 'Cumulative Cost' : 'Annual Cash Flow'}
        </h3>
        <button
          onClick={() => setShowCumulative(!showCumulative)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          Show {showCumulative ? 'Annual' : 'Cumulative'}
        </button>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        {showCumulative ? (
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={formatCompactCurrency}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload[0]) return null;
                return (
                  <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-3 shadow-lg">
                    <div className="text-sm font-medium text-[var(--text-primary)] mb-1">
                      Year {label}
                    </div>
                    <div className="text-lg font-semibold text-[var(--accent)] mono">
                      {formatFullCurrency(payload[0].value as number)}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">
                      Cumulative total
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="cumulative"
              fill="var(--accent)"
              radius={[4, 4, 0, 0]}
              animationDuration={500}
              animationBegin={0}
            />
          </BarChart>
        ) : (
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            stackOffset="sign"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              tickFormatter={formatCompactCurrency}
              domain={[minValue * 1.1, maxValue * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
              iconSize={8}
            />
            <ReferenceLine y={0} stroke="var(--border)" />
            <Bar
              dataKey="Base Rent"
              stackId="a"
              fill="#94a3b8"
              animationDuration={500}
              animationBegin={0}
            />
            <Bar
              dataKey="Operating"
              stackId="a"
              fill="#64748b"
              animationDuration={500}
              animationBegin={100}
            />
            <Bar
              dataKey="TI Costs"
              stackId="a"
              fill="#f59e0b"
              animationDuration={500}
              animationBegin={200}
            />
            <Bar
              dataKey="TI Credit"
              stackId="a"
              fill="#10b981"
              animationDuration={500}
              animationBegin={300}
            />
            <Bar
              dataKey="Brokerage"
              stackId="a"
              fill="#a78bfa"
              radius={[4, 4, 0, 0]}
              animationDuration={500}
              animationBegin={400}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
