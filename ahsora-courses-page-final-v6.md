# Ahsora Med Academy — /courses Page (IMAT Programmes)
## FINAL Complete Build Document — v6

v6 adds a real Growing Content Library status indicator (Section 03) and a shared
12-month portal access benefit stated consistently across the overview cards,
comparison table, all three detail sections, and FAQ. v5 incorporated a structural
review of v4 focused on conversion sequencing and
claims precision. Key changes from v4: programme choice now appears before the
founder story, the comparison table moves before the three detail sections, the
founder section's language is toned down and given exact per-tier boundaries, the
"Most Popular" badge is replaced with "Recommended" until real purchase data
justifies it, and pricing visibility is now an explicit requirement.

**Scope reminder:** IMAT is the only live offering — this document IS `/courses` for
now, not a sub-page. See Section 10 for the future multi-exam transition plan.

---

## 0. Non-Negotiables (unchanged — governs everything below)

- Original page structure, wording, cards, and visuals only — no competitor copying.
- ASCENT / MASTERY / MEDPATH ELITE naming only.
- MedPath Elite is never "smarter teaching" than Mastery — same core prep, plus the
  admissions/service layer.
- No live classes in Ascent.
- Real faculty photos and real portal/CBT screenshots only — no stock, no AI-generated
  people, no fake UI mockups presented as real product.
- No invented numbers, no admission/visa/scholarship guarantees.
- Reduced-motion, keyboard nav, visible focus states — mandatory.
- Founder credentials must be exactly accurate and kept current as they change.
- **"Most Popular" is never displayed unless real enrollment data supports it.** Use
  "Recommended" or "Best for Most Students" at launch instead — this is an editorial
  choice you're allowed to make, not a data claim, so word it as one.
- Any competitive comparison or "no competitor does this" observation is internal
  analysis for the business owner only — it must never appear as on-page marketing copy.

---

## 1. The Clarity System (subtler than v4 — solves "shouldn't confuse the client" without looking like a kids' pricing page)

Assign each programme one icon and one small accent color, applied consistently but
lightly:

```
Ascent    → compass icon + small steel-blue accent     ("I prepare myself")
Mastery   → graduation-cap icon + small gold accent      ("I prepare with Ahsora")
Elite     → globe/passport icon + small navy/gold accent  ("Ahsora guides my wider journey")
```

**Keep this to icon + a small accent touch (e.g. a thin border or icon color) plus
consistent terminology.** Do not colour-code the full card background, all text,
buttons, and badges by tier everywhere the programme is mentioned — at that point the
page starts reading like a children's pricing table rather than a premium academic
institution. A visitor should recognize which tier they're looking at from the icon
and name alone; the accent is a light reinforcement, not the primary signal.

**No repeated feature lists across sections with different jobs:**
```
Section 02 (overview cards)     → what is it?           (tagline only)
Section 06 (comparison table)   → how do they differ?    (cross-tier feature grid)
Sections 07-09 (detail)         → what exactly do I get? (full feature list, in full)
Section 10 (quiz)               → which one suits me?    (no feature list at all)
```
Each section answers a different question — that's what keeps four programme
mentions from reading as the same content four times.

---

## 2. Horizontal Space Rules

```
FULL-WIDTH / WIDE sections (generous width, not edge-to-edge):
- Hero
- Choose Your Ahsora Path (Section 2)
- See It In Action visual showcase (Section 3)
- Meet the Founder (Section 4)
- Comparison table (Section 6)
- Programme detail sections (7-9)
- Faculty grid (11)
- Testimonials (12)

NARROW / READING-WIDTH sections (~700-760px, centered):
- Standalone prose with no cards/images beside it (e.g. the intro line in Section 5
  before the Learning Cycle diagram)
- FAQ question/answer text (Section 13)

RULE: card grids and image showcases NEVER inherit the narrow reading-width
container. Use CSS grid with auto-fit/minmax so rows genuinely expand to fill the
viewport on wide screens.

IMPLEMENTATION DETAIL — don't just widen the container: setting a large fixed
max-width (e.g. 1600px) and leaving huge static side gutters on mid-size desktop
screens (e.g. 1440px) just moves the same wasted-space problem rather than solving
it. Content width should be responsive to actual viewport width with controlled,
proportional side padding — not a single fixed number that happens to look right on
one screen size and leaves dead margin on others.
```

---

## 3. Lead Capture Strategy

**1. Programme Recommendation Quiz → email-gated result (Section 10)**
Ends with: *"Enter your email to save your recommended programme and get a free
IMAT starter guide."* Never gate the recommendation itself.

**2. Free Diagnostic Mock as the primary soft CTA everywhere**
Every programme card and detail section carries a secondary link — *"Try a Free
Diagnostic Mock First"* — routing to the real portal test.

**3. Sticky mobile conversion bar**
`[Try Free Mock]` and `[Chat on WhatsApp]`, fixed to the bottom on mobile after the
hero scrolls past. Low-friction by design — this is a better mobile pattern than
"Buy Now / Contact Us," which asks for too much too soon.

**4. "Ask the Founder" micro-CTA (tied to Section 04)**
Copy: *"Have a question before you enrol? Ask the Founder →"* — routed to WhatsApp
or a short contact form.

**Operational requirement before this goes live:** commit to a real response-time
standard (e.g., same business day) for questions sent through this CTA. An
unanswered founder question does more damage to trust than not offering the option
at all — this needs a real staffing/monitoring plan behind it, not just a button.

**Internal note, not page copy:** this CTA is a genuine differentiator worth knowing
internally, but "no competitor offers this" is a competitive observation for you,
not a claim to put on the button or anywhere on the page.

**Explicitly not recommended:** an exit-intent popup — reads as pressure-sales
against the premium positioning here.

---

## 4. SEO Setup

**Title tag:** `IMAT Preparation Programmes — Ascent, Mastery & MedPath Elite | Ahsora Med Academy`

**Meta description:** `Three levels of IMAT preparation — independent study, live instructor-led teaching, or a complete journey to medical school in Italy. Choose the support that fits you.`

**Structured data:** `Course` schema per programme; `Person` schema for the founder;
`FAQPage` (visible HTML answers only); `BreadcrumbList`.

---

## 5. Final Page Flow (14 sections)

```
01  Hero
02  Choose Your Ahsora Path (overview cards, taglines only)
03  See It In Action — Live Classes, Portal & CBT System
04  Meet the Founder — Built From Firsthand Experience
05  How Ahsora Prepares You (philosophy + Learning Cycle diagram)
06  Programme Comparison Table (moved earlier — the decision map)
07  Ascent — Full Detail
08  Mastery — Full Detail
09  MedPath Elite — Full Detail
10  Which Programme Is Right for You? (quiz, email-gated result)
11  Meet Your Ahsora Faculty
12  Verified Testimonials / Results
13  FAQ
14  Final CTA
--  (Persistent) Sticky Mobile Conversion Bar — fixed overlay, not a scroll section
```

**Sequencing logic:** Hero answers "what is this?" · programme overview answers
"what are my options?" · the product showcase answers "is this real?" · the founder
section answers "who's behind it, and do they understand my situation?" · the
methodology section answers "why this approach?" · the comparison table gives a fast
decision map before three longer detail sections · the quiz catches anyone still
undecided after all of that. The founder story stays early — right after the visitor
has seen what's on offer — rather than being the very first thing before any of that
context exists.

---

## 6. Section-by-Section Spec

### 01 — Hero

```
Headline: Your Journey to Medicine in Italy Starts Here
Supporting copy: Prepare for the IMAT. Learn from experienced instructors. Measure
your progress. And, when you're ready, let Ahsora guide you through the journey
beyond the exam.
Small line: Three programmes. One complete ecosystem. Your choice of support.
Primary CTA: Explore Our Programmes
Secondary CTA: Not Sure Which Is Right For Me?
```

**Motion:** Headline + subhead fade-up staggered 100ms. CTAs scale to 1.03 on hover.

---

### 02 — Choose Your Ahsora Path

```
[Compass icon] ASCENT — Start with Confidence.
For students who want to prepare independently with a structured system.

[Graduation-cap icon] MASTERY — Recommended — Prepare Without Compromise.
For students who want structured preparation, live teaching and continuous support.

[Globe/passport icon] MEDPATH ELITE — Flagship — Your Complete Journey.
For students who want IMAT preparation plus university and admissions support.

[Jump to detail: ↓ Ascent | ↓ Mastery | ↓ Elite]

Small shared-benefit line beneath all three cards:
"Every programme includes 12 months of full portal access — mocks, question banks,
and resources for every subject, at your own pace."
```

Note the badge change: **"Recommended," not "Most Popular"** — see Section 0.

**Why state this here, before anything else about pricing or features:** it's the
one benefit genuinely shared and equal across all three tiers, so leading with it
here (rather than only in the comparison table) reinforces early that Ascent is a
real, complete product with the same access generosity as Mastery and Elite — the
tiers differ on teaching and support, not on how long you get to use what you paid for.

**Layout:** WIDE container, 3-column auto-fit grid. Mastery gets a light, consistent
visual emphasis (per the subtler Clarity System in Section 1) without looking
artificially inflated next to Ascent, which should look complete and credible on its
own.

**Motion:** Cards fade-up staggered left-to-right, 100ms apart.

---

### 03 — See It In Action — Live Classes, Portal & CBT System

**Each sub-block answers one specific question a visitor actually has — not just a
labeled screenshot:**

```
H2: See Exactly What You're Getting

[Sub-block 1 — Live Classes] "Will I actually be taught?"
Don't Just Watch. Learn.
Ask questions in real time, get concepts clarified on the spot, and apply what you
learn through IMAT-style problem solving.
[Real photo/screenshot of a live class in session]

[Sub-block 2 — Student Portal] "What will I use every day?"
Your Entire Preparation. One Dashboard.
Question bank, topic-wise practice, full mock exams, and a personal dashboard that
tracks everything in one place.
[Real portal screenshot, framed in a browser-chrome mockup]

[Sub-block 3 — CBT Mock System] "What will practicing the IMAT actually feel like?"
Practice on the Real Exam Format.
Timed, scored with the exact IMAT marking formula, so exam day feels familiar
before you ever sit the real thing.
[Real CBT interface screenshot, framed in a device mockup]
```

**Make the pipeline explicit, not just three separate proofs:** add a short
connecting line beneath the three sub-blocks — *"Course → Live Class → Question Bank
→ Mock Exam → Analytics → Improvement — one connected system, not three separate
tools."* This is a genuinely strong future differentiator if the portal's analytics
are as detailed as planned; make the connection visible rather than leaving the
visitor to infer it from three separate images.

**Sub-block 4 — Growing Content Library** *(new — addresses recorded lectures
honestly instead of leaving a silent gap)*
```
[Sub-block 4 — Growing Content Library] "What's available right now, and what's coming?"
A Library That Grows With Every Class.
Every live session becomes a permanent part of your resource library — so the
archive of recorded lectures grows continuously, alongside the question banks and
mock tests you have full access to from day one.

[Subject-by-subject status indicator, e.g.:]
Biology — Available
Chemistry — Available
Physics — Adding this month
Logical Reasoning — In production
```
**Rules for this sub-block specifically:**
- State the real, current status per subject — never mark something "Available" that
  isn't, and never commit to a specific month unless you're confident you'll hit it.
  If timing isn't certain, use "Regularly expanding" instead of a dated promise — a
  missed date does more damage than an honest "no date yet."
- Don't attach an hours/count claim to this ("500+ hours") unless it's a real,
  current number. If you want to show a number, show the true one today and let it
  visibly grow over time — a small accurate figure that's clearly increasing builds
  more trust than an inflated one.
- This status list should be genuinely easy to update (CMS-driven, per Section 7's
  data model), since it needs to change as content is actually added — a static,
  outdated status list is worse than not having one.

**Layout:** Wide, alternating zigzag (image/text, text/image, image/text). Real
screenshots in device frames, not flat borderless images. The Growing Content
Library sub-block can use a simple status-list layout rather than a device-framed
screenshot, since it's communicating a roadmap, not showing product UI.

**Build note:** Until real assets exist, use clearly labeled placeholders
("Illustrative preview — final screenshots coming soon") — never present a mockup as
the live product.

**Motion:** Each sub-block's image slides in from its side with a fade, 400-500ms,
on scroll-into-view.

**Lead capture tie-in:** Beneath the CBT sub-block: `[Try a Free Diagnostic Mock →]`.

---

### 04 — Meet the Founder — Built From Firsthand Experience

**Purpose:** The founder is a final-year Medicine and Surgery student at the
University of Messina — a genuine, verifiable, and directly relevant trust asset.
Frame it precisely: this section should establish *"there is a real person behind
this academy who understands the journey,"* not *"trust Ahsora because of the
founder."* Programme substance, real product evidence, and eventually real student
outcomes will do more of the actual persuading than any single founder biography —
the founder section's job is to add a human, credible face to those things, not to
replace them.

**Copy:**
```
H2: Built From Firsthand Experience of the Journey to Medicine in Italy

Ahsora was founded by [Founder Name], a final-year Medicine and Surgery student at
the University of Messina — one of Italy's public medical universities admitting
through the IMAT. The programmes are shaped by firsthand experience of studying for
the exam and living the result of it, not built at a distance from the process.

[Photo: real photo of the founder — at university, in a clinical setting, or with
students. Not a generic studio headshot — context that visibly ties to "current
medical student" is more credible than a polished corporate portrait.]

Quick facts strip:
Final-Year Medicine & Surgery Student · University of Messina, Italy
Founder, Ahsora Med Academy

[Have a question before you enrol? Ask the Founder →]
```

**Founder involvement — one exact model, stated plainly, no vague "direct access":**
```
Ascent    → No direct founder access; programme built on the founder's method
Mastery   → Scheduled group guidance and motivation sessions with the founder
MedPath Elite → Defined direct advisory access as part of admissions support
```
State this exact breakdown somewhere visible near this section (or in the FAQ, see
Section 13) — a vague blanket promise of "direct access to the founder" creates a
real problem the moment an Ascent student reasonably asks why they can't reach the
founder directly. Only use language like "personally supervised" or "personally
overseen" if that's genuinely operationally true at your current scale; if in
practice programme oversight is more accurately "shaped by the founder, delivered
through the wider academic team," say that instead — don't promise a level of
involvement that becomes unworkable once enrollment grows.

**Where this connects elsewhere (cross-reference, don't repeat the full story):**
- Sections 08-09 (Mastery/Elite detail): state the exact access level from the model
  above, not a repeated narrative.
- Section 11 (Faculty): founder appears under Leadership Team with a short card
  linking back here.
- Section 13 (FAQ): the "will I have access to the founder" question answers with
  the exact per-tier model, not a generic "yes."

**Design:** Full-width, WIDE container, two-column layout (photo ~40%, copy +
quick-facts the rest).

**Motion:** Photo and copy fade-up together on scroll-into-view — one clean entrance.

---

### 05 — How Ahsora Prepares You

```
H2: More Than an IMAT Course
Every Ahsora programme runs on the same core method, whether you study independently
or alongside live instructors:
Learn → Practice → Test → Analyze → Improve
```

**Layout:** Intro paragraph in narrow container, Learning Cycle diagram immediately
below in wide container.

**Motion:** Steps fade/draw in sequence, ~80ms stagger; reduced-motion fallback is a plain fade.

---

### 06 — Programme Comparison Table (moved earlier — the decision map)

*(Full feature matrix from the original requirements doc — confirm every row before
publishing.)* This now sits before the three detail sections deliberately: a visitor
gets the cross-tier differences at a glance here, then can jump into the relevant
detail section for the tier they're leaning toward, rather than reading three full
sections before ever seeing a side-by-side comparison.

Icons from Section 1 in each column header. Wide container; horizontally scrollable
or accordion-mode on mobile.

**Pricing must be visible here** (see Section 0 non-negotiables on pricing) once
finalized — price, payment option, access duration, per programme. Don't force a
visitor to contact sales just to learn the price unless there's a specific business
reason to keep it a conversation.

**Add "Portal Access Duration — 12 Months" as one of the first rows in the table,
checked ✓ identically across all three columns.** This is a deliberate placement:
putting the shared, generous benefit at the top of the table — before the rows that
start differentiating the tiers — sets a tone of fairness across all three
programmes before the visitor sees what's exclusive to Mastery/Elite.

---

### 07 — Ascent — Full Detail

```
Full feature list (as in the comparison table, expanded with description per item)
"Best for" line
[Start Your Ascent]   [Try a Free Diagnostic Mock First]
12 months of full portal access — mocks, question banks and resources for every subject
Price, payment option (access duration is the 12-month line above, not a separate vague field)
```

---

### 08 — Mastery — Full Detail

```
"Everything in Ascent, plus:" framing, full feature list
[Join Mastery]   [Try a Free Diagnostic Mock First]
Includes: scheduled group guidance sessions with the founder (per Section 04's model)
12 months of full portal access — mocks, question banks and resources for every subject
Price, payment option
```

---

### 09 — MedPath Elite — Full Detail

```
"Same core IMAT academic preparation as Mastery" stated near the top — never framed
as academically superior
Full feature list
[Talk to an Elite Advisor]
Includes: defined direct advisory access with the founder (per Section 04's model)
12 months of full portal access — mocks, question banks and resources for every subject
Price, payment option
```

---

### 10 — Which Programme Is Right for You? (Quiz)

**Keep it short — 20-30 seconds, immediate result, no personality-test framing:**
```
H2: Which Programme Is Right for You?

1. Do you prefer independent or guided preparation?
2. Do you want live, teacher-led classes?
3. Do you need university/admissions support?
4. Do you want additional personal guidance from the founder?

[Result: recommended programme + icon]
Below result: "Enter your email to save this result and get a free IMAT starter guide"
(optional — never blocks the recommendation itself)
```

**Motion:** Fade transitions between quiz steps, progress indicator ("Question 2 of 4").

---

### 11 — Meet Your Ahsora Faculty

*(Real photos, grouped into Leadership / Academic Faculty / Student Success &
Admissions, CMS-driven.)* Founder appears under Leadership Team with a short card
linking back to Section 04 — identify and link, don't repeat the full story.

---

### 12 — Verified Testimonials / Results

**Once real data exists, structure each as a mini case study, not a generic quote:**
```
Starting point → Ahsora programme → IMAT result → University → Student quote
```
This is a meaningfully stronger evidence format than a plain testimonial, and it's
the standard worth matching once you have real outcomes to show. Until then, an
honest "Student outcomes — coming soon" note beats a thin or inflated section.

---

### 13 — FAQ

```
Which programme is best for me?
Are Mastery classes live?
Can I ask questions during live classes?
Are classes recorded?
How long do I have access to the portal after enrolling?
Is the recorded lecture library complete, or still growing?
What subjects are covered?
How many mock examinations are included?
How does the student portal work?
What is the difference between Ascent and Mastery?
What is the difference between Mastery and MedPath Elite?
Does MedPath Elite include university application support?
Do you help with pre-enrolment / scholarships / the Italian student visa process?
Does Ahsora guarantee admission or a visa?
Who oversees the Ahsora programmes?
Will I have direct access to the founder?
```

**Guarantee answer (verbatim):** *"Ahsora provides preparation, guidance and
application support, but admission, scholarship and visa decisions are made by
universities and relevant authorities."*

**Founder-access answer:** state the exact per-tier model from Section 04 — no
vague "yes, full access."

**Access-duration answer:** *"Every Ahsora programme includes 12 months of full
portal access from the date you enroll — mocks, question banks, and resources for
every subject, at your own pace."*

**Recorded-lecture-library answer:** state the real, current status honestly —
e.g. *"Our recorded lecture library is growing continuously — every live class we
run becomes part of it. [See what's available now →]"* linking to the Section 03
status indicator. Never imply the library is complete if it isn't.

Narrow reading-width container for the accordion itself.

---

### 14 — Final CTA

```
H2: Your Goal Is Medicine. Your Path Starts With Ahsora.
Choose the level of preparation and support that fits your journey.
[Ascent]   [Mastery]   [MedPath Elite]
Not sure which programme is right for you? [Talk to an Ahsora Advisor]
```

---

### Persistent — Sticky Mobile Conversion Bar

Fixed to the bottom of the viewport on mobile only, after the hero scrolls past.
`[Try Free Mock]` `[Chat on WhatsApp]`. Disappears during active form/quiz input.
Respects iOS safe-area insets.

---

## 7. CMS / Data Model

- **Programme:** name, tagline, slug, short/long description, badge (Recommended/
  Flagship — never hardcode "Most Popular"), price, payment options, access
  duration (default: 12 months, shared across all programmes), CTA, active status
- **ProgrammeFeature:** feature name, category, description, programme availability, display order
- **ContentLibraryStatus:** subject name, status (Available / Adding this month /
  In production / Regularly expanding), last-updated date, display order — powers
  the Section 03 status indicator; must be easy for the business owner to update
  without a developer, since it needs to change as content is actually produced
- **Founder:** name, photo, credential line, university, degree programme, year of
  study, bio, contact-link, per-tier access model (Ascent/Mastery/Elite access levels)
- **Faculty:** name, photo, role, subject, qualifications, biography, display order, active status
- **Testimonial:** student name, programme, starting point, IMAT result, university,
  quote, photo, verification status, display order
- **FAQ:** question, answer, category, display order, active status
- **QuizQuestion / QuizResult:** question text, options, mapped recommendation, display order

---

## 8. Components to Build

CourseHero · ProgrammeCard (icon + light accent) · ProductShowcase (device-framed,
alternating layout, pipeline connector line) · FounderShowcase · LearningCycle ·
ComparisonTable (icon headers, visible pricing) · ProgrammeDetailSection ·
ProgrammeRecommendationQuiz (email-gated result) · FacultyGrid · FacultyProfileModal
· TestimonialCarousel (mini case-study format) · FAQAccordion · FinalProgrammeCTA ·
StickyMobileConversionBar

---

## 9. Forward-Compatibility Note

When USMLE/PLAB/German FSP launch, this content moves to a dedicated IMAT
programmes page and `/courses` becomes a multi-exam catalog hub, built on the same
Programme/ProgrammeFeature model extended with an `exam` field. The Founder section
carries over as a whole-academy trust signal, not IMAT-specific.

---

## 10. Pre-Launch QA Checklist

- [ ] Programme overview appears before the founder story (Section 02 before 04)
- [ ] Comparison table appears before the three detail sections (Section 06 before 07-09)
- [ ] "Recommended" used instead of "Most Popular" unless real enrollment data justifies the latter
- [ ] Clarity System kept subtle — icon + small accent, not full-color-coded cards everywhere
- [ ] Founder section states accurate, current credentials — reviewed each academic year
- [ ] Exact per-tier founder access model stated consistently in Sections 04, 08, 09, and FAQ — no vague "direct access" language anywhere
- [ ] "Personally supervised" language only used if operationally true at current scale
- [ ] "Ask the Founder" CTA has a real response-time commitment in place before launch
- [ ] No competitive claims ("no competitor does this") appear anywhere in on-page copy
- [ ] Pricing visible in the comparison table and each detail section once finalized
- [ ] Section 03 shows real, verified screenshots/photos — no stock or unlabeled placeholder
- [ ] Container widths responsive to viewport, not a single fixed max-width creating dead gutters
- [ ] No feature list duplicated across sections with different jobs (overview/comparison/detail/quiz)
- [ ] Quiz takes ~20-30 seconds, 4 functional questions, immediate result, email never blocks the recommendation
- [ ] Testimonials use the mini case-study format once real data exists; honest placeholder otherwise
- [ ] Sticky mobile bar respects safe-area insets, hides during active form/quiz input
- [ ] No exit-intent popup implemented
- [ ] No admission/visa guarantee anywhere; no invented numbers
- [ ] Content Library status list (Section 03) reflects real, current status per subject — no "Available" marked falsely, no missed committed dates
- [ ] 12-month portal access stated consistently: overview cards, comparison table (near the top, checked across all tiers), all three detail sections, and FAQ
- [ ] Reduced-motion respected; keyboard navigation and focus states work throughout
- [ ] Mobile: comparison table usable, all sections readable at narrow widths
- [ ] Analytics events configured: programme views, CTA clicks, quiz completions, diagnostic mock starts, WhatsApp bar clicks, "Ask the Founder" clicks
