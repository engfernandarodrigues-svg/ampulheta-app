const canvas = document.getElementById('hg');
const ctx = canvas.getContext('2d');

let intervalo = null;
let tempoRestante = 0;
let tempoTotal = 0;

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

function iniciar() {
  clearInterval(intervalo);

  const total = getInputSeconds();
  if (total <= 0) {
    alert('Digite um tempo válido');
    return;
  }

  tempoTotal = total;
  tempoRestante = total;

  document.getElementById('penalidade').classList.remove('visivel');

  atualizarDisplay();

  intervalo = setInterval(() => {
    tempoRestante--;
    atualizarDisplay();

    if (tempoRestante <= 0) {
      clearInterval(intervalo);
      document.getElementById('penalidade').classList.add('visivel');
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

/* animação simples da ampulheta */
function draw() {
  ctx.clearRect(0, 0, 220, 340);

  ctx.fillStyle = "#e8c96a";

  const pct = tempoTotal > 0 ? tempoRestante / tempoTotal : 1;

  ctx.fillRect(90, 50, 40, 100 * pct); // topo
  ctx.fillRect(90, 190, 40, 100 * (1 - pct)); // base

  requestAnimationFrame(draw);
}

draw();
