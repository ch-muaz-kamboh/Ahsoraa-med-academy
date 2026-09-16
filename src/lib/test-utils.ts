import { Test, TestQuestion } from '@/types';
import { mockTests } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

export function getMockTestWithCustom(testId: string): Test {
  const base = mockTests.find((t) => t.id === testId) || mockTests[0];
  let updated = { ...base };

  if (typeof window !== 'undefined') {
    try {
      const customSettings = localStorage.getItem('cbt_mock_test_settings_' + base.id);
      if (customSettings) {
        const settings = JSON.parse(customSettings);
        if (settings.title) updated.title = settings.title;
        if (settings.durationMinutes) updated.durationMinutes = settings.durationMinutes;
      }

      const customQuestions = localStorage.getItem('cbt_mock_test_questions_' + base.id);
      if (customQuestions) {
        const questions: TestQuestion[] = JSON.parse(customQuestions);
        updated.totalQuestions = questions.length;
        updated.questions = questions;
      }
    } catch (e) {
      console.error('Failed to load custom test data from localStorage', e);
    }
  }

  return updated;
}

export async function getMockTestWithCustomAsync(testId: string): Promise<Test> {
  const base = mockTests.find((t) => t.id === testId) || mockTests[0];
  let updated = { ...base };

  try {
    const supabase = createClient();

    // Fetch test metadata/settings from cbt_tests
    const { data: testData } = await supabase
      .from('cbt_tests')
      .select('*')
      .eq('id', base.id)
      .maybeSingle();

    if (testData) {
      if (testData.title) updated.title = testData.title;
      if (testData.duration_minutes) updated.durationMinutes = testData.duration_minutes;
    }

    // Fetch questions from cbt_test_questions
    const { data: qData, error: qError } = await supabase
      .from('cbt_test_questions')
      .select('*')
      .eq('test_id', base.id)
      .order('order_index', { ascending: true });

    if (!qError && qData && qData.length > 0) {
      // Check for metadata row in questions table as fallback
      const metaRow = qData.find((q: any) => q.id === '__test_meta__' + base.id || q.subject === '__META__');
      if (metaRow) {
        if (metaRow.question_text) updated.title = metaRow.question_text;
        if (metaRow.explanation && !isNaN(Number(metaRow.explanation))) {
          updated.durationMinutes = Number(metaRow.explanation);
        }
      }

      const questions: TestQuestion[] = qData
        .filter((q: any) => q.subject !== '__META__' && !q.id.startsWith('__test_meta__'))
        .map((q: any, idx: number) => ({
          id: q.id,
          orderIndex: q.order_index || idx + 1,
          subject: q.subject,
          topic: q.topic || '',
          difficulty: q.difficulty || 'medium',
          questionText: q.question_text,
          questionImageUrl: q.question_image_url || undefined,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctOption: q.correct_option,
          explanation: q.explanation || '',
        }));

      if (questions.length > 0) {
        updated.totalQuestions = questions.length;
        updated.questions = questions;
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cbt_mock_test_questions_' + base.id, JSON.stringify(questions));
        } catch (e) {}
      }
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'cbt_mock_test_settings_' + base.id,
          JSON.stringify({ title: updated.title, durationMinutes: updated.durationMinutes })
        );
      } catch (e) {}
    }

    return updated;
  } catch (e) {
    console.warn('Failed to fetch custom test from Supabase:', e);
  }

  return getMockTestWithCustom(testId);
}

export function getAllMockTestsWithCustom(): Test[] {
  if (typeof window === 'undefined') return mockTests;
  return mockTests.map((t) => getMockTestWithCustom(t.id));
}

export async function getAllMockTestsWithCustomAsync(): Promise<Test[]> {
  try {
    const supabase = createClient();
    const [{ data: dbTests }, { data: dbQuestions }] = await Promise.all([
      supabase.from('cbt_tests').select('*'),
      supabase.from('cbt_test_questions').select('*').order('order_index', { ascending: true }),
    ]);

    const testsMap = new Map<string, { title?: string; duration_minutes?: number }>();
    if (dbTests) {
      dbTests.forEach((t: any) => testsMap.set(t.id, t));
    }

    const questionsMap = new Map<string, TestQuestion[]>();
    if (dbQuestions) {
      dbQuestions.forEach((q: any) => {
        if (q.subject === '__META__' || q.id.startsWith('__test_meta__')) {
          const testId = q.test_id;
          const existing = testsMap.get(testId) || {};
          testsMap.set(testId, {
            title: q.question_text || existing.title,
            duration_minutes: (q.explanation && !isNaN(Number(q.explanation))) ? Number(q.explanation) : existing.duration_minutes,
          });
          return;
        }

        const list = questionsMap.get(q.test_id) || [];
        list.push({
          id: q.id,
          orderIndex: q.order_index || list.length + 1,
          subject: q.subject,
          topic: q.topic || '',
          difficulty: q.difficulty || 'medium',
          questionText: q.question_text,
          questionImageUrl: q.question_image_url || undefined,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
          correctOption: q.correct_option,
          explanation: q.explanation || '',
        });
        questionsMap.set(q.test_id, list);
      });
    }

    return mockTests.map((base) => {
      let updated = { ...base };
      const customMeta = testsMap.get(base.id);
      if (customMeta) {
        if (customMeta.title) updated.title = customMeta.title;
        if (customMeta.duration_minutes) updated.durationMinutes = customMeta.duration_minutes;
      } else if (typeof window !== 'undefined') {
        const localSettings = localStorage.getItem('cbt_mock_test_settings_' + base.id);
        if (localSettings) {
          try {
            const s = JSON.parse(localSettings);
            if (s.title) updated.title = s.title;
            if (s.durationMinutes) updated.durationMinutes = s.durationMinutes;
          } catch (e) {}
        }
      }

      const customQs = questionsMap.get(base.id);
      if (customQs && customQs.length > 0) {
        updated.totalQuestions = customQs.length;
        updated.questions = customQs;
      } else if (typeof window !== 'undefined') {
        const localQs = localStorage.getItem('cbt_mock_test_questions_' + base.id);
        if (localQs) {
          try {
            const qs = JSON.parse(localQs);
            updated.totalQuestions = qs.length;
            updated.questions = qs;
          } catch (e) {}
        }
      }

      return updated;
    });
  } catch (e) {
    console.warn('Failed to fetch all mock tests from Supabase async:', e);
    return getAllMockTestsWithCustom();
  }
}

export async function saveTestSettingsAsync(testId: string, title: string, durationMinutes: number): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cbt_mock_test_settings_' + testId, JSON.stringify({ title, durationMinutes }));
    } catch (e) {}
  }

  try {
    const supabase = createClient();
    // 1. Try upserting to cbt_tests
    await supabase.from('cbt_tests').upsert({
      id: testId,
      title,
      duration_minutes: durationMinutes,
      updated_at: new Date().toISOString(),
    });

    // 2. Also upsert meta record into cbt_test_questions (guaranteed table)
    await supabase.from('cbt_test_questions').upsert({
      id: '__test_meta__' + testId,
      test_id: testId,
      order_index: -1,
      subject: '__META__',
      topic: 'test_settings',
      difficulty: 'easy',
      question_text: title,
      options: [],
      correct_option: 'A',
      explanation: String(durationMinutes),
      updated_at: new Date().toISOString(),
    });

    // 3. Update active live test sessions in test_sessions if any
    await supabase.from('test_sessions').update({ test_title: title }).eq('test_id', testId).eq('is_live', true);
  } catch (e) {
    console.error('Failed to sync test settings to Supabase', e);
  }
}

export function saveTestSettings(testId: string, title: string, durationMinutes: number): void {
  saveTestSettingsAsync(testId, title, durationMinutes);
}

export async function saveCustomTestQuestionsAsync(testId: string, questions: TestQuestion[]): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cbt_mock_test_questions_' + testId, JSON.stringify(questions));
    } catch (e) {}
  }
  try {
    const supabase = createClient();
    // Delete existing custom questions for this test_id, but preserve __META__ metadata row
    await supabase.from('cbt_test_questions').delete().eq('test_id', testId).neq('subject', '__META__');

    // Insert new questions
    if (questions.length > 0) {
      const inserts = questions.map((q, idx) => ({
        id: q.id,
        test_id: testId,
        order_index: q.orderIndex || idx + 1,
        subject: q.subject,
        topic: q.topic || '',
        difficulty: q.difficulty || 'medium',
        question_text: q.questionText,
        question_image_url: q.questionImageUrl || null,
        options: q.options,
        correct_option: q.correctOption,
        explanation: q.explanation || '',
      }));
      const { error } = await supabase.from('cbt_test_questions').insert(inserts);
      if (error) {
        console.error('Supabase cbt_test_questions insert error:', error);
      }
    }
  } catch (e) {
    console.error('Failed to sync custom test questions to Supabase', e);
  }
}

export function saveCustomTestQuestions(testId: string, questions: TestQuestion[]): void {
  saveCustomTestQuestionsAsync(testId, questions);
}

export function resetCustomTestQuestions(testId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('cbt_mock_test_questions_' + testId);
    localStorage.removeItem('cbt_mock_test_settings_' + testId);
    const supabase = createClient();
    supabase.from('cbt_test_questions').delete().eq('test_id', testId).then();
    supabase.from('cbt_tests').delete().eq('id', testId).then();
  } catch (e) {
    console.error('Failed to reset custom test questions', e);
  }
}

