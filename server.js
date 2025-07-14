const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve index.html, CSS etc

// Configurar multer (upload em memória)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Conectar ao PostgreSQL (Docker ou local)
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "filmesdb",
  password: "postgres",
  port: 5432,
});

// Rota para processar o formulário
app.post("/processa-cadastro", upload.single("foto"), async (req, res) => {
  const { nome, genero, lancamento, duracao, sinopse } = req.body;
  const imagem = req.file ? req.file.buffer : null;

  try {
    await pool.query(
      "INSERT INTO filmes (nome, genero, lancamento, duracao, sinopse, imagem) VALUES ($1, $2, $3, $4, $5, $6)",
      [nome, genero, lancamento, duracao, sinopse, imagem]
    );
    res.send("Filme cadastrado com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar no banco:", err);
    res.status(500).send("Erro ao salvar no banco de dados.");
  }
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
