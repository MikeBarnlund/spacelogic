# SpaceLogic - Project Context

**AI-powered office space planning and financial modeling for commercial real estate brokers**

---

## Project Overview

SpaceLogic is an AI-native SaaS platform that transforms how commercial real estate (CRE) brokers analyze client office space needs and create financial scenarios. Instead of spending 10-20 hours per client manually building spreadsheets, brokers can generate multiple professional scenarios in real-time during client meetings using natural language input and AI assistance.

**Core Problem:** CRE brokers waste significant time on manual space calculations and financial modeling, putting them at risk of losing deals to faster competitors.

**Our Solution:** AI-powered scenario generation + comprehensive financial modeling + professional proposal generation = 8-15 hour time savings per client engagement.

**Target Market:** 50,000+ CRE brokers in North America specializing in tenant representation (helping companies find/lease office space).

**Business Model:** Freemium SaaS - Free tier (compete with CBRE Spacer) + Professional tier at $129/month.

**Path to Success:** 650 paying customers = $1M ARR (achievable in 2-3 years).

---

## Key Competitive Advantages

1. **Co-founder's 20-year CRE network** - Direct distribution channel, credibility, domain expertise
2. **AI-native approach** - Not bolting AI onto old software; building entirely new workflow
3. **Financial modeling** - Goes beyond space calculation (our key differentiator from CBRE Spacer)
4. **Rapid iteration capability** - Can ship weekly while competitors ship quarterly
5. **Data flywheel** - The more it's used, the smarter it gets

---

## Primary Competitor: CBRE Spacer

**What they do well:**
- Free, web-based space calculator
- Good UX, well-designed
- Backed by CBRE brand
- Proven market validation

**What they DON'T do (our opportunity):**
- No financial modeling (only space calculations)
- No scenario comparison
- No local market rent data
- No AI capabilities
- No client collaboration features
- No multi-year cost projections

**Our strategy:** Offer comparable free tier + paid tier with financial modeling and AI features.

---

## MVP Core Features (Months 1-3)

### 1. AI-Powered Natural Language Scenario Builder ⭐ FLAGSHIP FEATURE

**User flow:**
1. Broker describes client needs in plain English: *"45 employees, growing to 60 in 2 years, need mix of private offices and open space, budget ~$400K/year"*
2. AI instantly generates 3-5 scenarios with different tradeoffs
3. Scenarios appear in seconds during client meeting
4. Broker refines/adjusts as needed
5. Export to professional proposal

**Why it's transformational:**
- Eliminates 2-3 hour post-meeting spreadsheet work
- Enables real-time collaboration with client
- Creates "wow moment" in demos
- Single feature justifies $129/month pricing

**Technical approach:**
- Use Claude API (Sonnet 4) for natural language parsing
- Extract: headcount, growth trajectory, space preferences, budget
- Feed into scenario engine
- Return 3-5 options (budget-optimized, growth-optimized, culture-optimized)
- Structured JSON output for consistent rendering

### 2. Interactive Space Calculator

**What it calculates:**
- Square footage requirements based on:
  - Employee count
  - Workspace mix (private offices, open desks, conference rooms)
  - Common areas (break rooms, reception, storage)
  - Circulation space (hallways, paths)
- Provides recommended layouts by company archetype

**Must be competitive with CBRE Spacer** - this is table stakes.

### 3. Scenario Comparison View

**Display 3+ scenarios side-by-side:**
```
Scenario A: Traditional          Scenario B: Hybrid
12,000 sqft @ $42/sqft          9,000 sqft @ $45/sqft
$504K/year                      $405K/year
60 employees max                55 employees max
$8,400/employee/year            $7,364/employee/year
```

**Visual indicators for pros/cons of each option**

### 4. Market Rent Database

**Initial approach (MVP):**
- Manually curated from public sources
- Focus on 10-15 major markets (NYC, SF, LA, Chicago, Austin, Denver, Seattle, etc.)
- City-level data by building class (A, B, C)
- Quarterly updates from CBRE/JLL/C&W market reports
- Cost: $0 (labor only, ~20-30 hours initial, 5-10 hours quarterly)

**Future approach (Months 4-6):**
- Add crowdsourcing (brokers contribute deal data)
- Explore partnerships with brokerages
- Consider paid data (CompStak ~$500-1,500/month, CoStar $2,500-5,000/month)

**What we need:**
- Rent/sqft by market and submarket
- Building class distinctions
- Operating expense estimates
- Typical TI (tenant improvement) allowances
- Always cite sources and show update dates

### 5. Multi-Year Financial Projection

**Calculate total cost over lease term (5-10 years):**
- Base rent
- Annual escalations (typically 2-4%)
- Operating expenses
- Tenant improvement costs/allowances
- Rent abatements
- Year-by-year breakdown
- Cost per employee per year

**This is THE differentiator from CBRE Spacer.**

**Key outputs brokers care about:**
- "This option saves you $430K over 7 years"
- "Cost per employee: $12,400/year vs. $14,700/year"
- "You'll outgrow this space in Year 4 at current growth rate"
- "Year 1 cash outlay: $180K (including TI funding)"

### 6. Professional PDF/Document Export

**Formats needed (use skills):**
- **PDF** (pdf skill) - Final client presentation, non-editable
- **Word** (docx skill) - Editable proposal for client to annotate/share
- **Excel** (xlsx skill) - Financial model for deeper broker analysis

**Document must include:**
- Executive summary (AI-generated)
- Scenario comparison table
- Multi-year financial breakdown
- Visual space allocation charts
- Broker's branding/logo
- Data source citations

---

## Freemium Pricing Model

### FREE Tier
- Single scenario only
- Basic space calculation
- Generic cost estimates (national averages, no local market data)
- Watermarked PDF exports
- Limited to 2 client projects/month
- **Purpose:** Compete with CBRE Spacer, capture users, demonstrate value

### PROFESSIONAL Tier: $129/month
- Unlimited scenarios with side-by-side comparison
- Local market rent data for major metros
- Full financial modeling (5-10 year projections)
- TI allowance and operating expense modeling
- Custom branded exports (PDF, Word, Excel)
- Unlimited client projects
- AI-powered scenario generation
- **Purpose:** Core revenue driver, priced for solo brokers

### TEAM Tier: $99/user/month (3+ users, annual billing)
- Everything in Professional
- Team collaboration
- Shared templates and scenarios
- Admin controls
- Team analytics
- **Purpose:** Scale through brokerage teams

### ENTERPRISE Tier: Custom
- White label options
- API access
- Custom integrations (CRM systems like Buildout, AscendixRE)
- Dedicated support
- Custom market data
- **Purpose:** Large brokerages, expansion revenue

---

## Technology Stack

### Frontend
- **Next.js** (React framework) - Fast iteration, great for AI features
- **Tailwind CSS** - Styling (use frontend-design skill)
- **TypeScript** - Type safety
- **Vercel** - Hosting (zero-config, scales automatically)

### Backend
- **Supabase** - PostgreSQL + auth + real-time + file storage
- **Serverless functions** - API endpoints (Next.js API routes)
- **Supabase pgvector** - For RAG (retrieval-augmented generation) when needed

### AI Layer
- **Anthropic Claude API (Sonnet 4)** - Primary LLM for all natural language processing
- **Structured JSON outputs** - Use Claude's JSON mode for consistent scenario generation
- **Cost:** ~$0.50-2.00 per scenario generation
- **Economics:** At $129/month, can afford 65-250 AI generations per user/month (typical usage: 30-100/month)

### Additional Services
- **Resend** - Transactional emails
- **Stripe** - Payment processing
- **PDF generation** - Use pdf skill
- **Document generation** - Use docx and xlsx skills

### Skills Required
1. ✅ **frontend-design** - Create professional, polished UI
2. **docx** - Generate Word proposals
3. **xlsx** - Export financial models to Excel
4. **pdf** - Create final presentation PDFs

---

## AI Feature Strategy

### Phase 1 (MVP - Months 1-3)
**Natural Language Scenario Builder**
- Core differentiator
- Enables real-time client collaboration
- Simple prompt → structured scenarios

### Phase 2 (Months 4-6)
**Company Archetype Intelligence**
- User selects company type: "Series B SaaS, engineering-heavy, hybrid"
- AI suggests typical space configuration based on patterns
- Educates clients: "Companies like yours typically..."

**Market Comps Assistant**
- Conversational queries: "What are tech companies paying in Austin?"
- AI searches knowledge base + web for comparables
- Returns cited, contextual answers

**What-If Scenario Explorer**
- Client asks: "What if we only grow to 55 instead of 65?"
- AI instantly recalculates all scenarios
- Shows delta and new recommendations

### Phase 3 (Months 7-12)
**Smart Negotiation Playbook**
- AI generates negotiation guidance based on market norms
- "Request $50/sqft TI (market is $45-55), settle for $47"
- Democratizes 20 years of negotiation expertise

**Lease Clause Analyzer**
- Upload LOI/lease proposal PDF
- AI flags unfavorable terms vs. market benchmarks
- Suggests negotiation points

**Client Preference Learning**
- AI learns patterns from broker's historical clients
- "Your fintech clients typically prioritize private offices (80%)"
- Personalizes recommendations over time
- **This creates lock-in and network effects**

### Phase 4 (Year 2+)
**AI-Assisted Test Fits** (Not for MVP)
- Upload floor plate (building floor plan)
- AI analyzes usable space, cores, columns
- Generates conceptual layout description
- Future: Automated visual test fit generation
- **High value but complex - defer until validation**

---

## Data Flywheel (Long-Term Moat)

**The cycle:**
1. Brokers create scenarios → we capture patterns
2. Clients make decisions → we learn preferences
3. Deals close → we record outcomes
4. AI trains on real data → recommendations improve
5. Better recommendations → more value → more users → more data

**After 1,000 deals:**
- Our AI is trained on 1,000 real CRE transactions
- CBRE Spacer has generic rules
- Competitors can't replicate our dataset
- Each broker's AI learns THEIR specific client patterns

**This is the long-term competitive moat.**

---

## Go-To-Market Strategy

### Phase 1: Friends & Family Beta (Months 1-3)
- Co-founder reaches out to 10-15 broker friends
- Free access in exchange for weekly feedback
- **Success metric:** 5+ brokers using on real deals
- **Deliverable:** Product refinements based on real usage

### Phase 2: Testimonial Collection (Months 4-6)
- Capture 3+ video testimonials from beta users
- Create 2+ written case studies with real numbers
- **Success metric:** "SpaceLogic helped me win [specific deal]"
- **Deliverable:** Marketing assets for website/sales

### Phase 3: Industry Event Circuit (Months 7-9)
- Co-founder presents at 3-5 CRE events
- Live demo of natural language scenario builder
- Special "early adopter" pricing
- **Success metric:** 50+ signups, 10+ paid conversions
- **Deliverable:** Growing user base, brand awareness

### Phase 4: Content Marketing (Months 10-12)
- Articles in CRE publications
- Podcast appearances
- LinkedIn content series
- **Success metric:** Inbound leads from content
- **Deliverable:** Self-sustaining marketing engine

---

## Success Milestones

### Year 1
- 200 free users, 50 paid users ($77K ARR)
- 10 team/enterprise accounts ($30K ARR)
- **Total: ~$107K ARR**
- 5+ documented "won deal because of SpaceLogic" cases
- <5% monthly churn

### Year 2
- 1,000 free users, 250 paid users ($387K ARR)
- 30 team/enterprise accounts ($90K ARR)
- **Total: ~$477K ARR**
- <3% monthly churn

### Year 3
- 3,000 free users, 650 paid users ($1M ARR)
- 75 team/enterprise accounts ($225K ARR)
- **Total: ~$1.25M ARR**

---

## Development Roadmap

### Month 1-2: Foundation
- [ ] Database schema (Supabase)
- [ ] User authentication
- [ ] Basic space calculator (manual input)
- [ ] Simple scenario creation
- [ ] Basic PDF export

### Month 2-3: AI + Financial Modeling
- [ ] **AI-powered natural language scenario builder** (PRIORITY)
- [ ] Scenario comparison view
- [ ] Market rent data integration (manual curation, 10 markets)
- [ ] Multi-year financial projection engine
- [ ] Professional document export (PDF, Word, Excel using skills)
- [ ] Beta launch with 10 brokers

### Month 3-4: Refinement
- [ ] Beta feedback implementation
- [ ] Free vs. paid tier implementation
- [ ] Payment integration (Stripe)
- [ ] Client collaboration portal (basic)
- [ ] Onboarding flow optimization

### Month 4-6: Intelligence Layer
- [ ] Company archetype predictions
- [ ] Market comps assistant (RAG-based)
- [ ] What-if scenario explorer
- [ ] Crowdsourced market data collection
- [ ] Team collaboration features
- [ ] Public launch

### Month 7-12: Competitive Moat
- [ ] Negotiation playbook generator
- [ ] Lease clause analyzer
- [ ] Client preference learning
- [ ] CRM integrations (Buildout, AscendixRE)
- [ ] AI-assisted test fit descriptions (not full automation)
- [ ] Advanced analytics and reporting

---

## Critical Implementation Notes

### AI Prompt Engineering

**Scenario Generation - Workstyle-Aware Model:**

The system uses a workstyle-aware approach that calculates space based on actual in-office attendance, not total headcount.

**Extracted Requirements:**
1. Current headcount: Total number of employees
2. Growth projection: Expected growth (% or absolute + timeframe)
3. Workstyle distribution (must sum to 100%):
   - `on_site`: % working 4-5 days/week
   - `hybrid`: % working 1-3 days/week
   - `remote`: % working <1 day/week
4. Location: Market/city

**Attendance Calculation:**
```
average_daily = (on_site% × 0.9) + (hybrid% × 0.4) + (remote% × 0.1) × headcount
peak_attendance = average_daily × 1.25
```
Space is calculated based on **peak attendance**, not total headcount.

**Three Scenario Types:**
| Type | Sqft/Person | Seats/Person | Description |
|------|-------------|--------------|-------------|
| Traditional | 210 | 1.79 | Dedicated desks, more private offices |
| Moderate | 165 | 1.46 | Mix of dedicated and shared |
| Progressive | 143 | 1.14 | Hot desking, activity-based working |

**Cost Ranges (per sqft/year):**
- Low: $120 (suburban Class B/C)
- Mid: $250 (urban Class B)
- High: $450 (premium Class A)

**For each scenario return JSON:**
```json
{
  "scenario_name": string,
  "scenario_type": "traditional" | "moderate" | "progressive",
  "total_sqft": number,
  "sqft_per_person": number,
  "seats_per_person": number,
  "layout_mix": {
    "private_offices": number,
    "open_desks": number,
    "conference_rooms": number,
    "common_areas": number
  },
  "annual_cost_range": { "low": number, "mid": number, "high": number },
  "cost_per_employee_range": { "low": number, "mid": number, "high": number },
  "attendance_metrics": {
    "total_headcount": number,
    "average_daily_attendance": number,
    "peak_attendance": number
  },
  "capacity": { "current": number, "max": number },
  "pros": [string],
  "cons": [string]
}
```

### Data Transparency

**Always show users:**
- Data sources (e.g., "CBRE Q1 2025 Market Report")
- Update dates (e.g., "Last updated: January 2025")
- Confidence levels (e.g., "Medium confidence - single source")
- Allow broker override of any data point

**Example in-app display:**
```
Estimated Rent: $42-48/sqft
Building Class: A
Market: Downtown Austin
Source: CBRE Q1 2025 Market Report
Last Updated: January 2025
Confidence: Medium (city-level data)
```

### Export Quality Standards

**All exports must:**
- Look more professional than Excel printouts
- Include broker's branding/logo
- Cite all data sources
- Be client-ready (no "draft" watermarks on paid tier)
- Work on mobile devices (responsive PDF viewing)

---

## Risk Mitigation

### Risk: "Free is good enough" (CBRE Spacer)
**Mitigation:**
- Offer free tier ourselves
- Financial modeling (paid feature) provides clear differentiated value
- AI features impossible for Spacer to replicate quickly
- Target brokers who value time savings (ROI of one extra deal = 10x subscription cost)

### Risk: Slow market adoption
**Mitigation:**
- Leverage co-founder's network for initial traction
- Focus on "wow moments" in demos (natural language → instant scenarios)
- Capture video testimonials early
- Make tool so much faster than Excel that difference is obvious
- Price low enough ($129/month) that adoption barrier is minimal

### Risk: Market data costs too high
**Mitigation:**
- Start with free manual curation (good enough for MVP)
- Add crowdsourcing in Month 4-6 (zero cost)
- Only buy paid data once revenue justifies cost
- Be transparent about data limitations early

### Risk: Can't prove "helps win deals"
**Mitigation:**
- Obsessively track testimonials: "Won X deal because of faster response"
- Measure: time saved, deals won, proposal quality
- Get early wins documented (case studies)
- If brokers don't say "this helped me win," we're building wrong features

---

## Validation Checklist (Before Building)

Before writing code, validate:

### 1. Will brokers use this in meetings?
- [ ] Show mockups to 10 brokers
- [ ] 7+ say "yes, absolutely would use with client"
- [ ] 5+ commit to using on next deal

### 2. Will brokers pay $129/month?
- [ ] Present full value proposition
- [ ] Ask for credit card pre-payment (12 months)
- [ ] 5+ actually give us money

### 3. Can we get market rent data?
- [ ] Price CoStar/CompStak
- [ ] Identify public sources for 10 markets
- [ ] Confirm path to data at reasonable cost

**If we can't validate all three, pause and pivot.**

---

## Key Business Logic

### Scenario Generation Logic

**Input categories:**
1. **Headcount** - Current employee count
2. **Growth projection** - Expected growth (% or absolute + timeframe)
3. **Workstyle distribution** - Percentages that sum to 100%:
   - `on_site`: % working 4-5 days/week in office
   - `hybrid`: % working 1-3 days/week in office
   - `remote`: % working <1 day/week in office
4. **Location** - Market/city for context

**Workstyle Attendance Factors:**
- On-site workers: 90% daily attendance
- Hybrid workers: 40% daily attendance (avg 2 days/week)
- Remote workers: 10% daily attendance (occasional visits)

**Attendance Calculation:**
```
average_daily_attendance = headcount × ((on_site% × 0.9) + (hybrid% × 0.4) + (remote% × 0.1))
peak_attendance = average_daily_attendance × 1.25  // 25% buffer for Tue-Wed-Thu clustering
```

**Output - Three Scenario Types:**
| Type | Sqft/Person | Seats/Person | Style |
|------|-------------|--------------|-------|
| Traditional | 210 | 1.79 | Dedicated desks, private offices |
| Moderate | 165 | 1.46 | Mix of dedicated and shared |
| Progressive | 143 | 1.14 | Hot desking, activity-based |

Space is calculated from **peak attendance**, not total headcount.

**Cost Range Calculation:**
- Low: total_sqft × $120/sqft (suburban Class B/C)
- Mid: total_sqft × $250/sqft (urban Class B)
- High: total_sqft × $450/sqft (premium Class A)

**Always generate exactly 3 scenarios: Traditional, Moderate, Progressive**

### Financial Modeling Formulas

**Base annual cost:**
```
annual_cost = total_sqft × rent_per_sqft + operating_expenses
```

**Multi-year projection:**
```
Year N cost = Year 1 cost × (1 + escalation_rate)^(N-1)
```

**Total cost of occupancy (7 years):**
```
TCO = Σ(Year N cost) - TI_allowance + upfront_TI_funding
```

**Cost per employee:**
```
cost_per_employee = annual_cost / employee_count
```

**Utilization:**
```
utilization = current_headcount / max_capacity
```

### Space Allocation Standards

**Scenario-Based Sqft per Person (based on peak attendance):**
| Scenario Type | Sqft/Person | Seats/Person | Description |
|---------------|-------------|--------------|-------------|
| Traditional | 210 | 1.79 | Dedicated desks, generous private offices |
| Moderate | 165 | 1.46 | Mix of dedicated and shared workspaces |
| Progressive | 143 | 1.14 | Hot desking, activity-based working |

**Typical sqft per workspace type:**
- Private office: 100-150 sqft
- Open desk: 50-75 sqft
- Conference room small (4-6 people): 150-200 sqft
- Conference room large (8-12 people): 250-350 sqft
- Common areas: 15-20% of total sqft
- Circulation factor: 25-35% of total

**Layout Mix Guidelines by Scenario:**
- **Traditional**: 30-40% private offices, moderate open desks
- **Moderate**: 20-25% private offices, more open desks, flexible spaces
- **Progressive**: 10-15% private offices, hot desks, many small meeting rooms

**These are defaults - broker can override**

---

## User Experience Principles

### 1. Speed Above All
- Scenario generation: <10 seconds
- Page loads: <1 second
- Export generation: <5 seconds
- No unnecessary clicks or forms

### 2. Progressive Disclosure
- Start simple (natural language input)
- Show results immediately
- Allow drill-down for details
- Advanced features available but not required

### 3. Professional Output
- Everything looks better than Excel
- Client-ready by default
- Broker can customize but doesn't have to
- Mobile-friendly (brokers present on iPads)

### 4. Transparent AI
- Always show what AI is doing
- Allow override of AI suggestions
- Cite data sources
- Never "black box" the numbers

### 5. Broker-Centric Language
- Use CRE terminology (sqft, TI, NNN, rentable vs. usable)
- Assume broker knowledge level
- Provide tooltips for client-facing terms
- Match industry conventions

---

## Common CRE Terminology (For Reference)

**Space Metrics:**
- **Rentable sqft** - What you pay for (includes building common areas)
- **Usable sqft** - What you actually occupy
- **Load factor** - Rentable/Usable ratio (typically 1.15-1.25)
- **RSF** - Rentable square feet
- **USF** - Usable square feet

**Financial Terms:**
- **Base rent** - Core rental rate ($/sqft/year)
- **NNN (Triple Net)** - Tenant pays operating expenses separately
- **Full Service/Gross** - Rent includes operating expenses
- **Operating expenses (OpEx)** - CAM, taxes, insurance, utilities
- **TI (Tenant Improvements)** - Buildout/renovation allowance from landlord
- **Free rent** - Rent abatement period (often during buildout)
- **Escalation** - Annual rent increase (typically 2-4%)

**Building Classes:**
- **Class A** - Newest, best location, premium finishes ($45-65/sqft)
- **Class B** - Good quality, competitive ($30-45/sqft)
- **Class C** - Older, basic ($20-30/sqft)

**Use these terms in UI - brokers expect them**

---

## MVP Launch Criteria

**Ready to launch when:**
- [ ] Natural language scenario builder works reliably
- [ ] Can generate 3+ scenarios in <30 seconds
- [ ] Financial projections calculate correctly
- [ ] Professional exports (PDF/Word/Excel) look polished
- [ ] Market data loaded for 10 markets
- [ ] Free vs. paid tiers implemented
- [ ] Payment processing works (Stripe)
- [ ] 5+ beta brokers have used successfully on real deals
- [ ] No critical bugs
- [ ] Onboarding flow is clear (<5 minutes to first scenario)

**Don't wait for:**
- [ ] Perfect UI polish (good enough is fine for v1)
- [ ] All 50 markets (start with 10)
- [ ] Advanced AI features (save for Phase 2)
- [ ] CRM integrations (manual export is fine initially)
- [ ] Team collaboration (focus on solo brokers first)
- [ ] Test fit generation (defer to Phase 2-3)

---

## Technical Debt to Avoid

**Don't:**
- Build custom authentication (use Supabase Auth)
- Build custom payment system (use Stripe)
- Build custom email system (use Resend)
- Optimize prematurely (ship fast, optimize later)
- Over-engineer data models (start simple, refactor as needed)

**Do:**
- Use TypeScript everywhere (catch errors early)
- Write clear component names
- Keep API routes simple
- Document AI prompts (they'll need tuning)
- Track AI costs per feature (economics matter)
- Version control everything
- Deploy frequently (daily if possible)

---

## What Success Looks Like (Day 90)

**Product:**
- Fast, reliable scenario generation
- 10+ beta users actively using on real deals
- 3+ video testimonials captured
- Professional exports that brokers are proud to show clients
- AI generating relevant, useful scenarios 80%+ of the time

**Business:**
- $5-10K MRR (40-75 paying customers)
- Clear path to $100K ARR
- Low churn (<5%)
- Strong broker word-of-mouth

**Team:**
- Product-market fit signals clear
- Roadmap validated by user feedback
- Co-founders aligned and energized
- Ready to scale GTM efforts

---

## The Fundamental Transformation

**Old workflow:**
Meeting → Notes → Hours in Excel → Email proposal → Follow-up meeting → Revisions → Decision
**Timeline: 1-2 weeks**

**New workflow with SpaceLogic:**
Meeting → AI scenarios → Explore together → Export proposal → Decision
**Timeline: Single meeting**

**This is not incremental improvement. This is transformation.**

---

## When Working with Claude Code

**You can reference:**
- This entire context document
- Specific sections (e.g., "Based on the AI Prompt Engineering section...")
- Business logic (e.g., "Use the financial modeling formulas defined in context")
- Tech stack decisions (e.g., "We're using Next.js + Supabase as outlined")

**Key things to know:**
- Co-founder has 20 years CRE experience (product decisions should leverage this)
- We're competing with CBRE Spacer (free) so must be demonstrably better
- Natural language scenario builder is THE killer feature - prioritize this
- Financial modeling is our differentiation - this must be accurate
- Export quality matters - brokers present these to clients
- Use installed skills: frontend-design, docx, xlsx, pdf

**Build for speed:** MVP in 3 months, iterate weekly, ship daily if possible.

---

## Questions to Ask When Unsure

1. **Does this feature help brokers win more deals?** (If no, defer)
2. **Can we build this in <1 week?** (If no for MVP, simplify or defer)
3. **Would a broker pay $129/month for this?** (If no, reconsider)
4. **Does this differentiate from CBRE Spacer?** (If no, it's table stakes not differentiator)
5. **Can we validate this before building?** (Always try to de-risk)

---
