// ============================================
// CONFIG
// ============================================

const canvas =
document.getElementById('hourglassCanvas');

const ctx =
canvas.getContext('2d');

const W = 320;
const H = 420;

// ============================================
// TIMER
// ============================================

let tempoTotal = 90;
let tempoRestante = 90;

let intervalo = null;

let currentView = 'hourglass';

// ============================================
// PARTICULAS
// ============================================

let particles = [];

// ============================================
// PARTICLE
// ============================================

class Particle{

  constructor(){

    this.reset();
  }

  reset(){

    this.x =
      W/2 + (Math.random()-.5)*8;

    this.y = 185;

    this.vx =
      (Math.random()-.5)*.3;

    this.vy =
      2 + Math.random()*1.5;

    this.r =
      .8 + Math.random()*1.2;

    this.alpha =
      .5 + Math.random()*0.5;

    this.alive = true;
  }

  update(fill){

    this.y += this.vy;
    this.x += this.vx;

    const floor =
      305 - (fill*95);

    if(this.y >= floor){

      this.alive = false;
    }
  }

  draw(){

    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.r,
      0,
      Math.PI*2
    );

    ctx.fillStyle =
      `rgba(255,210,90,${this.alpha})`;

    ctx.fill();
  }
}

// ============================================
// AMPULHETA
// ============================================

function drawHourglass(){

  ctx.clearRect(0,0,W,H);

  const progress =
    tempoRestante / tempoTotal;

  const bottomFill =
    1 - progress;

  // glow
  const glow =
    ctx.createRadialGradient(
      W/2,
      210,
      30,
      W/2,
      210,
      180
    );

  glow.addColorStop(
    0,
    'rgba(170,90,255,.12)'
  );

  glow.addColorStop(
    1,
    'transparent'
  );

  ctx.fillStyle = glow;

  ctx.fillRect(0,0,W,H);

  // vidro
  const glass =
    ctx.createLinearGradient(
      0,
      0,
      W,
      H
    );

  glass.addColorStop(
    0,
    'rgba(255,255,255,.22)'
  );

  glass.addColorStop(
    .5,
    'rgba(255,255,255,.04)'
  );

  glass.addColorStop(
    1,
    'rgba(255,255,255,.16)'
  );

  ctx.fillStyle = glass;

  ctx.beginPath();

  ctx.moveTo(90,40);

  ctx.bezierCurveTo(
    90,
    120,
    120,
    150,
    145,
    190
  );

  ctx.bezierCurveTo(
    165,
    210,
    165,
    210,
    175,
    190
  );

  ctx.bezierCurveTo(
    200,
    150,
    230,
    120,
    230,
    40
  );

  ctx.lineTo(230,40);

  ctx.lineTo(230,40);

  ctx.bezierCurveTo(
    230,
    120,
    200,
    270,
    175,
    230
  );

  ctx.bezierCurveTo(
    165,
    210,
    165,
    210,
    145,
    230
  );

  ctx.bezierCurveTo(
    120,
    270,
    90,
    300,
    90,
    380
  );

  ctx.lineTo(230,380);

  ctx.strokeStyle =
    'rgba(255,255,255,.35)';

  ctx.lineWidth = 4;

  ctx.stroke();

  // areia superior
  const topHeight =
    95 * progress;

  ctx.beginPath();

  ctx.moveTo(112,160-topHeight);

  ctx.lineTo(208,160-topHeight);

  ctx.lineTo(160,188);

  ctx.closePath();

  ctx.fillStyle =
    '#d69d18';

  ctx.fill();

  // fluxo
  if(tempoRestante > 0){

    ctx.beginPath();

    ctx.moveTo(160,190);

    ctx.lineTo(160,270);

    ctx.strokeStyle =
      '#f4c542';

    ctx.lineWidth = 2;

    ctx.stroke();
  }

  // areia inferior
  const bottomHeight =
    95 * bottomFill;

  ctx.beginPath();

  ctx.moveTo(110,315);

  ctx.lineTo(210,315);

  ctx.lineTo(160,315-bottomHeight);

  ctx.closePath();

  ctx.fillStyle =
    '#c47a00';

  ctx.fill();

  // partículas
  particles.forEach(p=>{

    p.update(bottomFill);

    p.draw();
  });

  particles =
    particles.filter(p=>p.alive);

  // brilho
  ctx.beginPath();

  ctx.moveTo(118,65);

  ctx.lineTo(135,175);

  ctx.strokeStyle =
    'rgba(255,255,255,.18)';

  ctx.lineWidth = 5;

  ctx.stroke();
}

// ============================================
// LOOP
// ============================================

function animate(){

  if(currentView === 'hourglass'){

    if(
      tempoRestante > 0 &&
      Math.random() > .25
    ){

      particles.push(
        new Particle()
      );
    }

    drawHourglass();
  }

  requestAnimationFrame(animate);
}

animate();

// ============================================
// FORMAT
// ============================================

function formatTime(t){

  const m =
    Math.floor(t/60);

  const s =
    t%60;

  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ============================================
// DISPLAY
// ============================================

function updateDisplay(){

  const txt =
    formatTime(tempoRestante);

  document.getElementById(
    'display'
  ).textContent = txt;

  document.getElementById(
    'circleTime'
  ).textContent = txt;

  updateCircle();
}

updateDisplay();

// ============================================
// CIRCLE
// ============================================

function updateCircle(){

  const ring =
    document.querySelector(
      '.ring-progress'
    );

  const radius = 120;

  const circumference =
    2 * Math.PI * radius;

  const progress =
    tempoRestante / tempoTotal;

  ring.style.strokeDasharray =
    circumference;

  ring.style.strokeDashoffset =
    circumference * (1-progress);
}

// ============================================
// TICK
// ============================================

function tick(){

  tempoRestante--;

  updateDisplay();

  if(tempoRestante <= 0){

    tempoRestante = 0;

    clearInterval(intervalo);

    updateDisplay();

    if(navigator.vibrate){

      navigator.vibrate(
        [200,100,200]
      );
    }
  }
}

// ============================================
// START
// ============================================

function iniciar(){

  clearInterval(intervalo);

  intervalo =
    setInterval(tick,1000);
}

// ============================================
// PAUSE
// ============================================

function pausar(){

  clearInterval(intervalo);
}

// ============================================
// RESET
// ============================================

function resetar(){

  clearInterval(intervalo);

  tempoRestante = tempoTotal;

  updateDisplay();
}

// ============================================
// VIEW
// ============================================

function setView(view){

  currentView = view;

  const hourglass =
    document.getElementById(
      'hourglassView'
    );

  const circle =
    document.getElementById(
      'circleView'
    );

  document
    .querySelectorAll('.mode')
    .forEach(btn=>
      btn.classList.remove('active')
    );

  if(view === 'hourglass'){

    hourglass.classList.remove(
      'hidden'
    );

    circle.classList.add(
      'hidden'
    );

    document
      .querySelectorAll('.mode')[0]
      .classList.add('active');

  } else {

    hourglass.classList.add(
      'hidden'
    );

    circle.classList.remove(
      'hidden'
    );

    document
      .querySelectorAll('.mode')[1]
      .classList.add('active');
  }
}
