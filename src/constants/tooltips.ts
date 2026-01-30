// Tooltip content for scenario types
export const SCENARIO_TYPE_TOOLTIPS = {
  traditional: {
    heading: 'Traditional Workspace',
    content: 'Characterized by assigned seating and a high proportion of enclosed offices. Supports concentration and privacy, while offering fewer opportunities for informal interaction and space adaptability.',
  },
  moderate: {
    heading: 'Moderate Workspace',
    content: 'A hybrid model that integrates open collaboration areas with enclosed focus spaces. Typically includes a mix of assigned and unassigned seating, with success dependent on clear zoning, governance, and booking behaviors.',
  },
  progressive: {
    heading: 'Progressive Workspace',
    content: 'A highly flexible workplace model characterized by predominantly unassigned, bookable workspaces and a strong emphasis on collaboration areas. Supports spontaneous interaction and team-based work, with limited assigned seating for roles requiring full-time on-site presence.',
  },
} as const;

export type ScenarioTypeKey = keyof typeof SCENARIO_TYPE_TOOLTIPS;
