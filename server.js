const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // importante para aceitar JSON no PUT
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

// ----------------- ROTAS -----------------

// Cadastro de filme
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

// Buscar filmes (com filtros opcionais)
app.get("/filmes", async (req, res) => {
  const { nome, genero } = req.query;

  try {
    let query = "SELECT * FROM filmes";
    let values = [];

    if (nome) {
      query += " WHERE LOWER(nome) LIKE LOWER($1)";
      values.push(`%${nome}%`);
    } else if (genero) {
      query += " WHERE LOWER(genero) = LOWER($1)";
      values.push(genero);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    res.status(500).send("Erro ao buscar filmes no banco.");
  }
});

// Editar filme por ID
app.put("/filmes/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, genero, lancamento, duracao, sinopse } = req.body;

  try {
    await pool.query(
      "UPDATE filmes SET nome=$1, genero=$2, lancamento=$3, duracao=$4, sinopse=$5 WHERE id=$6",
      [nome, genero, lancamento, duracao, sinopse, id]
    );
    res.send("Filme atualizado com sucesso!");
  } catch (err) {
    console.error("Erro ao atualizar filme:", err);
    res.status(500).send("Erro ao atualizar filme no banco.");
  }
});

// Excluir filme por ID
app.delete("/filmes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM filmes WHERE id=$1", [id]);
    res.send("Filme excluído com sucesso!");
  } catch (err) {
    console.error("Erro ao excluir filme:", err);
    res.status(500).send("Erro ao excluir filme no banco.");
  }
});

// ----------------- START SERVER -----------------
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
