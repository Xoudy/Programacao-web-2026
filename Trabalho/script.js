const API_URL = "https://dummyjson.com/products";

const formPesquisa = document.getElementById("form-pesquisa");
const campoPesquisa = document.getElementById("campo-pesquisa");
const status = document.getElementById("status");
const listaProdutos = document.getElementById("lista-produtos");
const listaFavoritos = document.getElementById("lista-favoritos");
const dialogDetalhes = document.getElementById("detalhes");
const conteudoDetalhes = document.getElementById("conteudo-detalhes");
const btnFechar = document.getElementById("fechar-detalhes");

let produtosAtuais = [];
let favoritos = carregarFavoritos();

/* ---------- API (fetch + async/await) ---------- */

async function buscarProdutos(termo) {
  let url = API_URL + "?limit=20";
  if (termo) {
    url = API_URL + "/search?q=" + encodeURIComponent(termo);
  }

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error("Erro HTTP " + resposta.status);
  }
  const dados = await resposta.json();
  return dados.products;
}

async function buscarProduto(id) {
  const resposta = await fetch(API_URL + "/" + id);
  if (!resposta.ok) {
    throw new Error("Erro HTTP " + resposta.status);
  }
  return await resposta.json();
}

/* ---------- localStorage ---------- */

function carregarFavoritos() {
  const salvo = localStorage.getItem("favoritos");
  if (salvo) {
    return JSON.parse(salvo);
  }
  return [];
}

function salvarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function ehFavorito(id) {
  return favoritos.some(function (fav) {
    return fav.id === id;
  });
}

function alternarFavorito(produto) {
  if (ehFavorito(produto.id)) {
    favoritos = favoritos.filter(function (fav) {
      return fav.id !== produto.id;
    });
  } else {
    // objeto que representa o favorito
    favoritos.push({
      id: produto.id,
      title: produto.title,
      price: produto.price,
      thumbnail: produto.thumbnail
    });
  }
  salvarFavoritos();
  renderizarFavoritos();
  renderizarProdutos();
}

/* ---------- DOM ---------- */

function mostrarStatus(mensagem, erro) {
  status.textContent = mensagem;
  status.classList.toggle("erro", Boolean(erro));
}

function criarCartao(produto, nofavoritos) {
  const cartao = document.createElement("article");
  cartao.className = "cartao";

  const img = document.createElement("img");
  img.src = produto.thumbnail;
  img.alt = produto.title;

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const preco = document.createElement("p");
  preco.className = "preco";
  preco.textContent = "US$ " + produto.price.toFixed(2);

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const btnDetalhes = document.createElement("button");
  btnDetalhes.textContent = "Detalhes";
  btnDetalhes.className = "btn-detalhes";
  btnDetalhes.dataset.acao = "detalhes";
  btnDetalhes.dataset.id = produto.id;

  const btnFav = document.createElement("button");
  btnFav.dataset.acao = "favorito";
  btnFav.dataset.id = produto.id;
  if (nofavoritos || ehFavorito(produto.id)) {
    btnFav.textContent = "Remover";
    btnFav.className = "btn-remover";
  } else {
    btnFav.textContent = "Favoritar";
  }

  acoes.append(btnDetalhes, btnFav);
  cartao.append(img, titulo, preco, acoes);
  return cartao;
}

function renderizarProdutos() {
  listaProdutos.innerHTML = "";
  for (let i = 0; i < produtosAtuais.length; i++) {
    listaProdutos.appendChild(criarCartao(produtosAtuais[i], false));
  }
}

function renderizarFavoritos() {
  listaFavoritos.innerHTML = "";
  if (favoritos.length === 0) {
    listaFavoritos.textContent = "Nenhum favorito ainda.";
    return;
  }
  for (let i = 0; i < favoritos.length; i++) {
    listaFavoritos.appendChild(criarCartao(favoritos[i], true));
  }
}

async function mostrarDetalhes(id) {
  try {
    mostrarStatus("Carregando detalhes...");
    const produto = await buscarProduto(id);
    mostrarStatus("");

    conteudoDetalhes.innerHTML = "";

    const titulo = document.createElement("h2");
    titulo.textContent = produto.title;

    const img = document.createElement("img");
    img.src = produto.thumbnail;
    img.alt = produto.title;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const info = document.createElement("p");
    info.textContent =
      "Categoria: " + produto.category +
      " | Marca: " + (produto.brand || "não informada") +
      " | Preço: US$ " + produto.price.toFixed(2) +
      " | Avaliação: " + produto.rating;

    conteudoDetalhes.append(titulo, img, descricao, info);
    dialogDetalhes.showModal();
  } catch (erro) {
    mostrarStatus("Não foi possível carregar os detalhes. Tente novamente.", true);
  }
}

/* ---------- Carregar produtos ---------- */

async function carregarProdutos(termo) {
  mostrarStatus("Carregando produtos...");
  listaProdutos.innerHTML = "";

  try {
    produtosAtuais = await buscarProdutos(termo);
    if (produtosAtuais.length === 0) {
      mostrarStatus("Nenhum produto encontrado.");
    } else {
      mostrarStatus("");
    }
    renderizarProdutos();
  } catch (erro) {
    mostrarStatus("Erro ao carregar os produtos. A API pode estar indisponível ou você está sem internet.", true);
  }
}

/* ---------- Eventos ---------- */

formPesquisa.addEventListener("submit", function (evento) {
  evento.preventDefault();
  carregarProdutos(campoPesquisa.value.trim());
});

document.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) {
    return;
  }

  const id = Number(botao.dataset.id);

  if (botao.dataset.acao === "detalhes") {
    mostrarDetalhes(id);
  } else if (botao.dataset.acao === "favorito") {
    const produto =
      produtosAtuais.find(function (p) { return p.id === id; }) ||
      favoritos.find(function (p) { return p.id === id; });
    alternarFavorito(produto);
  }
});

btnFechar.addEventListener("click", function () {
  dialogDetalhes.close();
});


renderizarFavoritos();
carregarProdutos("");