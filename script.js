const canvas = document.getElementById('hg');
const ctx = canvas.getContext('2d');

let tempoRestante = 0;
let tempoTotal = 0;
let intervalo;

function format(t){
  let m = Math.floor(t/60);
  let s = t%60;
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function atualizar(){
  document.getElementById('display').innerText = format(tempoRestante);
}

function iniciar(){
  let min = parseInt(document.getElementById('minutos').value)||0;
  let seg = parseInt(document.getElementById('segundos').value)||0;

  if(seg>=60){
    min+=Math.floor(seg/60);
    seg=seg%60;
  }

  tempoTotal = min*60+seg;
  tempoRestante = tempoTotal;

  rodar();
}

function setTempo(s){
  tempoTotal = s;
  tempoRestante = s;
  rodar();
}

function rodar(){
  clearInterval(intervalo);
  atualizar();

  intervalo = setInterval(()=>{
    tempoRestante--;
    atualizar();

    if(tempoRestante<=0){
      clearInterval(intervalo);
      tempoRestante=0;
      atualizar();

      explosao();
      som.play();
      document.getElementById('penalidade').style.display='block';
    }

  },1000);
}

function pausar(){
  clearInterval(intervalo);
}

function resetar(){
  clearInterval(intervalo);
  tempoRestante=0;
  atualizar();
  document.getElementById('penalidade').style.display='none';
}

/* explosão */
function explosao(){
  const c = document.getElementById('explosao');

  for(let i=0;i<30;i++){
    let p = document.createElement('div');
    p.className='particula-explosao';

    p.style.setProperty('--x',(Math.random()*300-150)+'px');
    p.style.setProperty('--y',(Math.random()*300-150)+'px');

    c.appendChild(p);

    setTimeout(()=>p.remove(),700);
  }
}

/* som */
const som = new Audio('som.mp3');

/* ampulheta simples */
function draw(){
  ctx.clearRect(0,0,220,340);

  let pct = tempoTotal ? tempoRestante/tempoTotal : 1;

  ctx.fillStyle="gold";
  ctx.fillRect(80,50,60,100*pct);
  ctx.fillRect(80,200,60,100*(1-pct));

  requestAnimationFrame(draw);
}

draw();

/* deixa global */
window.setTempo = setTempo;
window.iniciar = iniciar;
window.pausar = pausar;
window.resetar = resetar;
