# 🚀 Ahsora Meds Academy — k6 Load & Stress Testing Suite

A production-grade performance and extreme load testing suite using [Grafana k6](https://k6.io/), tailored specifically for the Ahsora Meds Academy Next.js & Supabase architecture.

---

## ⚡ Quick Start

### 1. One-Click Setup (Installs `k6`)
Run the automated PowerShell setup script from the root or `load-tests/` folder:
```powershell
.\load-tests\setup-k6.ps1
```
> This checks for `k6` in your system PATH, attempts `winget`, or automatically downloads the official standalone `k6.exe` binary into `load-tests/bin/`.

### 2. Run the Interactive Test Runner
```powershell
.\load-tests\run.ps1
```
*(Or simply double-click `load-tests\run.bat`)*

You will be prompted to choose:
1. **Smoke Test** (5 VUs, 30s) — Verifies all endpoints respond with `200 OK`
2. **Moderate Load** (200 VUs, 3m) — Simulates normal peak traffic
3. **Extreme Stress** (1,000 – 2,500+ VUs, 8m) — **"Very Very Load"** to identify breaking points
4. **Sudden Spike** (1,200 VUs surge) — Simulates sudden traffic spikes (e.g., results day or marketing push)

---

## ⚠️ CRITICAL: Testing Local vs Deployed Website

### Testing Locally
> [!CAUTION]
> **DO NOT run heavy stress tests against `npm run dev`!**
> Next.js in development mode compiles pages on-the-fly, lacks caching, and includes full source maps. Stressing `next dev` will freeze your machine with high CPU usage on even 20 VUs.

**To load test locally, always use a production build:**
```bash
# 1. Build optimized production bundle
npm run build

# 2. Start the optimized production server
npm run start
```
Then run the stress test against `http://localhost:3000`.

### Testing a Deployed Website (Vercel / Staging / Production)
Provide your target domain via parameter or CLI:
```powershell
.\load-tests\run.ps1 -Type stress -Url "https://your-domain.com" -VUs 2000
```
Or directly with the `k6` binary:
```bash
k6 run -e TARGET_URL="https://your-domain.com" -e MAX_VUS=2000 load-tests/scripts/extreme-stress-test.js
```

---

## 📊 Test Suites Breakdown

| Test Type | File | Peak Concurrency (VUs) | Duration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Smoke Test** | `scripts/smoke-test.js` | 5 | 30 seconds | Sanity check routes, headers, status codes |
| **Moderate Load** | `scripts/extreme-stress-test.js` | 200 | 3 minutes | Baseline user traffic simulation |
| **Extreme Stress** | `scripts/extreme-stress-test.js` | 2,000+ *(configurable)* | 8+ minutes | Ramp up until server / database bottleneck |
| **Spike Test** | `scripts/spike-test.js` | 1,200 instant surge | 2 minutes | Auto-scaling recovery and edge failover |

---

## 🧭 Simulated Real User Journeys

The stress test script does **not** dumbly ping a single URL; it simulates realistic student navigation flows with weighted probabilities:
1. **40% Course Discovery Flow**: Home → Courses Catalog → Specific Course Detail (`/courses/usmle-step-1-complete-mastery`, etc.)
2. **25% University & Scholarship Flow**: Universities Directory → Specific University Detail (`/universities/universita-di-bologna`) → Scholarships
3. **20% IMAT & Mock Preparation Flow**: IMAT Hub → Free Mock Page → Mock Test Detail (`/mock-tests/imat-grand-mock-03-bio-chem-foundations`)
4. **15% Institutional Flow**: News List → Article → About Us → Contact Page

Each simulated user pauses with randomized human think-times (0.3s – 1.5s) between requests.

---

## 📈 Interactive HTML Reports

Every test run automatically generates a self-contained, interactive HTML dashboard located in:
```
load-tests/reports/latest-report.html
```
The report includes:
- **Request Duration & Percentiles**: Average, Medians, p90, p95, and p99 response times.
- **Throughput & RPS**: Requests Per Second and total data transferred.
- **Failures & Status Codes**: Detailed breakdown of 2xx, 3xx, 4xx (e.g., 429 rate limits), and 5xx (server errors).
- **Time to First Byte (TTFB)**: Tracking backend and SSR latency separately from network transfer.

---

## 🔍 Key Bottlenecks to Watch For

1. **Database Connection Limits (Supabase / Postgres)**:
   - Under very high load, concurrent database queries can exhaust direct database connection pools.
   - *Fix*: Ensure Supabase connection uses the **Transaction Pooler** (port `6543`) rather than direct connections (port `5432`).
2. **Next.js Server-Side Rendering (SSR) CPU**:
   - Dynamic pages that fetch from Supabase per request consume Node.js event loop time.
   - *Fix*: Use `revalidate` (Incremental Static Regeneration - ISR) for high-traffic public pages (courses, universities, news).
3. **External Rate Limits (Gemini AI / Auth)**:
   - Routes invoking `@google/generative-ai` or `supabase.auth.admin.listUsers` will hit provider rate limits under thousands of concurrent calls.
