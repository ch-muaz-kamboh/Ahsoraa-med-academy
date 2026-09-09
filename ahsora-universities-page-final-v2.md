# Ahsora Med Academy — /universities Page
## FINAL Hybrid Developer Specification — v2 (Precision Pass, Ready to Send)

This is a precision pass on the already-settled architecture — no structural
changes. Fixes in this version: public/private wording made year-conditional
rather than hardcoded, "Best Match" renamed to "Relevance," Tuition Budget
given a real tuition-only methodology, University/Programme modeled as
distinct entities, cutoff table's two null-states separated, Compare
hard-capped at 2-4 with a defined field list, Clear All/removable filter
chips added explicitly, and development-priority guidance added to the
Motion section (database accuracy and filter speed over animation polish).

Built from: a competitive audit of Future Meds Academy and IMAT Mentor's
university pages, a first draft, a second (ChatGPT) draft, and two rounds of
your own corrections — most importantly, the removal of any score-based
"chances" prediction, which was correctly flagged as a real trust risk given
how unpredictable IMAT cutoffs are year to year.

**Core principle:** the page helps a student filter, compare, and shortlist
universities based on real preferences and real public data — it never
predicts admission likelihood. Deep per-university detail lives on subpages,
not here — this hub stays lean by design.

**Open assumption — confirm before build:** private Italian medical
universities run their own separate entrance tests, not the IMAT. This spec
lists private universities as full informational entries (fees, seats,
admission route, city), with a clear note that Ahsora's exam-preparation
courses are IMAT-specific, while MedPath Elite's admissions guidance can
still support a student regardless of route. Correct this assumption if
Ahsora's actual scope differs.

---

## 0. Non-Negotiables

- No score-based filtering, matching, or categorization anywhere on this
  page. No "Safety / Match / Reach," no "your chances," no calculator. IMAT
  cutoffs are too year-variable to responsibly attach to a specific
  university recommendation.
- All tuition, seat, and cutoff figures are real, sourced from Universitaly.it,
  MUR publications, or each university's own admissions office — never
  estimated or invented. Every dataset carries a "Last verified" date and, for
  cutoffs, an explicit academic year.
- Cutoff data is always presented as historical reference, with visible
  language that past cutoffs don't predict future ones — every time it
  appears, not just once in a disclaimer.
- No admission guarantees anywhere.
- Clearly separate public (IMAT-route) and private (university-specific-route)
  universities throughout — never imply they follow the same admission system.
- Do not list a university before confirming it currently offers an
  English-taught Medicine programme and is currently accepting the stated
  admission route — routes and offerings can change year to year.
- Original structure and wording — informed by competitors' public data and
  general approach, not copied from their layout or copy.

---

## 1. SEO Setup

**Title tag:** `Italian Medical Universities — Public & Private, IMAT & Beyond | Ahsora Med Academy`

**Meta description:** `Compare English-taught Medicine programmes across Italy — public and private, admission routes, tuition, seats, and historical cutoffs. Filter by what matters to you and build your shortlist.`

**Primary keyword cluster:** Italian medical universities, English-taught
medicine Italy, IMAT universities list, private medical university Italy,
Italy medical school tuition, IMAT cutoffs [year], study medicine Italy public
vs private

**Structured data:** `ItemList` of `CollegeOrUniversity` entities; `Dataset`
schema for the cutoff table; `BreadcrumbList`.

**Internal linking:** `/imat` → links here for "where can I study"; each
university card → its subpage; costs section → `/scholarships`; results →
MedPath Elite on `/courses` for admissions guidance.

---

## 2. Final Page Sequence — 11 Sections

```
01  Hero
02  Public vs Private — Quick Orientation
03  How to Choose (decision factors)
04  Find Your University (preference filter — no score input)
05  Map Explorer
06  Results & Shortlist
07  Cutoff History (standalone, purely reference)
08  How Costs Actually Work (public ISEE-scaled + private fixed tuition)
09  Cost of Living & Cities
10  FAQ
11  Final CTA
```

---

## 3. Section-by-Section Spec

### 01 — Hero

```
Eyebrow: Medicine in Italy

H1: Find the Medical University That Fits Your Journey.

Subhead: Explore English-taught Medicine programmes across Italy — public and
private, admission routes, tuition, seats and historical cutoffs. Filter by
what matters to you, then build your shortlist.

Primary CTA: Find Your University (anchors to Section 04)
Secondary CTA: Browse the Map (anchors to Section 05)
```

**Visual:** Wide, real photo of an Italian university campus, or a stylized
Italy map illustration previewing Section 05.

**Motion:** Headline/subhead fade-up staggered 100ms, matching site-wide pattern.

---

### 02 — Public vs Private — Quick Orientation

**Purpose:** State this distinction once, clearly, with the comparison built
directly in — not repeated as a separate grid-then-comparison later.

```
H2: Not Every Medical University in Italy Works the Same Way.

Two cards side by side:

PUBLIC UNIVERSITIES
Many English-taught public Medicine programmes use the IMAT, or the
applicable national admission route for that academic year — merit-ranked,
with seats generally split into EU and non-EU pools.
Tuition generally scaled to family income · Regional scholarships widely available

PRIVATE UNIVERSITIES
Private universities generally run their own admission procedures and
selection tests, depending on the institution and academic year — separate
from the IMAT.
Tuition generally fixed and published upfront · Scholarships are institution-specific

Closing line: "Neither is automatically better — the right path depends on
your budget, admission strategy, and preferences."
```

**Why this wording matters beyond phrasing:** the underlying database rule
should be University/Programme → Admission Route → Academic Year, never a
hardcoded "Public = IMAT, Private = own test" assumption. Admission routes
can and do change year to year — the page copy needs to reflect that
conditionality, not just the data model.

**Design:** Two-column card layout, WIDE container, visually distinct (e.g.
different accent tone per card) so the split reads instantly.

**Motion:** Cards fade-up together, no stagger needed for just two.

---

### 03 — How to Choose

**Purpose:** The psychological core of the page — replaces any score-based
tool with a framework of real decision factors a student actually controls.

```
H2: There's No Single "Best" Medical University.

The right university is the one that fits your admission route, budget, city
preference, scholarship situation, and long-term plans — not a ranking.

ADMISSION ROUTE — Can you realistically apply through this route (IMAT or
university-specific)?

BUDGET — What can you and your family realistically sustain for six years?

CITY — Where would you actually want to live during your degree?

SCHOLARSHIPS — What funding could genuinely apply to your situation?

CLINICAL ENVIRONMENT — Teaching hospital size and setting vary — what suits you?

LIFESTYLE — Large international city or smaller, closer-knit university town?
```

**Reading cutoffs correctly (folded into this section, not a separate one):**
```
A cutoff score is a historical result, not a target you can hit with
certainty — seats, applicant numbers, and cutoffs shift every year. Use
historical cutoffs (Section 07) to understand a university's general
competitiveness, not to predict your own outcome.
```

**Design:** 6-card grid for the decision factors (WIDE container), with the
cutoff-reading note as a distinct callout box beneath it, visually separated
so it doesn't read as a 7th factor.

**Motion:** Cards fade-up staggered, 80ms apart.

---

### 04 — Find Your University (preference filter only)

**No score field. No calculator. No categorized output.** A straightforward
filter that narrows the full list to what's actually relevant to the visitor.

```
H2: What Are You Looking For?

Search box: "Search by university or city" (placeholder: "Milan, Pavia, Messina, Rome...")

Filters (multi-select where sensible):
Admission route — IMAT / University-specific
Type — Public / Private
Tuition Budget — Lower / Moderate / Higher
City size — Large / Medium / Smaller
Region — North / Central / South & Islands
Scholarship priority — Important / Not a priority

[Show Results]   [Clear All]
```

**Tuition Budget must be a defined, tuition-only methodology, not a vague
label:** the three bands (Lower/Moderate/Higher) apply to annual tuition
specifically, with the actual € thresholds maintained in the CMS/database —
not hardcoded into the UI — so they can be adjusted without a code change.
This filter must never be conflated with cost of living (Section 09), which
is a separate, clearly labeled estimate.

**Active filters must be visible and individually removable** as chips below
the panel, e.g. `Public ×` `North ×` `IMAT ×`, alongside the `Clear All`
option — without this, visitors can end up in a confusing filter state they
don't know how to escape.

**Design:** A clean filter panel — collapsible on mobile into a "Filters"
button that opens a sheet, rather than pushing six dropdowns down the page
before any results are visible. On desktop, filters can sit as a sidebar or a
horizontal bar above the results grid — either works, but the results grid
(Section 06) should always be visible or one scroll away, not buried.

**Search box behavior:** live-filter as the visitor types (debounced, ~200ms),
not requiring a submit click for the text search specifically — filters
(dropdowns/toggles) can require the explicit "Show Results" action so the
visitor isn't seeing the list re-shuffle on every single click.

**Motion:** Filter panel expands/collapses smoothly on mobile (250ms ease);
selected filter chips appear with a quick fade-in beneath the panel so the
visitor has a clear, removable record of what's currently applied.

---

### 05 — Map Explorer

```
H2: Explore Medicine Across Italy

Interactive map of Italy, one pin per university, colored or shaped
differently for Public vs Private. Filters from Section 04 apply to the map
too — filtering the list also filters visible pins.

Click a pin → a small popover: university name, city, Public/Private + route
tag, [View Profile →]
```

**Two-way link with Section 06:** hovering a result card highlights its pin;
clicking a pin scrolls to/highlights its card. This is a genuine
differentiator — neither competitor reviewed has this.

**Design:** WIDE container. On mobile, collapse to a "View Map" toggle rather
than always-rendering a full map above the results — protects the page from
feeling long on small screens.

**Motion:** Pins drop in with a slight bounce once on section load (not
repeating); popover fades/scales in on pin click (150ms).

---

### 06 — Results & Shortlist

**Card content (per university) — includes the "Best For" line, a genuinely
useful addition that gives decision context without overloading the card:**

```
[Photo] [City, Italy] `PUBLIC` or `PRIVATE` `IMAT` or `UNIVERSITY-SPECIFIC`
University Name
Medicine & Surgery · 6 years · English-taught
Seats: EU [n] · Non-EU [n]  (public) — or — Total intake: [n] (private, if published)
Tuition: €[range or fixed figure]/yr
Last verified: [date]

BEST FOR
"[One sentence — e.g. 'Students looking for a public English-taught programme
in a compact university city.']"

[View Full Profile →]   [+ Add to Shortlist]
```

**Result count + sort control above the grid:**
```
"[N] medical programmes match your preferences"
Sort by: Relevance · University Name · City · Tuition · Seats
```
Note: "Relevance" here means how many of the selected filter criteria a
result satisfies — deliberately not called "Best Match," which would imply
Ahsora is judging which university is best for the student. It never ranks
university quality and is never tied to admission likelihood.

**Shortlist utility (persistent, small, non-intrusive):**
```
A small persistent element (e.g. a floating pill or sticky mini-bar):
"[N] universities saved — Compare My Shortlist →"
```

**Compare feature — explicitly limited to 2-4 universities at a time.** More
than 4 columns becomes unusable on desktop and unworkable on mobile, so cap
it at the UI level, not just as a soft suggestion. Compare table fields:
```
Admission route · Type (Public/Private) · Location · Seats or intake ·
Tuition · Cost-of-living tier (from Section 09) · Scholarship availability ·
Programme length · Historical cutoff data (if applicable) · Best For
```
Anything beyond this list stays on the full university profile — [View Full
Profile] remains available from within the comparison view for deeper detail.

**Design:** Responsive auto-fit card grid, WIDE container, consistent with
the horizontal-space rules used elsewhere on the site — no fixed narrow
wrapper squeezing the grid.

**Motion:** Cards fade-up staggered on scroll/filter-change; "Add to
Shortlist" gives a quick checkmark micro-animation and updates the persistent
counter without a jarring page jump; sort re-ordering animates position
changes rather than an abrupt re-render.

---

### 07 — Cutoff History (standalone, purely reference)

**Deliberately separated from any tool or personalization — plain historical
data, clearly dated and sourced, nothing more.**

```
H2: IMAT Cutoff History

Toggle: EU / Non-EU
Toggle: [Year] / [Year] / [Year] (as many verified years as available)

Table: University | Seats | Seats Left After Round 1 | Round 1 Cutoff | Final Cutoff

Mandatory note, always visible near the table:
"Historical cutoffs are reference points, not guarantees — competition and
seat availability change every year. Source: Universitaly.it official
published results. Last verified: [date]."
```

**Design:** WIDE container, horizontally scrollable on mobile. This section
applies only to IMAT-route (public) universities, since private universities
don't publish comparable national cutoff data — state that plainly rather
than leaving a confusing gap in the table. The currently-selected pool
(EU/Non-EU) must be clearly and persistently visible in the table header
while scrolling, not just on the toggle control itself.

**Two distinct null-states — do not conflate them:**
```
"—" — seats were still being assigned through later scrolling rounds; no
      fixed final cutoff existed that cycle (a real, meaningful result)
"Not published" — this figure was not made available by the source for this
      university/year (a data-availability gap, different from the above)
```
Never force a blank cell or an invented placeholder number into either case —
show the correct one of these two labels instead, since they mean genuinely
different things to a student reading the table.

**Motion:** Toggle switches cross-fade the table body (200-250ms); row hover
highlight; no other animation — this is a reference table people need to
read carefully, not a showcase element.

---

### 08 — How Costs Actually Work

**Merged — public ISEE-scaled fees and private fixed tuition are genuinely
different systems, explained together for direct contrast rather than in two
disconnected sections.**

```
H2: How Much Does Medicine in Italy Actually Cost?

PUBLIC UNIVERSITIES
Tuition is scaled to your family's financial situation using Italy's income-
assessment system (ISEE) — so two students at the same university can pay
very different amounts. International students are generally assessed using
an equivalent income declaration. Regional scholarships can reduce this
further or add a living stipend.

PRIVATE UNIVERSITIES
Tuition is generally a fixed, published annual figure, sometimes payable in
installments, plus an application fee. Scholarships are set by the individual
university rather than a national/regional system.

[Illustrative ISEE income-band chart — labeled clearly as illustrative, not exact]

[See Full Scholarship Guidance →] (links to /scholarships)
```

**Design:** Narrow reading-width container for the explanatory text, wide
container for the illustrative chart beneath it.

**Motion:** Chart bars animate in on scroll (~400ms grow-in); static fallback for reduced-motion.

---

### 09 — Cost of Living & Cities

**Kept intentionally compact — snapshot cards, not essay-length city guides.**

```
H2: Your University Choice Is Also a City Choice

[Compact city cards, 3-4 lines each, e.g.:]

MILAN — Large international city, higher housing cost, strong transport network
ROME — Major capital, large student population, higher housing complexity
PAVIA — Compact university city, student-oriented, lower cost of living
MESSINA — Southern university city, meaningfully lower cost of living

Estimated monthly student budget: [range]
(Clearly labeled: "Ahsora's general planning estimate — not a university fee
or official figure.")
```

**Design:** Horizontal scroll-snap card row (mobile), grid (desktop) —
consistent with card patterns elsewhere on the site.

**Motion:** Simple fade-up on scroll, no elaborate treatment needed for short cards.

---

### 10 — FAQ

```
How many English-taught Medicine universities are there in Italy?
Which universities use the IMAT?
Do all Medicine programmes in Italy use the IMAT?
What's the difference between public and private medical universities?
How much does Medicine cost in Italy?
Does meeting a past cutoff guarantee my admission?
Can international students apply for scholarships?
Which cities are more affordable for students?
How do EU and non-EU seats differ?
Can I compare multiple universities?
Can Ahsora help me choose a university?
```

**"Does meeting a past cutoff guarantee admission" answer (verbatim style):**
*"No. Cutoffs are historical results, not guarantees — seat numbers,
applicant pools, and cutoffs can all shift year to year. We don't offer a
tool that predicts your personal chances at a specific university, because
that variability makes any such prediction unreliable."*

This last answer is worth including explicitly — it turns the deliberate
absence of a score-matching tool into a stated, honest position rather than
a gap a visitor might otherwise wonder about.

Narrow reading-width container for the accordion.

---

### 11 — Final CTA

```
H2: Your University Should Fit Your Journey — Not the Other Way Around.

Explore your options, build your shortlist, then get guidance when you're
ready to decide.

[Build My Shortlist]   [Get University Guidance]
```
Second button routes to MedPath Elite / advisor contact — not a placeholder
consultancy name; confirm the correct destination before this ships.

---

## 4. University Subpage Template (unchanged in principle — deep detail lives here)

```
01  Breadcrumb + Hero (name, city, photo, Public/Private + route tag)
02  Admissions Summary (tuition, seats or intake, programme length, language, intake months)
03  This University's Cutoff History (public/IMAT-route universities only)
04  Academic Eligibility & Prerequisites
05  Available English-Taught Programmes
06  Campus & City (clinical partner hospitals if verified, city life one-liner)
07  Official Resources (link to the university's own admissions page)
08  CTA — Get Guidance for This University
```

Each subpage carries its own independent "Last verified" date, not inherited
from the hub.

---

## 5. Motion & Visual Language (page-wide summary)

- Consistent site-wide fade-up/stagger pattern, applied to data-dense content
  without overloading any single view with multiple simultaneous animations.
- The map ↔ card two-way link (Section 05/06) is the one interaction worth
  the extra build effort — it's functional, not decorative.
- Filter and sort transitions should feel immediate and smooth (200-250ms),
  since this page's core interaction is narrowing and reordering results —
  a sluggish or jarring filter response undermines the entire "Find Your
  University" concept.
- No score-adjacent motion of any kind — no progress bars, gauges, or
  "your result" reveal animations anywhere on this page.
- Respect `prefers-reduced-motion` throughout, with static fallbacks for map
  pins and chart bars.

**Development priority, if time or budget is constrained:** this page's
value comes from data accuracy, filter speed, and mobile usability — not
motion polish. If trade-offs are needed, prioritize database correctness,
filter/sort responsiveness, page load speed, and mobile layout over refining
animation timing anywhere on this page. The stagger/fade specifications
above are the target, not the priority, if something has to give.

---

## 6. CMS / Data Model

**Structural principle — treat University and Programme as distinct
entities, not one object.** A single university can have multiple
programmes, admission routes, or offerings that change by academic year —
hardcoding "one university = one route" makes the system brittle the moment
that's no longer true for any institution.

- **University:** name, slug, city, region, type (Public/Private), photo,
  logo, official website URL, active status
- **Programme:** university reference, programme name (e.g. "Medicine &
  Surgery"), language (must explicitly confirm "English"), programme length,
  admission route (IMAT/University-specific), academic year, tuition (range
  for public/ISEE-scaled, fixed figure for private), seats (EU/non-EU,
  public) or total intake (private), tuition-budget band (Lower/Moderate/
  Higher, thresholds defined in CMS, tuition-only), "Best For" line,
  last-verified date, active status
- **CutoffRecord:** programme reference, year, applicant pool (EU/non-EU),
  seats, seats remaining after round 1, round 1 cutoff, final cutoff (or
  explicit "not published" flag, distinct from the "—" scrolling-rounds
  state), source citation, last-verified date
- **CityProfile:** city name, region, cost-of-living tier, one-line
  description, estimated monthly budget range
- **UniversityEligibility:** programme reference, prerequisite text, display order

Every page component (Finder, Map, Cards, Cutoff Explorer, Shortlist,
Compare) should read from these entities as the single source of truth —
build the data model first, then build the UI on top of it, rather than
building the visual page and populating it manually afterward.

**No scoring or matching logic of any kind in this data model** — the
Find Your University filter is a straightforward attribute match against
selected criteria, nothing computed against a user-provided score.

---

## 7. Components to Build

UniversityHero · PublicPrivateOrientation · DecisionFactorsGrid ·
UniversityFilterPanel (search + multi-select filters, no score input) ·
UniversityMap (interactive, two-way linked to grid, filter-aware) ·
UniversityCard (with Best For line + shortlist button) · ResultsGrid (sortable) ·
ShortlistUtility (persistent counter + compare) · ShortlistCompareTable ·
CutoffTable (togglable pool/year) · CostExplainer (ISEE + private tuition,
illustrative chart) · CityProfileCards · FAQAccordion · FinalCTA ·
UniversitySubpageTemplate

---

## 8. Why This Architecture Is Different

| Competitor gap | How this spec closes it |
|---|---|
| Neither FMA nor IMAT Mentor clearly separates public (IMAT) vs private (own-test) admission as a first-class distinction | Section 02, stated once and reinforced structurally throughout |
| Card walls with no way to narrow before browsing | Section 04's filter-first flow — results only render meaningfully once the visitor has stated what matters to them |
| No persistent shortlist/compare mechanic | Section 06 — a genuine reason to return to the page, not just a one-time lookup |
| Cutoff data presented without a clear "how to actually use this" framework | Section 03 folds correct cutoff interpretation directly into the decision-factors section, and Section 10's FAQ states plainly why no prediction tool exists |
| No competitor explicitly states why they don't offer a chance-prediction tool | Section 10 — turns a deliberate omission into an honest, stated position rather than a silent gap |

---

## 9. Pre-Launch QA Checklist

- [ ] No score input, calculator, or chance-based categorization exists
      anywhere on this page — confirmed absent from filters, results, and CTAs
- [ ] Public and private universities are clearly tagged and never implied to
      share the same admission system
- [ ] All tuition, seat, and cutoff figures sourced from official channels,
      with visible "Last verified" dates
- [ ] Cutoff table includes only IMAT-route (public) universities, with a
      stated reason private universities aren't included in it
- [ ] Cutoff data always appears with the "historical, not predictive"
      language — table, FAQ, and Section 03 alike
- [ ] Map and card grid are two-way linked and both respect active filters
- [ ] Filter panel is usable on mobile without pushing results far down the page
- [ ] Shortlist and Compare features function correctly and persist during the session
- [ ] "Get University Guidance" CTA routes to a real, confirmed destination —
      not a placeholder consultancy name
- [ ] Each university subpage has its own independent "last verified" date
- [ ] Cost-of-living figures clearly labeled as Ahsora's own estimate, not
      official or university-published data
- [ ] Reduced-motion respected throughout, with static fallbacks for map
      pins, chart bars, and filter transitions
- [ ] Tuition Budget filter thresholds defined in the CMS and apply to
      tuition only, never conflated with cost of living
- [ ] "Clear All" and individually removable filter chips both function correctly
- [ ] Compare is hard-capped at 2-4 universities in the UI, not just documented as a suggestion
- [ ] Cutoff table distinguishes "not published" from the scrolling-rounds
      "—" state — no invented or blank values in either case
- [ ] University and Programme are modeled as distinct entities — no
      hardcoded one-university-one-route assumption

---

## 10. Forward-Compatibility Note

When USMLE/PLAB/German FSP launch, the `University` model gains a
`country`/`examPathway` field, and the hub page gains a country-level filter
alongside admission route, type, region, and budget. Build the filter panel
and data model with that extension in mind now rather than hardcoding an
Italy-only assumption into the underlying components.
