'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Edit3,
  Download,
  Search,
  Award,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import {
  getAllMockTestsWithCustom,
  getAllMockTestsWithCustomAsync,
  saveCustomTestQuestions,
  saveTestSettingsAsync,
  resetCustomTestQuestions,
} from '@/lib/test-utils';
import { Test, TestQuestion, TestAttempt, TestDifficulty } from '@/types';

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
            return { id: o.id || String.fromCharCode(65 + oIdx), text: (o.text || '').trim() };
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

const DEFAULT_STUDENT_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att-sample-1',
    testId: 'tst-02',
    testTitle: 'IMAT Italy Section 2 & 3 High-Yield Simulation',
    studentId: 'std-ama-01',
    studentName: 'Zainab Ahmed',
    studentEmail: 'zainab.ahmed@example.com',
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 4.5).toISOString(),
    timeSpentSeconds: 1650,
    totalScore: 5.6,
    percentage: 93,
    totalAttempted: 4,
    totalCorrect: 4,
    totalIncorrect: 0,
    totalUnanswered: 0,
    accuracyRate: 100,
    percentile: 98,
    subjectBreakdown: {},
  },
  {
    id: 'att-sample-2',
    testId: 'tst-02',
    testTitle: 'IMAT Italy Section 2 & 3 High-Yield Simulation',
    studentId: 'std-ama-02',
    studentName: 'Matteo Colombo',
    studentEmail: 'matteo.colombo@gmail.com',
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 11.5).toISOString(),
    timeSpentSeconds: 1720,
    totalScore: 3.7,
    percentage: 62,
    totalAttempted: 4,
    totalCorrect: 3,
    totalIncorrect: 1,
    totalUnanswered: 0,
    accuracyRate: 75,
    percentile: 84,
    subjectBreakdown: {},
  },
  {
    id: 'att-sample-3',
    testId: 'tst-01',
    testTitle: 'USMLE Step 1 Full Diagnostic Assessment - Block 1',
    studentId: 'std-ama-03',
    studentName: 'Lucas Bernard',
    studentEmail: 'l.bernard@yahoo.fr',
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 23.2).toISOString(),
    timeSpentSeconds: 2450,
    totalScore: 7.1,
    percentage: 79,
    totalAttempted: 6,
    totalCorrect: 5,
    totalIncorrect: 1,
    totalUnanswered: 0,
    accuracyRate: 83,
    percentile: 91,
    subjectBreakdown: {},
  },
  {
    id: 'att-sample-4',
    testId: 'tst-03',
    testTitle: 'IMAT Grand Mock 3 - Biology & Chemistry Core Foundations',
    studentId: 'std-ama-04',
    studentName: 'Elena Dumitru',
    studentEmail: 'elena.dumitru@example.com',
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    timeSpentSeconds: 3200,
    totalScore: 16.5,
    percentage: 73,
    totalAttempted: 14,
    totalCorrect: 12,
    totalIncorrect: 2,
    totalUnanswered: 1,
    accuracyRate: 86,
    percentile: 88,
    subjectBreakdown: {},
  },
];

export default function AdminTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [liveSession, setLiveSession] = useState<{ id: string; test_id: string; test_title: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Active Tab: 'mocks' | 'results'
  const [adminTab, setAdminTab] = useState<'mocks' | 'results'>('mocks');

  // Edit Test Settings Modal State
  const [editingTestSettings, setEditingTestSettings] = useState<Test | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDuration, setEditDuration] = useState<number>(60);
  const [editPassingPercentage, setEditPassingPercentage] = useState<number>(50);
  const [editPassingMarks, setEditPassingMarks] = useState<number>(45);
  const [editDifficulty, setEditDifficulty] = useState<TestDifficulty>('medium');
  const [editUnlockDate, setEditUnlockDate] = useState<string>('');
  const [savingSettings, setSavingSettings] = useState(false);

  // Student Results & Score Publishing State
  const [studentAttempts, setStudentAttempts] = useState<TestAttempt[]>([]);
  const [resultsSearch, setResultsSearch] = useState('');
  const [resultsMockFilter, setResultsMockFilter] = useState('all');

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

  const loadStudentAttempts = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('ahsora_all_mock_attempts');
      if (raw) {
        const parsed = JSON.parse(raw);
        setStudentAttempts(parsed.length > 0 ? parsed : DEFAULT_STUDENT_ATTEMPTS);
      } else {
        localStorage.setItem('ahsora_all_mock_attempts', JSON.stringify(DEFAULT_STUDENT_ATTEMPTS));
        setStudentAttempts(DEFAULT_STUDENT_ATTEMPTS);
      }
    } catch {
      setStudentAttempts(DEFAULT_STUDENT_ATTEMPTS);
    }
  }, []);

  const refreshTests = useCallback(async () => {
    const updated = await getAllMockTestsWithCustomAsync();
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
    const [{ data }, customTests] = await Promise.all([
      supabase
        .from('test_sessions')
        .select('*')
        .eq('is_live', true)
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      getAllMockTestsWithCustomAsync(),
    ]);

    setLiveSession(data ?? null);
    setTests(customTests);
    loadStudentAttempts();
    setLoading(false);
  }, [loadStudentAttempts]);

  useEffect(() => {
    fetchLiveSession();
  }, [fetchLiveSession]);

  const handleSaveTestSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestSettings) return;
    if (!editTitle.trim()) {
      alert('Mock test title cannot be empty.');
      return;
    }
    if (editDuration <= 0) {
      alert('Mock test time must be at least 1 minute.');
      return;
    }

    setSavingSettings(true);
    await saveTestSettingsAsync(editingTestSettings.id, editTitle.trim(), editDuration, {
      passingPercentage: editPassingPercentage,
      passingMarks: editPassingMarks,
      difficulty: editDifficulty,
      unlockDate: editUnlockDate.trim() || undefined,
    });

    setSaveToast('Mock test details (title, time, passing marks, difficulty & unlock date) updated & synced!');
    setTimeout(() => setSaveToast(''), 3500);

    setEditingTestSettings(null);
    setSavingSettings(false);
    await refreshTests();
  };

  // Filtered Student Mock Results
  const filteredResults = useMemo(() => {
    return studentAttempts.filter((att) => {
      const matchSearch =
        !resultsSearch ||
        (att.studentName || '').toLowerCase().includes(resultsSearch.toLowerCase()) ||
        (att.studentEmail || '').toLowerCase().includes(resultsSearch.toLowerCase()) ||
        att.testTitle.toLowerCase().includes(resultsSearch.toLowerCase());

      const matchMock = resultsMockFilter === 'all' || att.testId === resultsMockFilter;
      return matchSearch && matchMock;
    });
  }, [studentAttempts, resultsSearch, resultsMockFilter]);

  // Download Mock Results CSV for Score Publishing
  const handleDownloadResultsCSV = () => {
    if (filteredResults.length === 0) {
      alert('No student mock test results match the current filters to download.');
      return;
    }
    const headers =
      'Attempt ID,Student Name,Student Email,Mock Test Title,Score Achieved,Max Total Marks,Percentage (%),Accuracy (%),Correct Answers,Incorrect Answers,Unanswered,Pass/Fail Result,Completion Date\n';

    const rows = filteredResults
      .map((att) => {
        const testMatch = tests.find((t) => t.id === att.testId);
        const maxScore = testMatch?.totalMarks || 90;
        const passMarks = testMatch?.passingMarks ?? Number((maxScore * ((testMatch?.passingPercentage ?? 50) / 100)).toFixed(1));
        const isPassed = testMatch?.passingMarks !== undefined ? att.totalScore >= testMatch.passingMarks : att.percentage >= (testMatch?.passingPercentage ?? 50);
        const dateStr = att.submittedAt ? new Date(att.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

        return `"${att.id}","${(att.studentName || 'Active Student').replace(/"/g, '""')}","${(att.studentEmail || '').replace(/"/g, '""')}","${att.testTitle.replace(/"/g, '""')}","${att.totalScore}","${maxScore}","${att.percentage}%","${att.accuracyRate}%","${att.totalCorrect}","${att.totalIncorrect}","${att.totalUnanswered}","${isPassed ? 'PASSED' : 'FAILED'}","${dateStr}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ahsora_mock_exam_results_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
    <div style={{ padding: '32px', maxWidth: '1280px', margin: '0 auto' }}>
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
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          CBT Mock Tests &amp; Examination Command Center
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9375rem' }}>
          Manage all 12 curriculum mock exams, customize difficulty &amp; passing cutoffs, schedule unlock dates, and track student scores.
        </p>
      </div>

      {/* Main Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '28px',
        }}
      >
        <button
          onClick={() => setAdminTab('mocks')}
          style={{
            padding: '12px 22px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: adminTab === 'mocks' ? '3px solid #16A34A' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: adminTab === 'mocks' ? '#16A34A' : '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <ListChecks size={18} />
          <span>Mock Tests &amp; Question Management ({tests.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('results')}
          style={{
            padding: '12px 22px',
            fontSize: '0.95rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: adminTab === 'results' ? '3px solid #16A34A' : '3px solid transparent',
            backgroundColor: 'transparent',
            color: adminTab === 'results' ? '#16A34A' : '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '-2px',
          }}
        >
          <BarChart3 size={18} />
          <span>Student Mock Results &amp; Score Publishing</span>
          <span
            style={{
              backgroundColor: adminTab === 'results' ? '#DCFCE7' : '#F1F5F9',
              color: adminTab === 'results' ? '#166534' : '#64748B',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            {studentAttempts.length}
          </span>
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: MOCK TESTS & QUESTION MANAGEMENT (12 MOCKS) ── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {adminTab === 'mocks' && (
        <div>
          {/* Live Session Banner */}
          {liveSession && (
            <div style={{
              backgroundColor: '#FEF2F2', border: '2px solid #EF4444', borderRadius: '16px',
              padding: '20px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center',
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
              const isScheduled = Boolean(test.unlockDate && new Date(test.unlockDate).getTime() > Date.now());
              const maxScore = test.totalMarks || Number((test.questions.length * 1.5).toFixed(1));
              const passCutoff = test.passingMarks ?? Number((maxScore * ((test.passingPercentage || 50) / 100)).toFixed(1));

              return (
                <div
                  key={test.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${isLive ? '#EF4444' : '#E2E8F0'}`,
                    borderRadius: '16px',
                    padding: '22px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ flex: '1 1 320px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                        borderRadius: '20px', backgroundColor: '#F0FFF4', color: '#059669',
                        textTransform: 'uppercase', letterSpacing: '0.5px'
                      }}>
                        {test.category}
                      </span>

                      {/* Difficulty Badge */}
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          textTransform: 'uppercase',
                          backgroundColor:
                            test.difficulty === 'hard'
                              ? '#FEE2E2'
                              : test.difficulty === 'medium'
                              ? '#FEF3C7'
                              : '#DCFCE7',
                          color:
                            test.difficulty === 'hard'
                              ? '#DC2626'
                              : test.difficulty === 'medium'
                              ? '#B45309'
                              : '#166534',
                        }}
                      >
                        {test.difficulty}
                      </span>

                      {/* Unlock Status Badge */}
                      {isScheduled ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}>
                          🔒 Unlocks {new Date(test.unlockDate!).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC' }}>
                          ✓ Ready / Unlocked
                        </span>
                      )}

                      {isLive && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', backgroundColor: '#EF4444', color: '#FFF' }}>
                          LIVE
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                      {test.title}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span><strong>{test.questions.length}</strong> Questions</span>
                      <span>•</span>
                      <span><strong>{test.durationMinutes}</strong> Minutes</span>
                      <span>•</span>
                      <span>Scoring: <strong style={{ color: '#16A34A' }}>+1.5</strong> / <strong style={{ color: '#DC2626' }}>-0.4</strong></span>
                      <span>•</span>
                      <span>Passing Cutoff: <strong style={{ color: '#0F172A' }}>{passCutoff} Marks ({test.passingPercentage}%)</strong></span>
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
                        gap: '6px',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8FAFC',
                        color: '#0F172A',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                      }}
                    >
                      <ListChecks size={15} color="#059669" />
                      <span>Questions ({test.questions.length})</span>
                    </button>

                    {/* Edit Test Details Button */}
                    <button
                      onClick={() => {
                        setEditingTestSettings(test);
                        setEditTitle(test.title);
                        setEditDuration(test.durationMinutes);
                        setEditPassingPercentage(test.passingPercentage || 50);
                        const curMax = test.totalMarks || Number((test.questions.length * 1.5).toFixed(1));
                        setEditPassingMarks(test.passingMarks ?? Number((curMax * ((test.passingPercentage || 50) / 100)).toFixed(1)));
                        setEditDifficulty(test.difficulty || 'medium');
                        setEditUnlockDate(test.unlockDate || '');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8FAFC',
                        color: '#0F172A',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit3 size={15} color="#7C3AED" />
                      <span>Edit Mock Details</span>
                    </button>

                    {/* Broadcast Live Button */}
                    {isLive ? (
                      <button
                        onClick={stopTest}
                        disabled={actionLoading}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
                          borderRadius: '8px', border: 'none', backgroundColor: '#FEF2F2', color: '#DC2626',
                          fontWeight: 700, fontSize: '0.84rem', cursor: actionLoading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <StopCircle size={15} /> Stop Test
                      </button>
                    ) : (
                      <button
                        onClick={() => startTest(test.id, test.title)}
                        disabled={actionLoading}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
                          borderRadius: '8px', border: 'none', backgroundColor: '#059669', color: '#FFF',
                          fontWeight: 700, fontSize: '0.84rem', cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.7 : 1,
                        }}
                      >
                        {actionLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={15} />}
                        Start Live
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: STUDENT MOCK RESULTS & SCORE PUBLISHING ── */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {adminTab === 'results' && (
        <div>
          {/* Summary Metric Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Submissions</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                {studentAttempts.length}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#16A34A', marginTop: '4px', fontWeight: 600 }}>Active student exam records</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Average Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                {studentAttempts.length > 0
                  ? `${Math.round(studentAttempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / studentAttempts.length)}%`
                  : 'N/A'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#6366F1', marginTop: '4px', fontWeight: 600 }}>Cohort mean score</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Pass Rate</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                {studentAttempts.length > 0
                  ? `${Math.round((studentAttempts.filter((a) => (a.percentage || 0) >= 50).length / studentAttempts.length) * 100)}%`
                  : 'N/A'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '4px', fontWeight: 600 }}>Achieved qualifying marks</div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', padding: '18px 20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Highest Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                {studentAttempts.length > 0
                  ? `${Math.max(...studentAttempts.map((a) => a.percentage || 0))}%`
                  : 'N/A'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#D97706', marginTop: '4px', fontWeight: 600 }}>Top mock performance</div>
            </div>
          </div>

          {/* Filters & CSV Download Toolbar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', flex: '1 1 340px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '380px' }}>
                <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Search by student name, email, or mock test..."
                  value={resultsSearch}
                  onChange={(e) => setResultsSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Mock Filter */}
              <select
                value={resultsMockFilter}
                onChange={(e) => setResultsMockFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  color: '#334155',
                }}
              >
                <option value="all">All Mock Tests ({tests.length})</option>
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadResultsCSV}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Download size={15} />
              <span>Download Results CSV</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: 0, overflow: 'hidden', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
                  <th style={{ padding: '14px 18px' }}>Student Name</th>
                  <th style={{ padding: '14px 18px' }}>Mock Exam</th>
                  <th style={{ padding: '14px 18px' }}>Score / Max</th>
                  <th style={{ padding: '14px 18px' }}>Percentage &amp; Accuracy</th>
                  <th style={{ padding: '14px 18px' }}>Breakdown (C/I/U)</th>
                  <th style={{ padding: '14px 18px' }}>Outcome</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                      No student mock exam results match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((att) => {
                    const testMatch = tests.find((t) => t.id === att.testId);
                    const maxScore = testMatch?.totalMarks || 90;
                    const isPassed = testMatch?.passingMarks !== undefined ? att.totalScore >= testMatch.passingMarks : att.percentage >= (testMatch?.passingPercentage ?? 50);
                    const formattedDate = att.submittedAt
                      ? new Date(att.submittedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recent';

                    return (
                      <tr key={att.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{att.studentName || 'Active Student'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{att.studentEmail || 'student@ahsora.com'}</div>
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: '#334155' }}>
                          {att.testTitle}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: 800, color: isPassed ? '#16A34A' : '#DC2626' }}>
                          {att.totalScore} / {maxScore} pts
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{att.percentage}%</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{att.accuracyRate}% accuracy</div>
                        </td>
                        <td style={{ padding: '14px 18px', fontSize: '0.8125rem' }}>
                          <span style={{ color: '#16A34A', fontWeight: 700 }}>✓ {att.totalCorrect}</span>
                          {' • '}
                          <span style={{ color: '#DC2626', fontWeight: 700 }}>✗ {att.totalIncorrect}</span>
                          {' • '}
                          <span style={{ color: '#64748B' }}>— {att.totalUnanswered}</span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '3px 10px',
                              borderRadius: '12px',
                              backgroundColor: isPassed ? '#DCFCE7' : '#FEE2E2',
                              color: isPassed ? '#166534' : '#991B1B',
                            }}
                          >
                            {isPassed ? 'PASSED' : 'FAILED'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', color: '#64748B', fontSize: '0.8125rem' }}>
                          {formattedDate}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                      backgroundColor: showAddForm ? '#F1F5F9' : '#059669',
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
                    border: '2px dashed #86EFAC',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: '24px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                      <Upload size={18} color="#059669" />
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
                    <Sparkles size={16} color="#059669" />
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

      {/* Edit Test Details (Title, Duration, Passing Marks, Difficulty, Unlock Date) Modal */}
      {editingTestSettings && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '540px', width: '100%',
            padding: '28px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Edit Mock Test Configuration
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                  Changes will immediately sync across student portals &amp; test rooms.
                </div>
              </div>
              <button
                onClick={() => setEditingTestSettings(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTestSettings}>
              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Mock Test Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1',
                    fontSize: '0.95rem', color: '#0F172A', boxSizing: 'border-box'
                  }}
                  placeholder="e.g. IMAT Full-Length Mock Exam 1"
                  required
                />
              </div>

              {/* Duration & Difficulty Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={editDuration}
                    onChange={(e) => setEditDuration(Number(e.target.value))}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1',
                      fontSize: '0.95rem', color: '#0F172A', boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Difficulty Level
                  </label>
                  <select
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(e.target.value as any)}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1',
                      fontSize: '0.95rem', color: '#0F172A', boxSizing: 'border-box', backgroundColor: '#FFFFFF'
                    }}
                  >
                    <option value="easy">🟢 Easy</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="hard">🔴 Hard</option>
                    <option value="expert">🟣 Expert</option>
                  </select>
                </div>
              </div>

              {/* Passing Marks & Percentage Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Passing Cutoff (Marks)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editPassingMarks}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditPassingMarks(val);
                      const maxScore = editingTestSettings.totalMarks || (editingTestSettings.questions.length * 1.5);
                      if (maxScore > 0) {
                        setEditPassingPercentage(Math.round((val / maxScore) * 100));
                      }
                    }}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1',
                      fontSize: '0.95rem', color: '#0F172A', boxSizing: 'border-box'
                    }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
                    Exact passing cutoff threshold
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Passing Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editPassingPercentage}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditPassingPercentage(val);
                      const maxScore = editingTestSettings.totalMarks || (editingTestSettings.questions.length * 1.5);
                      setEditPassingMarks(Number((maxScore * (val / 100)).toFixed(1)));
                    }}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1',
                      fontSize: '0.95rem', color: '#0F172A', boxSizing: 'border-box'
                    }}
                    required
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px', display: 'block' }}>
                    Evaluates student Pass / Fail
                  </span>
                </div>
              </div>

              {/* Scheduled Unlock Date */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#334155' }}>
                    Scheduled Unlock Date (Optional)
                  </label>
                  {editUnlockDate && (
                    <button
                      type="button"
                      onClick={() => setEditUnlockDate('')}
                      style={{ fontSize: '0.72rem', color: '#059669', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                    >
                      Unlock Immediately
                    </button>
                  )}
                </div>
                <input
                  type="date"
                  value={editUnlockDate}
                  onChange={(e) => setEditUnlockDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1',
                    fontSize: '0.95rem', color: '#0F172A', boxSizing: 'border-box'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                  {editUnlockDate
                    ? `Mock exam remains locked for students until ${new Date(editUnlockDate).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}.`
                    : 'Leave blank to make this mock exam available immediately.'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setEditingTestSettings(null)}
                  style={{
                    padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1',
                    backgroundColor: '#FFF', color: '#475569', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSettings}
                  style={{
                    padding: '10px 22px', borderRadius: '8px', border: 'none',
                    backgroundColor: '#059669', color: '#FFF', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                >
                  {savingSettings ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={16} />}
                  <span>Save &amp; Sync for All Students</span>
                </button>
              </div>
            </form>
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
