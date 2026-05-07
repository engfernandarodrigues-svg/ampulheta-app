const canvas =
document.getElementById('canvas');

const ctx =
canvas.getContext('2d');

const W = 320;
const H = 470;

let tempoTotal = 90;
let tempoRestante = 90;

let intervalo = null;

let currentView = 'hourglass';

let particles = [];

/* PARTICLE */

class Particle{

  constructor(){

    this.x =
      W/2 + (Math.random()-.5)*10;

    this.y = 200;

    this.vy =
      2 + Math.random()*2;

    this.vx =
      (Math.random()-.5)*.4;

    this.r =
      .8 + Math.random()*1.5;

    this.alpha =
      .5 + Math.random()*0.5;

    this.alive = true;
  }

  update(fill){

    this.y += this.vy;
    this.x += this.vx;

    const floor =
      330 - (fill*100);

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
      `rgba(255,210,80,${this.alpha})`;

    ctx.fill();
  }
}

/* AMPULHETA */

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
      240,
      40,
      W/2,
      240,
      180
    );

  glow.addColorStop(
    0,
    'rgba(180,100,255,.12)'
  );

  glow.addColorStop(
    1,
    'transparent'
  );

  ctx.fillStyle = glow;

  ctx.fillRect(0,0,W,H);

  // base
  ctx.fillStyle =
    '#2a1145';

  ctx.beginPath();

  ctx.ellipse(
    160,
    45,
    95,
    16,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();

  ctx.beginPath();

  ctx.ellipse(
    160,
    410,
    95,
    18,
    0,
    0,
    Math.PI*2
  );

  ctx.fill();

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
    'rgba(255,255,255,.03)'
  );

  glass.addColorStop(
    1,
    'rgba(255,255,255,.14)'
  );

  ctx.fillStyle = glass;

  ctx.beginPath();

  ctx.moveTo(95,55);

  ctx.bezierCurveTo(
    90,
    160,
    125,
    175,
    145,
    205
  );

  ctx.bezierCurveTo(
    155,
    220,
    165,
    220,
    175,
    205
  );

  ctx.bezierCurveTo(
    195,
    175,
    230,
    160,
    225,
    55
  );

  ctx.lineTo(225,55);

  ctx.bezierCurveTo(
    230,
    280,
    195,
    295,
    175,
    260
  );

  ctx.bezierCurveTo(
    165,
    245,
    155,
    245,
    145,
    260
  );

  ctx.bezierCurveTo(
    125,
    295,
    90,
    280,
    95,
    410
  );

  ctx.strokeStyle =
    'rgba(255,255,255,.35)';

  ctx.lineWidth = 4;

  ctx.stroke();

  // areia superior
  const topHeight =
    90 * progress;

  ctx.beginPath();

  ctx.moveTo(115,180-topHeight);

  ctx.lineTo(205,180-topHeight);

  ctx.lineTo(160,205);

  ctx.closePath();

  ctx.fillStyle =
    '#d59a12';

  ctx.fill();

  // fluxo
  if(tempoRestante > 0){

    ctx.beginPath();

    ctx.moveTo(160,205);

    ctx.lineTo(160,300);

    ctx.strokeStyle =
      '#f4c542';

    ctx.lineWidth = 2;

    ctx.stroke();
  }

  // areia inferior
  const bottomHeight =
    90 * bottomFill;

  ctx.beginPath();

  ctx.moveTo(112,340);

  ctx.lineTo(208,340);

  ctx.lineTo(160,340-bottomHeight);

  ctx.closePath();

  ctx.fillStyle =
    '#c77d00';

  ctx.fill();

  // partículas
  particles.forEach(p=>{

    p.update(bottomFill);

    p.draw();
  });

  particles =
    particles.filter(p=>p.alive);

  // brilho vidro
  ctx.beginPath();

  ctx.moveTo(122,75);

  ctx.lineTo(138,190);

  ctx.strokeStyle =
    'rgba(255,255,255,.18)';

  ctx.lineWidth = 6;

  ctx.stroke();
}

/* LOOP */

function animate(){

  if(currentView === 'hourglass'){

    if(
      tempoRestante > 0 &&
      Math.random() > .2
    ){

      particles.push(
        new Particle()
      );
    }

    drawHourglass();
  }

  requestAnimationFrame(
    animate
  );
}

animate();

/* FORMAT */

function formatTime(t){

  const m =
    Math.floor(t/60);

  const s =
    t%60;

  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

/* DISPLAY */

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

/* CIRCLE */

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

/* TICK */

function tick(){

  tempoRestante--;

  updateDisplay();

  if(tempoRestante <= 0){

    tempoRestante = 0;

    clearInterval(intervalo);

    updateDisplay();
  }
}

/* START */

function iniciar(){

  clearInterval(intervalo);

  intervalo =
    setInterval(tick,1000);
}

/* PAUSE */

function pausar(){

  clearInterval(intervalo);
}

/* RESET */

function resetar(){

  clearInterval(intervalo);

  tempoRestante =
    tempoTotal;

  updateDisplay();
}

/* VIEW */

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
    .querySelectorAll('.switch-btn')
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
      .querySelectorAll('.switch-btn')[0]
      .classList.add('active');

  } else {

    hourglass.classList.add(
      'hidden'
    );

    circle.classList.remove(
      'hidden'
    );

    document
      .querySelectorAll('.switch-btn')[1]
      .classList.add('active');
  }
}
