// clean_and_trim.js
// Removes duplicate MCQs (keeping newest) and trims the table to the target counts
// Target: Biology 818, Chemistry 182 (total ~1000)

const fetch = require('node-fetch');
require('dotenv').config({ path: `${process.cwd()}/.env.local` });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://couhzxvhzdipbffrkerf.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('Supabase key not found');
  process.exit(1);
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  Prefer: 'return=representation',
};

const TARGET = { Biology: 820, Chemistry: 196 };

// 1️⃣ Remove duplicate rows (keep newest based on created_at)
async function cleanDuplicates() {
  let offset = 0;
  const all = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/qb_questions?select=id,created_at&order=id.asc,created_at.desc&limit=1000&offset=${offset}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Fetch duplicate list failed ${res.status}`);
    const page = await res.json();
    all.push(...page);
    if (page.length < 1000) break;
    offset += 1000;
  }
  const seen = new Set();
  for (const row of all) {
    if (seen.has(row.id)) {
      // duplicate – delete this older row
      const delUrl = `${SUPABASE_URL}/rest/v1/qb_questions?id=eq.${row.id}`;
      const delRes = await fetch(delUrl, { method: 'DELETE', headers });
      if (!delRes.ok) console.error(`Failed delete duplicate ${row.id}: ${delRes.status}`);
      else console.log(`Deleted duplicate ${row.id}`);
    } else {
      seen.add(row.id);
    }
  }
  console.log('Duplicate cleanup complete');
}

// 2️⃣ Trim each subject to its target count (keep newest rows)
async function trimSubject(subject, keep) {
  let offset = 0;
  const ids = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/qb_questions?subject=eq.${subject}&select=id,created_at&order=created_at.desc&limit=1000&offset=${offset}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Fetch ${subject} rows failed ${res.status}`);
    const page = await res.json();
    ids.push(...page.map(r => r.id));
    if (page.length < 1000) break;
    offset += 1000;
  }
  const toDelete = ids.slice(keep);
  for (const id of toDelete) {
    const delUrl = `${SUPABASE_URL}/rest/v1/qb_questions?id=eq.${id}`;
    const delRes = await fetch(delUrl, { method: 'DELETE', headers });
    if (!delRes.ok) console.error(`Failed delete ${subject} ${id}: ${delRes.status}`);
    else console.log(`Deleted extra ${subject} ${id}`);
  }
  console.log(`Trimmed ${subject} to ${keep} rows`);
}

// 3️⃣ Fetch final counts for verification
async function fetchCounts() {
  let offset = 0;
  const all = [];
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/qb_questions?select=subject&limit=1000&offset=${offset}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`Fetch final counts failed ${res.status}`);
    const page = await res.json();
    all.push(...page);
    if (page.length < 1000) break;
    offset += 1000;
  }
  const bySubject = all.reduce((acc, r) => {
    acc[r.subject] = (acc[r.subject] || 0) + 1;
    return acc;
  }, {});
  console.log('\n=== FINAL COUNTS ===');
  console.log(`Total rows in table                : ${all.length}`);
  console.log(`Chemistry MCQs                     : ${bySubject['Chemistry'] || 0}`);
  console.log(`Biology MCQs                      : ${bySubject['Biology'] || 0}`);
}

(async () => {
  try {
    await cleanDuplicates();
    await trimSubject('Chemistry', TARGET.Chemistry);
    await trimSubject('Biology', TARGET.Biology);
    await fetchCounts();
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
