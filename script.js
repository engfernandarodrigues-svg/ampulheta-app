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

  document.getElementById("fim").classList.add("hidden");

  atualizar();

  intervalo = setInterval(() => {
    restante--;
    atualizar();

    if (restante <= 0) {
      clearInterval(intervalo);
      finalizou();
    }
  }, 1000);
}

function atualizar() {
  let min = Math.floor(restante / 60);
  let seg = restante % 60;

  document.getElementById("tempo").innerText =
    `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;

  if (total > 0) {
    let p = restante / total;

    document.getElementById("topo").style.height = (p * 50) + "%";
    document.getElementById("fundo").style.height = ((1 - p) * 50) + "%";
  }
}

function pausar() {
  clearInterval(intervalo);
}

function resetar() {
  clearInterval(intervalo);
  restante = 0;
  total = 0;
  atualizar();
  document.getElementById("fim").classList.add("hidden");
}

function finalizou() {
  document.getElementById("fim").classList.remove("hidden");

  // som
  document.getElementById("somFinal").play();

  // efeito explosão
  document.body.classList.add("explodir");

  setTimeout(() => {
    document.body.classList.remove("explodir");
  }, 500);

  salvarRanking();
}

function salvarRanking() {
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  ranking.push("Perdeu 😅");

  localStorage.setItem("ranking", JSON.stringify(ranking));

  mostrarRanking();
}

function mostrarRanking() {
  let lista = document.getElementById("rankingLista");
  let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

  lista.innerHTML = "";

  ranking.forEach((item, i) => {
    let li = document.createElement("li");
    li.innerText = `#${i + 1} - ${item}`;
    lista.appendChild(li);
  });
}

mostrarRanking();
