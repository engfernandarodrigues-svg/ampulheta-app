let intervalo;
let total = 0;
let restante = 0;

function iniciar() {
  clearInterval(intervalo);

  let min = parseInt(document.getElementById("minutos").value) || 0;
  let seg = parseInt(document.getElementById("segundos").value) || 0;

  total = (min * 60) + seg;

  if (total <= 0) {
    alert("Digite um tempo válido");
    return;
  }

  restante = total;
  atualizar();

  intervalo = setInterval(() => {
    restante--;
    atualizar();

    if (restante <= 0) {
      clearInterval(intervalo);
      alert("⏳ Tempo acabou!");
    }
  }, 1000);
}

function pausar() {
  clearInterval(intervalo);
}

function resetar() {
  clearInterval(intervalo);
  restante = 0;
  total = 0;
  atualizar();
}

function atualizar() {
  let min = Math.floor(restante / 60);
  let seg = restante % 60;

  document.getElementById("tempo").innerText =
    `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;

  if (total > 0) {
    let p = restante / total;

    document.getElementById("topo").style.height = (p * 100) + "%";
    document.getElementById("fundo").style.height = ((1 - p) * 100) + "%";
  }
}
