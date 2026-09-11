const fs = require('fs');
const path = require('path');

const files = [
  { name: 'Ahsora_Biochemistry_Biological_Molecules_Bioenergetics_272_MCQ_Practice_Bank_v1_0.txt', subject: 'Biology', defaultTopic: 'Biochemistry & Bioenergetics' },
  { name: 'Ahsora_Evolution_Variation_Biotechnology_48_MCQ_Practice_Bank_v1_0.txt', subject: 'Biology', defaultTopic: 'Evolution & Biotechnology' },
  { name: 'Ahsora_Genetics_Heredity_Molecular_Biology_400_MCQ_Practice_Bank_v1_0.txt', subject: 'Biology', defaultTopic: 'Genetics & Molecular Biology' },
  { name: 'Ahsora_Human_Anatomy_Physiology_Homeostasis_100_MCQ_Practice_Bank_FINAL.txt', subject: 'Biology', defaultTopic: 'Human Anatomy & Physiology' },
];

let allParsedQuestions = [];

files.forEach(fileObj => {
  const filePath = path.join(__dirname, fileObj.name);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  let currentTopic = fileObj.defaultTopic;
  let questionsInFile = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if line is a header tag like: BIO-HAP-TIS-001  |  Easy  |  Recall / Knowledge
    if (/^[A-Z0-9_-]+\s*\|\s*(Easy|Moderate|Hard|Medium)/i.test(line)) {
      const parts = line.split('|').map(p => p.trim());
      const sourceRef = parts[0] || '';
      const rawDiff = (parts[1] || 'easy').toLowerCase();
      let difficulty = 'easy';
      if (rawDiff.includes('hard')) difficulty = 'hard';
      else if (rawDiff.includes('mod') || rawDiff.includes('med')) difficulty = 'medium';

      // Next line is question text
      let questionText = lines[i + 1] || '';
      let optionA = '', optionB = '', optionC = '', optionD = '', optionE = '';
      let correctOption = 'A';
      let explanation = '';

      let idx = i + 2;

      // Extract options A through E
      while (idx < lines.length && idx < i + 15) {
        const currLine = lines[idx];

        if (/^A[\.\:]\s*/i.test(currLine)) optionA = currLine.replace(/^A[\.\:]\s*/i, '');
        else if (/^B[\.\:]\s*/i.test(currLine)) optionB = currLine.replace(/^B[\.\:]\s*/i, '');
        else if (/^C[\.\:]\s*/i.test(currLine)) optionC = currLine.replace(/^C[\.\:]\s*/i, '');
        else if (/^D[\.\:]\s*/i.test(currLine)) optionD = currLine.replace(/^D[\.\:]\s*/i, '');
        else if (/^E[\.\:]\s*/i.test(currLine)) optionE = currLine.replace(/^E[\.\:]\s*/i, '');
        else if (/^Correct\s*[\:\—\-]\s*([A-E])/i.test(currLine)) {
          const match = currLine.match(/^Correct\s*[\:\—\-]\s*([A-E])/i);
          if (match) correctOption = match[1].toUpperCase();
        } else if (/^Explanation\s*[\:\—\-]\s*/i.test(currLine)) {
          explanation = currLine.replace(/^Explanation\s*[\:\—\-]\s*/i, '');
          break; // Question block finished
        } else if (/^[A-Z0-9_-]+\s*\|\s*(Easy|Moderate|Hard|Medium)/i.test(currLine)) {
          break; // Next question started
        }
        idx++;
      }

      if (questionText && optionA && optionB) {
        questionsInFile.push({
          id: `qb-${sourceRef || Date.now()}-${questionsInFile.length + 1}`,
          subject: fileObj.subject,
          topic: currentTopic,
          difficulty: difficulty,
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC || 'None of the above',
          option_d: optionD || 'All of the above',
          option_e: optionE || 'Both A and B',
          correct_option: correctOption,
          explanation: explanation || 'Refer to Ahsora Biology Practice syllabus for complete detailed mechanism.',
          source_reference: sourceRef,
          is_active: true,
          created_at: new Date().toISOString()
        });
      }
    } else if (line.length > 3 && line.length < 50 && !line.includes('|') && !line.startsWith('A.') && !line.startsWith('B.') && !line.startsWith('C.')) {
      // Possible topic line
      if (line.endsWith('System') || line.endsWith('Tissues') || line.endsWith('Biology') || line.endsWith('Genetics') || line.endsWith('Homeostasis')) {
        currentTopic = line;
      }
    }
  }

  console.log(`Parsed ${questionsInFile.length} questions from ${fileObj.name}`);
  allParsedQuestions.push(...questionsInFile);
});

console.log(`\nTOTAL PARSED QUESTIONS: ${allParsedQuestions.length}`);

// Save to JSON file
fs.writeFileSync(
  path.join(__dirname, 'src', 'lib', 'imported_questions.json'),
  JSON.stringify(allParsedQuestions, null, 2),
  'utf8'
);

console.log(`Saved to src/lib/imported_questions.json successfully!`);
