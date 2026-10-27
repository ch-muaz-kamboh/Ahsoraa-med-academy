import http from 'k6/http';
import { check, sleep } from 'k6';
import { TARGET_URL, COMMON_HEADERS } from '../config.js';
import { generateSummary } from '../reporter.js';

const SPIKE_VUS = Number(__ENV.SPIKE_VUS) || 1200;

export const options = {
  stages: [
    { duration: '20s', target: 20 },         // Normal baseline
    { duration: '15s', target: SPIKE_VUS },   // Sudden massive surge to spike level!
    { duration: '1m', target: SPIKE_VUS },    // Hold heavy pressure
    { duration: '20s', target: 20 },         // Fast drop back down
    { duration: '30s', target: 0 },          // Recovery observation
  ],
  thresholds: {
    http_req_failed: ['rate<0.15'], // Allow up to 15% errors during sudden spike
    http_req_duration: ['p(95)<3500'],
  },
};

export default function () {
  const urls = [
    `${TARGET_URL}/`,
    `${TARGET_URL}/courses`,
    `${TARGET_URL}/imat`,
    `${TARGET_URL}/universities`,
  ];
  const url = urls[Math.floor(Math.random() * urls.length)];

  const res = http.get(url, { headers: COMMON_HEADERS });

  check(res, {
    'status is not 500': (r) => r.status < 500,
    'status is 200 or 304': (r) => r.status === 200 || r.status === 304,
  });

  sleep(Math.random() * 0.8 + 0.2);
}

export function handleSummary(data) {
  return generateSummary(data, `Ahsora Meds Academy - Spike Test (${SPIKE_VUS} VUs Surge)`);
}
