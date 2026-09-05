# Ahsora Med Academy — /imat Page
## Final Developer Specification v2 — SEO, Content, Design, Motion & Claims Governance

This version merges the design/motion/conversion depth of the first draft with the
claims-discipline and structural corrections identified in review. It also fixes
the earlier draft's biggest issues: unverified structure guesses, overlapping
sections, and reused numbers presented without a verification flag.

**Objective:** Build an authoritative IMAT information + decision + preparation
page that ranks, reduces visitor uncertainty, and moves qualified traffic toward
the Free IMAT Mock and Ahsora's programmes — positioned as a *preparation
system*, not a content library. Do not copy competitor layout, wording, or claims.

---

## 0. Claim Rules (read this before writing or editing any copy on this page)

This section governs every other section below. When in doubt, this wins.

- **No fabricated or unverified statistics.** Any number displayed (pass rate,
  student count, country count, rating, question bank size) must be a real,
  current figure you can stand behind. If a number already exists elsewhere on
  your live site (e.g. homepage stats), it's fine to reuse it here for
  consistency — but confirm it's still accurate at publish time, don't just
  copy-paste indefinitely.
- **No admission, scholarship, or visa guarantees.** The score calculator shows
  a projected score, not an admission prediction — label it that way explicitly.
- **No fixed dates, fees, or cutoffs published without current-year
  verification.** Pull from Universitaly/MUR at publish time; mark the page
  with a "last verified" date; re-check before each exam cycle.
- **No unsupported competitor attacks.** Do not name, caricature, or invent
  shortcomings about specific competitors anywhere on this page.
- **Distinguish Ahsora's service claims from government/university rules.**
  EU/non-EU procedure, visa steps, and cutoffs are MUR/Universitaly's rules to
  state, not yours to reinterpret loosely.
- **FAQ and all factual claims must be in visible, crawlable HTML/DOM** — not
  injected only on click.

---

## 1. SEO Setup

**Title tag:**
`IMAT 2027 Guide: Exam Date, Syllabus, Scoring & Preparation | Ahsora Med Academy`

**Meta description:**
`The complete IMAT guide: exam structure, syllabus, scoring, eligibility, registration, university options and costs. Take a free IMAT mock and explore Ahsora's live teaching system.`

**Primary keyword cluster:** IMAT exam guide, IMAT 2027, IMAT syllabus, IMAT scoring, IMAT eligibility, IMAT exam date, IMAT universities, study medicine in Italy, IMAT score calculator

**Structured data:**
- `BreadcrumbList` (Home > IMAT)
- `FAQPage` — visible, crawlable answers only
- `Course` schema linking to `/courses/imat-italy-medical-entrance-prep`

**Internal linking:** subject cards → relevant course modules · university cards
→ `/universities` · cost section → `/scholarships` · every prep-methodology
section → the IMAT course page · mock CTA → `/portal/tests/tst-01/take`

---

## 2. Final Page Sequence (15 sections — trimmed from the 21-section draft to avoid overlap/scroll fatigue)

```
01  Hero
02  IMAT At-a-Glance
03  What Is the IMAT
04  Key Dates & Registration
05  Exam Structure & Syllabus (verified 5-section format)
06  Scoring + Live Score Calculator
07  Is the IMAT Right for You? (segmentation)
08  EU vs Non-EU & Admission Category
09  Where Can You Study — University Snapshot
10  Cost of Studying Medicine in Italy
11  How Ahsora Prepares You (merged: method + live teaching + mocks/analytics)
12  Ahsora Preparation Paths (Ascent / Mastery / MedPath Elite)
13  The Full Journey — IMAT to Medical School
14  Free IMAT Starter Kit (lead magnet)
15  FAQ + Final CTA
```

*(Real Student Results has been removed from this sequence — add it back as a
new section once you have real, verified student data to show. Don't publish
it as a placeholder in the meantime.)*

**Why 16, not 21:** Sections 15-18 of the reviewed draft (How to Prepare /
Signature Learning Cycle / Live Teaching / Mocks & Analytics) all describe the
same underlying method from four different angles — a visitor would scroll
through four consecutive "how we teach" sections before reaching a strong CTA.
Section 11 below merges them into one well-organized section with three clear
sub-parts, so the substance isn't lost, just the redundancy.

---

## 3. Section-by-Section Spec

### 01 — Hero

**Copy:**
```
Eyebrow: IMAT — International Medical Admissions Test

H1: The IMAT Is the Test. Your Preparation Makes the Difference.

Subhead: Understand the exam, master the syllabus, practise under realistic
conditions, and measure your progress — with a preparation system built for
students pursuing Medicine in Italy.

Primary CTA: [Take the Free IMAT Mock]
Secondary CTA: [Explore IMAT Preparation]
```

Do not add stat claims directly into the hero unless verified current — keep
the hero clean and let Section 02 carry the exam facts (which are objective,
not promotional, so no verification risk there).

**Design:** Reuse the homepage's split hero layout (image/proof card right,
copy left) for brand continuity. Swap imagery to something IMAT-specific —
a stylized exam timer/mock-test UI works better here than a generic photo.

**Motion:**
- Headline + subhead: fade-up, 15px translate-Y, staggered 100ms
- CTA buttons: scale to 1.03 on hover (match existing button component)
- No animated counters in the hero (nothing here should look like an
  unverified stat being dramatized)

---

### 02 — IMAT At-a-Glance

**Content (4-card grid):**
```
60            100 min         90              5
Questions     Duration        Max Score       Answer Options
MCQ            One sitting     +1.5/−0.4/0     Per question
```
These are official exam facts, not Ahsora claims — safe to state plainly and
confidently, no hedging needed.

**Motion:** Cards stagger-fade in left-to-right, 80ms delay each, on
scroll-into-view. Numbers count up (0→60, 0→100, 0→90, 0→5) over ~700ms —
appropriate here because these are fixed, factual, non-promotional numbers.

---

### 03 — What Is the IMAT

**Copy (snippet-optimized, ~100 words):**
```
The International Medical Admissions Test (IMAT) is an English-language
entrance examination used for admission to participating English-taught
Medicine & Surgery programmes at Italian public universities. It tests
scientific knowledge alongside logical reasoning, problem solving and
reading-related skills, in a single 100-minute sitting. The exam is
time-limited, so effective preparation requires both subject mastery and
exam strategy — not one or the other. Not every Italian Medicine
programme uses the IMAT, so confirming your target university's
admission route is an important early step.
```

**Design:** Full-width text block, max-width ~700px, centered, generous
line-height — a visual breather between card-heavy sections.

---

### 04 — Key Dates & Registration

**Copy:**
```
H2: Mark Your Calendar

Exam Date: [pull current-year confirmed date]
Registration Opens: [pull current]
Registration Closes: [pull current]
Exam Fee: [pull current]
Results/Ranking: [pull current milestone if published]

Callout: "Dates, fees and procedures are set annually by the Italian
Ministry of University and Research (MUR) — always verify current
information on Universitaly.it. Last verified: [date]."

Optional CTA: [Get IMAT Date Updates] (email capture)
```

**Design:** Horizontal timeline (5 nodes, connecting line) — desktop; stacked
vertical on mobile. Visually distinct from the card grid pattern used
elsewhere so this reads as "practical logistics."

**Motion:** Timeline line draws itself (stroke-dashoffset) left-to-right on
scroll-into-view; each date node pops in as the line reaches it.

---

### 05 — Exam Structure & Syllabus

**Use the verified current structure (matches your own homepage FAQ — do not
deviate from this without checking the current official year's format):**
```
Reading & Acquired Knowledge — 4 questions
Logical Reasoning & Problem Solving — 5 questions
Biology — 23 questions
Chemistry — 15 questions
Physics & Mathematics — 13 questions
Total — 60 questions
```

**Depth layer (expandable per card) — label as "core topics include," not an
exhaustive/official list, unless verified against the current syllabus:**
```
Biology — core topics include: cell biology, genetics & heredity, human
anatomy & physiology, microbiology, evolution, ecology

Chemistry — core topics include: atomic structure, chemical bonding,
stoichiometry, acids & bases, organic chemistry fundamentals, redox reactions

Physics & Mathematics — core topics include: mechanics, thermodynamics,
electromagnetism, waves & optics, algebra, probability & statistics

Logical Reasoning & Problem Solving — core topics include: numerical
reasoning, data interpretation, logical sequences

Reading & Acquired Knowledge — core topics include: reading comprehension,
general/scientific culture, critical reasoning
```
Each card footer: `→ See course modules for this subject` (links to the IMAT course page, anchored per subject).

**Motion:** Accordion-expand (250ms ease) on click, chevron rotates 180°.
Topic pills fade in staggered 30ms each on expand.

---

### 06 — Scoring + Live Score Calculator

**Copy:**
```
H2: IMAT Scoring
+1.5 Correct · −0.4 Incorrect · 0 Blank
The IMAT rewards accuracy over guessing — a wrong answer costs you,
leaving one blank costs nothing. Knowing when to answer and when to
skip is a skill, one our mock tests train explicitly.
```

**Widget:** correct/incorrect/blank inputs (must total 60) → live score out
of 90, no login required.

**Critical copy rule:** never label a result "safe," "guaranteed," or
"automatically competitive." Use: *"Use this as a starting point for your
prep plan — not an admission prediction."*

**CTAs:**
`[Take the Full Free IMAT Mock]` (routes to your real portal simulator — this
is a genuine differentiator, most competitors have nothing like it)
`[Get a Personalised Preparation Plan]` (routes to counselling booking)

**Motion:** Score number animates live as inputs change. Avoid celebratory
effects (confetti, "great score!" banners) tied to a specific number — that
edges toward an implied guarantee. Keep the motion functional, not celebratory.

---

### 07 — Is the IMAT Right for You?

**Purpose:** Segments cold traffic by intent before they hit eligibility/cost
detail — reduces bounce from visitors who aren't sure IMAT even applies to them.

**Copy (3-card layout):**
```
I want to study Medicine in English in Italy
→ See which universities and programmes use the IMAT.

I'm not sure which university fits me
→ Explore Universities

I'm not sure which admission category applies to me
→ See EU / Non-EU guidance below
```
Small note beneath: *"Not every Italian Medicine programme uses the IMAT —
confirm your target university's route."*

**Motion:** Cards fade-up on scroll, subtle hover lift (4px translateY + shadow increase).

---

### 08 — EU vs Non-EU & Admission Category

**Copy:**
```
### EU Candidates
EU citizens — and non-EU citizens legally resident in Italy who meet the
criteria — apply through the EU procedure and quota.

### Non-EU Candidates
Applying from outside the EU means a separate quota and process, generally
including pre-enrolment at an Italian embassy/consulate tied to your visa.

Callout: "Rules, quotas and procedures are set by MUR/Universitaly and can
change — always confirm your category and process on Universitaly.it."
```

**"Which one am I?" helper (keep this — genuinely useful, low-risk since it's
a logic check, not a claim about outcomes):**
```
EU citizen, or non-EU legally resident in Italy meeting the criteria? → EU pool.
Applying from abroad on a student visa? → Non-EU pool.
Still unsure? [Ask us on WhatsApp →]
```

**Motion:** Cards tilt slightly on hover (subtle 3D perspective); helper box slides in after both cards are visible.

---

### 09 — Where Can You Study — University Snapshot

**Content:** Pull 3-4 cards live from your `/universities` database.
```
[University Name] — [City]
English-taught Medicine: Yes · [Programme length] · [View Details →]
```
**Only show tuition figures here if they're live-maintained and confirmed
current** (your `/universities` page already fact-checks and dates each
entry — reuse that same verified data, don't hand-type stale numbers into
this page separately).

**Design:** Horizontal scroll-snap carousel (mobile), 3-up grid (desktop) — match existing `/universities` card style.

**Motion:** Cards fade+slide in on scroll; link underlines on hover.

---

### 10 — Cost of Studying Medicine in Italy

**Copy:**
```
H2: What Does It Cost to Study Medicine in Italy?
Italian public universities generally charge tuition scaled to family
income (ISEE), often notably lower than private medical programmes
elsewhere in Europe. Regional scholarships (DSU) can reduce or cover
tuition and include a living stipend for eligible students, including
international applicants.

[Explore Costs & Scholarships →]
```
Avoid stating a specific €-range here unless it's current and matched to
what's published on your dedicated scholarships/costs page — keep this
section directional and link out to the maintained source of truth.

**Motion:** None needed — this section works as calm, confidence-building text after two data-dense sections.

---

### 11 — How Ahsora Prepares You (merged methodology section)

**Purpose:** Combines what were four overlapping sections into one, organized
as three clear sub-parts, so nothing is lost but nothing repeats.

**Copy:**
```
H2: How Ahsora Prepares You

The Ahsora Signature Learning Cycle:
Learn → Practice → Test → Analyze → Improve → Repeat

Learn — understand the concept, not just memorize it.
Practice — apply it through IMAT-style questions.
Test — full-length mocks under real exam conditions and timing.
Analyze — see exactly where marks were lost, by topic and by timing.
Improve — targeted practice on your specific weak points.
Repeat — return stronger for the next cycle.

Sub-section A — Live Teaching
Ahsora combines structured digital preparation with live, teacher-led
classes — difficult concepts explained, questions discussed, and doubts
resolved in real time. Recordings available for every session.

Sub-section B — Mocks, Question Bank & Analytics
Full-length timed mocks with official-style scoring, detailed question
review, subject/topic performance breakdown, and timing analysis so you
know exactly what to fix before the real exam.

[View the IMAT Course →] (links to $499 · 64 lectures · 18 mock tests course page — only display the rating/enrolment figure if it's real and current)
```

**Design:** Icon-led step row for the 6-stage cycle (visual anchor), then two
side-by-side content blocks below for Live Teaching / Mocks & Analytics —
avoids the four-separate-sections repetition while keeping full detail.

**Motion:** Step icons draw/pulse in sequence on scroll (matches homepage
Learning Cycle treatment for brand consistency — this section is the natural
extension of that homepage component, so reuse its exact animation).

---

### 12 — Ahsora Preparation Paths

**Copy:**
```
H2: Choose Your Ahsora Preparation Path

Ahsora IMAT Ascent — independent, structured self-paced preparation.
Ahsora IMAT Mastery — structured preparation + live teacher-led classes.
Ahsora MedPath Elite — full IMAT preparation + university & admissions support.

[Compare Programmes →]
```
Only include ratings, enrolment counts, or "most popular" badges if they're
real and current — if unverified, omit rather than estimate.

**Motion:** Reuse your existing pricing-card component/animation from the
homepage packages section for consistency — no need to reinvent this.

---

### 13 — The Full Journey — IMAT to Medical School

**Purpose:** Positions Ahsora as an end-to-end guide, not just an exam-prep
shop — a genuinely good strategic addition.

**Copy (8-step horizontal or vertical flow):**
```
1. Understand the IMAT → 2. Identify target universities → 3. Build your
prep plan → 4. Learn & practise → 5. Sit the IMAT → 6. Review your
ranking & options → 7. Complete university procedures → 8. Begin Medicine
in Italy
```

**Motion:** Simple horizontal stepper, each node fades/slides in sequentially
on scroll; connecting line draws progressively (same technique as Section 04's timeline, reused for consistency).

---

### 14 — Free IMAT Starter Kit (Lead Magnet)

**Copy:**
```
H2: Get the Free IMAT Starter Kit
Syllabus overview, subject checklist, recommended study order, a study
timeline, mock-test strategy, and a university-planning checklist —
sent straight to your inbox.

[Name] [Email] [Get the Free Starter Kit →]
```

**Design:** Contrasting background band so it reads as a distinct
micro-conversion moment, not another content block.

**Motion:** Input focus states get a soft glow (match button hover
treatment); success state shows a checkmark + "Check your inbox" micro-animation.

---

### 15 — FAQ + Final CTA

**FAQ (full answers visible in HTML, not click-injected):**
```
What is the IMAT?
How many questions are in each section?
How is the IMAT scored?
When is the IMAT exam held?
Who can take the IMAT?
Which universities accept IMAT scores?
What score do I need?
Can I retake the IMAT?
How should I prepare?
Does Ahsora offer live classes?
Which Ahsora programme is right for me?
```
All answers must be accurate and current — apply the Claim Rules from
Section 0 to every answer, especially score/university/eligibility questions.

**Final CTA:**
```
H2: Ready to Start Your IMAT Preparation?
Take the free diagnostic, understand your starting point, and choose the
preparation path that fits you.

[Take the Free IMAT Mock]   [Explore Programmes]
```

**Motion:** Standard accordion expand/collapse for FAQ. CTA section: buttons scale on hover, matches site-wide button treatment.

---

## 4. Global Design Notes for Dev

- Reuse existing design tokens (colors, spacing, button styles, card
  radius/shadow) from the homepage and `/universities` — this page should
  feel like a natural extension of the site.
- Sticky in-page anchor nav once scrolled past hero: Overview / Dates /
  Syllabus / Scoring / Eligibility / Cost / Programmes / FAQ.
- Score calculator and carousels: lightweight client components, lazy-loaded
  below the fold, don't block initial page load.
- Motion language consistency: fade-up + stagger on scroll-in is your
  existing site pattern — apply uniformly rather than introducing new
  transition styles per section. Reserve celebratory/high-energy motion
  (counters, pulses) for objective facts, not for anything touching a
  projected score or outcome claim.

---

## 5. Pre-Launch Quality Check

- [ ] Current official exam structure verified against MUR/Universitaly for the exam year being published
- [ ] Exam date, registration window, and fee verified and dated ("last verified: ___")
- [ ] EU/non-EU category rules verified current
- [ ] University card data matches the live, fact-checked `/universities` database
- [ ] Every statistic on the page (pass rate, student count, ratings) is real and current — remove anything that can't be verified
- [ ] Score calculator copy avoids "guaranteed/safe/competitive" language
- [ ] FAQ answers are visible in page HTML, not JS-injected-only
- [ ] All internal links resolve (courses, universities, scholarships, mock portal)
- [ ] Mobile layout checked for the timeline, accordion, and carousel components
