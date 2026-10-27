// Centralized configuration for Ahsora Meds Academy k6 load tests
export const TARGET_URL = (__ENV.TARGET_URL || 'http://localhost:3000').replace(/\/$/, '');

// High-traffic core pages
export const CORE_PAGES = [
  '/',
  '/courses',
  '/imat',
  '/scholarships',
  '/universities',
  '/about',
  '/contact',
  '/free-mock',
  '/licensing-exams',
  '/visa',
  '/news',
];

// Dynamic course slugs to test SSR / client hydration
export const COURSE_SLUGS = [
  'usmle-step-1-complete-mastery',
  'imat-italy-medical-entrance-prep',
  'plab-1-uk-gmc-registration-masterclass',
  'medical-german-b2-c1-approbation',
];

// Dynamic university slugs
export const UNIVERSITY_SLUGS = [
  'universita-di-bologna',
  'universita-degli-studi-di-pavia',
  'universita-di-roma-la-sapienza',
  'universita-degli-studi-di-milano',
  'humanitas-university',
];

// Mock test slugs
export const MOCK_TEST_SLUGS = [
  'imat-grand-mock-03-bio-chem-foundations',
  'imat-grand-mock-04-biochemistry-metabolism',
  'imat-grand-mock-05-cellular-genetics',
];

// News slugs
export const NEWS_SLUGS = [
  'admissions-open-italy-2027',
  'score-60-plus-imat-guide',
];

// Realistic browser headers to prevent basic firewall/WAF blocks
export const COMMON_HEADERS = {
  'User-Agent': 'k6-load-test-agent/1.0 (Ahsora Meds Academy Stress Test; Windows NT 10.0; Win64; x64)',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
};

export const API_HEADERS = {
  'User-Agent': 'k6-load-test-agent/1.0',
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
