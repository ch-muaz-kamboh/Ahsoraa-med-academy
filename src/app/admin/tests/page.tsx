'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  StopCircle,
  Radio,
  Loader2,
  ListChecks,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Upload,
  FileText,
  Copy,
  AlertCircle,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getAllMockTestsWithCustom,
  saveCustomTestQuestions,
  resetCustomTestQuestions,
} from '@/lib/test-utils';
import { Test, TestQuestion } from '@/types';

const EMPTY_QUESTION_FORM = {
  subject: 'General Medical Sciences',
  topic: '',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  optionE: '',
  correctOption: 'A' as 'A' | 'B' | 'C' | 'D' | 'E',
  explanation: '',
};

const SAMPLE_JSON_TEMPLATE = `[
  {
    "questionText": "Which organelle is responsible for cellular respiration?",
    "subject": "Biology",
    "topic": "Cell Structure",
    "difficulty": "medium",
    "optionA": "Mitochondria",
    "optionB": "Ribosome",
    "optionC": "Golgi Apparatus",
    "optionD": "Endoplasmic Reticulum",
    "optionE": "Lysosome",
    "correctOption": "A",
    "explanation": "Mitochondria synthesize ATP via oxidative phosphorylation."
  },
  {
    "questionText": "What is the normal resting heart rate for a healthy adult?",
    "subject": "Physiology",
    "topic": "Cardiovascular",
    "difficulty": "easy",
    "optionA": "60 - 100 bpm",
    "optionB": "30 - 50 bpm",
    "optionC": "120 - 160 bpm",
    "optionD": "40 - 60 bpm",
    "optionE": "100 - 140 bpm",
    "correctOption": "A",
    "explanation": "Normal resting HR is 60 to 100 beats per minute."
  }
]`;

const SAMPLE_CSV_TEMPLATE = `questionText,optionA,optionB,optionC,optionD,optionE,correctOption,subject,topic,explanation
"Which organelle is responsible for cellular respiration?","Mitochondria","Ribosome","Golgi Apparatus","Endoplasmic Reticulum","Lysosome","A","Biology","Cell Structure","Mitochondria synthesize ATP."
"What is normal resting heart rate for a healthy adult?","60 - 100 bpm","30 - 50 bpm","120 - 160 bpm","40 - 60 bpm","100 - 140 bpm","A","Physiology","Cardiovascular","Normal resting HR is 60-100 bpm."`;

function parseBulkQuestions(rawInput: string, defaultSubject: string = 'General'): { valid: TestQuestion[]; errors: string[] } {
  const valid: TestQuestion[] = [];
  const errors: string[] = [];

  const trimmed = rawInput.trim();
  if (!trimmed) return { valid, errors: ['Input is empty. Please paste text or choose a file.'] };

  // Try JSON first
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      items.forEach((item: any, idx: number) => {
        const qText = item.questionText || item.question || item.stem || '';
        if (!qText || !String(qText).trim()) {
          errors.push(`Item ${idx + 1}: Missing question text.`);
          return;
        }

        let opts: { id: string; text: string }[] = [];
        if (Array.isArray(item.options)) {
          opts = item.options.map((o: any, oIdx: number) => {
            if (typeof o === 'string') return { id: String.fromCharCode(65 + oIdx), text: o.trim() };
            return { id: String(o.id || String.fromCharCode(65 + oIdx)).toUpperCase(), text: String(o.text || '').trim() };
          });
        } else if (item.options && typeof item.options === 'object') {
          Object.keys(item.options).forEach((k) => {
            opts.push({ id: k.toUpperCase(), text: String(item.options[k]).trim() });
          });
        } else {
          ['A', 'B', 'C', 'D', 'E'].forEach((letter) => {
            const val = item[`option${letter}`] || item[`opt${letter}`] || item[letter];
            if (val && String(val).trim()) {
              opts.push({ id: letter, text: String(val).trim() });
            }
          });
        }

        if (opts.length < 2) {
          errors.push(`Item ${idx + 1} ("${String(qText).slice(0, 25)}..."): Requires at least 2 options.`);
          return;
        }

        let correct = String(item.correctOption || item.correct || item.answer || 'A').toUpperCase().trim();
        if (correct.length > 1) {
          const match = opts.find((o) => o.text.toLowerCase() === correct.toLowerCase());
          correct = match ? match.id : 'A';
        }
        if (!['A', 'B', 'C', 'D', 'E'].includes(correct)) correct = 'A';

        valid.push({
          id: `q-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
          orderIndex: 0,
          subject: item.subject || defaultSubject,
          topic: item.topic || 'General',
          difficulty: item.difficulty === 'easy' || item.difficulty === 'hard' ? item.difficulty : 'medium',
          questionText: String(qText).trim(),
          options: opts,
          correctOption: correct as 'A' | 'B' | 'C' | 'D' | 'E',
          explanation: item.explanation || item.exp || '',
        });
      });
      return { valid, errors };
    } catch (e: any) {
      errors.push(`JSON Syntax Error: ${e.message}`);
      return { valid, errors };
    }
  }

  // Parse CSV / Delimited
  const lines = trimmed.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { valid, errors: ['No valid lines found in CSV.'] };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if ((char === ',' || char === '\t') && !inQuotes) {
        result.push(cur.trim().replace(/^"(.*)"$/, '$1'));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^"(.*)"$/, '$1'));
    return result;
  };

  const firstLineCols = parseCSVLine(lines[0]);
  const headerCheck = firstLineCols.map((c) => c.toLowerCase());
  let startIdx = 0;
  let headers: string[] = [];

  if (headerCheck.some((h) => h.includes('question') || h.includes('option') || h.includes('answer'))) {
    headers = headerCheck;
    startIdx = 1;
  }

  for (let i = startIdx; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 3) continue;

    let qText = '';
    let optA = '', optB = '', optC = '', optD = '', optE = '';
    let correct = 'A';
    let subj = defaultSubject;
    let topic = 'General';
    let explanation = '';

    if (headers.length > 0) {
      cols.forEach((col, cIdx) => {
        const h = headers[cIdx] || '';
        if (h.includes('question') || h.includes('stem')) qText = col;
        else if (h === 'optiona' || h === 'opta' || h === 'a') optA = col;
        else if (h === 'optionb' || h === 'optb' || h === 'b') optB = col;
        else if (h === 'optionc' || h === 'optc' || h === 'c') optC = col;
        else if (h === 'optiond' || h === 'optd' || h === 'd') optD = col;
        else if (h === 'optione' || h === 'opte' || h === 'e') optE = col;
        else if (h.includes('correct') || h.includes('answer')) correct = col;
        else if (h.includes('subject')) subj = col;
        else if (h.includes('topic')) topic = col;
        else if (h.includes('explanation')) explanation = col;
      });
    } else {
      qText = cols[0];
      optA = cols[1] || '';
      optB = cols[2] || '';
      optC = cols[3] || '';
      optD = cols[4] || '';
      if (cols.length >= 6) optE = cols[5] || '';
      if (cols.length >= 7) correct = cols[6] || 'A';
      if (cols.length >= 8) subj = cols[7] || defaultSubject;
      if (cols.length >= 9) explanation = cols[8] || '';
    }

    if (!qText) {
      errors.push(`Row ${i + 1}: Missing question text.`);
      continue;
    }

    const opts: { id: string; text: string }[] = [];
    if (optA) opts.push({ id: 'A', text: optA });
    if (optB) opts.push({ id: 'B', text: optB });
    if (optC) opts.push({ id: 'C', text: optC });
    if (optD) opts.push({ id: 'D', text: optD });
    if (optE) opts.push({ id: 'E', text: optE });

    if (opts.length < 2) {
      errors.push(`Row ${i + 1} ("${qText.slice(0, 25)}..."): Less than 2 options provided.`);
      continue;
    }

    let correctOpt = correct.trim().toUpperCase();
    if (correctOpt.length > 1) {
      const match = opts.find((o) => o.text.toLowerCase() === correctOpt.toLowerCase());
      correctOpt = match ? match.id : 'A';
    }
    if (!['A', 'B', 'C', 'D', 'E'].includes(correctOpt)) correctOpt = 'A';

    valid.push({
      id: `q-bulk-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      orderIndex: 0,
      subject: subj || defaultSubject,
      topic: topic || 'General',
      difficulty: 'medium',
      questionText: qText,
      options: opts,
      correctOption: correctOpt as any,
      explanation,
    });
  }

  return { valid, errors };
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [liveSession, setLiveSession] = useState<{ id: string; test_id: string; test_title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Question Management Modal State
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkParsedQuestions, setBulkParsedQuestions] = useState<TestQuestion[]>([]);
  const [bulkParseErrors, setBulkParseErrors] = useState<string[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<'JSON' | 'CSV' | null>(null);
  const [newQForm, setNewQForm] = useState({ ...EMPTY_QUESTION_FORM });
  const [formError, setFormError] = useState('');
  const [saveToast, setSaveToast] = useState('');

  const refreshTests = useCallback(() => {
    const updated = getAllMockTestsWithCustom();
    setTests(updated);
    if (activeTest) {
      const refreshedActive = updated.find((t) => t.id === activeTest.id);
      if (refreshedActive) setActiveTest(refreshedActive);
    }
  }, [activeTest]);

  // Fetch current live session from DB on mount
  const fetchLiveSession = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('test_sessions')
      .select('*')
      .eq('is_live', true)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    setLiveSession(data ?? null);
    setTests(getAllMockTestsWithCustom());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLiveSession();
  }, [fetchLiveSession]);

  const startTest = async (testId: string, testTitle: string) => {
    if (liveSession) {
      alert('Please stop the currently live test before starting a new one.');
      return;
    }
    if (!confirm(`Start "${testTitle}" for ALL enrolled students?`)) return;

    setActionLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('test_sessions')
      .insert({ test_id: testId, test_title: testTitle, is_live: true })
      .select()
      .single();

    if (!error && data) {
      setLiveSession(data);
    } else {
      alert('Failed to start test: ' + (error?.message ?? 'Unknown error'));
    }
    setActionLoading(false);
  };

  const stopTest = async () => {
    if (!liveSession) return;
    setActionLoading(true);
    const supabase = createClient();
    await supabase
      .from('test_sessions')
      .update({ is_live: false, ended_at: new Date().toISOString() })
      .eq('id', liveSession.id);

    setLiveSession(null);
    setActionLoading(false);
  };

  // Add a new question to the active test
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTest) return;

    if (!newQForm.questionText.trim()) {
      setFormError('Please enter the question text.');
      return;
    }
    if (!newQForm.optionA.trim() || !newQForm.optionB.trim() || !newQForm.optionC.trim() || !newQForm.optionD.trim()) {
      setFormError('Please fill in at least options A, B, C, and D.');
      return;
    }

    const options = [
      { id: 'A', text: newQForm.optionA.trim() },
      { id: 'B', text: newQForm.optionB.trim() },
      { id: 'C', text: newQForm.optionC.trim() },
      { id: 'D', text: newQForm.optionD.trim() },
    ];
    if (newQForm.optionE.trim()) {
      options.push({ id: 'E', text: newQForm.optionE.trim() });
    }

    const newQuestion: TestQuestion = {
      id: `q-custom-${Date.now()}`,
      orderIndex: activeTest.questions.length + 1,
      subject: newQForm.subject.trim() || activeTest.subject || 'General',
      topic: newQForm.topic.trim() || 'General',
      difficulty: newQForm.difficulty,
      questionText: newQForm.questionText.trim(),
      options,
      correctOption: newQForm.correctOption,
      explanation: newQForm.explanation.trim() || '',
    };

    const updatedQuestions = [...activeTest.questions, newQuestion];
    saveCustomTestQuestions(activeTest.id, updatedQuestions);

    setNewQForm({ ...EMPTY_QUESTION_FORM });
    setShowAddForm(false);
    setFormError('');
    setSaveToast('Question added successfully!');
    setTimeout(() => setSaveToast(''), 3000);
    refreshTests();
  };

  // Delete a question from the active test (no confirm dialog - can use Reset to undo)
  const handleDeleteQuestion = (questionId: string) => {
    if (!activeTest) return;

    const updatedQuestions = activeTest.questions
      .filter((q) => q.id !== questionId)
      .map((q, idx) => ({ ...q, orderIndex: idx + 1 }));

    saveCustomTestQuestions(activeTest.id, updatedQuestions);
    // Immediately update activeTest state so UI reflects change without full refresh
    setActiveTest((prev) => prev ? { ...prev, questions: updatedQuestions, totalQuestions: updatedQuestions.length } : null);
    setSaveToast('Question removed.');
    setTimeout(() => setSaveToast(''), 2500);
  };

  // Reset to default questions
  const handleResetQuestions = () => {
    if (!activeTest) return;
    resetCustomTestQuestions(activeTest.id);
    refreshTests();
    setSaveToast('Test reset to default questions.');
    setTimeout(() => setSaveToast(''), 2500);
  };

  // Handle parsing bulk input text
  const handleParseBulkText = (text: string) => {
    setBulkInputText(text);
    if (!text.trim()) {
      setBulkParsedQuestions([]);
      setBulkParseErrors([]);
      return;
    }
    const { valid, errors } = parseBulkQuestions(text, activeTest?.subject || 'General Medical Sciences');
    setBulkParsedQuestions(valid);
    setBulkParseErrors(errors);
  };

  // Handle bulk file upload (.json, .csv, .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        handleParseBulkText(text);
      }
    };
    reader.readAsText(file);
  };

  // Handle confirm bulk import
  const handleConfirmBulkImport = () => {
    if (!activeTest || bulkParsedQuestions.length === 0) return;

    const startingIndex = activeTest.questions.length;
    const mapped = bulkParsedQuestions.map((q, idx) => ({
      ...q,
      orderIndex: startingIndex + idx + 1,
    }));

    const updatedQuestions = [...activeTest.questions, ...mapped];
    saveCustomTestQuestions(activeTest.id, updatedQuestions);

    setSaveToast(`Successfully imported ${bulkParsedQuestions.length} questions!`);
    setTimeout(() => setSaveToast(''), 3000);
    setBulkInputText('');
    setBulkParsedQuestions([]);
    setBulkParseErrors([]);
    setShowBulkForm(false);
    refreshTests();
  };

  const handleCopyTemplate = (format: 'JSON' | 'CSV') => {
    const content = format === 'JSON' ? SAMPLE_JSON_TEMPLATE : SAMPLE_CSV_TEMPLATE;
    navigator.clipboard.writeText(content);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '12px', color: '#64748B' }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading tests...
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      {/* Toast Notification */}
      {saveToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          CBT Mock Tests Manager
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Manage mock exam questions, add new custom MCQs with 5 options, or broadcast an exam live to all students.
        </p>
      </div>

      {/* Live Session Banner */}
      {liveSession && (
        <div style={{
          backgroundColor: '#FEF2F2', border: '2px solid #EF4444', borderRadius: '16px',
          padding: '20px 24px', marginBottom: '32px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#EF4444', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🔴 Live Now — All Students Notified
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7F1D1D', marginTop: '2px' }}>
                {liveSession.test_title}
              </div>
            </div>
          </div>
          <button
            onClick={stopTest}
            disabled={actionLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
              borderRadius: '8px', border: 'none', backgroundColor: '#DC2626', color: '#FFF',
              fontWeight: 700, fontSize: '0.9375rem', cursor: actionLoading ? 'not-allowed' : 'pointer',
              opacity: actionLoading ? 0.7 : 1,
            }}
          >
            {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <StopCircle size={18} />}
            End Test for All Students
          </button>
        </div>
      )}

      {/* Test Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tests.map((test) => {
          const isLive = liveSession?.test_id === test.id;
          return (
            <div
              key={test.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: `2px solid ${isLive ? '#EF4444' : '#E2E8F0'}`,
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                    borderRadius: '20px', backgroundColor: '#F0FFF4', color: '#059669',
                    textTransform: 'uppercase', letterSpacing: '0.5px'
                  }}>
                    {test.category}
                  </span>
                  {isLive && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', backgroundColor: '#EF4444', color: '#FFF' }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {test.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
                  <strong>{test.questions.length}</strong> Questions • {test.durationMinutes} Minutes • Passing: {test.passingPercentage}%
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Manage / Add Questions Button */}
                <button
                  onClick={() => {
                    setActiveTest(test);
                    setShowAddForm(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ListChecks size={16} color="#2563EB" />
                  <span>Manage Questions ({test.questions.length})</span>
                </button>

                {/* Broadcast Live Button */}
                {isLive ? (
                  <button
                    onClick={stopTest}
                    disabled={actionLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                      borderRadius: '8px', border: 'none', backgroundColor: '#FEF2F2', color: '#DC2626',
                      fontWeight: 700, fontSize: '0.875rem', cursor: actionLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <StopCircle size={16} /> Stop Test
                  </button>
                ) : (
                  <button
                    onClick={() => startTest(test.id, test.title)}
                    disabled={actionLoading}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
                      borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#FFF',
                      fontWeight: 700, fontSize: '0.875rem', cursor: actionLoading ? 'not-allowed' : 'pointer',
                      opacity: actionLoading ? 0.7 : 1,
                    }}
                  >
                    {actionLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={16} />}
                    Start for All Students
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* QUESTION MANAGER MODAL */}
      {activeTest && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '820px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC',
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Question Manager
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                  {activeTest.title}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                  Total Questions: {activeTest.questions.length}
                </div>
              </div>
              <button
                onClick={() => setActiveTest(null)}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                  backgroundColor: '#E2E8F0', color: '#64748B', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Action Buttons: Add Single vs Bulk Import */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setShowBulkForm(false);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      backgroundColor: showAddForm ? '#F1F5F9' : '#2563EB',
                      color: showAddForm ? '#475569' : '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    {showAddForm ? <X size={16} /> : <Plus size={16} />}
                    <span>{showAddForm ? 'Cancel Single Form' : '+ Add Single Question'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowBulkForm(!showBulkForm);
                      setShowAddForm(false);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      backgroundColor: showBulkForm ? '#F1F5F9' : '#059669',
                      color: showBulkForm ? '#475569' : '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    {showBulkForm ? <X size={16} /> : <Upload size={16} />}
                    <span>{showBulkForm ? 'Cancel Bulk Import' : '📥 Bulk Import Questions'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleResetQuestions}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Reset to original defaults
                </button>
              </div>

              {/* Bulk Import Drawer */}
              {showBulkForm && (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '2px dashed #93C5FD',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                      <Upload size={18} color="#2563EB" />
                      <span>Bulk Questions Importer (JSON / CSV)</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyTemplate('JSON')}
                        style={{
                          fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px',
                          borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        {copiedFormat === 'JSON' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        {copiedFormat === 'JSON' ? 'Copied JSON!' : 'Copy JSON Format'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyTemplate('CSV')}
                        style={{
                          fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px',
                          borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        {copiedFormat === 'CSV' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                        {copiedFormat === 'CSV' ? 'Copied CSV!' : 'Copy CSV Format'}
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: '#64748B', marginBottom: '14px', lineHeight: '1.4' }}>
                    Upload a <strong>.json</strong> or <strong>.csv</strong> file, or paste your raw text/JSON below.
                  </p>

                  {/* File Upload Button */}
                  <div style={{ marginBottom: '14px' }}>
                    <label
                      htmlFor="bulk-file-input"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#334155',
                      }}
                    >
                      <FileSpreadsheet size={16} color="#059669" />
                      <span>Choose File (.json, .csv, .txt)</span>
                      <input
                        id="bulk-file-input"
                        type="file"
                        accept=".json,.csv,.txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  {/* Textarea Paste Area */}
                  <div style={{ marginBottom: '14px' }}>
                    <textarea
                      rows={6}
                      value={bulkInputText}
                      onChange={(e) => handleParseBulkText(e.target.value)}
                      placeholder="Paste JSON array or CSV text here..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontFamily: 'monospace',
                        fontSize: '0.8125rem',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  </div>

                  {/* Parse Errors Feedback */}
                  {bulkParseErrors.length > 0 && (
                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.8125rem', color: '#991B1B' }}>
                      <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <AlertCircle size={14} /> Warnings / Parsing Notes:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>
                        {bulkParseErrors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Valid Questions Preview */}
                  {bulkParsedQuestions.length > 0 && (
                    <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '12px 14px', marginBottom: '16px' }}>
                      <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} color="#166534" />
                        <span>Ready to import {bulkParsedQuestions.length} valid question(s)!</span>
                      </div>

                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {bulkParsedQuestions.slice(0, 3).map((q, idx) => (
                          <div key={idx} style={{ fontSize: '0.75rem', color: '#15803D', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Q{idx + 1}: &quot;{q.questionText.slice(0, 50)}...&quot;</span>
                            <span>Correct: {q.correctOption}</span>
                          </div>
                        ))}
                        {bulkParsedQuestions.length > 3 && (
                          <div style={{ fontSize: '0.75rem', color: '#166534', fontStyle: 'italic' }}>
                            ...and {bulkParsedQuestions.length - 3} more questions.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleConfirmBulkImport}
                      disabled={bulkParsedQuestions.length === 0}
                      style={{
                        backgroundColor: bulkParsedQuestions.length > 0 ? '#10B981' : '#9CA3AF',
                        color: '#FFFFFF',
                        padding: '10px 22px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        cursor: bulkParsedQuestions.length > 0 ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      Import {bulkParsedQuestions.length} Questions
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowBulkForm(false);
                        setBulkInputText('');
                        setBulkParsedQuestions([]);
                        setBulkParseErrors([]);
                      }}
                      style={{
                        backgroundColor: '#E2E8F0',
                        color: '#475569',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel Bulk Import
                    </button>
                  </div>
                </div>
              )}

              {/* Add Question Form Drawer */}
              {showAddForm && (
                <form
                  onSubmit={handleAddQuestion}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={16} color="#2563EB" />
                    <span>New Question Details</span>
                  </div>

                  {formError && (
                    <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8125rem', marginBottom: '14px' }}>
                      {formError}
                    </div>
                  )}

                  {/* Subject, Topic, Difficulty */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Subject</label>
                      <input
                        type="text"
                        value={newQForm.subject}
                        onChange={(e) => setNewQForm({ ...newQForm, subject: e.target.value })}
                        placeholder="e.g., Biology, Anatomy"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Topic</label>
                      <input
                        type="text"
                        value={newQForm.topic}
                        onChange={(e) => setNewQForm({ ...newQForm, topic: e.target.value })}
                        placeholder="e.g., Cell Structure, Genetics"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Difficulty</label>
                      <select
                        value={newQForm.difficulty}
                        onChange={(e) => setNewQForm({ ...newQForm, difficulty: e.target.value as any })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFF' }}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Question Text *</label>
                    <textarea
                      rows={3}
                      value={newQForm.questionText}
                      onChange={(e) => setNewQForm({ ...newQForm, questionText: e.target.value })}
                      placeholder="Type the clinical vignette or question stem here..."
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      required
                    />
                  </div>

                  {/* 5 Options with Correct Option selector */}
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                      Options (Select the radio button for the correct answer):
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(['A', 'B', 'C', 'D', 'E'] as const).map((letter) => {
                        const fieldName = `option${letter}` as 'optionA' | 'optionB' | 'optionC' | 'optionD' | 'optionE';
                        const isSelected = newQForm.correctOption === letter;
                        return (
                          <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="correctOption"
                              id={`opt-${letter}`}
                              checked={isSelected}
                              onChange={() => setNewQForm({ ...newQForm, correctOption: letter })}
                              style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
                            />
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', width: '20px', color: isSelected ? '#059669' : '#64748B' }}>
                              {letter}.
                            </span>
                            <input
                              type="text"
                              value={newQForm[fieldName]}
                              onChange={(e) => setNewQForm({ ...newQForm, [fieldName]: e.target.value })}
                              placeholder={`Option ${letter} text${letter === 'E' ? ' (optional for 4-option tests)' : ' *'}`}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: `1px solid ${isSelected ? '#10B981' : '#CBD5E1'}`,
                                backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                                fontSize: '0.875rem',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Explanation (Optional)</label>
                    <textarea
                      rows={2}
                      value={newQForm.explanation}
                      onChange={(e) => setNewQForm({ ...newQForm, explanation: e.target.value })}
                      placeholder="Why is this the correct answer? This will be shown on the results page."
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '10px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                    }}
                  >
                    Save Question to Mock Test
                  </button>
                </form>
              )}

              {/* Questions List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activeTest.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: '#EEF2FF', color: '#4F46E5', fontWeight: 700,
                          fontSize: '0.75rem', padding: '2px 8px', borderRadius: '6px'
                        }}>
                          Q{idx + 1}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          {q.subject} • {q.topic}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        title="Remove question"
                        style={{
                          background: 'none', border: 'none', color: '#EF4444',
                          cursor: 'pointer', padding: '4px'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ fontWeight: 600, color: '#0F172A', fontSize: '0.9375rem', marginBottom: '12px', lineHeight: 1.5 }}>
                      {q.questionText}
                    </p>

                    {/* Options list */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                      {q.options.map((opt) => {
                        const isCorrect = opt.id === q.correctOption;
                        return (
                          <div
                            key={opt.id}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.8125rem',
                              border: `1px solid ${isCorrect ? '#86EFAC' : '#E2E8F0'}`,
                              backgroundColor: isCorrect ? '#F0FDF4' : '#F8FAFC',
                              color: isCorrect ? '#166534' : '#334155',
                              fontWeight: isCorrect ? 600 : 400,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>{opt.id}.</span>
                            <span>{opt.text}</span>
                            {isCorrect && <CheckCircle2 size={14} color="#166534" style={{ marginLeft: 'auto' }} />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F8FAFC', padding: '8px 12px', borderRadius: '6px', marginTop: '8px' }}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px', borderTop: '1px solid #E2E8F0',
              backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setActiveTest(null)}
                style={{
                  padding: '8px 20px', borderRadius: '8px', border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF', color: '#0F172A', fontWeight: 600,
                  fontSize: '0.875rem', cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div style={{ marginTop: '40px', backgroundColor: '#F0FFF4', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '20px 24px' }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#065F46', marginBottom: '10px' }}>
          💡 How CBT Mock Test Management Works
        </div>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '0.875rem', lineHeight: '2' }}>
          <li>Click <strong>&quot;Manage Questions&quot;</strong> on any test card to see its full question roster, delete questions, or add new ones.</li>
          <li>When you add a question, choose <strong>A, B, C, D, or E</strong> as the correct answer and provide an explanation.</li>
          <li>Added questions immediately update in the test room when students take that mock exam.</li>
          <li>Click <strong>&quot;Start for All Students&quot;</strong> to broadcast a live notification across the entire student portal.</li>
        </ul>
      </div>
    </div>
  );
}
