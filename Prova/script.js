function sortear() {
  const curiosidades = [
    "Um ano em Mercúrio dura só 88 dias terrestres.",
    "Vênus gira ao contrário dos outros planetas.",
    "Um dia em Marte dura quase o mesmo que um dia na Terra: 24h37min.",
    "A Lua é responsável por causar as marés nos oceanos.",
    "Júpiter tem pelo menos 95 luas conhecidas.",
    "Um ano em Saturno dura cerca de 29 anos terrestres.",
    "Foi o primeiro planeta descoberto com o uso de um telescópio, em 1781.",
    "Todos os outros planetas caberiam dentro de Júpiter.",
    "É o planeta mais distante do Sol desde que Plutão deixou de ser considerado planeta.",
    "Os anéis de Saturno têm km de largura, mas só metros de espessura."

  ];

  const indice = Math.floor(Math.random() * curiosidades.length);
  const caixa = document.getElementById("caixa-curiosidade");
  caixa.innerText = curiosidades[indice];
  caixa.style.display = "block";
}