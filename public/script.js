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

// Edição e Exclusão de Filmes

document.addEventListener("DOMContentLoaded", () => {
  const generoSelect = document.getElementById("genero");
  const campoNome = document.getElementById("campo-nome");
  const formPesquisa = document.getElementById("form-pesquisa");
  const resultados = document.getElementById("resultados");

  // Mostrar input de nome apenas se a opção "nome" for escolhida
  generoSelect.addEventListener("change", () => {
    if (generoSelect.value === "nome") {
      campoNome.style.display = "block";
    } else {
      campoNome.style.display = "none";
    }
  });

  // Enviar pesquisa
  formPesquisa.addEventListener("submit", async (e) => {
    e.preventDefault();

    let url = "/filmes";
    if (generoSelect.value && generoSelect.value !== "nome") {
      url += `?genero=${generoSelect.value}`;
    } else if (generoSelect.value === "nome") {
      const nome = document.getElementById("nome").value;
      url += `?nome=${encodeURIComponent(nome)}`;
    }

    try {
      const res = await fetch(url);
      const filmes = await res.json();

      resultados.innerHTML = "";
      filmes.forEach((filme) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><strong>${filme.nome}</strong> (${filme.genero})</p>
          <button data-id="${filme.id}" class="btn-editar">Editar</button>
          <button data-id="${filme.id}" class="btn-excluir">Excluir</button>
        `;
        resultados.appendChild(div);
      });
    } catch (err) {
      console.error("Erro ao buscar filmes:", err);
    }
  });

  // Edicao e Exclusão de filmes

  resultados.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    // EXCLUIR
    if (e.target.classList.contains("btn-excluir")) {
      if (confirm("Deseja excluir este filme?")) {
        await fetch(`/filmes/${id}`, { method: "DELETE" });
        e.target.parentElement.remove();
      }
    }

    // EDITAR
    if (e.target.classList.contains("btn-editar")) {
      const novoNome = prompt("Digite o novo nome do filme:");
      if (novoNome) {
        await fetch(`/filmes/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: novoNome }),
        });
        alert("Filme atualizado!");
      }
    }
  });
});
