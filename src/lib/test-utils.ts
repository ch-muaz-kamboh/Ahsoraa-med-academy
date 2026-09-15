import { Test, TestQuestion } from '@/types';
import { mockTests } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';

export function getMockTestWithCustom(testId: string): Test {
  const base = mockTests.find((t) => t.id === testId) || mockTests[0];
  if (typeof window === 'undefined') return base;
  try {
    const custom = localStorage.getItem('cbt_mock_test_questions_' + base.id);
    if (custom) {
      const questions: TestQuestion[] = JSON.parse(custom);
      return {
        ...base,
        totalQuestions: questions.length,
        questions,
      };
    }
  } catch (e) {
    console.error('Failed to load custom test questions', e);
  }
  return base;
}

export async function getMockTestWithCustomAsync(testId: string): Promise<Test> {
  const base = mockTests.find((t) => t.id === testId) || mockTests[0];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('cbt_test_questions')
      .select('*')
      .eq('test_id', base.id)
      .order('order_index', { ascending: true });

    if (!error && data && data.length > 0) {
      const questions: TestQuestion[] = data.map((q: any, idx: number) => ({
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

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cbt_mock_test_questions_' + base.id, JSON.stringify(questions));
        } catch (e) {}
      }

      return {
        ...base,
        totalQuestions: questions.length,
        questions,
      };
    }
  } catch (e) {
    console.warn('Failed to fetch custom test questions from Supabase:', e);
  }

  return getMockTestWithCustom(testId);
}

export function getAllMockTestsWithCustom(): Test[] {
  if (typeof window === 'undefined') return mockTests;
  return mockTests.map((t) => getMockTestWithCustom(t.id));
}

export async function getAllMockTestsWithCustomAsync(): Promise<Test[]> {
  const tests = await Promise.all(mockTests.map((t) => getMockTestWithCustomAsync(t.id)));
  return tests;
}

export async function saveCustomTestQuestionsAsync(testId: string, questions: TestQuestion[]): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cbt_mock_test_questions_' + testId, JSON.stringify(questions));
    } catch (e) {}
  }
  try {
    const supabase = createClient();
    // Delete existing custom questions for this test_id
    await supabase.from('cbt_test_questions').delete().eq('test_id', testId);

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
    const supabase = createClient();
    supabase.from('cbt_test_questions').delete().eq('test_id', testId).then();
  } catch (e) {
    console.error('Failed to reset custom test questions', e);
  }
}
