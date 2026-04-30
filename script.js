// ============================================================
//  AMPULHETA PRO — script.js (VERSÃO ATUALIZADA)
// ============================================================

const canvas = document.getElementById('hg');
const ctx    = canvas.getContext('2d');
const W = 220, H = 340;

// ---- Estado do timer ----
let intervalo      = null;
let tempoRestante  = 0;
let tempoTotal     = 0;

// ---- Estado das partículas ----
let particles      = [];
let animFrame      = null;
let lastSpawnTime  = 0;

// ---- Geometria ----
const NECK_X = W / 2;
const NECK_Y = H / 2;
const TOP_Y  = 32;
const BOT_Y  = H - 32;
const TOP_W  = 80;
const BOT_W  = 80;
const NECK_W = 7;
const GLASS_T = 6;

// ============================================================
//  UTIL
// ============================================================
function lerp(a, b, t) { return a + (b - a) * t; }

// ============================================================
//  GEOMETRIA
// ============================================================
function buildSide(side, steps = 50) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = lerp(TOP_Y, NECK_Y, t);
    const hw = lerp(TOP_W / 2, NECK_W / 2, t * t);
    pts.push({ x: NECK_X + side * hw, y });
  }
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = lerp(NECK_Y, BOT_Y, t);
    const hw = lerp(NECK_W / 2, BOT_W / 2, t * (2 - t));
    pts.push({ x: NECK_X + side * hw, y });
  }
  return pts;
}

const outerLeft  = buildSide(-1);
const outerRight = buildSide(1);

function makeGlassPath() {
  const p = new Path2D();
  p.moveTo(outerLeft[0].x, outerLeft[0].y);
  outerLeft.forEach(pt => p.lineTo(pt.x, pt.y));
  [...outerRight].reverse().forEach(pt => p.lineTo(pt.x, pt.y));
  p.closePath();
  return p;
}

function makeInnerPath() {
  const p = new Path2D();
  const inL = outerLeft.map(pt => ({ x: pt.x + GLASS_T, y: pt.y }));
  const inR = outerRight.map(pt => ({ x: pt.x - GLASS_T, y: pt.y }));
  p.moveTo(inL[0].x, inL[0].y);
  inL.forEach(pt => p.lineTo(pt.x, pt.y));
  [...inR].reverse().forEach(pt => p.lineTo(pt.x, pt.y));
  p.closePath();
  return p;
}

// ============================================================
//  AREIA
// ============================================================
function makeTopSandPath(pct) {
  if (pct <= 0) return null;
  const steps = 50;
  const pts = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = lerp(NECK_Y, TOP_Y, t);
    const hw = lerp(NECK_W / 2, TOP_W / 2, t * t) - GLASS_T;
    pts.push({ x: NECK_X - hw, y });
  }

  const fillY = lerp(NECK_Y, TOP_Y, pct);
  const clipped = pts.filter(p => p.y >= fillY);
  if (!clipped.length) return null;

  const path = new Path2D();
  path.moveTo(clipped[0].x, clipped[0].y);
  clipped.forEach(pt => path.lineTo(pt.x, pt.y));
  [...clipped].reverse().forEach(pt => path.lineTo(NECK_X + (NECK_X - pt.x), pt.y));
  path.closePath();

  return path;
}

function makeBotSandPath(pct) {
  if (pct <= 0) return null;
  const steps = 50;
  const pts = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = lerp(NECK_Y, BOT_Y, t);
    const hw = lerp(NECK_W / 2, BOT_W / 2, t * (2 - t)) - GLASS_T;
    pts.push({ x: NECK_X - hw, y });
  }

  const fillY = lerp(NECK_Y, BOT_Y, pct);
  const clipped = pts.filter(p => p.y <= fillY);
  if (!clipped.length) return null;

  const path = new Path2D();
  const rev = [...clipped].reverse();
  path.moveTo(rev[0].x, rev[0].y);
  rev.forEach(pt => path.lineTo(pt.x, pt.y));
  clipped.forEach(pt => path.lineTo(NECK_X + (NECK_X - pt.x), pt.y));
  path.closePath();

  return path;
}

// ============================================================
//  PARTÍCULAS
// ============================================================
class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x = NECK_X + (Math.random() - 0.5) * NECK_W;
    this.y = NECK_Y;
    this.vy = 1 + Math.random() * 3;
    this.vx = (Math.random() - 0.5);
    this.r = 1.5;
    this.alive = true;
  }

  update(botPct) {
    this.vy += 0.2;
    this.y += this.vy;
    this.x += this.vx;

    const t = Math.max(0, (this.y - NECK_Y) / (BOT_Y - NECK_Y));
    const hw = lerp(NECK_W / 2, BOT_W / 2, t * (2 - t)) - GLASS_T;

    if (this.x > NECK_X + hw) this.x = NECK_X + hw;
    if (this.x < NECK_X - hw) this.x = NECK_X - hw;

    const floor = lerp(NECK_Y, BOT_Y, botPct);
    if (this.y >= floor) this.alive = false;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = '#f5c542';
    ctx.fill();
  }
}

// ============================================================
//  RENDER
// ============================================================
function render() {
  ctx.clearRect(0, 0, W, H);

  const pct = tempoTotal > 0 ? Math.max(0, tempoRestante / tempoTotal) : 1;
  const botPct = 1 - pct;

  const glassPath = makeGlassPath();
  const innerPath = makeInnerPath();

  ctx.fillStyle = 'rgba(200,200,255,0.1)';
  ctx.fill(glassPath);

  ctx.save();
  ctx.clip(innerPath);

  const top = makeTopSandPath(pct);
  if (top) {
    ctx.fillStyle = '#e0a800';
    ctx.fill(top);
  }

  const bot = makeBotSandPath(botPct);
  if (bot) {
    ctx.fillStyle = '#c47a00';
    ctx.fill(bot);
  }

  particles.forEach(p => p.draw());
  ctx.restore();

  ctx.strokeStyle = '#aaa';
  ctx.stroke(glassPath);
}

// ============================================================
//  LOOP
// ============================================================
function spawnParticles() {
  if (tempoRestante <= 0) return;

  const now = Date.now();
  if (now - lastSpawnTime > 60) {
    particles.push(new Particle());
    lastSpawnTime = now;
  }

  const botPct = 1 - (tempoRestante / tempoTotal);
  particles.forEach(p => p.update(botPct));
  particles = particles.filter(p => p.alive);
}

function loop() {
  spawnParticles();
  render();
  requestAnimationFrame(loop);
}

// ============================================================
//  TEMPO
// ============================================================
function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = t % 60;
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function getInputSeconds() {
  let min = parseInt(document.getElementById('minutos').value) || 0;
  let seg = parseInt(document.getElementById('segundos').value) || 0;

  if (seg >= 60) {
    min += Math.floor(seg / 60);
    seg = seg % 60;
  }

  return min * 60 + seg;
}

function atualizarDisplay() {
  document.getElementById('display').textContent = formatTime(tempoRestante);
}

// ============================================================
//  CONTROLES
// ============================================================
function iniciar() {
  clearInterval(intervalo);

  const total = getInputSeconds();
  if (total <= 0) return alert('Tempo inválido');

  tempoTotal = total;
  tempoRestante = total;
  particles = [];

  document.getElementById('penalidade').classList.remove('visivel');

  atualizarDisplay();

  intervalo = setInterval(tick, 1000);
}

function setTempo(segundos) {
  clearInterval(intervalo);

  tempoTotal = segundos;
  tempoRestante = segundos;
  particles = [];

  document.getElementById('minutos').value = Math.floor(segundos / 60);
  document.getElementById('segundos').value = segundos % 60;

  document.getElementById('penalidade').classList.remove('visivel');

  atualizarDisplay();

  intervalo = setInterval(tick, 1000);
}

function tick() {
  tempoRestante--;
  atualizarDisplay();

  if (tempoRestante <= 0) {
    clearInterval(intervalo);
    tempoRestante = 0;
    atualizarDisplay();

    particles = [];

    document.getElementById('penalidade').classList.add('visivel');

    // vibração (mobile)
    if (navigator.vibrate) {
      navigator.vibrate([200,100,200]);
    }

    // som (opcional)
    // new Audio('som.mp3').play();
  }
}

function pausar() {
  clearInterval(intervalo);
}

function resetar() {
  clearInterval(intervalo);
  tempoRestante = 0;
  tempoTotal = 0;
  particles = [];

  atualizarDisplay();
  document.getElementById('penalidade').classList.remove('visivel');
}

// ============================================================
//  START
// ============================================================
loop();
