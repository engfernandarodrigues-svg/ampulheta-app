// ======================================================
// CONFIG
// ======================================================

const canvas = document.getElementById('hg');
const ctx = canvas.getContext('2d');

const W = 280;
const H = 420;

// ======================================================
// TIMER
// ======================================================

let intervalo = null;

let tempoRestante = 0;
let tempoTotal = 0;

let currentView = 'hourglass';

// ======================================================
// GEOMETRIA
// ======================================================

const centerX = W / 2;
const centerY = H / 2;

// ======================================================
// PARTÍCULAS
// ======================================================

let particles = [];

// ======================================================
// PARTICLE
// ======================================================

class Particle {

  constructor() {

    this.reset();
  }

  reset() {

    this.x = centerX + (Math.random() - .5) * 8;

    this.y = centerY;

    this.vx = (Math.random() - .5) * .5;

    this.vy = 2 + Math.random() * 2;

    this.r = 1 + Math.random() * 1.5;

    this.alpha = .6 + Math.random() * .4;

    this.alive = true;
  }

  update(fill) {

    this.y += this.vy;
    this.x += this.vx;

    const floor = 320 - (fill * 140);

    if (this.y >= floor) {
      this.alive = false;
    }
  }

  draw() {

    ctx.beginPath();

    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);

    ctx.fillStyle =
      `rgba(245,197,66,${this.alpha})`;

    ctx.fill();
  }

}

// ======================================================
// AMPULHETA
// ======================================================

function drawHourglass() {

  ctx.clearRect(0,0,W,H);

  const progress =
    tempoTotal > 0
      ? tempoRestante / tempoTotal
      : 1;

  const bottomFill = 1 - progress;

  // vidro
  const glass = ctx.createLinearGradient(0,0,W,H);

  glass.addColorStop(0,'rgba(255,255,255,.20)');
  glass.addColorStop(.5,'rgba(255,255,255,.04)');
  glass.addColorStop(1,'rgba(255,255,255,.15)');

  ctx.fillStyle = glass;

  ctx.beginPath();

  ctx.moveTo(70,40);
  ctx.lineTo(210,40);
  ctx.lineTo(150,190);
  ctx.lineTo(210,380);
  ctx.lineTo(70,380);
  ctx.lineTo(130,190);

  ctx.closePath();

  ctx.fill();

  // borda
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.lineWidth = 3;

  ctx.stroke();

  // areia superior
  const topHeight = 120 * progress;

  ctx.beginPath();

  ctx.moveTo(88, 175 - topHeight);

  ctx.lineTo(192, 175 - topHeight);

  ctx.lineTo(140,190);

  ctx.closePath();

  ctx.fillStyle = '#e0a800';

  ctx.fill();

  // fluxo
  if(tempoRestante > 0){

    ctx.beginPath();

    ctx.moveTo(centerX,190);

    ctx.lineTo(centerX,250);

    ctx.strokeStyle = '#f4c542';

    ctx.lineWidth = 2;

    ctx.stroke();
  }

  // areia inferior
  const bottomHeight = 140 * bottomFill;

  ctx.beginPath();

  ctx.moveTo(90,340);

  ctx.lineTo(190,340);

  ctx.lineTo(140,340 - bottomHeight);

  ctx.closePath();

  ctx.fillStyle = '#c47a00';

  ctx.fill();

  // partículas
  particles.forEach(p => {

    p.update(bottomFill);

    p.draw();
  });

  particles =
    particles.filter(p => p.alive);

  // brilho
  ctx.beginPath();

  ctx.moveTo(92,60);
  ctx.lineTo(110,170);

  ctx.strokeStyle =
    'rgba(255,255,255,.18)';

  ctx.lineWidth = 5;

  ctx.stroke();
}

// ======================================================
// LOOP
// ======================================================

function loop() {

  if(currentView === 'hourglass') {

    if(tempoRestante > 0){

      if(Math.random() > .35){

        particles.push(new Particle());
      }
    }

    drawHourglass();
  }

  requestAnimationFrame(loop);
}

loop();

// ======================================================
// FORMAT
// ======================================================

function formatTime(t){

  const m = Math.floor(t / 60);

  const s = t % 60;

  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ======================================================
// DISPLAY
// ======================================================

function atualizarDisplay(){

  const txt = formatTime(tempoRestante);

  document.getElementById('display').textContent = txt;

  document.getElementById('circleTime').textContent = txt;

  atualizarCirculo();
}

// ======================================================
// CIRCULO
// ======================================================

function atualizarCirculo(){

  const ring =
    document.querySelector('.ring-progress');

  if(!ring || tempoTotal <= 0) return;

  const radius = 110;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    tempoRestante / tempoTotal;

  ring.style.strokeDasharray =
    circumference;

  ring.style.strokeDashoffset =
    circumference * (1 - progress);
}

// ======================================================
// INPUT
// ======================================================

function getInputSeconds(){

  let min =
    parseInt(document.getElementById('minutos').value) || 0;

  let seg =
    parseInt(document.getElementById('segundos').value) || 0;

  return (min * 60) + seg;
}

// ======================================================
// START
// ======================================================

function iniciar(){

  clearInterval(intervalo);

  const total = getInputSeconds();

  if(total <= 0){
    return alert('Tempo inválido');
  }

  tempoTotal = total;
  tempoRestante = total;

  particles = [];

  document
    .getElementById('penalidade')
    .classList.remove('visivel');

  atualizarDisplay();

  intervalo = setInterval(tick,1000);
}

// ======================================================
// TICK
// ======================================================

function tick(){

  tempoRestante--;

  atualizarDisplay();

  if(tempoRestante <= 0){

    tempoRestante = 0;

    atualizarDisplay();

    clearInterval(intervalo);

    document
      .getElementById('penalidade')
      .classList.add('visivel');

    if(navigator.vibrate){
      navigator.vibrate([200,100,200]);
    }
  }
}

// ======================================================
// PAUSAR
// ======================================================

function pausar(){

  clearInterval(intervalo);
}

// ======================================================
// RESET
// ======================================================

function resetar(){

  clearInterval(intervalo);

  tempoRestante = 0;
  tempoTotal = 0;

  particles = [];

  atualizarDisplay();

  document
    .getElementById('penalidade')
    .classList.remove('visivel');
}

// ======================================================
// TEMPOS RÁPIDOS
// ======================================================

function setTempo(seg){

  clearInterval(intervalo);

  tempoTotal = seg;
  tempoRestante = seg;

  document.getElementById('minutos').value =
    Math.floor(seg / 60);

  document.getElementById('segundos').value =
    seg % 60;

  atualizarDisplay();

  intervalo = setInterval(tick,1000);
}

// ======================================================
// VIEW
// ======================================================

function setView(view){

  currentView = view;

  const hg =
    document.getElementById('hg');

  const circle =
    document.getElementById('circleWrapper');

  document
    .querySelectorAll('.mode')
    .forEach(btn => btn.classList.remove('active'));

  if(view === 'hourglass'){

    hg.classList.remove('hidden');

    circle.classList.add('hidden');

    document.querySelectorAll('.mode')[0]
      .classList.add('active');

  } else {

    hg.classList.add('hidden');

    circle.classList.remove('hidden');

    document.querySelectorAll('.mode')[1]
      .classList.add('active');
  }
}
