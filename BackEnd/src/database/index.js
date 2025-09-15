const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nameProduto TEXT UNIQUE,
      quantidadeProduto INTEGER,
      valor REAL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nameProduto TEXT,
      quantidadeProduto INTEGER,
      valorUnitario REAL,
      valorTotal REAL,
      usuario TEXT,
      dataHora BIGINT
    )
  `);
});

module.exports = db;