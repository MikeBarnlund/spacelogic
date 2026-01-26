'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { Project } from '@/types/project';
import { Scenario } from '@/types/scenario';
import { WorkstylePreset } from '@/types/kit-of-parts';
import {
  FinancialInputs,
  FinancialModel,
  MarketRates,
} from '@/types/financial-model';
import {
  InputsForm,
  AssumptionsPanel,
  CashFlowChart,
  ResultsSummary,
} from '@/components/financial-modeling';
import { getMarketRates, matchLocationToMarket } from '@/lib/financial-modeling';

const scenarioConfig: Record<WorkstylePreset, { label: string; color: string; bg: string }> = {
  traditional: {
    label: 'Traditional',
    color: 'var(--traditional)',
    bg: 'var(--traditional-bg)',
  },
  moderate: {
    label: 'Moderate',
    color: 'var(--moderate)',
    bg: 'var(--moderate-bg)',
  },
  progressive: {
    label: 'Progressive',
    color: 'var(--progressive)',
    bg: 'var(--progressive-bg)',
  },
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export default function FinancialsPage() {
  const params = useParams<{ id: string; scenario_type: string }>();
  const { id, scenario_type } = params;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<FinancialModel | null>(null);
  const [marketRates, setMarketRates] = useState<MarketRates | null>(null);

  // Default inputs
  const [inputs, setInputs] = useState<FinancialInputs>({
    building_class: 'B',
    lease_term: 10,
    ti_level: 'mid',
    market_key: 'toronto',
  });

  // Validate scenario_type
  const validScenarioTypes: WorkstylePreset[] = ['traditional', 'moderate', 'progressive'];
  if (!validScenarioTypes.includes(scenario_type as WorkstylePreset)) {
    notFound();
  }

  const workstylePreset = scenario_type as WorkstylePreset;
  const config = scenarioConfig[workstylePreset];

  // Fetch project and load existing financial model
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project');
        }
        const data = await res.json();
        setProject(data.project);

        // Try to match project location to a market
        const location = data.project.extracted_requirements?.location;
        const detectedMarket = matchLocationToMarket(location);

        // Check for existing financial model
        const existingModel = data.project.financial_models?.[workstylePreset]?.model;
        if (existingModel) {
          setModel(existingModel);
          setInputs(existingModel.inputs);
          setMarketRates(getMarketRates(existingModel.inputs.market_key));
        } else {
          // Use detected market
          setInputs(prev => ({ ...prev, market_key: detectedMarket }));
          setMarketRates(getMarketRates(detectedMarket));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, workstylePreset]);

  // Calculate financial model when inputs change
  const calculateModel = useCallback(async () => {
    if (!project) return;

    setCalculating(true);
    try {
      const res = await fetch(`/api/projects/${id}/financials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_type: workstylePreset,
          inputs,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to calculate financial model');
      }

      const data = await res.json();
      setModel(data.model);
      setMarketRates(getMarketRates(inputs.market_key));
    } catch (err) {
      console.error('Error calculating model:', err);
    } finally {
      setCalculating(false);
    }
  }, [id, inputs, project, workstylePreset]);

  // Handle input changes
  const handleInputsChange = (newInputs: FinancialInputs) => {
    setInputs(newInputs);
    setMarketRates(getMarketRates(newInputs.market_key));
  };

  // Calculate on button click or when inputs change (debounced)
  useEffect(() => {
    if (!project || loading) return;

    const timer = setTimeout(() => {
      calculateModel();
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs, project, loading, calculateModel]);

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-6 bg-[var(--bg-secondary)] rounded w-64 mb-8" />
            <div className="h-10 bg-[var(--bg-secondary)] rounded w-80 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="h-80 bg-[var(--bg-secondary)] rounded" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6">
                  <div className="h-[400px] bg-[var(--bg-secondary)] rounded" />
                </div>
                <div className="card p-6">
                  <div className="h-60 bg-[var(--bg-secondary)] rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--error)]/10 border border-[var(--error)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--error)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[var(--error)] mb-4">{error || 'Project not found'}</p>
            <Link href="/app" className="btn btn-secondary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find the matching scenario
  const scenarios = (project.scenarios as Scenario[]) || [];
  const scenario = scenarios.find(s => s.scenario_type === workstylePreset);

  if (!scenario) {
    return (
      <div className="min-h-screen py-12">
        <div className="container">
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--warning)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-[var(--text-tertiary)] mb-4">
              Scenario not found. Try regenerating the scenarios.
            </p>
            <Link href={`/app/projects/${id}`} className="btn btn-secondary">
              Back to Project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
          <Link href="/app" className="hover:text-[var(--text-secondary)] transition-colors">
            Projects
          </Link>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <Link
            href={`/app/projects/${id}`}
            className="hover:text-[var(--text-secondary)] transition-colors truncate max-w-[150px]"
          >
            {project.name}
          </Link>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-[var(--text-secondary)]">Financials</span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ml-1"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
            {config.label}
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="icon-box w-12 h-12">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Financial Analysis</h1>
              <p className="text-[var(--text-muted)]">
                {scenario.scenario_name} · {formatNumber(scenario.total_sqft)} sqft
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                Lease Parameters
              </h2>
              <InputsForm
                inputs={inputs}
                onChange={handleInputsChange}
                isLoading={calculating}
              />
            </div>

            {marketRates && (
              <AssumptionsPanel
                marketRates={marketRates}
                buildingClass={inputs.building_class}
              />
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart */}
            <div className="card p-6">
              {model ? (
                <CashFlowChart cashFlows={model.yearly_cash_flows} />
              ) : (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    {calculating ? (
                      <>
                        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-[var(--text-muted)]">Calculating...</p>
                      </>
                    ) : (
                      <p className="text-[var(--text-muted)]">
                        Select lease parameters to see cash flow analysis
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Results Summary */}
            {model && (
              <div className="card p-6">
                <ResultsSummary model={model} />
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href={`/app/projects/${id}`}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Project
          </Link>
        </div>
      </div>
    </div>
  );
}
