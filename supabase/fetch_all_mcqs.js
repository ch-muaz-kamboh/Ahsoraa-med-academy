// fetch_all_mcqs.js
// Retrieves ALL rows from Supabase qb_questions table (bypasses the 1,000‑row REST limit) and prints the counts.

// Use node-fetch for HTTP requests (compatible across Node versions)
const fetch = require('node-fetch');

// Load environment variables from .env.local (service role key, etc.)
require('dotenv').config({ path: `${process.cwd()}/.env.local` });

// Supabase URL – from env or fallback
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://couhzxvhzdipbffrkerf.supabase.co';
// Service‑role key gets priority; fall back to anon key if missing.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';

// Debug: show which key we are using (mask part of it)
console.log('Using Supabase key:', SUPABASE_KEY ? SUPABASE_KEY.slice(0, 6) + '...' : 'none');

// Helper: fetch a page (max 1000 rows) using offset pagination
const fetchPage = async (offset) => {
  const url = `${SUPABASE_URL}/rest/v1/qb_questions?select=*&limit=1000&offset=${offset}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'count=exact',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return await res.json(); // ≤ 1000 rows
};

// Loop until a page returns fewer than 1000 rows
const fetchAll = async () => {
  let offset = 0;
  const all = [];
  while (true) {
    const page = await fetchPage(offset);
    all.push(...page);
    console.log(`Fetched ${page.length} rows (offset ${offset})`);
    if (page.length < 1000) break; // last page reached
    offset += 1000;
  }
  return all;
};

(async () => {
  try {
    const rows = await fetchAll();
    const bySubject = rows.reduce((acc, r) => {
      acc[r.subject] = (acc[r.subject] || 0) + 1;
      return acc;
    }, {});
    console.log('\n=== FINAL COUNTS ===');
    console.log(`Total rows in table                : ${rows.length}`);
    console.log(`Chemistry MCQs                     : ${bySubject['Chemistry'] || 0}`);
    console.log(`Biology MCQs                      : ${bySubject['Biology']   || 0}`);
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
})();

