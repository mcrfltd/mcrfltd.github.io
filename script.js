const kanaData = [
  { h: 'あ', k: 'ア', r: 'a', v: 'a', c: 'a' }, { h: 'い', k: 'イ', r: 'i', v: 'i', c: 'a' }, { h: 'う', k: 'ウ', r: 'u', v: 'u', c: 'a' }, { h: 'え', k: 'エ', r: 'e', v: 'e', c: 'a' }, { h: 'お', k: 'オ', r: 'o', v: 'o', c: 'a' },
  { h: 'か', k: 'カ', r: 'ka', v: 'a', c: 'k' }, { h: 'き', k: 'キ', r: 'ki', v: 'i', c: 'k' }, { h: 'く', k: 'ク', r: 'ku', v: 'u', c: 'k' }, { h: 'け', k: 'ケ', r: 'ke', v: 'e', c: 'k' }, { h: 'こ', k: 'コ', r: 'ko', v: 'o', c: 'k' },
  { h: 'さ', k: 'サ', r: 'sa', v: 'a', c: 's' }, { h: 'し', k: 'シ', r: 'shi', v: 'i', c: 's' }, { h: 'す', k: 'ス', r: 'su', v: 'u', c: 's' }, { h: 'せ', k: 'セ', r: 'se', v: 'e', c: 's' }, { h: 'そ', k: 'ソ', r: 'so', v: 'o', c: 's' },
  { h: 'た', k: 'タ', r: 'ta', v: 'a', c: 't' }, { h: 'ち', k: 'チ', r: 'chi', v: 'i', c: 't' }, { h: 'つ', k: 'ツ', r: 'tsu', v: 'u', c: 't' }, { h: 'て', k: 'テ', r: 'te', v: 'e', c: 't' }, { h: 'と', k: 'ト', r: 'to', v: 'o', c: 't' },
  { h: 'な', k: 'ナ', r: 'na', v: 'a', c: 'n' }, { h: 'に', k: 'ニ', r: 'ni', v: 'i', c: 'n' }, { h: 'ぬ', k: 'ヌ', r: 'nu', v: 'u', c: 'n' }, { h: 'ね', k: 'ネ', r: 'ne', v: 'e', c: 'n' }, { h: 'の', k: 'ノ', r: 'no', v: 'o', c: 'n' },
  { h: 'は', k: 'ハ', r: 'ha', v: 'a', c: 'h' }, { h: 'ひ', k: 'ヒ', r: 'hi', v: 'i', c: 'h' }, { h: 'ふ', k: 'フ', r: 'fu', v: 'u', c: 'h' }, { h: 'へ', k: 'ヘ', r: 'he', v: 'e', c: 'h' }, { h: 'ほ', k: 'ホ', r: 'ho', v: 'o', c: 'h' },
  { h: 'ま', k: 'マ', r: 'ma', v: 'a', c: 'm' }, { h: 'み', k: 'ミ', r: 'mi', v: 'i', c: 'm' }, { h: 'む', k: 'ム', r: 'mu', v: 'u', c: 'm' }, { h: 'め', k: 'メ', r: 'me', v: 'e', c: 'm' }, { h: 'も', k: 'モ', r: 'mo', v: 'o', c: 'm' },
  { h: 'や', k: 'ヤ', r: 'ya', v: 'a', c: 'y' }, { h: 'ゆ', k: 'ユ', r: 'yu', v: 'u', c: 'y' }, { h: 'よ', k: 'ヨ', r: 'yo', v: 'o', c: 'y' },
  { h: 'ら', k: 'ラ', r: 'ra', v: 'a', c: 'r' }, { h: 'り', k: 'リ', r: 'ri', v: 'i', c: 'r' }, { h: 'る', k: 'ル', r: 'ru', v: 'u', c: 'r' }, { h: 'れ', k: 'レ', r: 're', v: 'e', c: 'r' }, { h: 'ろ', k: 'ロ', r: 'ro', v: 'o', c: 'r' },
  { h: 'わ', k: 'ワ', r: 'wa', v: 'a', c: 'w' }, { h: 'を', k: 'ヲ', r: 'wo', v: 'o', c: 'w' }, { h: 'ん', k: 'ン', r: 'n', v: 'n', c: 'w' }
];

let quizTimer = null;

function switchGame(game, btnEl) {
  if (quizTimer) clearTimeout(quizTimer);
  clearTimeout(recognizeTimeout);
  clearTimeout(quizRecognizeTimeout);

  document.querySelectorAll('.game-section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));

  if (btnEl) btnEl.classList.add('active');

  if (game === 'table') {
    document.getElementById('table-game').classList.add('active');
  } else if (game === 'quiz') {
    document.getElementById('quiz-game').classList.add('active');
    nextQuizQuestion();
  } else if (game === 'match') {
    document.getElementById('match-game').classList.add('active');
    initMatchGame();
  } else if (game === 'flashcard') {
    document.getElementById('flashcard-game').classList.add('active');
    updateFlashcard();
  }
}

/* --- GAME 1 邏輯 --- */
let quizMode = 'random';
let selectedVowel = 'all';
let selectedConsonant = 'all';
let answerType = 'choice';
let showRomaji = true;
let currentQuizTarget = null;
let currentCorrectAnswer = '';
let lastQuestionId = null;
let isAnsweringQuiz = false;

function toggleMode(mode, btn) {
  quizMode = mode;
  btn.parentElement.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  nextQuizQuestion();
}

function toggleVowel(val, btn) {
  selectedVowel = val;
  btn.parentElement.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  nextQuizQuestion();
}

function toggleConsonant(val, btn) {
  selectedConsonant = val;
  btn.parentElement.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  nextQuizQuestion();
}

function toggleAnswerType(type, btn) {
  answerType = type;
  btn.parentElement.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const optsContainer = document.getElementById('q-options');
  const writingArea = document.getElementById('q-writing-area');

  if (type === 'choice') {
    optsContainer.style.display = 'grid';
    writingArea.classList.remove('active');
  } else {
    optsContainer.style.display = 'none';
    writingArea.classList.add('active');
  }
  nextQuizQuestion();
}

function toggleRomaji(visible, btn) {
  showRomaji = visible;
  btn.parentElement.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  updateRomajiText();
}

function updateRomajiText() {
  const romajiEl = document.getElementById('q-romaji');
  if (!romajiEl) return;
  if (showRomaji) {
    romajiEl.textContent = currentQuizTarget ? currentQuizTarget.r : '-';
  } else {
    romajiEl.textContent = ' ';
  }
}

function getFilteredQuizPool() {
  return kanaData.filter(item => {
    const matchV = (selectedVowel === 'all' || item.v === selectedVowel);
    const matchC = (selectedConsonant === 'all' || item.c === selectedConsonant);
    return matchV && matchC;
  });
}

function nextQuizQuestion() {
  if (quizTimer) clearTimeout(quizTimer);
  if (quizRecognizeTimeout) clearTimeout(quizRecognizeTimeout);
  isAnsweringQuiz = false;
  clearQuizCanvas();

  const pool = getFilteredQuizPool();

  if (pool.length === 0) {
    document.getElementById('q-target').textContent = '無';
    document.getElementById('q-romaji').textContent = showRomaji ? '請重新選擇篩選條件' : ' ';
    document.getElementById('q-options').innerHTML = '';
    return;
  }

  let selectedTarget = null;
  let selectedIsH2K = true;
  let questionId = '';

  let maxAttempts = 20;
  while (maxAttempts > 0) {
    selectedTarget = pool[Math.floor(Math.random() * pool.length)];
    selectedIsH2K = quizMode === 'h2k' ? true : (quizMode === 'k2h' ? false : Math.random() < 0.5);

    const char = selectedIsH2K ? selectedTarget.h : selectedTarget.k;
    const direction = selectedIsH2K ? 'h2k' : 'k2h';
    questionId = `${char}_${direction}`;

    if (pool.length === 1 && (quizMode === 'h2k' || quizMode === 'k2h')) {
      break;
    }

    if (questionId !== lastQuestionId) {
      break;
    }
    maxAttempts--;
  }

  currentQuizTarget = selectedTarget;
  lastQuestionId = questionId;

  document.getElementById('quiz-title').textContent = selectedIsH2K ? '這個平假名的片假名是？' : '這個片假名的平假名是？';

  const questionChar = selectedIsH2K ? currentQuizTarget.h : currentQuizTarget.k;
  currentCorrectAnswer = selectedIsH2K ? currentQuizTarget.k : currentQuizTarget.h;

  document.getElementById('q-target').textContent = questionChar;
  updateRomajiText();

  if (answerType === 'choice') {
    let options = [currentCorrectAnswer];
    while (options.length < 4) {
      const randItem = kanaData[Math.floor(Math.random() * kanaData.length)];
      const randChar = selectedIsH2K ? randItem.k : randItem.h;
      if (!options.includes(randChar)) options.push(randChar);
    }
    options.sort(() => 0.5 - Math.random());

    const optsContainer = document.getElementById('q-options');
    optsContainer.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'opt-btn';
      btn.textContent = opt;
      btn.onclick = () => checkQuizAnswer(btn, opt, currentCorrectAnswer);
      optsContainer.appendChild(btn);
    });
  }
}

function checkQuizAnswer(btn, opt, correctAnswer) {
  if (isAnsweringQuiz) return;
  isAnsweringQuiz = true;

  if (opt === correctAnswer) {
    btn.classList.add('correct');
  } else {
    btn.classList.add('wrong');
    document.querySelectorAll('#q-options .opt-btn').forEach(b => {
      if (b.textContent === correctAnswer) b.classList.add('correct');
    });
  }

  quizTimer = setTimeout(nextQuizQuestion, 1000);
}

/* --- GAME 1 手寫畫布與辨識邏輯 --- */
const quizCanvas = document.getElementById('quiz-canvas');
const quizCtx = quizCanvas ? quizCanvas.getContext('2d') : null;
let isQuizDrawing = false;
let quizStrokes = [];
let currentQuizStroke = [];
let quizRecognizeTimeout = null;

if (quizCtx) {
  quizCtx.lineWidth = 6;
  quizCtx.lineCap = 'round';
  quizCtx.lineJoin = 'round';
  quizCtx.strokeStyle = '#222';
}

function getQuizPos(e) {
  const rect = quizCanvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return [clientX - rect.left, clientY - rect.top];
}

function startQuizDrawing(e) {
  if (isAnsweringQuiz) return;
  isQuizDrawing = true;
  const [x, y] = getQuizPos(e);
  currentQuizStroke = [[Math.round(x)], [Math.round(y)], [Date.now()]];
  quizCtx.beginPath();
  quizCtx.moveTo(x, y);
  clearTimeout(quizRecognizeTimeout);
}

function quizDraw(e) {
  if (!isQuizDrawing || isAnsweringQuiz) return;
  e.preventDefault();
  const [x, y] = getQuizPos(e);
  quizCtx.lineTo(x, y);
  quizCtx.stroke();
  currentQuizStroke[0].push(Math.round(x));
  currentQuizStroke[1].push(Math.round(y));
  currentQuizStroke[2].push(Date.now());
}

function stopQuizDrawing() {
  if (!isQuizDrawing) return;
  isQuizDrawing = false;
  if (currentQuizStroke[0].length > 0) {
    quizStrokes.push(currentQuizStroke);
  }
  quizRecognizeTimeout = setTimeout(recognizeQuizHandwriting, 800);
}

if (quizCanvas) {
  quizCanvas.addEventListener('mousedown', startQuizDrawing);
  quizCanvas.addEventListener('mousemove', quizDraw);
  quizCanvas.addEventListener('mouseup', stopQuizDrawing);
  quizCanvas.addEventListener('mouseleave', stopQuizDrawing);

  quizCanvas.addEventListener('touchstart', startQuizDrawing);
  quizCanvas.addEventListener('touchmove', quizDraw);
  quizCanvas.addEventListener('touchend', stopQuizDrawing);
}

function clearQuizCanvas() {
  if (quizCtx) quizCtx.clearRect(0, 0, quizCanvas.width, quizCanvas.height);
  quizStrokes = [];
  const feedback = document.getElementById('quiz-feedback');
  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'feedback-msg';
  }
}

async function recognizeQuizHandwriting() {
  if (quizStrokes.length === 0 || isAnsweringQuiz) return;

  const feedback = document.getElementById('quiz-feedback');
  if (feedback) {
    feedback.textContent = '辨識中...';
    feedback.className = 'feedback-msg';
  }

  const payload = {
    options: 'enable_ingestion',
    requests: [{
      language: 'ja',
      writing_guide: { width: 220, height: 220 },
      ink: quizStrokes
    }]
  };

  try {
    const response = await fetch('https://www.google.com/inputtools/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1] && data[1][0][1].length > 0) {
      const candidates = data[1][0][1];
      const isCorrect = candidates.includes(currentCorrectAnswer);

      isAnsweringQuiz = true;

      if (isCorrect) {
        feedback.textContent = `答對了！ (${currentCorrectAnswer})`;
        feedback.className = 'feedback-msg correct';
        quizTimer = setTimeout(nextQuizQuestion, 1000);
      } else {
        const detected = candidates[0] || '未知';
        feedback.textContent = `答錯了！辨識為: ${detected}，正確答案是: ${currentCorrectAnswer}`;
        feedback.className = 'feedback-msg wrong';
        quizTimer = setTimeout(nextQuizQuestion, 3000);
      }
    } else {
      if (feedback) feedback.textContent = '無法辨識，請重試';
    }
  } catch (err) {
    console.error(err);
    if (feedback) feedback.textContent = '連線失敗';
  }
}

/* --- GAME 2 邏輯 --- */
let selectedCards = [];
let clicks = 0;
let remainingCards = 0;

function initMatchGame() {
  const grid = document.getElementById('match-grid');
  if (!grid) return;
  grid.innerHTML = '';
  selectedCards = [];
  clicks = 0;

  let cards = [];
  kanaData.forEach(item => {
    cards.push({ char: item.h, romaji: item.r, type: 'h' });
    cards.push({ char: item.k, romaji: item.r, type: 'k' });
  });

  remainingCards = cards.length;
  document.getElementById('cards-left').textContent = remainingCards;
  document.getElementById('click-count').textContent = clicks;

  cards.sort(() => 0.5 - Math.random());

  cards.forEach(cardData => {
    const cardEl = document.createElement('div');
    cardEl.classList.add('match-card');
    cardEl.textContent = cardData.char;
    cardEl.dataset.romaji = cardData.romaji;
    cardEl.dataset.type = cardData.type;

    cardEl.addEventListener('click', handleCardClick);
    grid.appendChild(cardEl);
  });
  clearCanvas();
}

function handleCardClick() {
  if (this.classList.contains('selected') || selectedCards.length === 2) return;

  this.classList.add('selected');
  selectedCards.push(this);

  if (selectedCards.length === 2) {
    clicks++;
    document.getElementById('click-count').textContent = clicks;

    const [card1, card2] = selectedCards;
    const isSameRomaji = card1.dataset.romaji === card2.dataset.romaji;
    const isDifferentType = card1.dataset.type !== card2.dataset.type;

    if (isSameRomaji && isDifferentType) {
      setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        selectedCards = [];
        remainingCards -= 2;
        document.getElementById('cards-left').textContent = remainingCards;

        if (remainingCards === 0) {
          alert(`恭喜通關！總共點擊了 ${clicks} 次。`);
        }
      }, 200);
    } else {
      setTimeout(() => {
        card1.classList.remove('selected');
        card2.classList.remove('selected');
        selectedCards = [];
      }, 400);
    }
  }
}

/* --- GAME 3 邏輯 --- */
let currentFcIndex = 0;

function updateFlashcard() {
  const fcCardEl = document.getElementById('flashcard');
  if (!fcCardEl) return;
  fcCardEl.classList.remove('flipped');
  setTimeout(() => {
    const item = kanaData[currentFcIndex];
    document.getElementById('fc-hiragana').textContent = item.h;
    document.getElementById('fc-katakana').textContent = item.k;
    document.getElementById('fc-romaji-front').textContent = item.r;
    document.getElementById('fc-romaji-back').textContent = item.r;
  }, 150);
}

function flipFlashcard() {
  const fcCardEl = document.getElementById('flashcard');
  if (fcCardEl) fcCardEl.classList.toggle('flipped');
}

function nextCard() {
  currentFcIndex = (currentFcIndex + 1) % kanaData.length;
  updateFlashcard();
}

function prevCard() {
  currentFcIndex = (currentFcIndex - 1 + kanaData.length) % kanaData.length;
  updateFlashcard();
}

function randomCard() {
  currentFcIndex = Math.floor(Math.random() * kanaData.length);
  updateFlashcard();
}

/* --- 手寫辨識 (Game 2 專用) --- */
const canvas = document.getElementById('canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let isDrawing = false;
let strokes = [];
let currentStroke = [];
let recognizeTimeout = null;

if (ctx) {
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#222';
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return [clientX - rect.left, clientY - rect.top];
}

function startDrawing(e) {
  isDrawing = true;
  const [x, y] = getPos(e);
  currentStroke = [[Math.round(x)], [Math.round(y)], [Date.now()]];
  ctx.beginPath();
  ctx.moveTo(x, y);
  clearTimeout(recognizeTimeout);
}

function draw(e) {
  if (!isDrawing) return;
  e.preventDefault();
  const [x, y] = getPos(e);
  ctx.lineTo(x, y);
  ctx.stroke();
  currentStroke[0].push(Math.round(x));
  currentStroke[1].push(Math.round(y));
  currentStroke[2].push(Date.now());
}

function stopDrawing() {
  if (!isDrawing) return;
  isDrawing = false;
  if (currentStroke[0].length > 0) {
    strokes.push(currentStroke);
  }
  recognizeTimeout = setTimeout(recognizeCharacter, 800);
}

if (canvas) {
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);
}

function clearCanvas() {
  if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  strokes = [];
  const el = document.getElementById('detected-char');
  if (el) el.textContent = '-';
}

async function recognizeCharacter() {
  if (strokes.length === 0) return;

  const el = document.getElementById('detected-char');
  if (el) el.textContent = '辨識中...';

  const payload = {
    options: 'enable_ingestion',
    requests: [{
      language: 'ja',
      writing_guide: { width: 240, height: 240 },
      ink: strokes
    }]
  };

  try {
    const response = await fetch('https://www.google.com/inputtools/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (data && data[0] === 'SUCCESS' && data[1] && data[1][0] && data[1][0][1] && data[1][0][1].length > 0) {
      const candidates = data[1][0][1];
      let matchedChar = null;

      for (let char of candidates) {
        const found = kanaData.find(item => item.h === char || item.k === char);
        if (found) {
          matchedChar = char;
          break;
        }
      }

      if (el) el.textContent = matchedChar || candidates[0];
    } else {
      if (el) el.textContent = '無法辨識';
    }
  } catch (err) {
    console.error(err);
    if (el) el.textContent = '連線失敗';
  }
}

/* --- 頁面初次載入初始化 --- */
document.addEventListener("DOMContentLoaded", () => {
  nextQuizQuestion();
});
