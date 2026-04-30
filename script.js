// ============================================================
//  AMPULHETA REALISTA — script.js
//  Entrada: minutos + segundos
//  Animação: Canvas 2D com partículas de areia e vidro SVG-like
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

// ---- Geometria da ampulheta ----
const NECK_X   = W / 2;
const NECK_Y   = H / 2;
const TOP_Y    = 32;
const BOT_Y    = H - 32;
const TOP_W    = 80;
const BOT_W    = 80;
const NECK_W   = 7;
const GLASS_T  = 6; // espessura do vidro

// ============================================================
//  GEOMETRIA — pontos da silhueta
// ============================================================
function lerp(a, b, t) { return a + (b - a) * t; }

/** Gera array de pontos [{x,y}] para um lado da ampulheta */
function buildSide(side, steps = 50) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t  = i / steps;
    const y  = lerp(TOP_Y, NECK_Y, t);
    const hw = lerp(TOP_W / 2, NECK_W / 2, t * t);
    pts.push({ x: NECK_X + side * hw, y });
  }
  for (let i = 0; i <= steps; i++) {
    const t  = i / steps;
    const y  = lerp(NECK_Y, BOT_Y, t);
    const hw = lerp(NECK_W / 2, BOT_W / 2, t * (2 - t));
    pts.push({ x: NECK_X + side * hw, y });
  }
  return pts;
}

const outerLeft  = buildSide(-1);
const outerRight = buildSide(1);

/** Path2D da silhueta externa completa */
function makeGlassPath() {
  const p = new Path2D();
  p.moveTo(outerLeft[0].x, outerLeft[0].y);
  outerLeft.forEach(pt => p.lineTo(pt.x, pt.y));
  [...outerRight].reverse().forEach(pt => p.lineTo(pt.x, pt.y));
  p.closePath();
  return p;
}

/** Path2D do interior (área de areia) — vidro com espessura */
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
//  CAMINHOS DE AREIA
// ============================================================

/** Areia no topo — pct=0 vazio, pct=1 cheio */
function makeTopSandPath(pct) {
  if (pct <= 0) return null;
  const steps = 50;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t  = i / steps;
    const y  = lerp(NECK_Y, TOP_Y, t);
    const hw = lerp(NECK_W / 2, TOP_W / 2, t * t) - GLASS_T;
    pts.push({ x: NECK_X - hw, y, hw });
  }
  const fillY = lerp(NECK_Y, TOP_Y, pct);
  const clipped = pts.filter(p => p.y >= fillY);
  if (!clipped.length) return null;

  const p = new Path2D();
  p.moveTo(clipped[0].x, clipped[0].y);
  clipped.forEach(pt => p.lineTo(pt.x, pt.y));
  [...clipped].reverse().forEach(pt => p.lineTo(NECK_X + (NECK_X - pt.x), pt.y));
  p.closePath();
  return p;
}

/** Areia no fundo — pct=0 vazio, pct=1 cheio */
function makeBotSandPath(pct) {
  if (pct <= 0) return null;
  const steps = 50;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t  = i / steps;
    const y  = lerp(NECK_Y, BOT_Y, t);
    const hw = lerp(NECK_W / 2, BOT_W / 2, t * (2 - t)) - GLASS_T;
    pts.push({ x: NECK_X - hw, y, hw });
  }
  const fillY = lerp(NECK_Y, BOT_Y, pct);
  const clipped = pts.filter(p => p.y <= fillY);
  if (!clipped.length) return null;

  const p = new Path2D();
  const rev = [...clipped].reverse();
  p.moveTo(rev[0].x, rev[0].y);
  rev.forEach(pt => p.lineTo(pt.x, pt.y));
  clipped.forEach(pt => p.lineTo(NECK_X + (NECK_X - pt.x), pt.y));
  p.closePath();
  return p;
}

// ============================================================
//  PARTÍCULAS DE AREIA
// ============================================================
class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x   = NECK_X + (Math.random() - 0.5) * NECK_W * 0.65;
    this.y   = NECK_Y + 1;
    this.vy  = 1.0 + Math.random() * 2.8;
    this.vx  = (Math.random() - 0.5) * 0.9;
    this.r   = 1.4 + Math.random() * 1.6;
    const hue = 36 + Math.floor(Math.random() * 16);
    const lgt = 52 + Math.floor(Math.random() * 22);
    this.color = `hsla(${hue},82%,${lgt}%,${0.80 + Math.random() * 0.18})`;
    this.alive = true;
  }

  update(botPct) {
    this.vy += 0.20;           // gravidade
    this.x  += this.vx;
    this.y  += this.vy;

    // Colisão com paredes internas da metade inferior
    const t  = Math.max(0, (this.y - NECK_Y) / (BOT_Y - NECK_Y));
    const hw = lerp(NECK_W / 2, BOT_W / 2, t * (2 - t)) - GLASS_T - this.r;
    if (this.x - NECK_X >  hw) { this.x = NECK_X +  hw; this.vx *= -0.25; }
    if (this.x - NECK_X < -hw) { this.x = NECK_X + -hw; this.vx *= -0.25; }

    // "Chão" de areia acumulada
    const floor = lerp(NECK_Y, BOT_Y, botPct) - this.r;
    if (this.y >= floor) {
      this.y  = floor;
      this.vy = 0;
      this.vx = 0;
      this.alive = false;
    }
    if (this.y > BOT_Y) this.alive = false;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// ============================================================
//  RENDERIZAÇÃO PRINCIPAL
// ============================================================
function render() {
  ctx.clearRect(0, 0, W, H);

  const pct    = tempoTotal > 0 ? tempoRestante / tempoTotal : 1;
  const botPct = 1 - pct;

  const glassPath = makeGlassPath();
  const innerPath = makeInnerPath();

  // ---- 1. Corpo do vidro (preenchimento semitransparente) ----
  const glassGrad = ctx.createLinearGradient(NECK_X - TOP_W / 2, 0, NECK_X + TOP_W / 2, 0);
  glassGrad.addColorStop(0,    'rgba(160, 210, 255, 0.32)');
  glassGrad.addColorStop(0.18, 'rgba(255, 255, 255, 0.52)');
  glassGrad.addColorStop(0.50, 'rgba(200, 235, 255, 0.16)');
  glassGrad.addColorStop(0.82, 'rgba(255, 255, 255, 0.42)');
  glassGrad.addColorStop(1,    'rgba(130, 195, 250, 0.28)');
  ctx.fillStyle = glassGrad;
  ctx.fill(glassPath);

  // ---- 2. Interior: areia + partículas (clip ao interior) ----
  ctx.save();
  ctx.clip(innerPath);

  // Areia no topo
  const topPath = makeTopSandPath(pct);
  if (topPath) {
    const sg = ctx.createLinearGradient(NECK_X - TOP_W / 2, TOP_Y, NECK_X + TOP_W / 2, NECK_Y);
    sg.addColorStop(0,   '#e8b84b');
    sg.addColorStop(0.4, '#d4922a');
    sg.addColorStop(1,   '#c07818');
    ctx.fillStyle = sg;
    ctx.fill(topPath);
    // Camada de brilho sobre a areia
    ctx.fillStyle = 'rgba(255, 215, 100, 0.18)';
    ctx.fill(topPath);
  }

  // Areia no fundo
  const botPath = makeBotSandPath(botPct);
  if (botPath) {
    const sg2 = ctx.createLinearGradient(NECK_X - BOT_W / 2, NECK_Y, NECK_X + BOT_W / 2, BOT_Y);
    sg2.addColorStop(0,   '#c07818');
    sg2.addColorStop(0.5, '#d4922a');
    sg2.addColorStop(1,   '#e8b84b');
    ctx.fillStyle = sg2;
    ctx.fill(botPath);
    ctx.fillStyle = 'rgba(255, 220, 120, 0.15)';
    ctx.fill(botPath);
  }

  // Partículas
  particles.forEach(p => p.draw());

  ctx.restore();

  // ---- 3. Borda do vidro (reflexo realista) ----
  const strokeGrad = ctx.createLinearGradient(NECK_X - TOP_W / 2, 0, NECK_X + TOP_W / 2, 0);
  strokeGrad.addColorStop(0,    'rgba(110, 175, 240, 0.90)');
  strokeGrad.addColorStop(0.18, 'rgba(255, 255, 255, 0.95)');
  strokeGrad.addColorStop(0.50, 'rgba(180, 222, 255, 0.45)');
  strokeGrad.addColorStop(0.82, 'rgba(255, 255, 255, 0.88)');
  strokeGrad.addColorStop(1,    'rgba(100, 160, 220, 0.80)');
  ctx.strokeStyle = strokeGrad;
  ctx.lineWidth   = 2.5;
  ctx.stroke(glassPath);

  // ---- 4. Reflexo lateral esquerdo (brilho do vidro) ----
  ctx.save();
  ctx.clip(glassPath);
  const shine = ctx.createLinearGradient(
    NECK_X - TOP_W / 2 + 5, TOP_Y,
    NECK_X - TOP_W / 2 + 22, BOT_Y
  );
  shine.addColorStop(0,   'rgba(255,255,255,0.52)');
  shine.addColorStop(0.28,'rgba(255,255,255,0.28)');
  shine.addColorStop(0.65,'rgba(255,255,255,0.08)');
  shine.addColorStop(1,   'rgba(255,255,255,0.00)');
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.moveTo(NECK_X - TOP_W / 2 + 7, TOP_Y);
  ctx.quadraticCurveTo(
    NECK_X - TOP_W / 2 + 5,  NECK_Y,
    NECK_X - NECK_W / 2 + 2, NECK_Y
  );
  ctx.lineTo(NECK_X - NECK_W / 2 + GLASS_T + 5, NECK_Y);
  ctx.quadraticCurveTo(
    NECK_X - TOP_W / 2 + 18, NECK_Y,
    NECK_X - TOP_W / 2 + 20, TOP_Y
  );
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // ---- 5. Tampas (latão/madeira) ----
  const capH = 13, capW = TOP_W + 18;
  const capGrad = ctx.createLinearGradient(NECK_X - capW / 2, 0, NECK_X + capW / 2, 0);
  capGrad.addColorStop(0,    '#6b4c1a');
  capGrad.addColorStop(0.25, '#b8832a');
  capGrad.addColorStop(0.50, '#e8c46a');
  capGrad.addColorStop(0.75, '#b8832a');
  capGrad.addColorStop(1,    '#6b4c1a');

  // Tampa superior
  ctx.fillStyle = capGrad;
  ctx.beginPath();
  ctx.roundRect(NECK_X - capW / 2, TOP_Y - capH, capW, capH, [4, 4, 2, 2]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 220, 100, 0.35)';
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Tampa inferior
  ctx.beginPath();
  ctx.roundRect(NECK_X - capW / 2, BOT_Y, capW, capH, [2, 2, 4, 4]);
  ctx.fill();
  ctx.stroke();
}

// ============================================================
//  LOOP DE ANIMAÇÃO
// ============================================================
function spawnAndUpdateParticles() {
  if (tempoRestante <= 0 || tempoTotal <= 0) return;

  const now = Date.now();
  if (now - lastSpawnTime > 55) {
    particles.push(new Particle());
    if (Math.random() < 0.55) particles.push(new Particle());
    lastSpawnTime = now;
  }

  const botPct = 1 - (tempoRestante / tempoTotal);
  particles.forEach(p => p.update(botPct));
  particles = particles.filter(p => p.alive);
  if (particles.length > 45) particles.splice(0, particles.length - 45);
}

function loop() {
  spawnAndUpdateParticles();
  render();
  animFrame = requestAnimationFrame(loop);
}

// ============================================================
//  UTILITÁRIOS DE TEMPO
// ============================================================
function formatTime(totalSeg) {
  const m = Math.floor(totalSeg / 60);
  const s = totalSeg % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function getInputSeconds() {
  const min = parseInt(document.getElementById('minutos').value) || 0;
  const seg = parseInt(document.getElementById('segundos').value) || 0;
  return min * 60 + seg;
}

function atualizarDisplay() {
  document.getElementById('display').textContent = formatTime(tempoRestante);
}

// ============================================================
//  CONTROLES PÚBLICOS
// ============================================================
function iniciar() {
  clearInterval(intervalo);

  const total = getInputSeconds();
  if (total <= 0) {
    alert('Digite um tempo válido (minutos e/ou segundos).');
    return;
  }

  tempoTotal     = total;
  tempoRestante  = total;
  particles      = [];

  const doneEl = document.getElementById('done');
  doneEl.textContent = '';
  doneEl.classList.remove('visible');

  const penEl = document.getElementById('penalidade');
  penEl.classList.remove('visivel');

  atualizarDisplay();

  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarDisplay();

    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      particles = [];
      penEl.classList.add('visivel');
      penEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
}

function resetar() {
  clearInterval(intervalo);
  tempoRestante = 0;
  tempoTotal    = 0;
  particles     = [];

  document.getElementById('display').textContent = '00:00';
  const doneEl = document.getElementById('done');
  doneEl.textContent = '';
  doneEl.classList.remove('visible');

  document.getElementById('penalidade').classList.remove('visivel');
}

// ============================================================
//  INICIA O LOOP
// ============================================================
if (animFrame) cancelAnimationFrame(animFrame);
loop();
