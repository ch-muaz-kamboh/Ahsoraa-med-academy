// HTML and Console summary generator for k6
// Uses the standard k6 html-reporter bundle
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function generateSummary(data, reportTitle = 'Ahsora Meds Academy - Load Test Report') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const htmlFilename = `reports/report-${timestamp}.html`;
  const latestHtmlFilename = 'reports/latest-report.html';

  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    [htmlFilename]: htmlReport(data, { title: `${reportTitle} (${new Date().toLocaleString()})` }),
    [latestHtmlFilename]: htmlReport(data, { title: `${reportTitle} (${new Date().toLocaleString()})` }),
  };
}
