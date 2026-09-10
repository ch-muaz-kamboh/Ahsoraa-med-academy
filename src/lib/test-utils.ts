import { Test, TestQuestion } from '@/types';
import { mockTests } from '@/lib/mock-data';

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

export function getAllMockTestsWithCustom(): Test[] {
  if (typeof window === 'undefined') return mockTests;
  return mockTests.map((t) => getMockTestWithCustom(t.id));
}

export function saveCustomTestQuestions(testId: string, questions: TestQuestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('cbt_mock_test_questions_' + testId, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save custom test questions', e);
  }
}

export function resetCustomTestQuestions(testId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('cbt_mock_test_questions_' + testId);
  } catch (e) {
    console.error('Failed to reset custom test questions', e);
  }
}
