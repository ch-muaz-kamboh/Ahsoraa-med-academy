'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  Columns,
  Table as TableIcon,
  Sparkles,
  X,
  FileSpreadsheet,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import {
  CutoffStoreState,
  CutoffColumn,
  CutoffRow,
  getCutoffStore,
  saveCutoffStore,
  addCutoffRow,
  updateCutoffRow,
  deleteCutoffRow,
  addCutoffColumn,
  deleteCutoffColumn,
  addCutoffYear,
  resetCutoffStoreToDefault,
  parseAndImportCutoffCsv,
  syncCutoffStoreFromSupabase
} from '@/lib/cutoff-store';

export default function CutoffTableManager() {
  const [store, setStore] = useState<CutoffStoreState>(() => getCutoffStore());
  const [selectedPool, setSelectedPool] = useState<'EU' | 'Non-EU'>('EU');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modals state
  const [showAddRowModal, setShowAddRowModal] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, string>>({
    university: '',
    seats: '',
    seatsLeft: '—',
    round1Cutoff: '',
    finalCutoff: 'Pending',
  });

  const [showAddColModal, setShowAddColModal] = useState(false);
  const [newColLabel, setNewColLabel] = useState('');
  const [newColAlign, setNewColAlign] = useState<'left' | 'center' | 'right'>('center');

  const [showAddYearModal, setShowAddYearModal] = useState(false);
  const [newYearInput, setNewYearInput] = useState('');

  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvInput, setCsvInput] = useState('');

  // Editing row modal
  const [editingRow, setEditingRow] = useState<CutoffRow | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    // Initial sync
    syncCutoffStoreFromSupabase().then((data) => {
      setStore(data);
    });

    const handleUpdate = (e: any) => {
      if (e.detail) setStore(e.detail);
      else setStore(getCutoffStore());
    };

    window.addEventListener('ahsora_cms_cutoffs_updated', handleUpdate);
    return () => window.removeEventListener('ahsora_cms_cutoffs_updated', handleUpdate);
  }, []);

  const currentPoolData = store[selectedPool] || {};
  const currentTable = currentPoolData[selectedYear] || {
    columns: [],
    rows: [],
  };

  const availableYears = Object.keys(currentPoolData).sort((a, b) => Number(b) - Number(a));
  if (!availableYears.includes(selectedYear) && availableYears.length > 0) {
    setSelectedYear(availableYears[0]);
  }

  const filteredRows = currentTable.rows.filter((r) =>
    r.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers
  const handleCreateRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRowData.university.trim()) {
      showToast('error', 'Please enter a university name');
      return;
    }
    const updated = addCutoffRow(selectedPool, selectedYear, newRowData);
    setStore({ ...updated });
    setShowAddRowModal(false);
    setNewRowData({
      university: '',
      seats: '',
      seatsLeft: '—',
      round1Cutoff: '',
      finalCutoff: 'Pending',
    });
    showToast('success', `✅ Added "${newRowData.university}" to ${selectedPool} ${selectedYear} table!`);
  };

  const handleSaveEditRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;
    const updated = updateCutoffRow(selectedPool, selectedYear, editingRow.id, editingRow);
    setStore({ ...updated });
    setEditingRow(null);
    showToast('success', `✅ Updated record for "${editingRow.university}"!`);
  };

  const handleDeleteRow = (row: CutoffRow) => {
    if (confirm(`Are you sure you want to delete ${row.university} from ${selectedPool} ${selectedYear}?`)) {
      const updated = deleteCutoffRow(selectedPool, selectedYear, row.id);
      setStore({ ...updated });
      showToast('success', `Deleted "${row.university}".`);
    }
  };

  const handleCreateCol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColLabel.trim()) {
      showToast('error', 'Please enter a column name.');
      return;
    }
    const updated = addCutoffColumn(selectedPool, selectedYear, newColLabel, newColAlign);
    setStore({ ...updated });
    setShowAddColModal(false);
    setNewColLabel('');
    showToast('success', `✅ Added column "${newColLabel}" to ${selectedPool} ${selectedYear} table!`);
  };

  const handleDeleteCol = (col: CutoffColumn) => {
    if (confirm(`Delete custom column "${col.label}"? All data in this column will be removed.`)) {
      const updated = deleteCutoffColumn(selectedPool, selectedYear, col.id);
      setStore({ ...updated });
      showToast('success', `Column "${col.label}" removed.`);
    }
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;
    const updated = addCutoffYear(newYearInput.trim(), '2026');
    setStore({ ...updated });
    setSelectedYear(newYearInput.trim());
    setShowAddYearModal(false);
    setNewYearInput('');
    showToast('success', `✅ Created cycle year "${newYearInput}"!`);
  };

  const handleImportCsv = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) {
      showToast('error', 'Please paste CSV content.');
      return;
    }
    const result = parseAndImportCutoffCsv(selectedPool, selectedYear, csvInput);
    if (result.success) {
      setStore(getCutoffStore());
      setShowCsvModal(false);
      setCsvInput('');
      showToast('success', `✅ Successfully imported ${result.count} universities for ${selectedPool} ${selectedYear}!`);
    } else {
      showToast('error', result.error || 'Failed to import CSV.');
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset entire Cutoff database to official default data? All custom modifications will be replaced with verified MUR/Universitaly data.')) {
      const def = resetCutoffStoreToDefault();
      setStore(def);
      showToast('success', '✅ Cutoff tables reset to official 2026 and historical defaults.');
    }
  };

  // Quick stats
  const totalSeats = currentTable.rows.reduce((acc, r) => {
    const val = Number(r.seats);
    return !isNaN(val) ? acc + val : acc;
  }, 0);

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 99999,
            backgroundColor: toast.type === 'success' ? '#065F46' : '#991B1B',
            color: '#FFFFFF',
            padding: '14px 22px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <TableIcon size={22} color="#059669" />
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Live IMAT Cutoff Table &amp; Quota Manager
            </h2>
            <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
              Admin Live CMS
            </span>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0, maxWidth: '780px' }}>
            Full control over official Italian public medical university cutoffs, seat allocations, and scrollings. Add or delete rows, create custom columns, and instantly sync with the public website.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCsvModal(true)}
            className="btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={14} /> Import / Paste CSV
          </button>
          <button
            onClick={handleResetDefaults}
            className="btn-outline"
            style={{ padding: '8px 14px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B' }}
            title="Reset to official 2026 data"
          >
            <RotateCcw size={14} /> Defaults
          </button>
          <button
            onClick={() => {
              saveCutoffStore(store);
              showToast('success', '💾 Cutoff table saved and published live to public website!');
            }}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={14} /> Save &amp; Publish Live
          </button>
        </div>
      </div>

      {/* Control Strip: Pool Selector, Year Selector & Actions */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Pool Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
            Contingent Pool:
          </span>
          <div style={{ display: 'flex', backgroundColor: '#E2E8F0', borderRadius: '10px', padding: '3px' }}>
            {(['EU', 'Non-EU'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPool(p)}
                style={{
                  padding: '6px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedPool === p ? '#0F172A' : 'transparent',
                  color: selectedPool === p ? '#FFFFFF' : '#475569',
                  transition: 'all 0.2s ease',
                }}
              >
                {p === 'EU' ? '🇪🇺 EU Candidates' : '🌍 Non-EU (International)'}
              </button>
            ))}
          </div>

          {/* Year Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
              Cycle:
            </span>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedYear === yr ? '#059669' : '#FFFFFF',
                  color: selectedYear === yr ? '#FFFFFF' : '#475569',
                  boxShadow: selectedYear === yr ? '0 2px 6px rgba(5,150,105,0.3)' : '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.15s ease',
                }}
              >
                {yr} {yr === '2026' && '⚡'}
              </button>
            ))}
            <button
              onClick={() => setShowAddYearModal(true)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: '1px dashed #CBD5E1',
                backgroundColor: '#FFFFFF',
                color: '#64748B',
                cursor: 'pointer',
              }}
              title="Add a new academic year cycle"
            >
              + Year
            </button>
          </div>
        </div>

        {/* Action Buttons: Add Row & Add Column */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowAddColModal(true)}
            className="btn-outline"
            style={{ padding: '7px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Columns size={14} /> + Add Column
          </button>
          <button
            onClick={() => setShowAddRowModal(true)}
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Plus size={14} /> + Add University Row
          </button>
        </div>
      </div>

      {/* Filter / Search Bar & Summary Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search universities in this table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.84rem',
              backgroundColor: '#FFFFFF',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', color: '#64748B' }}>
          <span>
            Institutions: <strong style={{ color: '#0F172A' }}>{currentTable.rows.length}</strong>
          </span>
          {totalSeats > 0 && (
            <span>
              Total Verified Seats: <strong style={{ color: '#059669' }}>{totalSeats}</strong>
            </span>
          )}
          <span>
            Current View: <strong style={{ color: '#0F172A' }}>{selectedPool} · {selectedYear}</strong>
          </span>
        </div>
      </div>

      {/* Interactive Table */}
      <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '12px 14px', width: '40px', textAlign: 'center', fontSize: '0.75rem' }}>#</th>
              {currentTable.columns.map((col) => (
                <th
                  key={col.id}
                  style={{
                    padding: '12px 16px',
                    textAlign: col.align || 'left',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span>{col.label}</span>
                    {!col.isDefault && (
                      <button
                        onClick={() => handleDeleteCol(col)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', padding: '2px' }}
                        title={`Delete custom column "${col.label}"`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th style={{ padding: '12px 16px', textAlign: 'center', width: '100px', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={currentTable.columns.length + 2} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  No university records match your filter. Click "+ Add University Row" or "+ Import CSV" to populate data.
                </td>
              </tr>
            ) : (
              filteredRows.map((row, idx) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FBFDFB',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FBFDFB')}
                >
                  <td style={{ padding: '12px 14px', textAlign: 'center', color: '#94A3B8', fontSize: '0.78rem' }}>
                    {idx + 1}
                  </td>

                  {currentTable.columns.map((col) => {
                    const val = row[col.id] !== undefined ? String(row[col.id]) : '—';
                    const isRound1 = col.id === 'round1Cutoff';
                    const isFinal = col.id === 'finalCutoff';
                    const isUniv = col.id === 'university';

                    return (
                      <td
                        key={col.id}
                        style={{
                          padding: '12px 16px',
                          textAlign: col.align || 'left',
                          fontWeight: isUniv ? 700 : isRound1 || isFinal ? 700 : 500,
                          color: isRound1 ? '#059669' : isUniv ? '#0F172A' : '#334155',
                          whiteSpace: isUniv ? 'normal' : 'nowrap',
                          maxWidth: isUniv ? '340px' : 'auto',
                        }}
                      >
                        {val === 'Pending' ? (
                          <span style={{ color: '#D97706', fontSize: '0.8rem', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '4px' }}>
                            Pending
                          </span>
                        ) : val === 'N/A' ? (
                          <span style={{ color: '#94A3B8', fontStyle: 'italic' }}>N/A</span>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}

                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => setEditingRow({ ...row })}
                        style={{
                          backgroundColor: '#F1F5F9',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 8px',
                          cursor: 'pointer',
                          color: '#0F172A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                        title="Edit Row"
                      >
                        <Edit2 size={13} color="#059669" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row)}
                        style={{
                          backgroundColor: '#FEE2E2',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '5px 8px',
                          cursor: 'pointer',
                          color: '#DC2626',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Delete Record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL 1: ADD NEW ROW ──────────────────────────────────────────────── */}
      {showAddRowModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '580px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Add University Record ({selectedPool} · {selectedYear})
              </h3>
              <button onClick={() => setShowAddRowModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRow}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    University Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Università degli Studi di Milano (La Statale)"
                    value={newRowData.university || ''}
                    onChange={(e) => setNewRowData({ ...newRowData, university: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Total Seats
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 60 or Pending"
                      value={newRowData.seats || ''}
                      onChange={(e) => setNewRowData({ ...newRowData, seats: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Seats Left After Round 1
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. — or 4"
                      value={newRowData.seatsLeft || ''}
                      onChange={(e) => setNewRowData({ ...newRowData, seatsLeft: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Round 1 Cutoff
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 74.9 or Pending"
                      value={newRowData.round1Cutoff || ''}
                      onChange={(e) => setNewRowData({ ...newRowData, round1Cutoff: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Final Cutoff
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 68.2 or Pending"
                      value={newRowData.finalCutoff || ''}
                      onChange={(e) => setNewRowData({ ...newRowData, finalCutoff: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                {/* Custom columns inputs if any */}
                {currentTable.columns.filter((c) => !c.isDefault).map((c) => (
                  <div key={c.id}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {c.label} (Custom Column)
                    </label>
                    <input
                      type="text"
                      value={newRowData[c.id] || ''}
                      onChange={(e) => setNewRowData({ ...newRowData, [c.id]: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddRowModal(false)} className="btn-outline" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT ROW ─────────────────────────────────────────────────── */}
      {editingRow && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '580px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Edit Record: {editingRow.university}
              </h3>
              <button onClick={() => setEditingRow(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditRow}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    University Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRow.university}
                    onChange={(e) => setEditingRow({ ...editingRow, university: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Total Seats
                    </label>
                    <input
                      type="text"
                      value={String(editingRow.seats || '')}
                      onChange={(e) => setEditingRow({ ...editingRow, seats: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Seats Left After Round 1
                    </label>
                    <input
                      type="text"
                      value={editingRow.seatsLeft || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, seatsLeft: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Round 1 Cutoff
                    </label>
                    <input
                      type="text"
                      value={editingRow.round1Cutoff || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, round1Cutoff: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Final Cutoff
                    </label>
                    <input
                      type="text"
                      value={editingRow.finalCutoff || ''}
                      onChange={(e) => setEditingRow({ ...editingRow, finalCutoff: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                {/* Custom columns */}
                {currentTable.columns.filter((c) => !c.isDefault).map((c) => (
                  <div key={c.id}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      {c.label} (Custom Column)
                    </label>
                    <input
                      type="text"
                      value={String(editingRow[c.id] || '')}
                      onChange={(e) => setEditingRow({ ...editingRow, [c.id]: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setEditingRow(null)} className="btn-outline" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: ADD COLUMN ──────────────────────────────────────────────── */}
      {showAddColModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '460px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Add Custom Column
              </h3>
              <button onClick={() => setShowAddColModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCol}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Column Header Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Round 2 Cutoff, Accepted Rank, Campus"
                    value={newColLabel}
                    onChange={(e) => setNewColLabel(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Text Alignment
                  </label>
                  <select
                    value={newColAlign}
                    onChange={(e: any) => setNewColAlign(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  >
                    <option value="left">Left Align</option>
                    <option value="center">Center Align</option>
                    <option value="right">Right Align</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                <button type="button" onClick={() => setShowAddColModal(false)} className="btn-outline" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  Add Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ADD ACADEMIC YEAR ────────────────────────────────────────── */}
      {showAddYearModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Add New Cycle Year
              </h3>
              <button onClick={() => setShowAddYearModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateYear}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Year Label (e.g. 2027)
              </label>
              <input
                type="text"
                required
                placeholder="2027"
                value={newYearInput}
                onChange={(e) => setNewYearInput(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', marginBottom: '20px' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAddYearModal(false)} className="btn-outline" style={{ padding: '8px 16px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px' }}>
                  Create Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 5: IMPORT / PASTE CSV ───────────────────────────────────────── */}
      {showCsvModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '680px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={20} color="#059669" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Import Cutoffs from CSV ({selectedPool} · {selectedYear})
                </h3>
              </div>
              <button onClick={() => setShowCsvModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>
              Paste standard comma-separated cutoff text containing columns like:
              <br />
              <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.78rem' }}>
                UNIVERSITY,TOTAL SEATS,SEATS LEFT AFTER ROUND 1,ROUND 1 CUTOFF,FINAL CUTOFF
              </code>
            </p>

            <form onSubmit={handleImportCsv}>
              <textarea
                required
                rows={10}
                placeholder={`UNIVERSITY,TOTAL SEATS,SEATS LEFT AFTER ROUND 1,ROUND 1 CUTOFF,FINAL CUTOFF\nUniversità della Campania «Luigi Vanvitelli»,70,,66.7,\nUniversità degli Studi di Messina,55,,65.2,...`}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                  Target: <strong>{selectedPool}</strong> · <strong>{selectedYear}</strong>
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setShowCsvModal(false)} className="btn-outline" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 22px' }}>
                    Parse &amp; Import Rows
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
