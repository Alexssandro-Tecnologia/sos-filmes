document.addEventListener("click", (e) => {
  if (e.target.classList.contains("filme-thumb")) {
    const img = e.target;

    document.getElementById("modal-img").src = img.src;
    document.getElementById("modal-nome").textContent = img.dataset.nome;
    document.getElementById("modal-genero").textContent = img.dataset.genero;
    document.getElementById("modal-lancamento").textContent =
      img.dataset.lancamento;
    document.getElementById("modal-duracao").textContent = img.dataset.duracao;
    document.getElementById("modal-sinopse").textContent = img.dataset.sinopse;

    document.getElementById("modal").classList.remove("hidden");
  }

  if (e.target.id === "fechar-modal") {
    document.getElementById("modal").classList.add("hidden");
  }
});
