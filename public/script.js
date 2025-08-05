document.addEventListener("DOMContentLoaded", () => {
  // MODAL - abrir/fechar
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("filme-thumb")) {
      const img = e.target;

      document.getElementById("modal-img").src = img.src;
      document.getElementById("modal-nome").textContent = img.dataset.nome;
      document.getElementById("modal-genero").textContent = img.dataset.genero;
      document.getElementById("modal-lancamento").textContent =
        img.dataset.lancamento;
      document.getElementById("modal-duracao").textContent =
        img.dataset.duracao;
      document.getElementById("modal-sinopse").textContent =
        img.dataset.sinopse;

      document.getElementById("modal").classList.remove("hidden");
    }

    if (e.target.id === "fechar-modal") {
      document.getElementById("modal").classList.add("hidden");
    }
  });

  // FORMULÁRIO - envio AJAX com mensagem na mesma tela
  const form = document.getElementById("form-cadastro");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const res = await fetch("/processa-cadastro", {
          method: "POST",
          body: formData,
        });

        const texto = await res.text();
        const msg = document.getElementById("mensagem");
        msg.textContent = texto;
        msg.style.color = "#345372";

        form.reset();
      } catch (err) {
        const msg = document.getElementById("mensagem");
        msg.textContent = "Erro ao cadastrar o filme.";
        msg.style.color = "#e54e3d";
      }
    });
  }
});
