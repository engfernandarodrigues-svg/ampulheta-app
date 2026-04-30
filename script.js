const canvas = document.getElementById('hg');
const ctx = canvas.getContext('2d');

let tempoRestante = 0;
let tempoTotal = 0;
let intervalo;

// SOM
const somExplosao = new Audio('som.mp3');

// ===== TEMPO =====
function formatTime(t) {
  let m = Math.floor(t / 60);
  let s = t % 60;
  return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function atualizarDisplay() {
  document.getElementById('display').textContent = formatTime(tempoRestante);
}

// ===== CONTROLES =====
function iniciar() {
  let min = parseInt(document.getElementById('minutos').value) || 0;
  let seg = parseInt(document.getElementById('segundos').value) || 0;

  if (seg >= 60) {
    min += Math.floor(seg / 60);
    seg = seg % 60;
  }

  tempoTotal = min * 60 + seg;
  tempoRestante = tempoTotal;

  rodar();
}

function setTempo(segundos) {
  tempoTotal = segundos;
  tempoRestante = segundos;

  document.getElementById('minutos').value = Math.floor(segundos / 60);
  document.getElementById('segundos').value = segundos % 60;

  rodar();
}

function rodar() {
  clearInterval(intervalo);
  atualizarDisplay();

  document.getElementById('penalidade').classList.remove('visivel');

  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarDisplay();

    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      tempoRestante = 0;
      atualizarDisplay();

      document.getElementById('penalidade').classList.add('visivel');

      explosao();
      somExplosao.currentTime = 0;
      somExplosao.play().catch(()=>{});
    }
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
}

function resetar() {
  clearInterval(intervalo);
  tempoRestante = 0;
  tempoTotal = 0;
  atualizarDisplay();
  document.getElementById('penalidade').classList.remove('visivel');
}

// ===== EXPLOSÃO =====
function explosao() {
  const container = document.getElementById('explosao');

  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particula-explosao';

    p.style.setProperty('--x', (Math.random() - 0.5) * 400 + 'px');
    p.style.setProperty('--y', (Math.random() - 0.5) * 400 + 'px');

    container.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
}

// ===== AMPULHETA SIMPLES MAS FUNCIONAL =====
function draw() {
  ctx.clearRect(0, 0, 220, 340);

  let pct = tempoTotal ? tempoRestante / tempoTotal : 1;

  ctx.fillStyle = 'gold';
  ctx.fillRect(80, 40, 60, 120 * pct);
  ctx.fillRect(80, 180, 60, 120 * (1 - pct));

  requestAnimationFrame(draw);
}

draw();

// ===== GLOBAL =====
window.setTempo = setTempo;
window.iniciar = iniciar;
window.pausar = pausar;
window.resetar = resetar;
