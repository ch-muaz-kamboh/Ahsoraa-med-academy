// adjust_counts.js
// Deletes excess MCQs to reach target totals (Biology 818, Chemistry 182)

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

async function deleteRows(subject, limit) {
  // Fetch rows to delete
  const selectUrl = `${SUPABASE_URL}/rest/v1/qb_questions?subject=eq.${subject}&select=id&order=created_at.asc&limit=${limit}`;
  const res = await fetch(selectUrl, { headers });
  if (!res.ok) throw new Error(`Fetch select failed ${res.status}`);
  const rows = await res.json();
  for (const row of rows) {
    const delUrl = `${SUPABASE_URL}/rest/v1/qb_questions?id=eq.${row.id}`;
    const delRes = await fetch(delUrl, { method: 'DELETE', headers });
    if (!delRes.ok) console.error(`Delete failed for ${row.id}: ${delRes.status}`);
    else console.log(`Deleted ${row.id}`);
  }
}

(async () => {
  try {
    // Delete 15 Chemistry rows
    await deleteRows('Chemistry', 15);
    // Delete 1 Biology row
    await deleteRows('Biology', 1);
    console.log('Adjustment completed.');
  } catch (e) {
    console.error('Error:', e.message);
  }
})();
