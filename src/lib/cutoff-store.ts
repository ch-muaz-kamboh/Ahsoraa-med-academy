'use client';

import { createClient } from '@/lib/supabase/client';

export interface CutoffColumn {
  id: string; // e.g. "university", "seats", "seatsLeft", "round1Cutoff", "finalCutoff", or custom "col_..."
  label: string; // Header title e.g. "University", "Total Seats", "Seats Left After Round 1"
  align?: 'left' | 'center' | 'right';
  isDefault?: boolean;
}

export interface CutoffRow {
  id: string;
  university: string;
  seats: string | number;
  seatsLeft: string;
  round1Cutoff: string;
  finalCutoff: string;
  [key: string]: any; // Allow dynamic custom column values
}

export interface CutoffPoolYearData {
  columns: CutoffColumn[];
  rows: CutoffRow[];
}

export type CutoffStoreState = Record<string, Record<string, CutoffPoolYearData>>;

export const DEFAULT_CUTOFF_COLUMNS: CutoffColumn[] = [
  { id: 'university', label: 'University', align: 'left', isDefault: true },
  { id: 'seats', label: 'Total Seats', align: 'center', isDefault: true },
  { id: 'seatsLeft', label: 'Seats Left After Round 1', align: 'center', isDefault: true },
  { id: 'round1Cutoff', label: 'Round 1 Cutoff', align: 'center', isDefault: true },
  { id: 'finalCutoff', label: 'Final Cutoff', align: 'center', isDefault: true },
];

// ── LATEST 2026 ATTACHED OFFICIAL DATA (EU & NON-EU) ──────────────────────────
const INITIAL_2026_NON_EU: CutoffRow[] = [
  { id: 'neu-1', university: 'Università della Campania «Luigi Vanvitelli»', seats: 50, seatsLeft: '—', round1Cutoff: 'Pending', finalCutoff: 'Pending' },
  { id: 'neu-2', university: 'Università degli Studi di Messina', seats: 56, seatsLeft: '—', round1Cutoff: '71.1', finalCutoff: 'Pending' },
  { id: 'neu-3', university: 'Università degli Studi di Catania', seats: 60, seatsLeft: '—', round1Cutoff: '69.9', finalCutoff: 'Pending' },
  { id: 'neu-4', university: 'Università degli Studi di Firenze', seats: 0, seatsLeft: '—', round1Cutoff: 'N/A', finalCutoff: 'N/A (0 Seats)' },
  { id: 'neu-5', university: 'Università degli Studi di Padova — MedTech', seats: 'Pending', seatsLeft: '—', round1Cutoff: '73.7', finalCutoff: 'Pending' },
  { id: 'neu-6', university: 'Università degli Studi di Milano (La Statale)', seats: 25, seatsLeft: '—', round1Cutoff: '80.6', finalCutoff: 'Pending' },
  { id: 'neu-7', university: 'Università degli Studi di Milano-Bicocca', seats: 18, seatsLeft: '—', round1Cutoff: '75.2', finalCutoff: 'Pending' },
  { id: 'neu-8', university: 'Università di Roma «La Sapienza»', seats: 13, seatsLeft: '—', round1Cutoff: '76.0', finalCutoff: 'Pending' },
  { id: 'neu-9', university: 'Università di Bologna', seats: 20, seatsLeft: '—', round1Cutoff: '77.9', finalCutoff: 'Pending' },
  { id: 'neu-10', university: 'Università degli Studi di Pavia', seats: 40, seatsLeft: '—', round1Cutoff: '75.3', finalCutoff: 'Pending' },
  { id: 'neu-11', university: 'Università degli Studi di Padova (Venice)', seats: 25, seatsLeft: '—', round1Cutoff: '72.9', finalCutoff: 'Pending' },
  { id: 'neu-12', university: 'Università degli Studi di Torino', seats: 32, seatsLeft: '—', round1Cutoff: 'Pending', finalCutoff: 'Pending' },
  { id: 'neu-13', university: 'Università di Roma «Tor Vergata»', seats: 20, seatsLeft: '—', round1Cutoff: '70.7', finalCutoff: 'Pending' },
  { id: 'neu-14', university: 'Università degli Studi di Parma (Piacenza)', seats: 45, seatsLeft: '—', round1Cutoff: '71.5', finalCutoff: 'Pending' },
  { id: 'neu-15', university: 'Università de Napoli Federico II', seats: 45, seatsLeft: '—', round1Cutoff: '74.8', finalCutoff: 'Pending' },
  { id: 'neu-16', university: 'Università degli Studi di Siena (Dentistry LM-46)', seats: 8, seatsLeft: '—', round1Cutoff: '52.0', finalCutoff: 'Pending' },
  { id: 'neu-17', university: 'Università Politecnica delle Marche', seats: 20, seatsLeft: '—', round1Cutoff: '73.0', finalCutoff: 'Pending' },
  { id: 'neu-18', university: 'Università degli Studi di Bari Aldo Moro', seats: 11, seatsLeft: '—', round1Cutoff: '69.9', finalCutoff: 'Pending' },
  { id: 'neu-19', university: 'Università degli Studi di Cagliari', seats: 20, seatsLeft: '—', round1Cutoff: '61.5', finalCutoff: 'Pending' },
];

const INITIAL_2026_EU: CutoffRow[] = [
  { id: 'eu-1', university: 'Università della Campania «Luigi Vanvitelli»', seats: 70, seatsLeft: '—', round1Cutoff: '66.7', finalCutoff: 'Pending' },
  { id: 'eu-2', university: 'Università degli Studi di Messina', seats: 55, seatsLeft: '—', round1Cutoff: '65.2', finalCutoff: 'Pending' },
  { id: 'eu-3', university: 'Università degli Studi di Catania', seats: 40, seatsLeft: '—', round1Cutoff: '65.5', finalCutoff: 'Pending' },
  { id: 'eu-4', university: 'Università degli Studi di Firenze', seats: 50, seatsLeft: '—', round1Cutoff: '68.1', finalCutoff: 'Pending' },
  { id: 'eu-5', university: 'Università degli Studi di Padova — MedTech', seats: 70, seatsLeft: '—', round1Cutoff: '68.5', finalCutoff: 'Pending' },
  { id: 'eu-6', university: 'Università degli Studi di Milano (La Statale)', seats: 60, seatsLeft: '—', round1Cutoff: '74.9', finalCutoff: 'Pending' },
  { id: 'eu-7', university: 'Università degli Studi di Milano-Bicocca', seats: 40, seatsLeft: '—', round1Cutoff: '72.2', finalCutoff: 'Pending' },
  { id: 'eu-8', university: 'Università di Roma «La Sapienza»', seats: 52, seatsLeft: '—', round1Cutoff: '72.7', finalCutoff: 'Pending' },
  { id: 'eu-9', university: 'Università di Bologna', seats: 140, seatsLeft: '—', round1Cutoff: '70.8', finalCutoff: 'Pending' },
  { id: 'eu-10', university: 'Università degli Studi di Pavia', seats: 103, seatsLeft: '—', round1Cutoff: '70.3', finalCutoff: 'Pending' },
  { id: 'eu-11', university: 'Università degli Studi di Padova (Venice)', seats: 75, seatsLeft: '—', round1Cutoff: '68.8', finalCutoff: 'Pending' },
  { id: 'eu-12', university: 'Università degli Studi di Torino', seats: 73, seatsLeft: '—', round1Cutoff: '70.3', finalCutoff: 'Pending' },
  { id: 'eu-13', university: 'Università di Roma «Tor Vergata»', seats: 65, seatsLeft: '—', round1Cutoff: '67.8', finalCutoff: 'Pending' },
  { id: 'eu-14', university: 'Università degli Studi di Parma (Piacenza)', seats: 80, seatsLeft: '—', round1Cutoff: '67.7', finalCutoff: 'Pending' },
  { id: 'eu-15', university: 'Università de Napoli Federico II', seats: 35, seatsLeft: '—', round1Cutoff: '69.2', finalCutoff: 'Pending' },
  { id: 'eu-16', university: 'Università degli Studi di Siena (Dentistry LM-46)', seats: 30, seatsLeft: '—', round1Cutoff: '66.2', finalCutoff: 'Pending' },
  { id: 'eu-17', university: 'Università Politecnica delle Marche', seats: 30, seatsLeft: '—', round1Cutoff: '67.7', finalCutoff: 'Pending' },
  { id: 'eu-18', university: 'Università degli Studi di Bari Aldo Moro', seats: 89, seatsLeft: '—', round1Cutoff: '66.5', finalCutoff: 'Pending' },
  { id: 'eu-19', university: 'Università degli Studi di Cagliari', seats: 80, seatsLeft: '—', round1Cutoff: '65.1', finalCutoff: 'Pending' },
];

// Historical 2025 data
const INITIAL_2025_EU: CutoffRow[] = [
  { id: 'eu25-1', university: 'Università degli Studi di Milano (La Statale)', seats: 60, seatsLeft: '4', round1Cutoff: '66.2', finalCutoff: '61.5' },
  { id: 'eu25-2', university: 'Università degli Studi di Milano-Bicocca', seats: 40, seatsLeft: '2', round1Cutoff: '64.5', finalCutoff: '59.8' },
  { id: 'eu25-3', university: 'Università di Roma «La Sapienza»', seats: 52, seatsLeft: '—', round1Cutoff: '62.4', finalCutoff: '58.0' },
  { id: 'eu25-4', university: 'Università di Bologna', seats: 140, seatsLeft: '7', round1Cutoff: '61.2', finalCutoff: '57.1' },
  { id: 'eu25-5', university: 'Università degli Studi di Pavia', seats: 103, seatsLeft: '4', round1Cutoff: '60.5', finalCutoff: '56.4' },
  { id: 'eu25-6', university: 'Università degli Studi di Padova (Venice)', seats: 75, seatsLeft: '5', round1Cutoff: '59.8', finalCutoff: '55.8' },
  { id: 'eu25-7', university: 'Università degli Studi di Torino', seats: 73, seatsLeft: '5', round1Cutoff: '59.2', finalCutoff: '55.1' },
  { id: 'eu25-8', university: 'Università di Roma «Tor Vergata»', seats: 65, seatsLeft: '3', round1Cutoff: '58.5', finalCutoff: '54.6' },
  { id: 'eu25-9', university: 'Università degli Studi di Parma (Piacenza)', seats: 80, seatsLeft: '6', round1Cutoff: '57.1', finalCutoff: '53.2' },
  { id: 'eu25-10', university: 'Università di Napoli Federico II', seats: 35, seatsLeft: '2', round1Cutoff: '56.5', finalCutoff: '52.8' },
  { id: 'eu25-11', university: 'Università degli Studi di Siena (Dentistry LM-46)', seats: 30, seatsLeft: '2', round1Cutoff: '55.9', finalCutoff: '52.1' },
  { id: 'eu25-12', university: 'Università Politecnica delle Marche', seats: 30, seatsLeft: '5', round1Cutoff: '55.4', finalCutoff: '51.7' },
  { id: 'eu25-13', university: 'Università degli Studi di Bari Aldo Moro', seats: 89, seatsLeft: '6', round1Cutoff: '55.0', finalCutoff: '51.2' },
  { id: 'eu25-14', university: 'Università degli Studi di Cagliari', seats: 80, seatsLeft: '8', round1Cutoff: '54.8', finalCutoff: '50.9' },
  { id: 'eu25-15', university: 'Università della Campania «Luigi Vanvitelli»', seats: 70, seatsLeft: '7', round1Cutoff: '54.2', finalCutoff: '50.4' },
  { id: 'eu25-16', university: 'Università degli Studi di Messina', seats: 55, seatsLeft: '5', round1Cutoff: '53.2', finalCutoff: '49.5' },
  { id: 'eu25-17', university: 'Università degli Studi di Catania', seats: 40, seatsLeft: '0', round1Cutoff: 'N/A', finalCutoff: 'N/A (40 EU seats)' },
  { id: 'eu25-18', university: 'Università degli Studi di Firenze', seats: 50, seatsLeft: '—', round1Cutoff: 'N/A', finalCutoff: 'N/A — In fase di accreditamento' },
  { id: 'eu25-19', university: 'Università degli Studi di Padova — MedTech', seats: 70, seatsLeft: '—', round1Cutoff: 'N/A', finalCutoff: 'N/A — In fase di accreditamento' },
];

const INITIAL_2025_NON_EU: CutoffRow[] = [
  { id: 'neu25-1', university: 'Università degli Studi di Milano (La Statale)', seats: 15, seatsLeft: '2', round1Cutoff: '76.5', finalCutoff: '72.9' },
  { id: 'neu25-2', university: 'Università degli Studi di Pavia', seats: 40, seatsLeft: '1', round1Cutoff: '75.8', finalCutoff: '71.9' },
  { id: 'neu25-3', university: 'Università di Bologna', seats: 20, seatsLeft: '2', round1Cutoff: '74.0', finalCutoff: '71.1' },
  { id: 'neu25-4', university: 'Università degli Studi di Milano-Bicocca', seats: 20, seatsLeft: '1', round1Cutoff: '73.2', finalCutoff: '69.5' },
  { id: 'neu25-5', university: 'Università di Roma «La Sapienza»', seats: 13, seatsLeft: '—', round1Cutoff: '71.0', finalCutoff: '65.8' },
  { id: 'neu25-6', university: 'Università della Campania «Luigi Vanvitelli»', seats: 50, seatsLeft: '4', round1Cutoff: '62.0', finalCutoff: '66.2' },
  { id: 'neu25-7', university: 'Università degli Studi di Padova (Venice)', seats: 25, seatsLeft: '2', round1Cutoff: '69.8', finalCutoff: '65.4' },
  { id: 'neu25-8', university: 'Università degli Studi di Torino', seats: 32, seatsLeft: '3', round1Cutoff: '68.5', finalCutoff: '64.8' },
  { id: 'neu25-9', university: 'Università di Roma «Tor Vergata»', seats: 20, seatsLeft: '1', round1Cutoff: '67.9', finalCutoff: '64.2' },
  { id: 'neu25-10', university: 'Università degli Studi di Parma (Piacenza)', seats: 50, seatsLeft: '3', round1Cutoff: '66.2', finalCutoff: '62.8' },
  { id: 'neu25-11', university: 'Università di Napoli Federico II', seats: 45, seatsLeft: '2', round1Cutoff: '65.5', finalCutoff: '62.1' },
  { id: 'neu25-12', university: 'Università degli Studi di Catania', seats: 40, seatsLeft: '3', round1Cutoff: '61.2', finalCutoff: '61.6' },
  { id: 'neu25-13', university: 'Università degli Studi di Siena (Dentistry LM-46)', seats: 5, seatsLeft: '1', round1Cutoff: '64.8', finalCutoff: '61.5' },
  { id: 'neu25-14', university: 'Università Politecnica delle Marche', seats: 50, seatsLeft: '2', round1Cutoff: '64.0', finalCutoff: '60.9' },
  { id: 'neu25-15', university: 'Università degli Studi di Cagliari', seats: 18, seatsLeft: '2', round1Cutoff: '62.8', finalCutoff: '59.6' },
  { id: 'neu25-16', university: 'Università degli Studi di Messina', seats: 61, seatsLeft: '3', round1Cutoff: '60.5', finalCutoff: '57.8' },
  { id: 'neu25-17', university: 'Università degli Studi di Bari Aldo Moro', seats: 11, seatsLeft: '1', round1Cutoff: '63.5', finalCutoff: '50.9' },
  { id: 'neu25-18', university: 'Università degli Studi di Firenze', seats: 0, seatsLeft: '—', round1Cutoff: 'N/A', finalCutoff: 'N/A — In fase di accreditamento' },
  { id: 'neu25-19', university: 'Università degli Studi di Padova — MedTech', seats: 15, seatsLeft: '—', round1Cutoff: 'N/A', finalCutoff: 'N/A — In fase di accreditamento' },
];

export function getDefaultCutoffStore(): CutoffStoreState {
  return {
    EU: {
      '2026': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: INITIAL_2026_EU,
      },
      '2025': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: INITIAL_2025_EU,
      },
      '2024': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: [
          { id: 'eu24-1', university: 'Università degli Studi di Milano (La Statale)', seats: 55, seatsLeft: '6', round1Cutoff: '84.7', finalCutoff: '78.2' },
          { id: 'eu24-2', university: 'Università degli Studi di Milano-Bicocca', seats: 30, seatsLeft: '3', round1Cutoff: '81.2', finalCutoff: '73.8' },
          { id: 'eu24-3', university: 'Università di Roma «La Sapienza»', seats: 45, seatsLeft: '—', round1Cutoff: '79.3', finalCutoff: '72.1' },
          { id: 'eu24-4', university: 'Università degli Studi di Padova (Venice)', seats: 76, seatsLeft: '7', round1Cutoff: '78.6', finalCutoff: '71.8' },
          { id: 'eu24-5', university: 'Università di Bologna', seats: 97, seatsLeft: '8', round1Cutoff: '76.4', finalCutoff: '70.5' },
          { id: 'eu24-6', university: 'Università degli Studi di Pavia', seats: 103, seatsLeft: '5', round1Cutoff: '73.5', finalCutoff: '68.3' },
        ],
      },
      '2023': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: [
          { id: 'eu23-1', university: 'Università degli Studi di Milano (La Statale)', seats: 55, seatsLeft: '5', round1Cutoff: '82.1', finalCutoff: '75.9' },
          { id: 'eu23-2', university: 'Università degli Studi di Milano-Bicocca', seats: 30, seatsLeft: '2', round1Cutoff: '79.0', finalCutoff: '71.5' },
          { id: 'eu23-3', university: 'Università di Roma «La Sapienza»', seats: 45, seatsLeft: '—', round1Cutoff: '77.6', finalCutoff: '70.3' },
          { id: 'eu23-4', university: 'Università di Bologna', seats: 97, seatsLeft: '11', round1Cutoff: '74.2', finalCutoff: '68.0' },
        ],
      },
    },
    'Non-EU': {
      '2026': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: INITIAL_2026_NON_EU,
      },
      '2025': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: INITIAL_2025_NON_EU,
      },
      '2024': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: [
          { id: 'neu24-1', university: 'Università degli Studi di Milano (La Statale)', seats: 25, seatsLeft: '2', round1Cutoff: '88.2', finalCutoff: '82.5' },
          { id: 'neu24-2', university: 'Università degli Studi di Milano-Bicocca', seats: 15, seatsLeft: '1', round1Cutoff: '84.6', finalCutoff: '77.9' },
          { id: 'neu24-3', university: 'Università di Roma «La Sapienza»', seats: 13, seatsLeft: '—', round1Cutoff: '84.0', finalCutoff: '76.8' },
          { id: 'neu24-4', university: 'Università di Bologna', seats: 20, seatsLeft: '2', round1Cutoff: '80.1', finalCutoff: '74.3' },
        ],
      },
      '2023': {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: [
          { id: 'neu23-1', university: 'Università degli Studi di Milano (La Statale)', seats: 25, seatsLeft: '3', round1Cutoff: '85.9', finalCutoff: '79.7' },
          { id: 'neu23-2', university: 'Università degli Studi di Milano-Bicocca', seats: 15, seatsLeft: '1', round1Cutoff: '82.3', finalCutoff: '75.6' },
          { id: 'neu23-3', university: 'Università di Roma «La Sapienza»', seats: 13, seatsLeft: '—', round1Cutoff: '81.3', finalCutoff: '74.2' },
        ],
      },
    },
  };
}

const CUTOFFS_STORAGE_KEY = 'ahsora_cms_cutoffs_data_v2';

export function getCutoffStore(): CutoffStoreState {
  if (typeof window === 'undefined') return getDefaultCutoffStore();
  try {
    const raw = localStorage.getItem(CUTOFFS_STORAGE_KEY);
    if (!raw) return getDefaultCutoffStore();
    const parsed = JSON.parse(raw);
    // Ensure both EU and Non-EU and 2026 exist
    if (!parsed.EU || !parsed['Non-EU'] || !parsed.EU['2026'] || !parsed['Non-EU']['2026']) {
      const def = getDefaultCutoffStore();
      const merged: CutoffStoreState = {
        EU: { ...def.EU, ...(parsed.EU || {}) },
        'Non-EU': { ...def['Non-EU'], ...(parsed['Non-EU'] || {}) },
      };
      // Make sure 2026 attached data is present
      if (!merged.EU['2026']) merged.EU['2026'] = def.EU['2026'];
      if (!merged['Non-EU']['2026']) merged['Non-EU']['2026'] = def['Non-EU']['2026'];
      saveCutoffStore(merged);
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error('Failed reading cutoffs store from localStorage:', err);
    return getDefaultCutoffStore();
  }
}

export function saveCutoffStore(data: CutoffStoreState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUTOFFS_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('ahsora_cms_cutoffs_updated', { detail: data }));
    window.dispatchEvent(new Event('storage'));

    // Asynchronously sync to Supabase site_content table
    const supabase = createClient();
    supabase
      .from('site_content')
      .upsert({
        id: 1,
        cutoff_data: data,
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase cutoffs sync notification:', error.message);
      });
  } catch (err) {
    console.error('Failed saving cutoffs store:', err);
  }
}

export async function syncCutoffStoreFromSupabase(): Promise<CutoffStoreState> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_content').select('*').eq('id', 1).single();
    if (!error && data && data.cutoff_data) {
      const parsed: CutoffStoreState = data.cutoff_data;
      if (parsed.EU && parsed['Non-EU']) {
        saveCutoffStore(parsed);
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Supabase cutoffs fetch skipped/fallback:', e);
  }
  return getCutoffStore();
}

// ── CRUD OPERATIONS ──────────────────────────────────────────────────────────

export function addCutoffRow(
  pool: 'EU' | 'Non-EU',
  year: string,
  rowData: Partial<CutoffRow>
): CutoffStoreState {
  const store = getCutoffStore();
  if (!store[pool]) store[pool] = {};
  if (!store[pool][year]) {
    store[pool][year] = { columns: DEFAULT_CUTOFF_COLUMNS, rows: [] };
  }

  const newRow: CutoffRow = {
    id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    university: rowData.university || 'New University Record',
    seats: rowData.seats !== undefined ? rowData.seats : 'Pending',
    seatsLeft: rowData.seatsLeft || '—',
    round1Cutoff: rowData.round1Cutoff || 'Pending',
    finalCutoff: rowData.finalCutoff || 'Pending',
    ...rowData,
  };

  store[pool][year].rows.unshift(newRow);
  saveCutoffStore(store);
  return store;
}

export function updateCutoffRow(
  pool: 'EU' | 'Non-EU',
  year: string,
  rowId: string,
  updates: Partial<CutoffRow>
): CutoffStoreState {
  const store = getCutoffStore();
  const poolYear = store[pool]?.[year];
  if (!poolYear) return store;

  poolYear.rows = poolYear.rows.map((r) => (r.id === rowId ? { ...r, ...updates } : r));
  saveCutoffStore(store);
  return store;
}

export function deleteCutoffRow(
  pool: 'EU' | 'Non-EU',
  year: string,
  rowId: string
): CutoffStoreState {
  const store = getCutoffStore();
  const poolYear = store[pool]?.[year];
  if (!poolYear) return store;

  poolYear.rows = poolYear.rows.filter((r) => r.id !== rowId);
  saveCutoffStore(store);
  return store;
}

export function addCutoffColumn(
  pool: 'EU' | 'Non-EU',
  year: string,
  colLabel: string,
  align: 'left' | 'center' | 'right' = 'center',
  defaultValue = '—'
): CutoffStoreState {
  const store = getCutoffStore();
  const poolYear = store[pool]?.[year];
  if (!poolYear) return store;

  const colId = `col_${Date.now()}_${colLabel.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 16)}`;
  const newCol: CutoffColumn = {
    id: colId,
    label: colLabel.trim(),
    align,
    isDefault: false,
  };

  poolYear.columns.push(newCol);
  poolYear.rows = poolYear.rows.map((row) => ({
    ...row,
    [colId]: defaultValue,
  }));

  saveCutoffStore(store);
  return store;
}

export function deleteCutoffColumn(
  pool: 'EU' | 'Non-EU',
  year: string,
  colId: string
): CutoffStoreState {
  const store = getCutoffStore();
  const poolYear = store[pool]?.[year];
  if (!poolYear) return store;

  poolYear.columns = poolYear.columns.filter((c) => c.id !== colId);
  poolYear.rows = poolYear.rows.map((row) => {
    const copy = { ...row };
    delete copy[colId];
    return copy;
  });

  saveCutoffStore(store);
  return store;
}

export function addCutoffYear(
  newYear: string,
  copyFromYear = '2026'
): CutoffStoreState {
  const store = getCutoffStore();
  const yearTrimmed = newYear.trim();

  for (const p of ['EU', 'Non-EU'] as const) {
    if (!store[p]) store[p] = {};
    if (!store[p][yearTrimmed]) {
      const source = store[p][copyFromYear] || {
        columns: DEFAULT_CUTOFF_COLUMNS,
        rows: [],
      };
      store[p][yearTrimmed] = {
        columns: [...source.columns],
        rows: source.rows.map((r, i) => ({
          ...r,
          id: `${p.toLowerCase()}-${yearTrimmed}-${i + 1}`,
          round1Cutoff: 'Pending',
          finalCutoff: 'Pending',
          seatsLeft: '—',
        })),
      };
    }
  }

  saveCutoffStore(store);
  return store;
}

export function resetCutoffStoreToDefault(): CutoffStoreState {
  const def = getDefaultCutoffStore();
  saveCutoffStore(def);
  return def;
}

// ── CSV PARSER / IMPORTER ────────────────────────────────────────────────────
export function parseAndImportCutoffCsv(
  pool: 'EU' | 'Non-EU',
  year: string,
  csvText: string
): { success: boolean; count: number; error?: string } {
  try {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return { success: false, count: 0, error: 'CSV must have a header line and at least one data row.' };
    }

    const header = lines[0].split(',').map((h) => h.trim().toUpperCase());
    const univIdx = header.findIndex((h) => h.includes('UNIVERSITY'));
    const seatsIdx = header.findIndex((h) => h.includes('TOTAL SEATS') || h.includes('SEATS'));
    const seatsLeftIdx = header.findIndex((h) => h.includes('SEATS LEFT'));
    const r1Idx = header.findIndex((h) => h.includes('ROUND 1') || h.includes('R1'));
    const finalIdx = header.findIndex((h) => h.includes('FINAL'));

    if (univIdx === -1) {
      return { success: false, count: 0, error: 'Could not find "UNIVERSITY" column in CSV header.' };
    }

    const rows: CutoffRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Regex CSV parse to handle quotes
      const cells: string[] = [];
      let inQuotes = false;
      let curr = '';
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"' || char === '«' || char === '»') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          cells.push(curr.trim());
          curr = '';
        } else {
          curr += char;
        }
      }
      cells.push(curr.trim());

      const univName = cells[univIdx] || '';
      if (!univName || univName.toUpperCase().includes('UNIVERSITY')) continue;

      const seatsVal = seatsIdx !== -1 && cells[seatsIdx] ? cells[seatsIdx] : 'Pending';
      const seatsLeftVal = seatsLeftIdx !== -1 && cells[seatsLeftIdx] ? cells[seatsLeftIdx] : '—';
      const r1Val = r1Idx !== -1 && cells[r1Idx] ? cells[r1Idx] : 'Pending';
      const finalVal = finalIdx !== -1 && cells[finalIdx] ? cells[finalIdx] : 'Pending';

      rows.push({
        id: `csv-${Date.now()}-${i}`,
        university: univName,
        seats: isNaN(Number(seatsVal)) ? seatsVal : Number(seatsVal),
        seatsLeft: seatsLeftVal || '—',
        round1Cutoff: r1Val || 'Pending',
        finalCutoff: finalVal || 'Pending',
      });
    }

    if (rows.length === 0) {
      return { success: false, count: 0, error: 'No valid data rows found in CSV.' };
    }

    const store = getCutoffStore();
    if (!store[pool]) store[pool] = {};
    store[pool][year] = {
      columns: DEFAULT_CUTOFF_COLUMNS,
      rows,
    };

    saveCutoffStore(store);
    return { success: true, count: rows.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err.message || 'Failed to parse CSV' };
  }
}
