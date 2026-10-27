import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { TARGET_URL, CORE_PAGES, COURSE_SLUGS, UNIVERSITY_SLUGS, COMMON_HEADERS } from '../config.js';
import { generateSummary } from '../reporter.js';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'], // < 1% errors
    http_req_duration: ['p(95)<800'], // 95% of requests should be < 800ms
  },
};

export default function () {
  group('Smoke Test - Core Pages', function () {
    for (const page of CORE_PAGES.slice(0, 5)) {
      const res = http.get(`${TARGET_URL}${page}`, { headers: COMMON_HEADERS, tags: { page } });
      check(res, {
        [`${page} status is 200`]: (r) => r.status === 200,
        [`${page} duration < 1000ms`]: (r) => r.timings.duration < 1000,
      });
      sleep(0.5);
    }
  });

  group('Smoke Test - Dynamic Pages', function () {
    const courseRes = http.get(`${TARGET_URL}/courses/${COURSE_SLUGS[0]}`, { headers: COMMON_HEADERS });
    check(courseRes, {
      'Course detail status is 200': (r) => r.status === 200,
    });

    const uniRes = http.get(`${TARGET_URL}/universities/${UNIVERSITY_SLUGS[0]}`, { headers: COMMON_HEADERS });
    check(uniRes, {
      'University detail status is 200': (r) => r.status === 200,
    });
  });

  sleep(1);
}

export function handleSummary(data) {
  return generateSummary(data, 'Ahsora Meds Academy - Smoke Test');
}
