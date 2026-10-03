const registros = JSON.parse(localStorage.getItem("registros")) || [];

const form = document.getElementById("form");
const titulo = document.getElementById("titulo");
const lista = document.getElementById("lista");
const limpar = document.getElementById("limpar");

function mostrar() {
  lista.innerHTML = "";
  for (const r of registros) {
    const li = document.createElement("li");
    li.textContent = r.titulo;
    lista.appendChild(li);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const novo = { titulo: titulo.value };
  registros.push(novo);
  localStorage.setItem("registros", JSON.stringify(registros));
  mostrar();
  form.reset();
});

limpar.addEventListener("click", function () {
  registros.length = 0;
  localStorage.removeItem("registros");
  mostrar();
});

mostrar();