const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'lib', 'imported_questions.ts');
let raw = fs.readFileSync(filePath, 'utf8');

const startIdx = raw.indexOf('[');
let depth = 0, endIdx = -1;
for (let i = startIdx; i < raw.length; i++) {
  if (raw[i] === '[' || raw[i] === '{') depth++;
  if (raw[i] === ']' || raw[i] === '}') depth--;
  if (depth === 0) { endIdx = i; break; }
}

const jsonPart = raw.slice(startIdx, endIdx + 1);
const questions = JSON.parse(jsonPart);

let swapped = 0;
const cleaned = questions.map(q => {
  if (q.subject === 'Biology') {
    const oldTopic = q.topic;
    const oldChapter = q.chapter;
    q.topic = oldChapter;
    q.chapter = oldTopic;
    swapped++;
  }
  return q;
});

const prefix = raw.slice(0, startIdx);
const suffix = raw.slice(endIdx + 1);
const newJson = JSON.stringify(cleaned, null, 2);
fs.writeFileSync(filePath, prefix + newJson + suffix, 'utf8');

console.log(`Swapped topic and chapter for ${swapped} biology questions.`);
