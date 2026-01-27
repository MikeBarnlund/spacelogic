import Anthropic from '@anthropic-ai/sdk';
import { GenerateScenariosResponse, Scenario } from '@/types/scenario';
import { WorkstylePreset, SpaceType } from '@/types/kit-of-parts';
import { calculateKitOfParts, generateLayoutMixFromKitOfParts } from '@/lib/kit-of-parts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert commercial real estate (CRE) broker with 20 years of experience analyzing office space needs. You help tenant representation brokers quickly generate professional space scenarios for their clients.

Your task is to analyze natural language descriptions of client needs and generate 3 distinct workspace scenarios based on workstyle and attendance patterns.

## STEP 1: EXTRACT REQUIREMENTS

From the user input, extract:
1. **current_headcount**: Total number of employees
2. **growth_projection**: Description of expected change (e.g., "20% over 2 years" for growth, or "30% reduction" for downsizing)
3. **is_reduction**: Boolean - true if the company is downsizing/reducing workforce, false if growing, null if no change mentioned
4. **workstyle_distribution**: Percentages that sum to 100:
   - on_site: % working 4-5 days/week in office
   - hybrid: % working 1-3 days/week in office
   - remote: % working <1 day/week in office
5. **location**: Market/city if mentioned

If workstyle distribution is not explicitly provided, infer reasonable defaults based on context:
- Traditional company/law firm: 70% on_site, 25% hybrid, 5% remote
- Tech/startup: 20% on_site, 50% hybrid, 30% remote
- General office: 40% on_site, 45% hybrid, 15% remote

## STEP 2: CALCULATE PROJECTED HEADCOUNT

**IMPORTANT: Space should be sized for PROJECTED headcount, not current headcount.**

1. **Calculate Projected Headcount**:
   - If growth is specified (e.g., "20% over 2 years", "100% growth", "double in size"), calculate the projected total
   - Example: 100 employees with 20% growth = 120 projected headcount
   - Example: 50 employees expecting to double = 100 projected headcount
   - If reduction/downsizing is specified (e.g., "reducing by 30%", "downsizing to 80 employees", "RIF of 25%"), calculate the projected total
   - Example: 100 employees with 30% reduction = 70 projected headcount
   - Example: 100 employees downsizing to 80 = 80 projected headcount
   - If no change mentioned, use current headcount as projected headcount

Space is calculated based on PROJECTED HEADCOUNT. The sqft_per_person standards already account for typical workstyle and attendance patterns.

## STEP 3: GENERATE THREE SCENARIOS

Generate exactly 3 scenarios with these standards:

| Type | Sqft/Person | Seats/Person | Description |
|------|-------------|--------------|-------------|
| Traditional | 210 | 1.79 | Dedicated desks, more private offices, generous space |
| Moderate | 165 | 1.46 | Mix of dedicated and shared workspaces |
| Progressive | 143 | 1.14 | Hot desking, activity-based working, efficient |

For each scenario:
- **total_sqft** = projected_headcount × sqft_per_person
- **seats** = projected_headcount × seats_per_person (for capacity calculation)

## STEP 4: CALCULATE COST RANGES

For each scenario, calculate annual cost using these rates per sqft:
- Low: $120/sqft (suburban Class B/C)
- Mid: $250/sqft (urban Class B)
- High: $450/sqft (premium Class A)

**annual_cost_range**:
- low = total_sqft × 120
- mid = total_sqft × 250
- high = total_sqft × 450

**cost_per_employee_range** = annual_cost_range ÷ projected_headcount (to show cost when fully staffed)

## RESPONSE FORMAT

Always respond with valid JSON matching this exact structure:
{
  "extracted_requirements": {
    "current_headcount": number or null,
    "growth_projection": "string description" or null,
    "is_reduction": boolean or null (true if downsizing, false if growing, null if no change),
    "workstyle_distribution": {
      "on_site": number (percentage),
      "hybrid": number (percentage),
      "remote": number (percentage)
    } or null,
    "location": "string description" or null
  },
  "scenarios": [
    {
      "scenario_name": "string (e.g., 'Traditional Workspace')",
      "scenario_type": "traditional" | "moderate" | "progressive",
      "total_sqft": number,
      "sqft_per_person": number (from standards table),
      "seats_per_person": number (from standards table),
      "layout_mix": {
        "private_offices": number (count),
        "open_desks": number (count),
        "conference_rooms": number (count),
        "common_areas": number (sqft)
      },
      "annual_cost_range": {
        "low": number,
        "mid": number,
        "high": number
      },
      "cost_per_employee_range": {
        "low": number,
        "mid": number,
        "high": number
      },
      "attendance_metrics": {
        "total_headcount": number (projected headcount after growth, or current if no growth specified),
        "average_daily_attendance": number (based on projected headcount),
        "peak_attendance": number (based on projected headcount)
      },
      "capacity": {
        "current": number (employees it fits based on peak),
        "max": number (max employees at lower density)
      },
      "pros": ["string", "string", "string"],
      "cons": ["string", "string"]
    }
  ]
}

## LAYOUT MIX GUIDELINES

Based on scenario type and projected headcount:
- **Traditional**: More private offices (30-40%), moderate open desks, standard conf rooms
- **Moderate**: Balanced mix (20-25% private), more open desks, flexible conf rooms
- **Progressive**: Few private offices (10-15%), hot desks, many small meeting rooms

Common areas should be 15-20% of total sqft.
Conference rooms: 1 per 10-15 employees.

## IMPORTANT NOTES

- CRITICAL: Always factor in growth or reduction projections when calculating space needs. If a client says "100% growth" or "double in size", the total_headcount in attendance_metrics must reflect that projected number, not the current number. Similarly, if they mention "downsizing", "reduction in force", "RIF", "layoffs", or "reducing headcount", set is_reduction to true and calculate the reduced headcount.
- Use whole numbers for sqft and costs
- Each scenario must have exactly 3 pros and 2 cons
- Pros/cons should reflect the tradeoffs of each approach
- Be practical and realistic
- The attendance_metrics should be IDENTICAL across all 3 scenarios (same input data)
- Only total_sqft, costs, and layout differ between scenarios`;

export interface GenerationResult {
  success: true;
  data: GenerateScenariosResponse;
}

export interface GenerationError {
  success: false;
  error: string;
}

export type GenerationResponse = GenerationResult | GenerationError;

/**
 * Generate workspace scenarios using Claude API
 * @param promptText - The user's input describing their workspace needs
 * @returns Generated scenarios and extracted requirements, or an error
 */
export async function generateScenarios(promptText: string): Promise<GenerationResponse> {
  if (!promptText || typeof promptText !== 'string') {
    return { success: false, error: 'Input is required' };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return { success: false, error: 'API key not configured' };
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Analyze this client's office space needs and generate 3 scenarios (Traditional, Moderate, Progressive):\n\n"${promptText}"\n\nRespond with only valid JSON, no additional text.`,
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract text content from the response
    const textContent = message.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return { success: false, error: 'No text response from Claude' };
    }

    // Parse the JSON response
    let parsedResponse: GenerateScenariosResponse;
    try {
      // Clean up potential markdown code blocks
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7);
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3);
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3);
      }
      jsonText = jsonText.trim();

      parsedResponse = JSON.parse(jsonText);
    } catch {
      console.error('Failed to parse Claude response:', textContent.text);
      return { success: false, error: 'Failed to parse scenario response' };
    }

    // Enhance scenarios with Kit of Parts (server-side calculation)
    const enhancedScenarios = enhanceScenariosWithKitOfParts(parsedResponse.scenarios);

    return {
      success: true,
      data: {
        ...parsedResponse,
        scenarios: enhancedScenarios,
      },
    };
  } catch (error) {
    console.error('Error generating scenarios:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate scenarios',
    };
  }
}

/**
 * Enhance scenarios with Kit of Parts data calculated server-side
 * @param scenarios - The scenarios from Claude
 * @param customSpaceTypes - Optional custom space types for calculation
 * @returns Enhanced scenarios with kit_of_parts
 */
function enhanceScenariosWithKitOfParts(
  scenarios: Scenario[],
  customSpaceTypes?: SpaceType[]
): Scenario[] {
  return scenarios.map((scenario) => {
    // Get projected headcount from attendance metrics
    const headcount = scenario.attendance_metrics.total_headcount;

    // Map scenario type to workstyle preset
    const workstylePreset: WorkstylePreset = scenario.scenario_type;

    // Calculate Kit of Parts
    const kitOfParts = calculateKitOfParts({
      headcount,
      workstyle_preset: workstylePreset,
      space_types: customSpaceTypes,
    });

    // Generate backward-compatible layout_mix from Kit of Parts
    const layoutMix = generateLayoutMixFromKitOfParts(kitOfParts);

    // Calculate actual seats_per_person and sqft_per_person from Kit of Parts
    const actualSeatsPerPerson = headcount > 0
      ? Math.round((kitOfParts.total_seats / headcount) * 100) / 100
      : 0;
    const actualSqftPerPerson = headcount > 0
      ? Math.round(kitOfParts.total_usable_sqft / headcount)
      : 0;

    return {
      ...scenario,
      kit_of_parts: kitOfParts,
      layout_mix: layoutMix, // Override Claude's layout_mix with calculated version
      total_sqft: kitOfParts.total_usable_sqft, // Use calculated sqft
      sqft_per_person: actualSqftPerPerson, // Use calculated sqft/person
      seats_per_person: actualSeatsPerPerson, // Use calculated seats/person
    };
  });
}

/**
 * Re-calculate Kit of Parts for existing scenarios
 * Useful when spatial ratios have been updated
 */
export function recalculateKitOfParts(
  scenarios: Scenario[],
  customSpaceTypes?: SpaceType[]
): Scenario[] {
  return enhanceScenariosWithKitOfParts(scenarios, customSpaceTypes);
}
