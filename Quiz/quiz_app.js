// =================== SPLASH EFFECT ===================
window.addEventListener("load", () => {
  // Hide splash after 3.5s
  setTimeout(() => {
    document.getElementById("splash-screen").style.display = "none";
  }, 4500);

  // Particle animation
  const canvas = document.getElementById("splash-particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    }
    animate();
  }
});

// =================== CONFIG ===================
const TIME_PER_QUESTION = 20; // seconds
const SHUFFLE_QUESTIONS = true;
const SHUFFLE_OPTIONS = false; // keep options steady for simplicity
const HIGHSCORE_KEY = "gk_quiz_highscore_v1";

// =================== QUESTIONS ===================
const questions = [
  { q: "What is the capital of France?", opts: ["London", "Berlin", "Paris", "Rome"], ans: 2 },
  { q: "Which planet is known as the Red Planet?", opts: ["Earth", "Mars", "Venus", "Jupiter"], ans: 1 },
  { q: "Who painted the Mona Lisa?", opts: ["Pablo Picasso", "Leonardo da Vinci", "Michelangelo", "Vincent van Gogh"], ans: 1 },
  { q: "How many continents are there on Earth?", opts: ["5", "6", "7", "8"], ans: 2 },
  { q: "What is the largest mammal in the world?", opts: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"], ans: 1 },
  { q: "Which ocean is the biggest?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3 },
  { q: "Who wrote 'Romeo and Juliet'?", opts: ["William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"], ans: 0 },
  { q: "What gas do humans need to survive?", opts: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], ans: 0 },
  { q: "How many colors are in a rainbow?", opts: ["5", "6", "7", "8"], ans: 2 },
  { q: "What is the currency of the USA?", opts: ["Euro", "Dollar", "Pound", "Peso"], ans: 1 },
  { q: "Who invented the telephone?", opts: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Albert Einstein"], ans: 1 },
  { q: "Which sport is called 'the beautiful game'?", opts: ["Basketball", "Football (Soccer)", "Tennis", "Cricket"], ans: 1 },
  { q: "What is the fastest land animal?", opts: ["Cheetah", "Horse", "Greyhound", "Leopard"], ans: 0 },
  { q: "Where are the Pyramids of Giza?", opts: ["India", "Mexico", "Egypt", "Iraq"], ans: 2 },
  { q: "Boiling point of water in Celsius?", opts: ["90", "100", "120", "80"], ans: 1 },
  { q: "Who was the first man on the moon?", opts: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], ans: 1 },
  { q: "What is the national animal of China?", opts: ["Lion", "Panda", "Tiger", "Elephant"], ans: 1 },
  { q: "What is 25 × 4?", opts: ["50", "75", "100", "125"], ans: 2 },
  { q: "What is the opposite of 'hot'?", opts: ["Warm", "Cold", "Cool", "Freeze"], ans: 1 },
  { q: "Which language has the most native speakers?", opts: ["English", "Mandarin Chinese", "Spanish", "Hindi"], ans: 1 },
];

// =================== STATE ===================
let order = [...questions.keys()];
if (SHUFFLE_QUESTIONS) order.sort(() => Math.random() - 0.5);

let idx = 0;
let score = 0;
let selected = null;
let timer = null;
let timeLeft = TIME_PER_QUESTION;
let high = Number(localStorage.getItem(HIGHSCORE_KEY) || 0);
let soundOn = localStorage.getItem("quiz_sound_on") !== "false"; // default true

// =================== DOM ===================
const qEl = document.getElementById("question");
const optionsWrap = document.getElementById("options");
const optionBtns = Array.from(document.querySelectorAll(".option-btn"));
const nextBtn = document.getElementById("next-btn");
const qCountEl = document.getElementById("q-count");
const timerEl = document.getElementById("timer");
const progressFill = document.getElementById("progress-fill");
const scoreBox = document.getElementById("score-box");
const scoreText = document.getElementById("score");
const questionBox = document.getElementById("question-box");
const restartBtn = document.getElementById("restart-btn");
const soundToggle = document.getElementById("sound-toggle");

// Audio elements
const sfxCorrect = document.getElementById("sfx-correct");
const sfxWrong = document.getElementById("sfx-wrong");
const sfxTimeout = document.getElementById("sfx-timeout");
const sfxTick = document.getElementById("sfx-tick");

// init sound toggle UI
setSoundUI();

// =================== INIT ===================
bindEvents();
loadQuestion();

// =================== FUNCTIONS ===================
function bindEvents(){
  optionBtns.forEach(btn => {
    btn.addEventListener("click", () => handleSelect(Number(btn.dataset.index)));
  });

  nextBtn.addEventListener("click", next);
  (restartBtn || document).addEventListener("click", restart);

  // Keyboard shortcuts: 1-4 to select, Enter to Next
  window.addEventListener("keydown", (e) => {
    if (scoreBox.hidden) {
      if (e.key >= "1" && e.key <= "4") handleSelect(Number(e.key) - 1);
      if (e.key === "Enter" && !nextBtn.disabled) next();
    } else if (e.key === "Enter") restart();
  });

  soundToggle.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem("quiz_sound_on", String(soundOn));
    setSoundUI();
  });
}

function setSoundUI(){
  soundToggle.setAttribute("aria-pressed", String(soundOn));
  soundToggle.textContent = soundOn ? "🔊 Sound On" : "🔇 Sound Off";
}

function loadQuestion(){
  resetTimer();

  selected = null;
  nextBtn.disabled = true;
  optionBtns.forEach(b => {
    b.disabled = false;
    b.classList.remove("correct","wrong");
  });

  const q = questions[ order[idx] ];
  qEl.textContent = q.q;

  const indices = [0,1,2,3];
  if (SHUFFLE_OPTIONS) indices.sort(() => Math.random() - 0.5);

  indices.forEach((optIdx, i) => {
    const btn = optionBtns[i];
    btn.dataset.index = optIdx; // store actual option index
    btn.textContent = q.opts[optIdx];
  });

  updateMeta();
  startTimer();
}

function updateMeta(){
  qCountEl.textContent = `Question ${idx + 1} of ${questions.length}`;
  const pct = (idx / questions.length) * 100;
  progressFill.style.width = `${pct}%`;
  timerEl.textContent = `${timeLeft}s`;
}

function handleSelect(chosenOptIdx){
  if (selected !== null) return; // already answered
  selected = chosenOptIdx;

  const q = questions[ order[idx] ];
  lockOptions();

  const correctOpt = q.ans;
  if (chosenOptIdx === correctOpt) {
    optionBtns.find(b => Number(b.dataset.index) === chosenOptIdx)?.classList.add("correct");
    score++;
    playSafe(sfxCorrect);
  } else {
    optionBtns.find(b => Number(b.dataset.index) === chosenOptIdx)?.classList.add("wrong");
    optionBtns.find(b => Number(b.dataset.index) === correctOpt)?.classList.add("correct");
    playSafe(sfxWrong);
  }

  nextBtn.disabled = false; // user can now advance
  stopTimer();
}

function lockOptions(){
  optionBtns.forEach(b => b.disabled = true);
}

function startTimer(){
  timeLeft = TIME_PER_QUESTION;
  timerEl.textContent = `${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `${timeLeft}s`;
    if (timeLeft > 0 && timeLeft <= 5) {
      // subtle tick in last seconds
      playSafe(sfxTick, {volume: .35});
    }
    if (timeLeft <= 0) {
      stopTimer();
      // mark only the correct one; no wrong since no choice
      const q = questions[ order[idx] ];
      lockOptions();
      optionBtns.find(b => Number(b.dataset.index) === q.ans)?.classList.add("correct");
      nextBtn.disabled = false; // user advances manually
      playSafe(sfxTimeout);
    }
  }, 1000);
}

function stopTimer(){ 
  clearInterval(timer); 
  
  // stop tick sound if it's still playing
  try {
    sfxTick.pause();
    sfxTick.currentTime = 0;
  } catch(_) {}
}

function resetTimer(){ stopTimer(); }

function next(){
  idx++;
  if (idx >= questions.length) {
    showScore();
  } else {
    // Update button text for last question
    nextBtn.textContent = (idx === questions.length - 1) ? "Finish" : "Next";
    loadQuestion();
  }
}

function showScore(){
  questionBox.hidden = true;
  scoreBox.hidden = false;

  // progress to 100%
  progressFill.style.width = "100%";

  // High score logic
  if (score > high) {
    high = score;
    localStorage.setItem(HIGHSCORE_KEY, String(high));
  }

  const pct = Math.round((score / questions.length) * 100);
  scoreText.innerHTML = `
    Score: <strong>${score}</strong> / ${questions.length} (${pct}%)<br>
    High Score: <strong>${high}</strong>
  `;
}

function restart(){
  order = [...questions.keys()];
  if (SHUFFLE_QUESTIONS) order.sort(() => Math.random() - 0.5);

  idx = 0;
  score = 0;
  questionBox.hidden = false;
  scoreBox.hidden = true;
  nextBtn.textContent = "Next";
  loadQuestion();
}

function playSafe(audioEl, opts = {}){
  if (!soundOn || !audioEl) return;
  try {
    // set temp volume if provided
    const { volume } = opts;
    const prevVol = audioEl.volume;
    if (typeof volume === "number") audioEl.volume = volume;
    audioEl.currentTime = 0;
    audioEl.play().catch(() => {/* ignore autoplay blocks */});
    if (typeof volume === "number") {
      setTimeout(() => audioEl.volume = prevVol, 50);
    }
  } catch(_) { /* ignore */ }
}