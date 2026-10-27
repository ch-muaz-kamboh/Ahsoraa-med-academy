import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import {
  TARGET_URL,
  CORE_PAGES,
  COURSE_SLUGS,
  UNIVERSITY_SLUGS,
  MOCK_TEST_SLUGS,
  NEWS_SLUGS,
  COMMON_HEADERS,
} from '../config.js';
import { generateSummary } from '../reporter.js';

// Custom metrics to monitor breaking point
const errorCount5xx = new Counter('errors_5xx_total');
const rateLimitCount429 = new Counter('rate_limited_429_total');
const failureRate = new Rate('custom_failure_rate');
const pageTtfb = new Trend('custom_page_ttfb', true);

// Configure maximum VUs from environment variable or default to 2000
const MAX_VUS = Number(__ENV.MAX_VUS) || 2000;
const V1 = Math.round(MAX_VUS * 0.1);  // 10%
const V2 = Math.round(MAX_VUS * 0.25); // 25%
const V3 = Math.round(MAX_VUS * 0.5);  // 50%
const V4 = MAX_VUS;                   // 100% peak

export const options = {
  // Staged multi-tier ramp up to push the server to extreme limits
  stages: [
    { duration: '45s', target: V1 }, // Warmup to 10%
    { duration: '1m30s', target: V2 }, // Ramp to 25%
    { duration: '2m', target: V3 },    // Ramp to 50%
    { duration: '2m', target: V4 },    // Ramp to 100% (Extreme Peak)
    { duration: '2m', target: V4 },    // Sustain Peak Load
    { duration: '1m', target: 0 },     // Ramp down / recovery test
  ],
  thresholds: {
    // Tolerances during extreme stress testing
    http_req_failed: ['rate<0.10'], // Less than 10% failures allowed at peak
    http_req_duration: ['p(90)<2500', 'p(95)<4000'], // Latency bounds under extreme load
    custom_failure_rate: ['rate<0.10'],
  },
  // Ensure k6 doesn't discard connection pool too quickly
  noConnectionReuse: false,
  userAgent: 'k6-extreme-stress-agent/1.0',
};

// Helper: randomly pick an element from an array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: random sleep between min and max seconds
function randomSleep(min = 0.3, max = 1.5) {
  const duration = Math.random() * (max - min) + min;
  sleep(duration);
}

// Request handler with metric recording
function getPage(url, pageTag) {
  const res = http.get(url, {
    headers: COMMON_HEADERS,
    tags: { page: pageTag },
  });

  pageTtfb.add(res.timings.waiting);

  const isSuccess = res.status >= 200 && res.status < 400;
  failureRate.add(!isSuccess);

  if (res.status >= 500) {
    errorCount5xx.add(1);
  } else if (res.status === 429) {
    rateLimitCount429.add(1);
  }

  check(res, {
    [`${pageTag} responded with OK status`]: (r) => r.status >= 200 && r.status < 400,
    [`${pageTag} responded without server error`]: (r) => r.status < 500,
  });

  return res;
}

export default function () {
  const roll = Math.random();

  // 1. 40% of traffic browses Home -> Course catalog -> Specific Course
  if (roll < 0.40) {
    group('User Flow: Course Discovery', function () {
      getPage(`${TARGET_URL}/`, 'Home');
      randomSleep(0.5, 1.2);

      getPage(`${TARGET_URL}/courses`, 'Courses_Catalog');
      randomSleep(0.3, 1.0);

      const courseSlug = pickRandom(COURSE_SLUGS);
      getPage(`${TARGET_URL}/courses/${courseSlug}`, 'Course_Detail');
      randomSleep(0.5, 1.5);
    });
  }
  // 2. 25% of traffic explores Universities & Scholarships
  else if (roll < 0.65) {
    group('User Flow: University & Scholarship Research', function () {
      getPage(`${TARGET_URL}/universities`, 'Universities_Directory');
      randomSleep(0.4, 1.0);

      const uniSlug = pickRandom(UNIVERSITY_SLUGS);
      getPage(`${TARGET_URL}/universities/${uniSlug}`, 'University_Detail');
      randomSleep(0.5, 1.2);

      getPage(`${TARGET_URL}/scholarships`, 'Scholarships_Guide');
      randomSleep(0.5, 1.2);
    });
  }
  // 3. 20% of traffic focuses on IMAT & Mock Tests
  else if (roll < 0.85) {
    group('User Flow: IMAT & Mock Exam Prep', function () {
      getPage(`${TARGET_URL}/imat`, 'IMAT_Hub');
      randomSleep(0.4, 1.0);

      getPage(`${TARGET_URL}/free-mock`, 'Free_Mock');
      randomSleep(0.5, 1.2);

      const mockSlug = pickRandom(MOCK_TEST_SLUGS);
      getPage(`${TARGET_URL}/mock-tests/${mockSlug}`, 'Mock_Test_Detail');
      randomSleep(0.5, 1.5);
    });
  }
  // 4. 15% of traffic reads News, About, and Contact
  else {
    group('User Flow: News & Institutional Pages', function () {
      getPage(`${TARGET_URL}/news`, 'News_List');
      randomSleep(0.4, 0.8);

      const newsSlug = pickRandom(NEWS_SLUGS);
      getPage(`${TARGET_URL}/news/${newsSlug}`, 'News_Detail');
      randomSleep(0.4, 1.0);

      getPage(`${TARGET_URL}/about`, 'About_Page');
      randomSleep(0.3, 0.8);

      getPage(`${TARGET_URL}/contact`, 'Contact_Page');
      randomSleep(0.5, 1.2);
    });
  }

  // Inter-journey think time
  randomSleep(0.5, 2.0);
}

export function handleSummary(data) {
  return generateSummary(data, `Ahsora Meds Academy - Extreme Stress Test (${MAX_VUS} VUs)`);
}
