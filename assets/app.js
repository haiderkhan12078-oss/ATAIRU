const questions = [
  { text: 'Where does AI sit in your company strategy?', answers: [['It is not discussed strategically', 5], ['We have broad ambitions but no roadmap', 14], ['Priorities and owners are defined', 22], ['AI is embedded in business strategy and investment decisions', 25]] },
  { text: 'How do you choose which AI initiatives to pursue?', answers: [['Ad hoc ideas and individual experiments', 5], ['Based on enthusiasm or tool availability', 12], ['Using business cases and defined criteria', 21], ['Through a governed portfolio tied to P&L outcomes', 25]] },
  { text: 'How widely has new AI-enabled work been adopted?', answers: [['A few individual users', 5], ['Several pilots or champion teams', 13], ['Multiple functions with change support', 21], ['Enterprise-wide, with roles and processes redesigned', 25]] },
  { text: 'How do you measure the value AI creates?', answers: [['We do not measure it yet', 4], ['Usage and time saved', 11], ['Operational KPIs and selected business outcomes', 20], ['Financial impact, risk and strategic advantage', 25]] }
];

let current = 0;
let score = 0;
const selections = [];
const questionText = document.getElementById('questionText');
const questionNumber = document.getElementById('questionNumber');
const answers = document.getElementById('answers');
const progressFill = document.getElementById('progressFill');
const quizStep = document.getElementById('quizStep');
const quizResult = document.getElementById('quizResult');

function renderQuestion() {
  document.getElementById('previousQuestion').hidden = current === 0;
  const q = questions[current];
  questionText.textContent = q.text;
  questionNumber.textContent = current + 1;
  progressFill.style.width = `${((current + 1) / questions.length) * 100}%`;
  answers.replaceChildren(...q.answers.map(([label, value]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => choose(value));
    return button;
  }));
}

function choose(value) {
  selections[current] = value;
  score = selections.slice(0, current + 1).reduce((a, b) => a + b, 0);
  current += 1;
  if (current < questions.length) renderQuestion();
  else showResult();
}

function showResult() {
  quizStep.hidden = true;
  quizResult.hidden = false;
  document.getElementById('scoreNumber').textContent = score;
  const result = score < 40
    ? ['Experimenting', 'Your next move is strategic clarity: select a small number of value pools, define decision criteria and give each initiative an accountable owner.']
    : score < 70
      ? ['Mobilising', 'You have momentum. Your next move is to connect the portfolio to measurable outcomes and build adoption across functions—not only champion teams.']
      : ['Reinventing', 'You are positioned to scale. Focus on redesigning end-to-end processes, strengthening governance and building a repeatable AI-native innovation rhythm.'];
  document.getElementById('resultTitle').textContent = result[0];
  document.getElementById('resultCopy').textContent = result[1];
}

document.getElementById('restartQuiz')?.addEventListener('click', () => {
  current = 0; score = 0; quizResult.hidden = true; quizStep.hidden = false; renderQuestion();
});

function downloadText(filename, content) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.getElementById('previousQuestion')?.addEventListener('click', () => {
  if (current > 0) { current--; renderQuestion(); }
});
document.getElementById('downloadResult')?.addEventListener('click', () => {
  downloadText('ai-readiness-result.txt', `AI READINESS — ILLUSTRATIVE SELF-ASSESSMENT\nScore: ${score}/100\nStage: ${document.getElementById('resultTitle').textContent}\n\n${document.getElementById('resultCopy').textContent}\n\nNot an official ATAIRU diagnostic.`);
});
let requestText = '';
document.getElementById('inviteForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  if (['name', 'company'].some(key => !String(data.get(key)).trim())) {
    const field = event.currentTarget.elements.namedItem(!String(data.get('name')).trim() ? 'name' : 'company');
    field.setCustomValidity('Please enter a value.'); field.reportValidity(); field.oninput = () => field.setCustomValidity(''); return;
  }
  requestText = 'INVITATION / CONSULTATION REQUEST\n\n' + [...data.entries()].map(([key, value]) => `${key}: ${String(value).trim()}`).join('\n') + '\n\nPrepared locally. This request has not been sent.';
  document.getElementById('requestSummary').textContent = `${data.get('name')}, your request for ${data.get('company')} is ready to download. It has not been sent.`;
  event.currentTarget.hidden = true;
  document.getElementById('formSuccess').hidden = false;
  document.getElementById('formSuccess').focus();
});
document.getElementById('downloadRequest')?.addEventListener('click', () => downloadText('leadership-request.txt', requestText));
document.getElementById('editRequest')?.addEventListener('click', () => {
  document.getElementById('formSuccess').hidden = true;
  document.getElementById('inviteForm').hidden = false;
  document.querySelector('[name="name"]').focus();
});

const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
toggle.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  toggle.setAttribute('aria-expanded', String(open));
});
header.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => {
  header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false');
}));

if (questionText) renderQuestion();
